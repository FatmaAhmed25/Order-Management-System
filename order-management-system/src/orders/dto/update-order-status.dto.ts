import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class UpdateStatusDto {
    @ApiProperty({ description: 'New status for the order' })
    @IsIn(['pending', 'processing', 'completed'], { message: 'Invalid status value' })
    status: string;
}
