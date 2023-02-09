import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import hashids from 'hashids/cjs/hashids';
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
      // Удалить если кончилось время жизни
      if (db_token.deathDate && db_token.deathDate < new Date(Date.now())) {
        await this.tokensRepository.remove(db_token);
        throw new HttpException('Not Found', 404);
      }

      if (db_token.connectQty != null) {
        // Уменьшить оставшееся кол-во переходов и удалить, если количество  равно 1 (или меньше)
        if (db_token.connectQty > 1) {
          await this.tokensRepository.update(db_token.id, {
            connectQty: --db_token.connectQty,
          });
        } else {
          await this.tokensRepository.delete(db_token.id);
        }
      }

      return { url: db_token.originalUrl };
    } else {
      throw new HttpException('Token not found', 404);
    }
  }

  async saveUrl(payload: SaveUrlDto): Promise<{ token: string }> {
    const count: number = await this.tokensRepository.countBy({
      originalUrl: payload.url,
    });

    let token: string;

    if (count > 0) {
      const find_equal_token = await this.tokensRepository.findOneBy({
        originalUrl: payload.url,
        connectQty: payload.connectQty,
        hashedPassword: payload.password,
        deathDate: payload.deathDate,
      });

      if (find_equal_token) {
        // Ссылка есть в базе с теми же параметрами
        token = find_equal_token.token;
      } else {
        // Ссылка есть в базе, но пришли другие параметры
        const new_token: Tokens = this.tokensRepository.create({
          token: this.getHash(payload.url, count),
          originalUrl: payload.url,
          connectQty: payload.connectQty,
          hashedPassword: payload.password,
          deathDate: payload.deathDate,
        });

        await this.tokensRepository.save(new_token);
        token = new_token.token;
      }
    } else {
      // Сохранение новой ссылки
      const new_token: Tokens = this.tokensRepository.create({
        token: this.getHash(payload.url, count),
        originalUrl: payload.url,
        connectQty: payload.connectQty,
        hashedPassword: payload.password,
        deathDate: payload.deathDate,
      });

      await this.tokensRepository.save(new_token);
      token = new_token.token;
    }

    return { token };
  }

  getHash(url: string, count = 0): string {
    const hasher = new hashids(url, 6);
    return hasher.encode(url.length + count);
  }

  async deleteExpiredTokens(): Promise<void> {
    const date = new Date();
    const expired_tokens: Tokens[] = await this.tokensRepository.find({
      where: { deathDate: LessThan(date) },
    });
    this.tokensRepository.remove(expired_tokens);
  }
}
