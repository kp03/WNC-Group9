import { Injectable, NotFoundException } from '@nestjs/common';
import { actor } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActorDto } from './dtos/create.actor.dto';
import { UpdateActorDto } from './dtos/update.actor.dto';

@Injectable()
export class ActorService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    // Get the list of all actor
    async getAllActor(): Promise<actor[] | []> {
        return this.prismaService.actor.findMany();
    }

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

    // Delete an actor
    async deleteAnActor(id: number): Promise<actor>{

        const actor = await this.prismaService.actor.findUnique({
            where: {actor_id: id},
        });

        if (!actor) {
            throw new NotFoundException('Actor not found!');
        }

        return this.prismaService.actor.delete({where:{actor_id:id}});
    }

    // Update an actor
    async updateAnActor(id: number, data: UpdateActorDto ): Promise<actor> {

        const actor = await this.prismaService.actor.findUnique({
            where: {actor_id: id},
        });

        if (!actor) {
            throw new NotFoundException('Actor not found!');
        }

        const {first_name, last_name, last_update} = data;
        
        return this.prismaService.actor.update({
            where:{actor_id: id}, data: {
                first_name,
                last_name,
                last_update
            }
        });
    }
}
