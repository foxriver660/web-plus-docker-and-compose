import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OwnerInterceptor } from 'src/common/owner.interceptor';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(OwnerInterceptor)
  @Post()
  create(@Req() { user }, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(user, createWishDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(OwnerInterceptor)
  @Post(':id/copy')
  createCopy(@Req() { user }, @Param('id') id: string) {
    return this.wishesService.createCopy(user, +id);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findWishesBy('createdAt', 'DESC', 40);
  }

  @Get('top')
  findTop() {
    return this.wishesService.findWishesBy('copied', 'ASC', 20);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.wishesService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(+id, updateWishDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() { user }, @Param('id') id: string) {
    console.log(id);
    return this.wishesService.remove(user, +id);
  }
}
