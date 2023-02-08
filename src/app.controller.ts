import { Controller, Get, Post, Query } from '@nestjs/common';
import { Body, Param } from '@nestjs/common/decorators';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger/dist';
import { AppService } from './app.service';
import { SaveUrlDto } from './save-url.dto';
import { Tokens } from './tokens.entity';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({
    type: Array<Tokens>,
    description: 'Получение всех ссылок. (Временно)',
  })
  @Get()
  getAllTokens() {
    return this.appService.getAllTokens();
  }
  @ApiParam({ name: 'token', type: 'string' })
  @ApiResponse({
    type: Tokens,
    description: 'Получение ссылки по токену.',
  })
  @Get(':token')
  getToken(@Param('token') token: string): Promise<{ url: string }> {
    return this.appService.getToken(token);
  }

  @ApiBody({ type: SaveUrlDto })
  @ApiResponse({
    type: Tokens,
    description: 'Сохранение ссылки.',
  })
  @Post()
  async saveUrl(@Body() data: SaveUrlDto): Promise<{ token: string }> {
    return await this.appService.saveUrl(data);
  }
}
