import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { CreateUserDTO } from "./dto/CreateUser.dto";
import { ListUsersDTO } from "./dto/ListUser.dto";
import { UpdateUserDTO } from "./dto/UpdateUser.dto";
import { HistoryAction } from "../history/enums/history-action.enum";
import { HistoryService } from "../history/history.service";
import { HistoryEntity } from "../history/enums/history-entity.enum";
import { UserTermAcceptanceEntity } from "../acceptance/entities/user-term-acceptance.entity";
import { TermEntity } from "../term/entities/term.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly historyService: HistoryService,

    @InjectRepository(UserTermAcceptanceEntity)
    private readonly userTermAcceptanceRepository: Repository<UserTermAcceptanceEntity>,

    @InjectRepository(TermEntity)
    private readonly termRepository: Repository<TermEntity>,
  ) { }

  async createUser(data: CreateUserDTO) {
    const userEntity = this.userRepository.create(data);
    const createdUser = await this.userRepository.save(userEntity);

    await this.historyService.log(
      HistoryAction.CREATE_USER,
      HistoryEntity.USER,
      createdUser.id,
      createdUser,
    );

    if (data.acceptedTermIds?.length > 0) {
      const termEntities = await this.termRepository.findByIds(data.acceptedTermIds);

      const acceptances = termEntities.map((term) => {
        const acceptance = new UserTermAcceptanceEntity();
        acceptance.userId = createdUser.id;
        acceptance.termId = term.id;
        acceptance.acceptedAt = new Date();
        return acceptance;
      });

      await this.userTermAcceptanceRepository.save(acceptances);
    }

    return createdUser;
  }

  async listUsers() {
    const usersSaved = await this.userRepository.find();
    const usersList = usersSaved.map(
      (user) => new ListUsersDTO(
        user.id,
        user.name,
        user.email,
        user.role,
        user.createdAt,
        user.updatedAt,
      ),
    );
    return usersList;
  }

  async findByEmail(email: string) {
    const checkEmail = await this.userRepository.findOne({
      where: { email },
    });

    if (checkEmail === null)
      throw new NotFoundException("O email não foi encontrado.");

    return checkEmail;
  }

  async updateUser(id: string, newData: UpdateUserDTO) {

    const user = await this.userRepository.findOneBy({ id });

    if (user === null)
      throw new NotFoundException("O usuário não foi encontrado.");

    Object.assign(user, newData as UserEntity);

    const updatedUser = await this.userRepository.save(user);

    await this.historyService.log(
      HistoryAction.UPDATE_USER,
      HistoryEntity.USER,
      id,
      updatedUser,
    );

    return updatedUser;
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException("O usuário não foi encontrado");
    }

    await this.userRepository.delete(user.id);

    return user;
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        relations: ['termAcceptances', 'termAcceptances.term'],
      });

      if (!user) {
        throw new NotFoundException(`Usuário com email ${email} não encontrado`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Erro ao buscar usuário por email:', error);
      throw new HttpException('Erro ao buscar usuário por email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
