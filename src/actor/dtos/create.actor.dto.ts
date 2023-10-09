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