import { Controller, Get, NotFoundException, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { UserTermAcceptanceService } from './user-term-acceptance.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../user/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.EMPLOYEE)
@Controller('/user-term-acceptance')
@ApiTags("user-term-acceptance")
@ApiBearerAuth()
export class UserTermAcceptanceController {
  constructor(private readonly userTermAcceptanceService: UserTermAcceptanceService) { }

  @Get()
  @ApiOperation({ summary: "Busca os termos aceitos e reprovados por um usuário" })
  async findAll(@Query('userId') userId: string) {
    return this.userTermAcceptanceService.findAll({ userId });
  }

  @Patch(':id/revoke')
  @ApiOperation({ summary: "Rota para revogar o consentimento a um termo específico" })
  async revokeConsent(@Param('id') id: string) {
    const result = await this.userTermAcceptanceService.revokeConsent(id);
    if (!result) throw new NotFoundException('Consentimento não encontrado');
    return { message: 'Consentimento revogado com sucesso' };
  }
}