import { Module } from '@nestjs/common';
import { UserTermAcceptanceService } from './user-term-acceptance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTermAcceptanceEntity } from './entities/user-term-acceptance.entity';
import { UserTermAcceptanceController } from './user-term-acceptance.controller';
import { UserAcceptedCustomFieldEntity } from './entities/user-accepted-custom-fields.entity';
import { HistoryModule } from '../history/history.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserTermAcceptanceEntity, UserAcceptedCustomFieldEntity]),
        HistoryModule,
    ],
    controllers: [UserTermAcceptanceController],
    exports: [UserTermAcceptanceService],
    providers: [UserTermAcceptanceService],
})

export class UserTermAcceptanceModule { }