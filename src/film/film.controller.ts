import { Body, Controller, Delete, Get, Param, ParseEnumPipe, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { FilmService } from './film.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateFilmDto } from './dtos/create.film.dto';
import { film } from '@prisma/client';
import { UpdateFilmDto } from './dtos/update.film.dto';

@ApiTags('films')
@Controller('films')
export class FilmController {
    constructor(
        private readonly filmService: FilmService
    ){}

    @ApiOperation({ summary: 'Get films list'})
    @ApiResponse({status: 200, description: ''})
    @Get('/')
    async getAllFilms(){
        return await this.filmService.getAllFilm();
    }

    @ApiOperation({summary: 'Get film detail by ID'})
    @ApiResponse({status:200, description: 'Film found!'})
    @Get('/:id')
    async getFilmDetailById(@Param('id', ParseIntPipe) id: number){
        return await this.filmService.getFilmDetail(id);
    }

    @ApiOperation({summary: 'Add a new film'})
    @ApiResponse({status: 201, description: 'Film created!'})
    @Post('/')
    async createAFilm(@Body() createFilmDto: CreateFilmDto){
        return await this.filmService.createFilm(createFilmDto);
    }

    @ApiOperation({summary: 'Edit a film detail'})
    @ApiResponse({status: 200, description: 'Film detail updated!'})
    @Put('/:id')
    async updateAFilm(@Param('id') id:number, @Body() updateFilmDto: UpdateFilmDto){
        return await this.filmService.updateFilmDetail(id, updateFilmDto);
    }

    @ApiOperation({ summary: 'Delete a film'})
    @ApiResponse({status: 204, description: 'Film deleted'})
    @Delete('/:id')
    async deleteFilmById(@Param('id', ParseIntPipe) id: number){
        return this.filmService.deleteAFilm(id);
    }
}
