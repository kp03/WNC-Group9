import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ActorService } from './actor.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateActorDto } from './dtos/create.actor.dto';
import { UpdateActorDto } from './dtos/update.actor.dto';

@Controller('actor')
export class ActorController {
    constructor (
        private actorService: ActorService,
    ) {}

    @Get('/')
    async getAllActors() {
        return await this.actorService.getAllActor();
    }

    @ApiOperation({ summary: 'Get actor detail by ID' })
    @ApiResponse({ status: 201, description: 'Actor found!' })
    @Get('/:id')
    async getActorDetailById(@Param('id', ParseIntPipe) id: number) { // Use 'id' here as well
      return await this.actorService.getActorDetail(id);
    }


    @ApiOperation({summary: 'Delete an actor'})
    @Delete('/:id')
    async deleteActorById(@Param('id', ParseIntPipe) id: number){
        return this.actorService.deleteAnActor(id);
    }

    @ApiOperation({summary: 'Add a new actor'})
    @ApiBody({ type: CreateActorDto })
    @Post('/actor')
    async createAnActor(@Body() createActorDto: CreateActorDto){
        return await this.actorService.createAnActor(createActorDto);
    }

    @Put('/:id')
    async updateAnActor(@Param('id', ParseIntPipe) id:number, @Body() updateActorDto: UpdateActorDto) {
        return await this.actorService.updateAnActor(id, updateActorDto );
    }
}
