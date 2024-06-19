import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User name' })
  name: string;

  @ApiProperty({ description: 'User Email' })
  email: string;

  @ApiProperty({ description: 'User Password' })
  password: string;

  @ApiProperty({ required: false, } )
  address?: string;
}
