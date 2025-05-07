// portability.controller.ts
import { Controller, Post, Get, Req, UseGuards, Param } from '@nestjs/common';
import { PortabilityService } from './portability.service';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('portability')
export class PortabilityController {
  constructor(
    private portabilityService: PortabilityService,
    private userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('token')
  async generateToken(@Req() req: any) {
    const user = req.user;
    const token = await this.portabilityService.generatePortabilityToken(user);
    return { token };
  }

  @Get('request/:token')
  async requestPortability(@Param('token') token: string) {
    return await this.portabilityService.export(token)
  }
}
