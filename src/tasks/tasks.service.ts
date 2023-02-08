import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TokensService } from './../tokens/tokens.service';

@Injectable()
export class TasksService {
  constructor(private readonly tokensService: TokensService) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_5_MINUTES)
  deleteExpiredTokens() {
    this.tokensService.deleteExpiredTokens();
    this.logger.debug('deleted');
  }
}
