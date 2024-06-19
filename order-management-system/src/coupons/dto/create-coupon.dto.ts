import { ApiProperty } from '@nestjs/swagger';


export class CreateCouponDto {
  @ApiProperty({ description: 'Coupon code' })
  code: string;

  @ApiProperty({ description: 'Coupon Discount percentage' })
  discountPercentage: number;

  @ApiProperty({ description: 'Coupon Expiry date' })
  expiryDate: Date;
}
