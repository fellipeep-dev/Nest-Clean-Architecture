import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './presentation/controllers/auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { SingInAuthHandler } from './use-cases/commands/singIn/sing-in.auth.handler';
import { FindAllAuthsHandler } from './use-cases/queries/find-all/find-all-auths.handler';
import { AuthRepository } from './infrastructure/auth.repository';
import { IAuthRepository } from './domain/repositories/iauth.repository';
import { SingOutAuthHandler } from './use-cases/commands/singOut/sing-out.auth.handler';
import { expiresAt } from './domain/consts/expires-at';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: `${expiresAt}d`,
        },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    SingInAuthHandler,
    SingOutAuthHandler,
    FindAllAuthsHandler,
    { provide: IAuthRepository, useClass: AuthRepository },
  ],
  exports: [
    SingInAuthHandler,
    SingOutAuthHandler,
    FindAllAuthsHandler,
    JwtModule,
  ],
})
export class AuthModule {}
