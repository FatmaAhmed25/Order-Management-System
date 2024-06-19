import { Controller, Post, Body, HttpException, HttpStatus,ParseIntPipe, Param, Get, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBadRequestResponse, ApiParam, ApiNotFoundResponse } from '@nestjs/swagger';
import { UpdateStatusDto } from './dto/update-order-status.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}



    @ApiOperation({ summary: 'Create a new order' })
    @ApiBody({ type: CreateOrderDto })
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    @ApiBadRequestResponse({ description: 'Bad request. Cart not found or product out of stock.' })
    @Post()
    async createOrder(@Body() createOrderDto: CreateOrderDto) {
        try {
            const order = await this.ordersService.createOrder(createOrderDto);
            return { order };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


    @ApiOperation({ summary: 'Get order by ID' })
    @ApiParam({ name: 'orderId', description: 'Order ID to retrieve' })
    @ApiResponse({ status: 200, description: 'Order found successfully' })
    @ApiNotFoundResponse({ description: 'Order not found' })
    @Get('/:orderId')
    async getOrderById(@Param('orderId',ParseIntPipe) orderId:number){

        try {
            const order = await this.ordersService.getOrderById(+orderId); // Convert param to number if needed
            return { order };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
        
    }


    @ApiOperation({ summary: 'Update order status by ID' })
    @ApiParam({ name: 'orderId', description: 'Order ID to update status' })
    @ApiBody({ type: UpdateStatusDto })
    @ApiResponse({ status: 200, description: 'Order status updated successfully' })
    @ApiBadRequestResponse({ description: 'Bad request. Invalid status or order not found.' })
    @Put('/:orderId/status')
    async updateOrderStatus(@Param('orderId') orderId: number, @Body() updateOrderStatusDto: UpdateStatusDto) {
        try {
            const updatedOrder = await this.ordersService.updateOrderStatus(+orderId, updateOrderStatusDto); // Convert param to number if needed
            return { order: updatedOrder };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }




    @ApiOperation({ summary: 'Apply coupon to order' })
    @ApiBody({ type: ApplyCouponDto })
    @ApiResponse({ status: 200, description: 'Coupon applied successfully' })
    @ApiBadRequestResponse({ description: 'Bad request. Invalid coupon or order not found.' })
    @Post('apply-coupon')
    async applyCoupon(@Body() applyCouponDto: ApplyCouponDto) {
        try {
            const { orderId } = applyCouponDto;
            const updatedOrder = await this.ordersService.applyCoupon(orderId, applyCouponDto);
            return { order: updatedOrder };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


}
