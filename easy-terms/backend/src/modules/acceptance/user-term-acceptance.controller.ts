import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  UseGuards,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import { UserTermAcceptanceService } from './user-term-acceptance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../user/enums/role.enum';
import { UpdateAcceptedFieldsDTO } from './dto/update-accepted-fields.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.EMPLOYEE)
@Controller('/user-term-acceptance')
@ApiTags('user-term-acceptance')
@ApiBearerAuth()
export class UserTermAcceptanceController {
  constructor(private readonly userTermAcceptanceService: UserTermAcceptanceService) { }

  @Get()
  @ApiOperation({ summary: 'Busca os termos aceitos e reprovados por um usuário' })
  async findAll(@Query('userId') userId: string) {
    return this.userTermAcceptanceService.findAll({ userId });
  }

  @Patch(':id/revoke')
  @ApiOperation({ summary: 'Revoga o consentimento de um termo completo' })
  async revokeConsent(@Param('id') id: string) {
    const result = await this.userTermAcceptanceService.revokeConsent(id);
    if (!result) throw new NotFoundException('Consentimento não encontrado');
    return { message: 'Consentimento revogado com sucesso' };
  }

  @Patch(':id/update-fields')
  @ApiOperation({ summary: 'Atualiza os campos opcionais aceitos de um termo' })
  @ApiBody({ type: UpdateAcceptedFieldsDTO })
  async updateAcceptedFields(
    @Param('id') id: string,
    @Body() body: UpdateAcceptedFieldsDTO,
  ) {
    return this.userTermAcceptanceService.updateAcceptedFields(id, body.acceptedFieldIds);
  }

  @Patch(':acceptanceId/revoke-field/:fieldId')
  async revokeField(
    @Param('acceptanceId') acceptanceId: string,
    @Param('fieldId') fieldId: string,
  ) {
    return this.userTermAcceptanceService.revokeCustomFieldConsent(acceptanceId, fieldId);
  }

}
