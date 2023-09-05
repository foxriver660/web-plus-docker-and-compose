import { Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BcryptService {
  async generateSalt(rounds: number): Promise<string> {
    return await genSalt(rounds);
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return await hash(password, salt);
  }

  async generateUserWithHashPass<T extends { password?: string }>(dto: T) {
    const salt = await this.generateSalt(10);
    const hashedPassword = await this.hashPassword(dto.password, salt);
    return {
      ...dto,
      password: hashedPassword,
    };
  }
}
