import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

class conditionsDto {
  [key: string]: any;
}

export class QueryParamsDto {
  @ApiProperty({ required: false, nullable: true, default: '1' })
  @IsOptional()
  @IsString()
  page?: string = '1';

  @ApiProperty({ required: false, nullable: true, default: 10 })
  @IsOptional()
  @IsString()
  limit?: string = '10';

  @ApiProperty({
    required: false,
    nullable: true,
    type: conditionsDto,
    description: 'Conditions for querying records',
  })
  @IsOptional()
  conditions?: conditionsDto;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiProperty({ required: false, nullable: true, enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
