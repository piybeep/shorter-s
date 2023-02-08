import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tokens } from './tokens.entity';
import { SaveUrlDto } from './save-url.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NOTFOUND } from 'dns';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Tokens)
    private readonly Repository: Repository<Tokens>,
  ) {}

  async getAllTokens(): Promise<Tokens[]> {
    return await this.Repository.find();
  }

  async getToken(token: string): Promise<{ url: string }> {
    const _token: Tokens = await this.Repository.findOneBy({ token });
    if (_token) {
      if (_token.connectQty && _token.connectQty > 1) {
        await this.Repository.update(_token.id, {
          connectQty: _token.connectQty - 1,
        });
      } else {
        await this.Repository.delete(_token.id);
      }
      return { url: _token.originalUrl };
    } else {
      throw new HttpException('Token not found', 404);
    }
  }

  async saveUrl(payload: SaveUrlDto): Promise<{ token: string }> {
    const saved_url: Tokens = await this.Repository.findOneBy({
      originalUrl: payload.url,
    });
    if (!saved_url) {
      const token: Tokens = this.Repository.create({
        originalUrl: payload.url,
        connectQty: payload.connectQty,
        hashedPassword: payload.password,
        deathDate: payload.deathDate,
      });
      const saved_token: Tokens = await this.Repository.save(token);
      return { token: saved_token.token };
    }
    return { token: saved_url.token };
  }
}
