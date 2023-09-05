import { Entity, Column, OneToMany } from 'typeorm';
import { BasicEntity } from 'src/common/basic.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { IsEmail, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class User extends BasicEntity {
  @Column({ unique: true })
  @IsString()
  username: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsUrl()
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  @ValidateNested({ each: true })
  @Type(() => Wish)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  @ValidateNested({ each: true })
  @Type(() => Offer)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  @ValidateNested({ each: true })
  @Type(() => Wishlist)
  wishlists: Wishlist[];
}
