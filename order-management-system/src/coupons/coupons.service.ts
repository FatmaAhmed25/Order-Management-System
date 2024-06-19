import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assuming you have PrismaService for database operations
import { CreateCouponDto } from './dto/create-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  async createCoupon(createCouponDto: CreateCouponDto) {
  
    // Check if coupon with the same code already exists
    const existingCoupon = await this.prisma.coupon.findUnique({ where: { code:createCouponDto.code } });
    if (existingCoupon) {
      throw new Error('Coupon code already exists');
    }

    // Create the coupon using Prisma client
    const createdCoupon = await this.prisma.coupon.create({
      data: {
        code:createCouponDto.code,
        discountPercentage:createCouponDto.discountPercentage,
        expiryDate:createCouponDto.expiryDate,
      },
    });

    return createdCoupon;
  }
  async findAllCoupons() {
    return this.prisma.coupon.findMany();
  }
  
}
