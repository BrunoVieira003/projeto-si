// portability.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PortabilityService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async generatePortabilityToken(user: any){
    return await this.jwtService.signAsync({sub: user.sub}, {
      secret: jwtConstants.portabilitySecret,
      expiresIn: '15m',
    });
  }

  async export(token: string){
    try{
        const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.portabilitySecret,
        });

        const user = await this.userService.findById(payload.sub)
        
        if (!user) throw new UnauthorizedException('Invalid or expired token')

        return {
            id: user.id,
            cpf: user.cpf,
            email: user.email,
        };
    }catch(err){
        throw new UnauthorizedException('Invalid or expired token')
    }

    }
}
