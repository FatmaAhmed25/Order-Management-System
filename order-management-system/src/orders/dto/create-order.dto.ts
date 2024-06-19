import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class CreateOrderDto {
    @ApiProperty({ description: 'User ID to create his order' })
    @IsPositive({ message: 'User ID must be a positive integer' })
    userId: number;
}
