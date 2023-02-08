import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { Tokens } from './entities/tokens.entity';
import { SaveUrlDto } from "./dto/save-url.dto";

@ApiTags('tokens')
@Controller()
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @ApiResponse({
    type: Array<Tokens>,
    description: 'Получение всех ссылок. (Временно)',
  })
  @Get()
  getAllTokens() {
    return this.tokensService.getAllTokens();
  }
  @ApiParam({ name: 'token', type: 'string' })
  @ApiResponse({
    type: Tokens,
    description: 'Получение ссылки по токену.',
  })
  @Get(':token')
  getToken(@Param('token') token: string): Promise<{ url: string }> {
    return this.tokensService.getToken(token);
  }

  @ApiBody({ type: SaveUrlDto })
  @ApiResponse({
    type: Tokens,
    description: 'Сохранение ссылки.',
  })
  @Post()
  async saveUrl(@Body() data: SaveUrlDto): Promise<{ token: string }> {
    return await this.tokensService.saveUrl(data);
  }
}
