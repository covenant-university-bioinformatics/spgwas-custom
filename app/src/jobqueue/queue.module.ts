import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { createWorkers } from '../workers/spgwas.main';
import { SpgwasJobQueue } from './queue/spgwas.queue';
import { NatsModule } from '../nats/nats.module';
import { JobCompletedPublisher } from '../nats/publishers/job-completed-publisher';

@Module({
  imports: [NatsModule],
  providers: [SpgwasJobQueue],
  exports: [SpgwasJobQueue],
})
export class QueueModule implements OnModuleInit {
  @Inject(JobCompletedPublisher) jobCompletedPublisher: JobCompletedPublisher;
  async onModuleInit() {
    await createWorkers(this.jobCompletedPublisher);
  }
}
