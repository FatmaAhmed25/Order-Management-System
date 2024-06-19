import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}



  /**
   * Creates a new user record in the database.
   * @param createUserDto DTO containing user details.
   * @returns Promise<User> Created user object.
   */
  async createUser(createUserDto: CreateUserDto) {

    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
        address: createUserDto.address,
      },
    });
  }

  async findUserById(userId: number) {
    return this.prisma.user.findUnique({ where: { userId } });
  }




  /**
   * Retrieves order history for a user based on their ID.
   * @param userId ID of the user to retrieve order history for.
   * @returns Promise<Order[]> Array of orders belonging to the user.
   */
  async getOrderHistoryByUserId(userId: number) {
    const orders = await this.prisma.order.findMany({
        where: { userId },
        include: { orderItems: true }, // Include related order items if needed
    });
    return orders;
  }
  async findAllUsers() {
    return this.prisma.user.findMany();
  }




}
