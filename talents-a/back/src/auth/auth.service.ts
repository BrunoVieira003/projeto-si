import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async signIn(email: string, password: string){
        const user = await this.userService.findByEmail(email)
        if(user?.password !== password){
            throw new UnauthorizedException('Email or password invalid')
        }

        const payload = {sub: user.id, email: user.email, cpf: user.cpf}
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
        
    }
}
