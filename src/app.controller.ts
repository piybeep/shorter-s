import { Controller, Get, Post, Query } from '@nestjs/common';
import { Body, Param } from '@nestjs/common/decorators';
import { AppService } from './app.service';
import { SaveUrlDto } from './save-url.dto';
import { Tokens } from './tokens.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get()
  getAllTokens(){
    return this.appService.getAllTokens();
  }
  @Get(':token')
  getToken(@Param('token') token: string): Promise<Tokens> {
    return this.appService.getToken(token);
  }

  @Post()
  async saveUrl(@Body() data: SaveUrlDto): Promise<{token: string}> {
    return await this.appService.saveUrl(data);
  }
}
