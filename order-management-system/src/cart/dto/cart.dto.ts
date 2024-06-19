import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min} from 'class-validator';

export class CartDto {

    @ApiProperty({ description: 'User ID' })
    @IsInt()
    userId: number;

    @ApiProperty({ description: 'Product ID' })
    @IsInt()
    productId: number;

    @ApiProperty({ description: 'Quantity of the product' })
    @IsInt()
    @Min(1)
    quantity: number;

}
