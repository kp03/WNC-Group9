import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ActorModule } from './actor/actor.module';
import { FilmModule } from './film/film.module';

@Module({
  imports: [PrismaModule, ActorModule, FilmModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
