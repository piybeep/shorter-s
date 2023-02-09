import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TokensModule } from './../tokens/tokens.module';

@Module({
  imports: [TokensModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
