import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './presentation/controllers/auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { SingInAuthHandler } from './use-cases/commands/singIn/sing-in.auth.handler';
import { FindAuthByIdHandler } from './use-cases/queries/find-by-id/find-auth-by-id.handler';
import { AuthRepository } from './infrastructure/auth.repository';
import { IAuthRepository } from './domain/repositories/iauth.repository';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: '1d',
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
    FindAuthByIdHandler,
    { provide: IAuthRepository, useClass: AuthRepository },
  ],
  exports: [SingInAuthHandler, FindAuthByIdHandler, JwtModule],
})
export class AuthModule {}
