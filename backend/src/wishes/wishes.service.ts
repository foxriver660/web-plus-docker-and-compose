import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationUserDto } from 'src/auth/dto/validation-user.dto';
import { ErrorsService } from 'src/errors/errors.service';
import { UserPublicProfileResponseDto } from 'src/users/dto/response-dto/user-public-profile.dto';
import { DataSource, In, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateRaiseWishDto } from './dto/update-raise-wish-copy.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private readonly dataSource: DataSource,
    private readonly errorsService: ErrorsService,
  ) {}

  async create(
    owner: UserPublicProfileResponseDto,
    createWishDto: CreateWishDto,
  ): Promise<Wish> {
    try {
      const savedWish = await this.wishRepository.save({
        owner,
        ...createWishDto,
      });
      return savedWish;
    } catch (error) {
      this.errorsService.handleError(error);
    }
  }
  async createCopy(
    owner: UserPublicProfileResponseDto,
    id: number,
  ): Promise<Wish> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const copiedWish = await this.wishRepository.findOne({ where: { id } });
      if (!copiedWish) {
        throw new NotFoundException('The wish you want to copy was not found');
      }
      const {
        id: wishId,
        createdAt,
        updatedAt,
        raised,
        copied,
        ...result
      } = copiedWish;
      const savedWish = await this.wishRepository.save({
        ...result,
        owner,
      });
      if (!savedWish) {
        throw new InternalServerErrorException(
          'Failed to save a copy of the wish',
        );
      }

      const updateResult = await this.wishRepository.update(id, {
        copied: copiedWish.copied + 1,
      });
      if (updateResult.affected !== 1) {
        throw new InternalServerErrorException(
          'Failed to update the copied wish',
        );
      }
      await queryRunner.commitTransaction();
      return savedWish;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.errorsService.handleError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findWishesBy(
    key: 'copied' | 'createdAt',
    sortOrder: 'ASC' | 'DESC',
    quantity: number,
  ): Promise<Wish[]> {
    try {
      const order = { [key]: sortOrder };
      const wishes = await this.wishRepository.find({ order, take: quantity });
      return wishes;
    } catch (error) {
      this.errorsService.handleError(error);
    }
  }

  async findById(id: number, relations?): Promise<Wish> {
    try {
      const queryOptions = {};
      if (relations) {
        queryOptions['relations'] = relations;
      }
      const wish = await this.wishRepository.findOne({
        where: { id },
        ...queryOptions,
      });
      if (!wish) {
        throw new NotFoundException('Requested wish was not found');
      }
      return wish;
    } catch (error) {
      this.errorsService.handleError(error);
    }
  }
  async findWishesByIds(ids: number[]): Promise<Wish[]> {
    try {
      const wishes = await this.wishRepository.find({
        where: { id: In(ids) },
      });
      if (wishes.length !== ids.length) {
        const missingIds = ids.filter((id) => !wishes.some((e) => e.id === id));
        throw new NotFoundException(
          `Entities with ids ${missingIds} not found`,
        );
      }
      return wishes;
    } catch (error) {
      this.errorsService.handleError(error);
    }
  }
  async update(
    id: number,
    updateWishDto: UpdateWishDto | UpdateRaiseWishDto,
  ): Promise<void> {
    try {
      const updateResult = await this.wishRepository.update(id, updateWishDto);
      if (updateResult.affected === 0) {
        throw new InternalServerErrorException('Failed to update the wish');
      }
    } catch (error) {
      this.errorsService.handleError(error);
    }
  }

  async remove(user: ValidationUserDto, id: number): Promise<void> {
    try {
      const deletedWish = await this.findById(id, ['owner']);
      if (user.id !== deletedWish.owner.id) {
        throw new ForbiddenException('You cant remove not your wish');
      }
      await this.wishRepository.delete(id);
    } catch (error) {
      this.errorsService.handleError(error);
    }
  }
}
