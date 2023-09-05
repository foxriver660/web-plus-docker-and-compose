import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { ErrorsService } from 'src/errors/errors.service';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Repository } from 'typeorm';
import { UserProfileResponseDto } from './dto/response-dto/user-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private bcryptService: BcryptService,
    private readonly errorsService: ErrorsService,
  ) {}

  async findByIdOrName(
    value: number | string,
    key: 'id' | 'username',
  ): Promise<UserProfileResponseDto> {
    try {
      const { password, wishes, offers, wishlists, ...user } =
        await this.usersRepository.findOne({
          where: { [key]: value },
        });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      this.errorsService.handleError(error);
    }
  }

  async findMany(value: string): Promise<UserProfileResponseDto[]> {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          [value.includes('@') ? 'email' : 'username']: value,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { password, ...result } = user;
      return [result];
    } catch (error) {
      this.errorsService.handleError(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    try {
      const genUpdate = updateUserDto.password
        ? await this.bcryptService.generateUserWithHashPass<UpdateUserDto>(
            updateUserDto,
          )
        : updateUserDto;
      const updateResult = await this.usersRepository.update(id, genUpdate);
      if (updateResult.affected === 0) {
        throw new InternalServerErrorException('Failed to update the wish');
      }
    } catch (error) {
      this.errorsService.handleError(error);
    }
  }

  async findUserWishes(username: string): Promise<Wish[]> {
    try {
      const { wishes } = await this.usersRepository.findOne({
        where: { username },
        relations: ['wishes'],
      });
      if (!wishes) {
        throw new NotFoundException('User not found');
      }
      return wishes;
    } catch (error) {
      this.errorsService.handleError(error);
    }
  }
}
