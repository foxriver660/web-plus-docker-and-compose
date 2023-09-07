import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

export const getPostgreSqlConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    host: configService.get('POSTGRES_HOST') || 'postgres',
    port: configService.get('POSTGRES_PORT') || 5432,
    username: configService.get('POSTGRES_USER') || 'postgres',
    password: configService.get('POSTGRES_PASSWORD') || 'password',
    database: configService.get('POSTGRES_DB') || 'postgres',
    entities: [User, Wish, Offer, Wishlist],
    synchronize: true,
  };
};
