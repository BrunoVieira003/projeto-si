import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IntegrationOrgService } from './integration-org.service';
import { CreateIntegrationOrgDto } from './dto/create-integration-org.dto';
import { UpdateIntegrationRequestDto } from './dto/update-integration-org.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('integration-org')
@Controller('integration-org')
export class IntegrationOrgController {
  constructor(private readonly integrationRequestService: IntegrationOrgService) {}

  @Post()
  async create(@Body() createIntegrationRequestDto: CreateIntegrationOrgDto) {
    return await this.integrationRequestService.create(createIntegrationRequestDto);
  }

  @Get()
  async findAll() {
    return await this.integrationRequestService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.integrationRequestService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateIntegrationRequestDto: UpdateIntegrationRequestDto) {
    return await this.integrationRequestService.update(id, updateIntegrationRequestDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.integrationRequestService.remove(id);
  }
}
