import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { CreateUserDTO } from "./dto/CreateUser.dto";
import { ListUsersDTO } from "./dto/ListUser.dto";
import { UpdateUserDTO } from "./dto/UpdateUser.dto";
import { HistoryAction } from "../history/enums/history-action.enum";
import { HistoryService } from "../history/history.service";
import { HistoryEntity } from "../history/enums/history-entity.enum";
import { UserTermAcceptanceEntity } from "../acceptance/entities/user-term-acceptance.entity";
import { TermEntity } from "../term/entities/term.entity";
import { TermCustomFieldEntity } from "../term/entities/term-custom-field.entity";
import { UserAcceptedCustomFieldEntity } from "../acceptance/entities/user-accepted-custom-fields.entity";

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

    @InjectRepository(TermCustomFieldEntity)
    private readonly termCustomFieldRepository: Repository<TermCustomFieldEntity>,

    @InjectRepository(UserAcceptedCustomFieldEntity)
    private readonly userAcceptedCustomFieldRepository: Repository<UserAcceptedCustomFieldEntity>
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

    let savedAcceptances: UserTermAcceptanceEntity[] = [];

    // 1. Criação dos aceites de termos
    if (Array.isArray(data.acceptedTermIds) && data.acceptedTermIds.length > 0) {
      const termEntities = await this.termRepository.findByIds(data.acceptedTermIds);

      const acceptancesToSave = termEntities.map((term) =>
        this.userTermAcceptanceRepository.create({
          userId: createdUser.id,
          termId: term.id,
          acceptedAt: new Date(),
        })
      );

      savedAcceptances = await this.userTermAcceptanceRepository.save(acceptancesToSave);
    }

    // 2. Criação de aceites e revogações de campos opcionais
    const acceptedFieldIds = new Set(data.acceptedFieldIds || []);
    const allCustomFields = await this.termCustomFieldRepository.find({
      where: savedAcceptances.length > 0
        ? { term: In(savedAcceptances.map(a => a.termId)) }
        : {},
      relations: ['term'],
    });

    const userAcceptedFieldsToSave: UserAcceptedCustomFieldEntity[] = [];

    for (const field of allCustomFields) {
      const acceptance = savedAcceptances.find(acc => acc.termId === field.term.id);
      if (!acceptance) continue;

      const isAccepted = acceptedFieldIds.has(field.id);

      const newFieldEntity = this.userAcceptedCustomFieldRepository.create({
        userTermAcceptance: acceptance,
        customField: field,
        accepted: isAccepted,
        acceptedAt: isAccepted ? new Date() : null,
        revokedAt: isAccepted ? null : new Date(),
      });

      userAcceptedFieldsToSave.push(newFieldEntity);
    }

    const savedFieldEntities = await this.userAcceptedCustomFieldRepository.save(userAcceptedFieldsToSave);

    // 3. Log de histórico para todos os campos opcionais (aceitos e revogados)
    for (const fieldEntity of savedFieldEntities) {
      const fullEntity = await this.userAcceptedCustomFieldRepository.findOne({
        where: { id: fieldEntity.id },
        relations: [
          'userTermAcceptance',
          'userTermAcceptance.user',
          'userTermAcceptance.term',
          'customField',
        ],
      });

      if (fullEntity) {
        await this.historyService.log(
          fullEntity.accepted ? HistoryAction.ACCEPT_TERM_FIELD : HistoryAction.REVOKE_TERM_FIELD,
          HistoryEntity.ACCEPTANCE,
          fullEntity.id.toString(),
          fullEntity,
        );
      }
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
        user.phoneNumber,
        user.birthDate,
        user.city,
        user.cpf,
        user.state,
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

  async findById(id: string) {
    const checkId = await this.userRepository.findOne({
      where: { id },
    });

    if (checkId === null)
      throw new NotFoundException("O usuário com esse id não foi encontrado.");

    return checkId;
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
