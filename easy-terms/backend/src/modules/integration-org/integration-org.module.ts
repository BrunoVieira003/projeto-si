import { Module } from '@nestjs/common';
import { IntegrationOrgService } from './integration-org.service';
import { IntegrationOrgController } from './integration-org.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationOrg } from './entities/integration-org.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IntegrationOrg
    ])
  ],
  controllers: [IntegrationOrgController],
  providers: [IntegrationOrgService],
})
export class IntegrationOrgModule {}
