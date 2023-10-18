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