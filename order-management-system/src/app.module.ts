import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { PrismaModule } from './prisma/prisma.module';
import { CouponsModule } from './coupons/coupons.module';
import { DefaultdataModule } from './defaultdata/defaultdata.module';

@Module({
  imports: [UsersModule, ProductsModule, OrdersModule, CartModule,PrismaModule, CouponsModule, DefaultdataModule],
  
})
export class AppModule {}
