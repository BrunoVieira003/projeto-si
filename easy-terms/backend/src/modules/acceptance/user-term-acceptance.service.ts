import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTermAcceptanceEntity } from './entities/user-term-acceptance.entity';
import { UserAcceptedCustomFieldEntity } from './entities/user-accepted-custom-fields.entity';
import { ListAcceptancesDTO } from './dto/list-acceptance.dto';

@Injectable()
export class UserTermAcceptanceService {
  constructor(
    @InjectRepository(UserTermAcceptanceEntity)
    private readonly userTermAcceptanceRepository: Repository<UserTermAcceptanceEntity>,

    @InjectRepository(UserAcceptedCustomFieldEntity)
    private readonly userAcceptedCustomFieldRepository: Repository<UserAcceptedCustomFieldEntity>,
  ) { }

  async findAll(filter?: { userId?: string }): Promise<ListAcceptancesDTO[]> {
    const acceptances = await this.userTermAcceptanceRepository.find({
      where: filter?.userId ? { userId: filter.userId } : {},
      relations: [
        'term',
        'term.customFields',
        'user',
        'acceptedCustomFields',
        'acceptedCustomFields.customField',
      ],
      order: { acceptedAt: 'DESC' },
    });

    return acceptances.map(
      (item) =>
        new ListAcceptancesDTO(
          item.id,
          item.acceptedAt,
          item.revokedAt,
          item.user,
          item.term,
          item.acceptedCustomFields,
        ),
    );
  }

  async updateAcceptedFields(acceptanceId: string, acceptedFieldIds: string[]) {
    const acceptance = await this.userTermAcceptanceRepository.findOne({
      where: { id: acceptanceId },
      relations: ['term', 'term.customFields', 'acceptedCustomFields', 'acceptedCustomFields.customField'],
    });

    if (!acceptance) throw new NotFoundException('Aceite não encontrado');

    const existing = acceptance.acceptedCustomFields || [];
    const allFields = acceptance.term.customFields;

    const updatedEntities: UserAcceptedCustomFieldEntity[] = [];

    for (const field of allFields) {
      const existingRecord = existing.find((e) => e.customField.id === field.id);
      const isNowAccepted = acceptedFieldIds.includes(field.id);

      if (existingRecord) {
        if (isNowAccepted && !existingRecord.accepted) {
          // Reaceitou o campo
          existingRecord.accepted = true;
          existingRecord.acceptedAt = new Date();
          existingRecord.revokedAt = null;
          updatedEntities.push(existingRecord);
        } else if (!isNowAccepted && existingRecord.accepted) {
          // Revogou o campo
          existingRecord.accepted = false;
          existingRecord.revokedAt = new Date();
          updatedEntities.push(existingRecord);
        }
        // se nada mudou, não precisa atualizar
      } else if (isNowAccepted) {
        // Aceitou um campo que ainda não existia
        const newField = this.userAcceptedCustomFieldRepository.create({
          userTermAcceptance: acceptance,
          customField: field,
          accepted: true,
          acceptedAt: new Date(),
          revokedAt: null,
        });
        updatedEntities.push(newField);
      }
    }

    await this.userAcceptedCustomFieldRepository.save(updatedEntities);

    return { message: 'Campos opcionais atualizados com sucesso' };
  }

  async revokeConsent(id: string): Promise<UserTermAcceptanceEntity | null> {
    const record = await this.userTermAcceptanceRepository.findOne({
      where: { id },
      relations: ['user', 'term'],
    });

    if (!record) return null;

    record.revokedAt = new Date();
    return this.userTermAcceptanceRepository.save(record);
  }

  async revokeCustomFieldConsent(acceptanceId: string, fieldId: string) {
    const acceptedField = await this.userAcceptedCustomFieldRepository.findOne({
      where: {
        userTermAcceptance: { id: acceptanceId },
        customField: { id: fieldId },
      },
      relations: ['userTermAcceptance', 'customField'],
    });

    if (!acceptedField) {
      throw new NotFoundException('Campo aceito não encontrado ou já revogado.');
    }

    acceptedField.accepted = false;
    acceptedField.revokedAt = new Date();

    await this.userAcceptedCustomFieldRepository.save(acceptedField);

    return {
      message: 'Campo opcional revogado com sucesso',
      fieldId,
      acceptanceId,
    };
  }
}
