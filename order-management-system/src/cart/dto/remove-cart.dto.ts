import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class RemoveCartDto {

    @ApiProperty({ description: 'User ID to remove items from their cart' })
    @IsInt()
    userId: number;

    @ApiProperty({ description: 'Product ID to remove from the cart' })
    @IsInt()
    productId: number;

}
