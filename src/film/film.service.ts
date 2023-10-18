import { Injectable, NotFoundException } from '@nestjs/common';
import { film, film_rating } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFilmDto } from './dtos/create.film.dto';
import { UpdateFilmDto } from './dtos/update.film.dto';

@Injectable()
export class FilmService {
    constructor(
        private readonly prismaService : PrismaService,
    ) {}

    // Get the list of all film
    async getAllFilm(): Promise<film[] | []> {
        return this.prismaService.film.findMany();
    }

    // Get a film detail
    async getFilmDetail(id: number): Promise<film | null> {
        
        const film = await this.prismaService.film.findFirst({
            where : {
                film_id: id
            },
        });
        if (!film){ 
            throw new NotFoundException('Film not found!');
        }
        return film;
    }

    // Create a film
    async createFilm(data: CreateFilmDto): Promise<film> {

        const {title, description, release_year, language_id, 
                rental_duration, rental_rate, length, 
                replacement_cost} = data;

        
        return this.prismaService.film.create({
            data: {
                title,
                description,
                release_year,
                language_id,
                rental_duration,
                rental_rate,
                length,
                replacement_cost,                
            }
        });
    }

    // Update a film detail
    async updateFilmDetail(id: number, data: UpdateFilmDto): Promise<film>{
        const film = await this.prismaService.film.findUnique({
            where: {film_id: id},
        });

        if (!film) {
            throw new NotFoundException('Fim not found!');
        }
        
        const {title, description, release_year, language_id,
                rental_duration, rental_rate, length, replacement_cost} = data;

        return this.prismaService.film.update({
            where:{film_id: id}, data: {
                title, description, release_year,
                language_id, rental_duration, rental_rate, length,
                replacement_cost
            }
        });                 
    }

    // Delete a film
    async deleteAFilm(id: number): Promise<film> {
        const film = await this.prismaService.film.findUnique({
            where: {film_id: id},
        });

        if (!film) {
            throw new NotFoundException('Fim not found!');
        }

        return this.prismaService.film.delete({where:{film_id: id}});
    }
}
