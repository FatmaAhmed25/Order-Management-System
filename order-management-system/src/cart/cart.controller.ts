import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDto } from './dto/cart.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RemoveCartDto } from './dto/remove-cart.dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {

  constructor(private readonly cartService: CartService) {}

  /**
   * Add a product to the cart (Creates a car if it doesn't exists).
   * @param cartDto The data required to add a product to the cart (userId,productId,quantity).
   * @returns The updated cart state.
   */
  @Post('/add')
  @ApiOperation({ summary: 'Add a product to the cart' })
  @ApiBody({ type: CartDto })
  @ApiResponse({ status: 201, description: 'Successfully added to the cart' })
  @ApiResponse({ status: 400, description: 'Bad Request: Invalid input data' })
  async addToCart(@Body() cartDto: CartDto) {
    return this.cartService.addToCart(cartDto);
  }

  /**
   * Retrieve the list of products in the user's cart.
   * @param userId The ID of the user whose cart is being viewed.
   * @returns A list of products currently in the cart.
   */
  @Get('/:userId')
  @ApiOperation({ summary: 'View the contents of the cart' })
  @ApiResponse({ status: 200, description: 'List of products in the cart', type: [CartDto] })
  @ApiResponse({ status: 400, description: 'Bad Request: Invalid user ID' })
  async viewCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.viewCart(userId);
  }

  /**
   * Update the quantity of a specific product in the cart.
   * @param cartDto The data containing the updated quantity and product details.
   * @returns The updated cart state.
   */
  @Patch('/update')
  @ApiOperation({ summary: 'Update the quantity of a product in the cart' })
  @ApiBody({ type: CartDto })
  @ApiResponse({ status: 200, description: 'Successfully updated the cart' })
  @ApiResponse({ status: 400, description: 'Bad Request: Invalid input data' })
  async updateCart(@Body() cartDto: CartDto) {
    return this.cartService.updateCart(cartDto);
  }

  /**
   * Remove an item from the cart.
   * @param removeCartDto The data identifying which product to remove from the cart.
   * @returns The updated cart state after removal.
   */
  @Delete('/remove')
  @ApiOperation({ summary: 'Remove a product from the cart' })
  @ApiBody({ type: RemoveCartDto })
  @ApiResponse({ status: 200, description: 'Successfully removed from the cart' })
  @ApiResponse({ status: 400, description: 'Bad Request: Invalid input data' })
  async removeFromCart(@Body() removeCartDto: RemoveCartDto) {
    return this.cartService.removeFromCart(removeCartDto);
  }
}
