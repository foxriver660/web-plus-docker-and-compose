import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { BasicEntity } from 'src/common/basic.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class Offer extends BasicEntity {
  @Column()
  @IsNumber()
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  @ValidateNested()
  @Type(() => User)
  @IsDefined()
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  @ValidateNested()
  @Type(() => Wish)
  @IsDefined()
  item: Wish;
}
