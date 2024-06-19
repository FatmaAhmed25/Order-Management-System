import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartDto } from './dto/cart.dto';
import { RemoveCartDto } from './dto/remove-cart.dto';
import { round } from 'lodash';
import { ApplyCouponDto } from 'src/orders/dto/apply-coupon.dto';

@Injectable()
export class CartService {

    constructor(private prisma: PrismaService) {}


    /**
     * Add a product to the user's cart or update its quantity if already present.
     * Throws NotFoundException if the product is not found or out of stock.
     */
    async addToCart(cartDto: CartDto) {
        // check if the product is in stock
        const product = await this.prisma.product.findUnique({
            where: { productId: cartDto.productId },
        });
    
        if (!product || product.stock < cartDto.quantity) {
            throw new NotFoundException('Product not found or out of stock.');
        }
    
        // check if the user already has a cart
        let userCart = await this.prisma.cart.findUnique({
            where: { userId: cartDto.userId },
            include: { cartProducts: true }, 
        });
    
        // If no cart exists, create a new one
        if (!userCart) {
            userCart = await this.prisma.cart.create({
                data: {
                    userId: cartDto.userId,
                },
                include: { cartProducts: true }, 
            });
        }
    
        // check if the product already exists in the cart to only increase the quantity
        const existingCartItem = await this.prisma.cartProduct.findUnique({
            where: {
                cartId_productId: {
                    cartId: userCart.cartId,
                    productId: cartDto.productId,
                },
            },
        });
    
        if (existingCartItem) {
            await this.prisma.cartProduct.update({
                where: {
                    cartId_productId: {
                        cartId: userCart.cartId,
                        productId: cartDto.productId,
                    },
                },
                data: {
                    quantity: {
                        increment: cartDto.quantity,
                    },
                },
            });
        } else {
            await this.prisma.cartProduct.create({
                data: {
                    cartId: userCart.cartId,
                    productId: cartDto.productId,
                    quantity: cartDto.quantity,
                },
            });
        }

        
    
        // recalculate total amount of the cart after adding/updating products
        const updatedCart = await this.prisma.cart.findUnique({
            where: { cartId: userCart.cartId },
            include: {
                cartProducts: {
                    include: {
                        product: true, 
                    },
                },
            }, 
        });
        // calculate new total amount
        const newTotalAmount = await updatedCart.cartProducts.reduce((total, cartProduct) => {
            const productPrice = cartProduct.product.price;
            return total + (productPrice * cartProduct.quantity);
        }, 0);
    
        // update the cart with the new total amount
        await this.prisma.cart.update({
            where: { cartId: userCart.cartId },
            data: {
                totalAmount: newTotalAmount,
            },
        });
    
        // update the updatedCart object with the new totalAmount
        updatedCart.totalAmount = newTotalAmount;
    

        // return the updated cart
        return updatedCart;
    }
    

    /**
     * View the user's cart with all its products.
     */
    async viewCart(userId: number) 
    {
        return this.prisma.cart.findUnique({
            where: {
            userId: userId,
            },
            include: {
            cartProducts: {
                include: {
                product: true,
                },
            },
            },
        });
    }

    /**
     * Update the quantity of a product in the user's cart.
     * Throws NotFoundException if the product or user's cart is not found.
     */    
    async updateCart(cartDto: CartDto) {
        // check if the product is in stock
        const product = await this.prisma.product.findUnique({
            where: {
                productId: cartDto.productId,
            },
        });

        if (!product || product.stock < cartDto.quantity) {
            throw new NotFoundException('Product not found or out of stock.');
        }

        // Fetch the user's cart
        const userCart = await this.prisma.cart.findUnique({
            where: { userId: cartDto.userId },
            include: {
                cartProducts: true, // Include all products in the cart
            },
        });

        if (!userCart) {
            throw new Error('User does not have a cart.');
        }

        // update the cartProduct with new quantity
        await this.prisma.cartProduct.update({
            where: {
                cartId_productId: {
                    cartId: userCart.cartId,
                    productId: cartDto.productId,
                },
            },
            data: {
                quantity: cartDto.quantity,
            },
        });

        // recalculate total amount of the cart after updating quantities
        const updatedCart = await this.prisma.cart.findUnique({
            where: { cartId: userCart.cartId },
            include: {
                cartProducts: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // calculate new total amount
        const newTotalAmount = updatedCart.cartProducts.reduce((total, cartProduct) => {
            const productPrice = cartProduct.product.price;
            return total + (productPrice * cartProduct.quantity);
        }, 0);

        // update the cart with the new total amount
    return await this.prisma.cart.update({
            where: { cartId: userCart.cartId },
            data: {
                totalAmount: newTotalAmount,
            },
        });

        
    }

    /**
     * Remove a product from the user's cart.
     * Throws NotFoundException if the user's cart is not found.
     */
    async removeFromCart(removeCartDto:RemoveCartDto) {
        
        const userCart = await this.prisma.cart.findUnique({
        where: { userId: removeCartDto.userId },
        });

        if (!userCart) {
            throw new NotFoundException("User's cart not found.");
        }

        await this.prisma.cart.update({
            where: { cartId: userCart.cartId },
            data: {
                totalAmount: 0,
            
            },
        });

        await this.prisma.cartProduct.update({
            where: {
                cartId_productId: {
                    cartId: userCart.cartId,
                    productId: removeCartDto.productId,
                
                },
            },
            data: {
                quantity: 0,
            
            },

        });

        return await this.prisma.cartProduct.delete({
        where: {
            cartId_productId: {
            cartId: userCart.cartId,
            productId: removeCartDto.productId,
            
            },
        },
        
        });
    }




 
}
    



