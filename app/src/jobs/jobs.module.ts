import { Global, Module } from '@nestjs/common';
import { JobsSpgwasService } from './services/jobs.spgwas.service';
import { JobsSpgwasController } from './controllers/jobs.spgwas.controller';
import { QueueModule } from '../jobqueue/queue.module';
import { JobsSpgwasNoauthController } from './controllers/jobs.spgwas.noauth.controller';

@Global()
@Module({
  imports: [QueueModule],
  controllers: [JobsSpgwasController, JobsSpgwasNoauthController],
  providers: [JobsSpgwasService],
  exports: [],
})
export class JobsModule {}
