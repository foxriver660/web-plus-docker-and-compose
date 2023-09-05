import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { WishesModule } from 'src/wishes/wishes.module';
import { UsersModule } from 'src/users/users.module';
import { ErrorsModule } from 'src/errors/errors.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer, Wish, User]),
    WishesModule,
    UsersModule,
    ErrorsModule,
  ],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
