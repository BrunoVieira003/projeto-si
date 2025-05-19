import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IntegrationEntity } from 'src/modules/integration/entities/integration.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class IntegrationService {

  constructor(
    @InjectRepository(IntegrationEntity)
    private readonly repo: Repository<IntegrationEntity>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ){}
  
  async create(userId: string, createIntegrationDto: CreateIntegrationDto) {
    const user = await this.userService.findById(userId)
    if(!user){
      throw new NotFoundException('User not found')
    }
    const token = await this.jwtService.signAsync({
        sub: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        phone: user.phoneNumber
    })

    const old = await this.repo.findOneBy({name: createIntegrationDto.name, user: {id: user.id}})
    if(old){
      return {
        id: old.id,
        name: old.name,
        token: old.token
      }
    }

    const result = await this.repo.save({
      name: createIntegrationDto.name,
      token,
      user
    })

    return {
      id: result.id,
      name: result.name,
      token: result.token
    }
  }

  async findAll(userId: string) {
    return await this.repo.find({})
  }

  async findOne(id: string) {
    const integration = await this.repo.findOneBy({id})
    if(!integration){
      throw new NotFoundException('Integration not found')
    }

    return integration
  }

  async getByToken(token: string){
    const result = this.jwtService.decode(token)
    const old = await this.repo.findOneBy({id: result.id})
    if(!old){
      throw new UnauthorizedException('Token inválido')
    }

    return result
  }

  async remove(id: string) {
    return await this.repo.delete({id})
  }
}
