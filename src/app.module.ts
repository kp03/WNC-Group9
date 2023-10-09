import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ActorModule } from './actor/actor.module';

@Module({
  imports: [PrismaModule, ActorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
