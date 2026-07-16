import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  expiresAt!: Date;
}
