import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateIntegrationOrgDto } from './dto/create-integration-org.dto';
import { UpdateIntegrationRequestDto } from './dto/update-integration-org.dto';
import { IntegrationOrg } from './entities/integration-org.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class IntegrationOrgService {
  constructor(
      @InjectRepository(IntegrationOrg)
      private readonly repo: Repository<IntegrationOrg>,
    ) {}

  async create(createIntegrationOrgDto: CreateIntegrationOrgDto) {
    const old = await this.repo.findOneBy([
      { email: createIntegrationOrgDto.email },
      { website: createIntegrationOrgDto.website },
    ])
    console.log(old)

    if(old){
      throw new BadRequestException('Email ou website já utilizado')
    }

    return await this.repo.save(createIntegrationOrgDto)
  }

  async findAll() {
    return await this.repo.find()
  }

  async findOne(id: string) {
    const result = await this.repo.findOneBy({id})
    if(!result) throw new NotFoundException('Integration request not found');

    return result
  }

  async update(id: string, updateIntegrationRequestDto: UpdateIntegrationRequestDto) {
    const old = await this.repo.findOneBy({id})
    if(!old) throw new NotFoundException('Integration request not found');

    return await this.repo.update({id}, updateIntegrationRequestDto)
  }

  async remove(id: string) {
    const old = await this.repo.findOneBy({id})
    if(!old) throw new NotFoundException('Integration request not found');

    return await this.repo.remove(old)
  }
}
