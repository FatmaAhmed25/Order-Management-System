import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { UpdateStatusDto } from './dto/update-order-status.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { round } from 'lodash';

@Injectable()
export class OrdersService {

    constructor(private prisma: PrismaService) {}

    /**
     * Creates a new order based on the provided order details.
     * Validates cart contents, checks product availability, and updates stock.
     * @param createOrderDto The DTO containing userId .
     * @returns The newly created order.
     */
    async createOrder(createOrderDto: CreateOrderDto) {
       
        // a transaction for consistency
        return this.prisma.$transaction(async (prisma) => {

          // Retrieve the user's cart
          const cart = await prisma.cart.findUnique({
            where: { userId: createOrderDto.userId },
            include: { cartProducts: true },
          });
    
          if (!cart) {
            throw new NotFoundException('Cart not found.');
          }

          if (cart.cartProducts.length === 0) {
            throw new BadRequestException('Cart is empty.');
          }
    
          let totalAmount = 0;
          // check if all products in the cart are in stock
          for (const item of cart.cartProducts) {
            const product = await prisma.product.findUnique({
              where: { productId: item.productId },
            });
    
            if (!product || product.stock < item.quantity) {
              throw new BadRequestException(`Product with ID ${item.productId} is out of stock.`);
            }

            totalAmount += product.price * item.quantity;
          }
    
          // create an order
          const order = await prisma.order.create({
            data: {
              user: { connect: { userId: createOrderDto.userId } },
              status: 'pending',
              orderDate: new Date(),
              totalAmount: totalAmount,
              

            },
          });
    
          // create order items and update product stock
          for (const item of cart.cartProducts)
          {
            await prisma.orderItem.create({
        
              data: {
                order: { connect: { orderId: order.orderId } },
                product: { connect: { productId: item.productId } },
                quantity: item.quantity,
              },
            });
    
            // Update product stock
            await prisma.product.update({
              where: { productId: item.productId },
              data: { stock: { decrement: item.quantity } },
            });
          }
    
          // Clear the user's cart
          await prisma.cartProduct.deleteMany({
            where: { cartId: cart.cartId },
          });
       
    
          return order;
        });
      }    


    /**
     * Retrieves an order by its ID.
     * @param orderId The ID of the order to retrieve.
     * @returns The order object if found.
     * @throws NotFoundException if the order with the given ID does not exist.
     */
    async getOrderById(orderId:number){
      const order = await this.prisma.order.findUnique({
        where: { orderId },
        include: { orderItems: true } 
    });
      if (!order) {
          throw new NotFoundException(`Order with ID ${orderId} not found.`);
      }
      return order;

    }

    /**
     * Updates the status of an order identified by orderId.
     * @param orderId The ID of the order to update.
     * @param updateStatusDto DTO containing the new status.
     * @returns The updated order object.
     */
    async updateOrderStatus(orderId:number,updateStatusDto:UpdateStatusDto)
    {
        const updatedOrder = await this.prisma.order.update({
          where: { orderId },
          data: { status:updateStatusDto.status },
      });
      return updatedOrder;
    }


    /**
     * Applies a coupon to reduce the total amount of an order.
     * Validates coupon existence, expiration, and applies discounts.
     * @param orderId The ID of the order to apply the coupon to.
     * @param applyCouponDto DTO containing the coupon code to apply.
     * @returns The updated order object with the applied coupon.
     * @throws BadRequestException if the coupon code is invalid or expired.
     * @throws NotFoundException if the order with the given ID does not exist.
     */    
    async applyCoupon(orderId: number, applyCouponDto: ApplyCouponDto) {
      // find the order
      const order = await this.prisma.order.findUnique({
          where: { orderId },
          include: { orderItems: true },
      });

      if (!order) {
          throw new NotFoundException(`Order with ID ${orderId} not found.`);
      }

      // find existing coupon applied to the order, if any
      const existingCoupon = await this.prisma.coupon.findUnique({
          where: { code: order.couponCode },
      });

      // check if the same coupon code is already applied to the order
      if (order.couponCode === applyCouponDto.couponCode) {
          return order; // No changes needed
      }

      // find new coupon to apply
      const newCoupon = await this.prisma.coupon.findUnique({
          where: { code: applyCouponDto.couponCode },
      });

      if (!newCoupon) {
          throw new BadRequestException(`Coupon with code ${applyCouponDto.couponCode} not found.`);
      }

      if (newCoupon.expiryDate < new Date()) {
          throw new BadRequestException(`Coupon with code ${applyCouponDto.couponCode} has expired.`);
      }

      let updatedOrder = order;

      // if an existing coupon was applied, refund its discount
      if (existingCoupon && existingCoupon.code !== newCoupon.code) {
          const originalAmount = updatedOrder.totalAmount / (1 - (existingCoupon.discountPercentage / 100));
          updatedOrder = await this.prisma.order.update({
              where: { orderId },
              data: {
                  totalAmount: originalAmount,
                  couponCode: null, // remove old coupon code
              },
              include: { orderItems: true },
          });
      }

      // apply the new coupon's discount on the original amount
      const newDiscount = (updatedOrder.totalAmount * newCoupon.discountPercentage) / 100;
      updatedOrder = await this.prisma.order.update({
          where: { orderId },
          data: {
              totalAmount: updatedOrder.totalAmount - newDiscount,
              couponCode: newCoupon.code,
          },
          include: { orderItems: true },
      });

      return updatedOrder;
  }













  }
