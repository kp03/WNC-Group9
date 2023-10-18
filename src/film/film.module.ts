import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { FilmController } from './film.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [FilmService, PrismaService],
  controllers: [FilmController]
})
export class FilmModule {}
