import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ActorService } from './actor.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateActorDto } from './dtos/create.actor.dto';
import { UpdateActorDto } from './dtos/update.actor.dto';

@ApiTags('actors')
@Controller('actors')
export class ActorController {
    constructor (
        private actorService: ActorService,
    ) {}

    @ApiOperation({ summary: 'Get actor list' })
    @ApiResponse({ status: 201, description: '' })
    @Get('/')
    async getAllActors() {
        return await this.actorService.getAllActor();
    }

    @ApiOperation({ summary: 'Get actor detail by ID' })
    @ApiResponse({ status: 201, description: 'Actor found!' })
    @ApiResponse({ status: 404, description: 'Actor not found!' })
    @Get('/:id')
    async getActorDetailById(
        @Param('id')  id: number) {
      return await this.actorService.getActorDetail(id);
    }


    @ApiOperation({summary: 'Delete an actor'})
    @ApiResponse({ status: 204, description: 'Actor deleted!' })
    @ApiResponse({ status: 404, description: 'Actor not found!' })
    @Delete('/:id')
    async deleteActorById(@Param('id') id: number){
        return this.actorService.deleteAnActor(id);
    }

    @ApiOperation({summary: 'Add a new actor'})
    @ApiResponse({ status: 201, description: 'Actor created!' })
    @ApiBody({ type: CreateActorDto })
    @Post('/')
    async createAnActor(@Body() createActorDto: CreateActorDto){
        return await this.actorService.createAnActor(createActorDto);
    }

    @Put('/:id')
    @ApiOperation({summary: 'Edit an actor detail'})
    @ApiResponse({ status: 200, description: 'Actor detail updated!' })
    @ApiResponse({ status: 404, description: 'Actor not found!' })
    @ApiBody({ type: UpdateActorDto })
    async updateAnActor(@Param('id') id:number, @Body() updateActorDto: UpdateActorDto) {
        return await this.actorService.updateAnActor(id, updateActorDto );
    }
}
