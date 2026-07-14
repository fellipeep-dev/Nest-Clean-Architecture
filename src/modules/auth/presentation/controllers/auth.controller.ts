import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SingInAuthDto } from '../dtos/sing-in.auth.dto';
import { SingInAuthCommand } from '../../use-cases/commands/singIn/sing-in.auth.command';
import { FindAllAuthsQuery } from '../../use-cases/queries/find-all/find-all-auths.query';
import { Public } from 'src/shared/decorators';
import { QueryConditionsPipe } from 'src/shared/pipes';
import { QueryParamsDto } from 'src/shared-presentation/dtos';
import { SingOutAuthCommand } from '../../use-cases/commands/singOut/sing-out.auth.command';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Public()
  @Post('singIn')
  singIn(@Body() singInAuthDto: SingInAuthDto) {
    return this.commandBus.execute(new SingInAuthCommand(singInAuthDto));
  }

  @Post('singOut')
  singOut(@Param('id') id: string) {
    return this.commandBus.execute(new SingOutAuthCommand(id));
  }

  @Get()
  findAllAuths(@Query(new QueryConditionsPipe()) query: QueryParamsDto) {
    return this.queryBus.execute(new FindAllAuthsQuery(query));
  }
}
