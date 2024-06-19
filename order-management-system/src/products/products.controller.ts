import { Controller ,Body,Post,Get,Param} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';


@ApiTags('products')
@Controller('products')
export class ProductsController {
  
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'Product created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async createProduct(@Body() createProductDto:CreateProductDto )
    {
        return this.productsService.createProduct(createProductDto);
    }


    @Get()
    @ApiOperation({ summary: 'Get all products' })
    @ApiResponse({ status: 200, description: 'List of products.', type: [CreateProductDto] })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async getAllProducts() 
    {
      return this.productsService.getAllProducts();
    }

    @Get(':productId')
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiResponse({ status: 200, description: 'The product info.', type: CreateProductDto })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async getProductById(@Param('productId') productId: number) {
      return this.productsService.getProductById(productId);
    }
    




}
