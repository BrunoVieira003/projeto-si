import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
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

        const payload = {sub: user.id}

        const access_token = await this.jwtService.signAsync(payload, {
            secret: jwtConstants.secret,
            expiresIn: '1d',
        })

        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: jwtConstants.secret,
            expiresIn: '7d',
        })

        return { access_token, refresh_token }
    }

    async refreshToken(token: string){
        try {
            const payload = this.jwtService.verify(token, {
                secret: jwtConstants.secret,
            });

            const access_token = await this.jwtService.signAsync({sub: payload.sub}, {
                secret: jwtConstants.secret,
            })
        
            return { access_token };
        } catch (err) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}
