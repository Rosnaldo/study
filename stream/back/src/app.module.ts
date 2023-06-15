import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppController2 } from './app.controller2';
import { AppController3 } from './app.controller3';
import { AppController4 } from './app.controller4';

@Module({
  imports: [],
  controllers: [AppController, AppController2, AppController3, AppController4],
  providers: [],
})
export class AppModule {}
