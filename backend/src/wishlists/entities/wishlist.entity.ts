import { Type } from 'class-transformer';
import {
  IsDefined,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { BasicEntity } from 'src/common/basic.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Wishlist extends BasicEntity {
  @Column({ length: 250, default: 'Мой вишлист' })
  @IsString()
  @MaxLength(250)
  name: string;

  @Column({ default: 'https://i.pravatar.cc/150?img=3' })
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  @ValidateNested()
  @Type(() => User)
  @IsDefined()
  owner: User;

  @ManyToMany(() => Wish, (wish) => wish.name)
  @JoinTable()
  @ValidateNested({ each: true })
  @Type(() => Wish)
  items: Wish[];
}
