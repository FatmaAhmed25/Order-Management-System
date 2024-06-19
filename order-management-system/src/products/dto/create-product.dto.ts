import { ApiProperty } from '@nestjs/swagger';


export class CreateProductDto{

    @ApiProperty({ description: 'Product name' })
    name:string;

    @ApiProperty({ description: 'Product Description' })
    description:string;

    @ApiProperty({ description: 'Product price' })
    price:number; 
    
    @ApiProperty({ description: 'Product stock' })
    stock:number;

}