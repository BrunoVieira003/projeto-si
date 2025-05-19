import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@Controller('integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createIntegrationDto: CreateIntegrationDto, @Req() req: any) {
    return await this.integrationService.create(req.user.sub, createIntegrationDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: any) {
    return await this.integrationService.findAll(req.user.sub);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.integrationService.findOne(id);
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.integrationService.remove(id);
  }

  @Get('info/:token')
  async getPortInfo(@Param('token') token: string){
    return this.integrationService.getByToken(token)
  }
}
