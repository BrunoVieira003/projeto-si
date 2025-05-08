import { Controller, Post, Body } from '@nestjs/common';
import { BreachService } from './breach.service';
import { CreateBreachDto } from './dto/create-breach.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('breaches')
@Controller('breaches')
export class BreachController {
  constructor(private readonly breachService: BreachService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar incidente de vazamento de dados' })
  @ApiResponse({
    status: 201,
    description: 'Incidente registrado e e-mails de notificação enviados.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou erro ao registrar o incidente.',
  })
  async create(@Body() dto: CreateBreachDto) {
    return this.breachService.reportIncident(dto);
  }
}
