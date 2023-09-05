import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { Wishlist } from './entities/wishlist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesModule } from 'src/wishes/wishes.module';
import { UsersModule } from 'src/users/users.module';
import { ErrorsService } from 'src/errors/errors.service';
import { ErrorsModule } from 'src/errors/errors.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist, User]),
    WishesModule,
    UsersModule,
    ErrorsModule,
  ],
  controllers: [WishlistsController],
  providers: [WishlistsService],
})
export class WishlistsModule {}
