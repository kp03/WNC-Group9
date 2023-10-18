import { ApiProperty } from "@nestjs/swagger"
import { film_rating } from "@prisma/client"
import { IsEnum, IsIn, IsInt, IsNotEmpty, IsNumber, IsString, Length, Max, Min } from "class-validator"

export class UpdateFilmDto {

    @ApiProperty({example: 'FINDING NEMO'})    
    @IsNotEmpty()
    @IsString()
    title: string

    @ApiProperty({example: 'A story of an overprotective clownfish named Marlin who, along with a forgetful regal blue tang named Dory, searches for his missing son Nemo.'})    
    @IsString()
    description:  string
    
    @ApiProperty({example: '2003'})
    @IsInt()
    @Min(1000)
    @Max(9999) 
    release_year: number

    @ApiProperty({example: '1'})
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(50)
    language_id: number

    @ApiProperty({example: '7'})
    @IsNotEmpty()
    @IsNumber()
    @IsInt()
    @Min(1)
    @Max(10)
    rental_duration: number

    @ApiProperty({example: '3.34'})
    @IsNotEmpty()
    @IsNumber()
    @Min(0.00)
    @Max(5.00) 
    rental_rate: number

    @ApiProperty({example: '122'})
    @IsInt()
    @Min(1)
    @Max(1000)
    length: number

    @ApiProperty({example: '12.99'})
    @IsNumber()
    @IsNotEmpty()
    replacement_cost: number

    // @ApiProperty({example: 'NC-17'})
    // @IsEnum(film_rating, {message: `Invalid value for 'film_rating'.` +
    //             `Acceptable values are: ${Object.values(film_rating)}`})
    // rating: film_rating

    // @ApiProperty({example: 'Deleted Scences, Behind the Scenes'})
    // @IsString()
    // special_features: string

}

