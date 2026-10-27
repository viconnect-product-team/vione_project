import { Module } from '@nestjs/common';
import { PlatformHubController } from './platform-hub.controller';
import { PlatformHubService } from './platform-hub.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PlatformHubController],
  providers: [PlatformHubService],
  exports: [PlatformHubService],
})
export class PlatformHubModule {}
