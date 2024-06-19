import { Controller, Post, Body } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  async createCoupon(@Body() createCouponDto: CreateCouponDto) {
    try {
      const createdCoupon = await this.couponsService.createCoupon(createCouponDto);
      return { success: true, data: createdCoupon };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
