import { Module } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationEntity } from 'src/modules/integration/entities/integration.entity';
import { UserModule } from 'src/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      IntegrationEntity
    ]),
    UserModule,
    JwtModule.register({
      secret: process.env.SEGREDO_JWT_PORTABILIDADE,
      signOptions:{
        expiresIn: '1d'
      }
    }),
  ],
  controllers: [IntegrationController],
  providers: [IntegrationService],
})
export class IntegrationModule {}
