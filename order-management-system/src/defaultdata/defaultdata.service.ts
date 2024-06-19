import { Injectable } from '@nestjs/common';
import { CouponsService } from 'src/coupons/coupons.service';
import { CreateCouponDto } from 'src/coupons/dto/create-coupon.dto';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { ProductsService } from 'src/products/products.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DefaultdataService {

    
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly couponsService: CouponsService,
  ) {}

//method for creating default data

  async initializeDefaultData() {
    await this.createDefaultUsers();
    await this.createDefaultProducts();
    await this.createDefaultCoupons();
  }

  private async createDefaultUsers() {
    // check if any user already exists
    const usersExist = await this.usersService.findAllUsers();
    if (usersExist.length === 0) {
    const defaultUsers: CreateUserDto [] = [
      { name: 'Fatma', email: 'fatma@gmail.com', password: '123' },
      { name: 'Ahmed', email: 'ahmed@gmail.com', password: '123' },
    ];

    for (const user of defaultUsers) {
      await this.usersService.createUser(user);
    }
  }
}

  private async createDefaultProducts() {
    // check if any product already exists
    const productsExist = await this.productsService.getAllProducts();
    if (productsExist.length === 0) {   
    const defaultProducts: CreateProductDto[] = [
      { name: 'Bag', description: 'High-end bag', price: 200, stock: 50 },
      { name: 'Smartphone', description: 'Latest smartphone', price: 500, stock: 10 },
      
    ];

    for (const product of defaultProducts) {
      await this.productsService.createProduct(product);
    }
  }
}

  private async createDefaultCoupons() {

    // check if any coupon already exists
    const couponsExist = await this.couponsService.findAllCoupons();
    if (couponsExist.length === 0) {
    const couponsToCreate: CreateCouponDto[] = [
      { code: 'SUMMER20', discountPercentage: 20, expiryDate: new Date('2024-7-7') },
      { code: 'WINTER50', discountPercentage: 50, expiryDate: new Date('2024-12-29') },
      
    ];

    for (const coupon of couponsToCreate) {
      await this.couponsService.createCoupon(coupon);
    }
  }

}}
