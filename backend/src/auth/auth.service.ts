import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, genSalt, hash } from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SignupResponseDto } from './dto/response-dto/signup-response.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserPublicProfileResponseDto } from 'src/users/dto/response-dto/user-public-profile.dto';
import { ErrorsService } from 'src/errors/errors.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { SigninResponseDto } from './dto/response-dto/signin-response.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
    private readonly errorsService: ErrorsService,
  ) {}
  async register(createUserDto: CreateUserDto): Promise<SignupResponseDto> {
    try {
      const genUser =
        await this.bcryptService.generateUserWithHashPass<CreateUserDto>(
          createUserDto,
        );
      const savedUser = await this.usersRepository.save(genUser);
      const { password, ...result } = savedUser;
      return result as SignupResponseDto;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException(
          `User with same username or email already exists`,
        );
      } else {
        this.errorsService.handleError(error);
      }
    }
  }
  async login(user: UserPublicProfileResponseDto): Promise<SigninResponseDto> {
    const payload = {
      username: user.username.split(' ').join(' '),
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // LOCAL STRATEGY
  async validateUser(signinUserDto: SigninUserDto) {
    const user = await this.usersRepository.findOne({
      where: { username: signinUserDto.username },
    });
    if (!user) {
      throw new UnauthorizedException(
        '[U]Authorization error, please check the correctness of the data entered',
      );
    }
    const isValidPassword = await compare(
      signinUserDto.password,
      user.password,
    );
    if (isValidPassword) {
      const { password, email, ...result } = user;
      return result;
    }
    return null;
  }
}
