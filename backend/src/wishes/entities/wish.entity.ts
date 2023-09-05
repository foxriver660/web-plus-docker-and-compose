import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BasicEntity } from 'src/common/basic.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import {
  IsDefined,
  IsInt,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class Wish extends BasicEntity {
  @Column({ length: 250 })
  @IsString()
  @MaxLength(250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'float' })
  @IsNumber()
  price: number;

  @Column({ default: 0 })
  @IsNumber()
  raised: number;

  @Column({ default: 0 })
  @IsInt()
  copied: number;

  @Column({ length: 1024 })
  description: string;

  @ManyToOne(() => User, (user) => user.wishes)
  @ValidateNested()
  @Type(() => User)
  @IsDefined()
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  @ValidateNested({ each: true })
  @Type(() => Offer)
  offers: Offer[];
}
