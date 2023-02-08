import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { TokensService } from './../tokens/tokens.service';

@Injectable()
export class TasksService {
  constructor(private readonly tokensService: TokensService) {}
  private readonly logger = new Logger(TasksService.name);

  @Interval(10000)
  deleteExpiredTokens() {
    this.tokensService.deleteExpiredTokens();
    console.log('deleted');
    console.log(Date.now());
    this.logger.debug('deleted');
  }
}
