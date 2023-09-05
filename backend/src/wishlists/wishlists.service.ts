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
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
    private readonly errorsService: ErrorsService,
  ) {}

  async create(
    owner: UserPublicProfileResponseDto,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    try {
      const wishes = createWishlistDto.itemsId
        ? await this.wishesService.findWishesByIds(createWishlistDto.itemsId)
        : [];
      const savedWishlist = await this.wishlistRepository.save({
        items: wishes,
        owner,
        ...createWishlistDto,
      });
      return savedWishlist;
    } catch (error) {
      this.errorsService.handleError(error);
    }
  }

  async findAll(): Promise<Wishlist[]> {
    try {
      const allWishlists = await this.wishlistRepository.find({
        relations: ['owner', 'items'],
      });
      if (!allWishlists) {
        throw new NotFoundException('Requested wishlist was not found');
      }
      return allWishlists;
    } catch (error) {
      this.errorsService.handleError(error);
    }
  }

  async findById(id: number, relations?): Promise<Wishlist> {
    try {
      const queryOptions = {};
      if (relations) {
        queryOptions['relations'] = relations;
      }
      const wishlist = await this.wishlistRepository.findOne({
        where: { id },
        ...queryOptions,
      });
      if (!wishlist) {
        throw new NotFoundException('Requested wishlist was not found');
      }
      return wishlist;
    } catch (error) {
      this.errorsService.handleError(error);
    }
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<void> {
    try {
      const wishes = updateWishlistDto.itemsId
        ? await this.wishesService.findWishesByIds(updateWishlistDto.itemsId)
        : [];
      const updateResult = await this.wishlistRepository.update(id, {
        items: wishes,
        ...updateWishlistDto,
      });
      if (updateResult.affected === 0) {
        throw new InternalServerErrorException('Failed to update the wishlist');
      }
    } catch (error) {
      this.errorsService.handleError(error);
    }
  }

  async remove(user: ValidationUserDto, id: number): Promise<void> {
    try {
      const removedWishList = await this.findById(id, ['owner']);

      if (user.id !== removedWishList.owner.id) {
        throw new ForbiddenException('You cant remove not your wishlist');
      }
      await this.wishlistRepository.delete(id);
    } catch (error) {
      this.errorsService.handleError(error);
    }
  }
}
