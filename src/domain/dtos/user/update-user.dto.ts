import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false, nullable: true, default: 'string' })
  @IsOptional()
  @IsString()
  name: string | null;

  @ApiProperty({ required: false, nullable: true, default: 'string' })
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string | null;

  @ApiProperty({ required: false, nullable: true, default: null })
  @IsString()
  @IsOptional()
  profilePictureUrl: string | null;
}
