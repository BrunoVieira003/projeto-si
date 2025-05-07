import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '../email/email.module';
import { UserEntity } from '../user/entities/user.entity';
import { BreachController } from './breach.controller';
import { BreachIncident } from './entities/breach.entity';
import { BreachService } from './breach.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BreachIncident, UserEntity]),
    EmailModule
  ],
  controllers: [BreachController],
  providers: [BreachService],
})
export class BreachModule {}
