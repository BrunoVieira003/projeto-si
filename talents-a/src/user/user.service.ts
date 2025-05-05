import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create({
      email: createUserDto.email,
      cpf: createUserDto.cpf
    })

    return await this.usersRepository.save(newUser)
  }

  async findAll() {
    return await this.usersRepository.find()
  }

  async findOne(id: string) {
    return await this.usersRepository.findOneBy({id})
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const oldUser =  await this.usersRepository.findOneBy({id})
    if(!oldUser){
      throw new NotFoundException(`User with id ${id} not found`)
    }

    if(updateUserDto.email){
      oldUser.email = updateUserDto.email
    }

    if(updateUserDto.cpf){
      oldUser.cpf = updateUserDto.cpf
    }

    return await this.usersRepository.save(oldUser)
  }

  async remove(id: string) {
    const oldUser =  await this.usersRepository.findOneBy({id})
    if(!oldUser){
      throw new NotFoundException(`User with id ${id} not found`)
    }

    return await this.usersRepository.remove(oldUser)
  }
}
