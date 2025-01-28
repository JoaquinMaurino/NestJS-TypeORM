import {
    IsString,
    IsNumber,
    IsUrl,
    IsNotEmpty,
    IsPositive
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ description: 'The name of the product', example: 'Laptop' })
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ description: 'A brief description of the product', example: 'A high-performance laptop for gaming' })
    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @ApiProperty({ description: 'The price of the product', example: 1200 })
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    readonly price: number;

    @ApiProperty({ description: 'The stock available for the product', example: 50 })
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    readonly stock: number;

    @ApiProperty({ description: 'URL of the product image', example: 'https://example.com/laptop.jpg' })
    @IsUrl()
    @IsNotEmpty()
    readonly image: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) { }
