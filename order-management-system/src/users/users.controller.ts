import { Body, Controller, Post, Get, Param,ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get User by id' })
  @ApiResponse({ status: 201, description: 'The user info' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getUser(@Param('userId',ParseIntPipe) userId: number) {
    return this.usersService.findUserById(userId);
  }

  @ApiOperation({ summary: 'Get order history by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID to retrieve order history' })
  @ApiResponse({ status: 200, description: 'Order history retrieved successfully' })
  @Get('/:userId/orders')
  async getOrderHistoryByUserId(@Param('userId') userId: number) {
      try {
          const orders = await this.usersService.getOrderHistoryByUserId(+userId);
          return { orders };
      } catch (error) {
          throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
  }
}
