import { Module } from '@nestjs/common';
import { AuthProxyService } from './auth-proxy.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';

/**
 * @description 登录鉴权模块
 * 实现单点登录（SSO）和其他身份验证相关的功能
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  providers: [AuthProxyService],
  controllers: [],
})
export class AuthProxyModule {}
