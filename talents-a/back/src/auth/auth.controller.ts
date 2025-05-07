import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async signIn(@Body() signInDto: SignInDto){
        return await this.authService.signIn(signInDto.email, signInDto.password)
    }

    @Post('refresh')
    async refresh(@Body('refresh_token') token: string){
        return await this.authService.refreshToken(token)
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req){
        return req.user
    }
}
