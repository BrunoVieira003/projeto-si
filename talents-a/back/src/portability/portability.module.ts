import { Module } from '@nestjs/common';
import { PortabilityService } from './portability.service';
import { PortabilityController } from './portability.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@Module({
  imports: [
      UserModule,
      JwtModule.register({
        global: true,
        secret: jwtConstants.secret,
        signOptions: {expiresIn: '1d'}
      })
  ],
  controllers: [PortabilityController],
  providers: [PortabilityService],
})
export class PortabilityModule {}
