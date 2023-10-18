## NestJS Guide

### 1.Rerequisite:
#### I. Database Setup:
1. MySQL Database setup.
2. DBeaver or any other DB Management tool.
3. SQL Script: sakila-mysql.sql
#### II. Framework Setup:
1. Nodejs.
2. NPM.
3. Yarn package manager.
    ```bash
    $ npm install --global yarn
    ```
    ```bash
    $ yarn --version
    ```
4. NestJS Framework: https://docs.nestjs.com/

    Installation
    ```bash
    $ npm i -g @nestjs/cli
    ```
### 2.Writing an API with NestJS
1. We'll be using an ORM for ease of development: 
- Choice: TypeORM, MikroORM, etc.
- NestJS documentation provide guides for these.
- For this guide we'll be using Prisma
### I.Project Initialization:
1. Init a Project
    ```bash
    $ nest new sakila-api
    ```
2. Select a package manager of your choice, I'll be using Yarn.
3. You can find the command in the README.md in the repository. For development, we'll be mainly using
    ```
    $ yarn run start:dev
    ```
4. Delete the ```app.controller.spec.ts```, ```app.service.ts``` and ```app.controller.ts``` in the source folder, it's out of the scope in this tutorial.
5. Make sure to clear out the import lines in ```app.module.ts```
6. We'll be using swagger for this tutorial, head over to the command line and tye in:
    ```bash
    $ yarn add @nestjs/swagger
    ```
7. Now we'll be adding some configuration for our swagger documentation, as well as changing our app port to port ```4000``` since most of our front-end will be using the ```3000``` port with ReactJS.
8. Add in this code:
    ```javascript
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';
    import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

    async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Sakila Api').setVersion('1.0').build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('documentation', app, document);
    await app.listen(4000);
    }
    bootstrap();
    ```
    This will help us change the port of our NestJS app to 4000 and also add an /documentation endpoint to access the swagger doc ourself.
9. Next, we'll be adding prisma to use in our app. Type in the folowwing:
    ```bash
    $ yarn add @prisma/client prisma
    $ yarn prisma init
    ```
    Adding prisma and init the prisma module will generate us a ```.env``` file for us to config our database and use the Prisma ORM to help us with the SQL.
10. Navigate to the ```.env``` and setup your .env to match the database, note that these configuration should be based on how you setup your database in your machine:
    ```bash
    HOST = localhost
    PORT = 3306
    DB_NAME=sakila
    DB_USERNAME=root
    DB_PASSWORD=1
    DATABASE_URL=mysql://${DB_USERNAME}:${DB_PASSWORD}@${HOST}:${PORT}/${DB_NAME}
    ```
    Also, head into the ```schema.prisma``` file and change the provider to ```mysql``` if you're using sql, you can leave it as is if you're using postgresql
    ```bash
    generator client {
    provider = "prisma-client-js"
    }

    datasource db {
    provider = "mysql"
    url      = env("DATABASE_URL")
    }
    ```
11. After that, we can check if our Prisma database is working properly by typing in the command line:
    ```bash
    $ yarn prisma studio
    ```
11. An error will occur since prisma model is empty and it will be working just fine after we define some models for it. Since our SQL scripts has already generated the data and also have tables in it, we can use this command to make it easier for us:
    ```bash
    $ yarn prisma db pull
    $ yarn prisma generate
    ```
    We'll be having an error at line ```134``` because it does not match the data type of the description, simply change the description type to @db.VarChar(255). Then rerun the generate command:
    ```bash
    $ yarn prisma generate
    ```
12. Congrats, now we can actually view the database using the command before:
    ```bash
    $ yarn prisma studio
    ```
### II. Starting to write the API in depth:
1. Our main goal today is to create the api for our actor model, and we have these operation:
    ```bash
    👉 View a list of all `actor`
    👉 View detail of an `actor`
    👉 Add new `actor`
    👉 Delete an `actor`
    👉 Update an `actor`
    ```
2. To start writing the api, make sure you're in the sakila-app or whatever name you called your project is. Since we need Prisma to do operation with the database, we'll need to have a prisma service that helps us connect to the database and perform those operation. Type this into the command line:
    ```bash
    $ nest generate module prisma
    $ nest generate service prisma
    ```
3. In the ```prisma.service.ts``` file, we'll code the following:
    ```typescript
    import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
    import { PrismaClient } from '@prisma/client';

    @Injectable()
    export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy{
        async onModuleInit() {
            await this.$connect;
        }
        async onModuleDestroy() {
            await this.$disconnect;
        }
    }
    ```
    - This piece of code will act as a service that will open and close the connection for us everytime we're calling an api that needs to perform operation to our database. For every API we'll be working with NestJS and Prisma, this is the base setup that we'll need to do first before implementing any other APIs.
    - However, to actually use this Prisma Service in other modules, as we'll see the ```actor``` module up next, we will need to export the ```PrismaService``` out from the ```prisma.module.ts``` in order to inject it into other modules. Example:
        ```typescript
        import { Module } from '@nestjs/common';
        import { PrismaService } from './prisma.service';

        @Module({
        providers: [PrismaService],
        exports: [PrismaService]
        })
        export class PrismaModule {}
        ```
    - And vice versa, if we want to use the ```PrismaModule``` inside other module, we'll need to import ```PrismaModule``` in the ``imports``. Example 
        ```typescript
        @Module({
            imports: [PrismaModule, ActorModule],
            controllers: [],
            providers: [],
        })
        ```
4. Now to our main part, type in the command line these following:
    ```bash
    $ nest generate module actor
    $ nest generate service actor
    $ nest generate controller actor
    ```
5. We'll not be doing any testing so you can delete any ```.spec.ts``` files within that folder.
6. We need the PrismaModule, therefore we should import it into our actor module to use.
7. As you might already know, the we'll be coding the logic part in our ```actor.service.ts``` and coding up the controller for the api endpoints in our ```actor.controller.ts``` this way, our code will be cleaner and easier to maintain.
8. Navigate into our ```actor.service.ts```. To invoke and use the Prisma Service, we'll have to add in the Prisma Service through ```constructor```, which is the place where we'll create an instance of that service to use.
    ```typescript
    export class ActorService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    ```
9. After that, we'll get the list of all actor, we can simply use prisma to do all the work, simply:
    ```typescript
    // Get the list of all actor
    async getAllActor(): Promise<actor[] | []> {
        return this.prismaService.actor.findMany();
    }
    ```
    - The ```findMany()``` function will return all available actors, now we only need to define a controller endpoint in our ```actor.controller.ts``` 
    - You can read more about Prisma at: https://www.prisma.io/docs/getting-started/quickstart

10. Inside our controller, we'll simply need to use the ```ActorService``` to do all the behind work for us, therefore, like earlier, we'll need to define it in the controller constructor:
    ```typescript
    @Controller('actor')
    export class ActorController {
        constructor (
            private actorService: ActorService,
        ) {}
    }
    ```
11. Then adding the controller with the decorations from @nestjs/swagger will make the api endpoint easy to understand and use in swagger doc.
    ```typescript
    @ApiOperation({ summary: 'Get actor list' })
    @ApiResponse({ status: 201, description: '' })
    @Get('/')
    async getAllActors() {
        return await this.actorService.getAllActor();
    }

    ```
    - Do note that the ```@ApiOperation``` Describe what the api is going to perform. The ```@ApiResponse``` will be the return response when it performs successfuly. The ```@Get('/')``` defines the API operation and the endpoint of that operation.

12. Adding the get a single actor detail api:
    - ```actor.service.ts```
        ```typescript
        // Get an actor detail
        async getActorDetail(id: number): Promise<actor | null> {
        const actor = await this.prismaService.actor.findFirst({
            where: {
                actor_id: id
            },
        }); 
        if (!actor) {
            throw new NotFoundException('Actor not found!');
        }
        return actor;
        }
        ```
    - ```actor.controller.ts```
        ```typescript
        @ApiOperation({ summary: 'Get actor detail by ID' })
        @ApiResponse({ status: 201, description: 'Actor found!' })
        @Get('/:id')
        async getActorDetailById(@Param('id', ParseIntPipe) id: number) {
        return await this.actorService.getActorDetail(id);
        }
        ```
    - Do note that the ```@Param('id', ParseIntPipe) id: number``` is the operation to allow us to input an id as a number into the swagger api. Without parsing the type, we'll likely encounter an ```error type inferred as string```. So please do note that all param you're parsing in is string then you need to use ```ParseIntPipe``` or relevant to parse in the correct type.
    - Read more here: https://docs.nestjs.com/pipes
13. DTOs for creating a new actor:
    - ```actor.service.ts```
        ```typescript
        // Create an actor
        async createAnActor(data: CreateActorDto): Promise<actor> {
            const {first_name, last_name, last_update} = data;
            
            return this.prismaService.actor.create({
                data: {
                    first_name,
                    last_name,
                    last_update,                
                }
            });
        }
        ```
    - ```actor.controller.ts```
        ```typescript
        @ApiOperation({summary: 'Add a new actor'})
        @ApiBody({ type: CreateActorDto })
        @Post('/actor')
        async createAnActor(@Body() createActorDto: CreateActorDto){
            return await this.actorService.createAnActor(createActorDto);
        }
        ```
    - The main difference here is we need to add a ```dtos``` folder inside our actor folder and inside the ```dtos``` folder, we'll need to create a file name ```create.actor.dto``` with the following code.
        ```typescript
        import { ApiProperty } from "@nestjs/swagger"
        import { IsNotEmpty } from "class-validator"

        export class CreateActorDto {

        @ApiProperty({example: 'John'})    
        @IsNotEmpty()
        first_name: string

        @ApiProperty({example: 'Doe'})    
        @IsNotEmpty()
        last_name:  string
        
        last_update: Date

        film_actor: []
        }
        ```
    - The class-validator provide us some decorator like IsNotEmpty(), IsString(), etc so that we could add it to our dto to ensure that when creating an actor, we'll have those error handle when the input is wrong.
    - Do add in the class-validator and class-transform:
    ```bash
    $ yarn add class-validator class-transformer
    ```
14. Homework:
    - Try to implement the ```delete``` and the ```update``` api endpoints yourself

## NestJS API Documentation With Swagger Guide

1. Setup swagger in ```main.ts```
    ```typescript
    async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Set this up to automatically validate
    app.useGlobalPipes(
        new ValidationPipe({
        transform: true,
    }));

    const config = new DocumentBuilder()
        .setTitle('Sakila Api').setVersion('1.0').build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('documentation', app, document);
    await app.listen(4000);
    }
    ```

2. Within the bootstrap, we will setup the ```ValidationPipe transform``` to actually setup the validation for any data.
3. By using this, we'll actually don't need to worry about adding the ```ParseIntPipe``` or things like that within our controller.
4. Now, we'll be focusing on writing the dto for the create and update.     
    - ```create.actor.dto.ts```
        ```typescript
        import { ApiProperty } from "@nestjs/swagger"
        import { IsNotEmpty, IsString } from "class-validator"

        export class CreateActorDto {

            @ApiProperty({example: 'John'})    
            @IsNotEmpty()
            @IsString()
            first_name: string

            @ApiProperty({example: 'Doe'})    
            @IsNotEmpty()
            @IsString()
            last_name:  string
            
            last_update: Date

            film_actor: []
        }
        ```
    - As you can see, now we will add in a ```IsString()```, ```IsNotEmpty()``` for the ```first_name``` and ```last_name``` property, which will ensure that the user must be putting in the data as a string, and it shouldn't be emty also.
    - By using the dto and parse it in the controller within the ```actor.controller.ts```, we can ensure what the users input is correct each time they call for the API.
        ```typescript
        @Put('/:id')
        @ApiOperation({summary: 'Edit an actor detail'})
        @ApiResponse({ status: 200, description: 'Actor detail updated!' })
        @ApiResponse({ status: 404, description: 'Actor not found!' })
        @ApiResponse({ type: UpdateActorDto })
            async updateAnActor(@Param('id') id:number, @Body() updateActorDto: UpdateActorDto) {
                return await this.actorService.updateAnActor(id, updateActorDto );
            }
        }   
        ```
5. Note
    - When writing the controller for the API, we can actually use the "@" to specify the decorators that we want to use for that particular controller.
    - Some key decoration which we could be usually using is the:
    - ```@ApiOperation```, ```@ApiResponse```, ```@ApiResponse```.
    - Of which it describe the Operation of that API, the Response of that API and the Body that it will intake.
    - Furthermore, we also have the ```@Param``` parameter which we'll use if that api need that parameter to be called successfully.
    - For more information, you can visit the documentation here: 
        - https://docs.nestjs.com/openapi/decorators 
        - https://docs.nestjs.com/openapi/introduction

