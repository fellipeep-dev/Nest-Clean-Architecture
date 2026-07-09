import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SingInAuthDto } from '../dtos/sing-in.auth.dto';
import { SingInAuthCommand } from '../../use-cases/commands/singIn/sing-in.auth.command';
import { FindAuthByIdQuery } from '../../use-cases/queries/find-by-id/find-auth-by-id.query';
import { Public } from 'src/shared/decorators';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Public()
  @Post()
  singIn(@Body() singInAuthDto: SingInAuthDto) {
    return this.commandBus.execute(new SingInAuthCommand(singInAuthDto));
  }

  @Get('id/:id')
  findAuthById(@Param('id') id: string) {
    return this.queryBus.execute(new FindAuthByIdQuery(id));
  }
}
