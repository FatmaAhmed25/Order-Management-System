# Order Management System (OMS) Backend

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Getting Started](#getting-started)
   - [Installation](#installation)
   - [Configuration](#configuration)
   - [Running the Application](#running-the-application)
5. [API Documentation](#api-documentation)


## Introduction

 This project implements a backend system for managing orders, carts, and products using NestJS, Prisma, and PostgreSQL.

## Features

- **User Management**
  - Create,and retrieve user details.
- **Cart Operations**
  - Add, view, update, and remove products from the cart.
  - Calculate total cart amounts dynamically based on product prices and quantities.
- **Order Processing**
  - Create new orders from existing carts.
  - Retrieve order history for users.
- **Coupon Application**
  - Apply discounts to orders using unique coupon codes.
  - Validate coupon codes and adjust order totals accordingly.
- **API Documentation**
  - Automatically generated Swagger documentation for easy API exploration and integration.
- **Database Integration**
  - Seamless integration with PostgreSQL for data persistence and management.
  - Efficient data querying and manipulation using Prisma ORM.

## Prerequisites

Before you begin, ensure you have the following installed on your development environment:

- Node.js 
- npm or yarn
- PostgreSQL

## Getting Started

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/FatmaAhmed25/order-management-system.git
   cd order-management-system
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install

### Configuration
1. **Set up the PostgreSQL database:**
   - Create a new PostgreSQL database.
   - Update the database connection URL in the .env file or as environment variables:
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   Replace username and password with your PostgreSQL username and password, and database_name with the name you have chosen for your database.
2. **Run database migrations:**
   - To initialize or update your database schema, run the following command:
   ```bash
   npx prisma migrate dev

   - This command applies any pending migrations to the database specified in your .env file. It ensures that your database schema matches your Prisma schema defined in your project.


### Running the Application
To start the application in development mode, run:

npm run start:dev
or
yarn start:dev

The application should now be running locally at http://localhost:3000.



## API Documentation
API documentation is automatically generated using Swagger. Access the Swagger UI at:
(http://localhost:3000/api/)


   
   

   
