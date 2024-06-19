import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsPositive } from 'class-validator';

export class ApplyCouponDto {
    @ApiProperty({ description: 'Order ID' })
    @IsPositive({ message: 'Order ID must be a positive integer' })
    orderId: number;

    @ApiProperty({ description: 'Coupon Code' })
    @IsNotEmpty({ message: 'Coupon code cannot be empty' })
    @IsString({ message: 'Coupon code must be a string' })
    couponCode: string;
}
