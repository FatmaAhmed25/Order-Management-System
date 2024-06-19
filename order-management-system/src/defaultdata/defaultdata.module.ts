import { Module } from '@nestjs/common';
import { DefaultdataService } from './defaultdata.service';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { CouponsService } from 'src/coupons/coupons.service';

@Module({
  providers: [DefaultdataService,UsersService,ProductsService,CouponsService]
  ,
})
export class DefaultdataModule {}
