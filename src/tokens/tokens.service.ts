import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { SaveUrlDto } from './dto/save-url.dto';
import { Tokens } from './entities/tokens.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Tokens)
    private readonly tokensRepository: Repository<Tokens>,
  ) {}

  async getAllTokens(): Promise<Tokens[]> {
    return await this.tokensRepository.find();
  }

  async getUrl(token: string): Promise<{ url: string }> {
    const db_token: Tokens = await this.tokensRepository.findOneBy({ token });

    if (db_token) {
      if (db_token.deathDate < new Date(Date.now())) {
        await this.tokensRepository.remove(db_token);
        throw new HttpException('Not Found', 404);
      } else if (db_token.connectQty && db_token.connectQty > 1) {
        await this.tokensRepository.update(db_token.id, {
          connectQty: db_token.connectQty - 1,
        });
      } else if (db_token.connectQty && db_token.connectQty === 1) {
        await this.tokensRepository.delete(db_token.id);
      }
      return { url: db_token.originalUrl };
    } else {
      throw new HttpException('Token not found', 404);
    }
  }

  async saveUrl(payload: SaveUrlDto): Promise<{ token: string }> {
    const saved_url: Tokens = await this.tokensRepository.findOneBy({
      originalUrl: payload.url,
    });

    if (!saved_url) {
      const token: Tokens = this.tokensRepository.create({
        originalUrl: payload.url,
        connectQty: payload.connectQty,
        hashedPassword: payload.password,
        deathDate: payload.deathDate,
      });
      const saved_token: Tokens = await this.tokensRepository.save(token);
      return { token: saved_token.token };
    }
    return { token: saved_url.token };
  }

  async deleteExpiredTokens(): Promise<void> {
    const date = new Date();
    const expired_tokens: Tokens[] = await this.tokensRepository.find({
      where: { deathDate: LessThan(date) },
    });
    this.tokensRepository.remove(expired_tokens);
  }

  private toZeroTimeZone(date: any): Date {
    date.setHours(date.getHours() - 3);
    return date;
  }
}
