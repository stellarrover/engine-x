import { Logger, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { GlobalExtension } from '@global';
import 'dotenv/config';
import { BootStrap } from './common/cluster';
import { ConfigService } from '@nestjs/config';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: true,
    //   playground: false,
    //   plugins: [ApolloServerPluginLandingPageLocalDefault()],
    // }),
    // WorkflowModule,
  ],
  providers: [],
})
export class AppModule {}

export class AppBootstrap {
  static logger: Logger = new Logger(AppBootstrap.name);
  static async start() {
    GlobalExtension.init();

    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);

    const port = configService.get('PORT');

    await app.listen(port);
  }
}

BootStrap(AppBootstrap);
