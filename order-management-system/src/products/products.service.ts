import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {

    constructor(private prisma: PrismaService) {}

    async createProduct(createProductDto:CreateProductDto)
    {
        return this.prisma.product.create({
            data: {
              name: createProductDto.name,
              description: createProductDto.description,
              price: createProductDto.price,
              stock: createProductDto.stock,
            },
          });
   }

   async getAllProducts() 
   {
    return this.prisma.product.findMany();
   }

  async getProductById(productId: number) {
    return this.prisma.product.findUnique({
      where: { productId },
    });
  }






}
