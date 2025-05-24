import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTermAcceptanceEntity } from './entities/user-term-acceptance.entity';
import { UserAcceptedCustomFieldEntity } from './entities/user-accepted-custom-fields.entity';
import { ListAcceptancesDTO } from './dto/list-acceptance.dto';
import { HistoryService } from '../history/history.service';
import { HistoryAction } from '../history/enums/history-action.enum';
import { HistoryEntity } from '../history/enums/history-entity.enum';

@Injectable()
export class UserTermAcceptanceService {
  constructor(
    @InjectRepository(UserTermAcceptanceEntity)
    private readonly userTermAcceptanceRepository: Repository<UserTermAcceptanceEntity>,

    @InjectRepository(UserAcceptedCustomFieldEntity)
    private readonly userAcceptedCustomFieldRepository: Repository<UserAcceptedCustomFieldEntity>,

    private readonly historyService: HistoryService,
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
      relations: [
        'term',
        'term.customFields',
        'acceptedCustomFields',
        'acceptedCustomFields.customField',
      ],
    });

    if (!acceptance) {
      throw new NotFoundException('Aceite não encontrado');
    }

    const existing = acceptance.acceptedCustomFields || [];
    const allFields = acceptance.term.customFields;
    const entitiesToUpdate: UserAcceptedCustomFieldEntity[] = [];

    const entitiesToLog: { id: string; action: HistoryAction }[] = [];

    for (const field of allFields) {
      const existingRecord = existing.find((e) => e.customField.id === field.id);
      const isNowAccepted = acceptedFieldIds.includes(field.id);

      if (existingRecord) {
        if (isNowAccepted && !existingRecord.accepted) {
          existingRecord.accepted = true;
          existingRecord.acceptedAt = new Date();
          existingRecord.revokedAt = null;
          entitiesToUpdate.push(existingRecord);
          entitiesToLog.push({ id: existingRecord.id, action: HistoryAction.ACCEPT_TERM_FIELD });

        } else if (!isNowAccepted && existingRecord.accepted) {
          existingRecord.accepted = false;
          existingRecord.revokedAt = new Date();
          entitiesToUpdate.push(existingRecord);
          entitiesToLog.push({ id: existingRecord.id, action: HistoryAction.REVOKE_TERM_FIELD });
        }
      } else if (isNowAccepted) {
        const newField = this.userAcceptedCustomFieldRepository.create({
          userTermAcceptance: acceptance,
          customField: field,
          accepted: true,
          acceptedAt: new Date(),
          revokedAt: null,
        });

        entitiesToUpdate.push(newField);
        // ID será obtido após save
      }
    }

    const savedEntities = await this.userAcceptedCustomFieldRepository.save(entitiesToUpdate);

    // Após salvar, combine com logs para novos campos
    for (const entity of savedEntities) {
      const action = entity.accepted
        ? HistoryAction.ACCEPT_TERM_FIELD
        : HistoryAction.REVOKE_TERM_FIELD;

      const fullEntity = await this.userAcceptedCustomFieldRepository.findOne({
        where: { id: entity.id },
        relations: [
          'userTermAcceptance',
          'userTermAcceptance.user',
          'userTermAcceptance.term',
          'customField',
        ],
      });

      if (fullEntity) {
        await this.historyService.log(
          action,
          HistoryEntity.ACCEPTANCE,
          fullEntity.id.toString(),
          fullEntity,
        );
      }
    }

    return { message: 'Campos opcionais atualizados com sucesso' };
  }


  async revokeConsent(id: string): Promise<UserTermAcceptanceEntity | null> {
    const record = await this.userTermAcceptanceRepository.findOne({
      where: { id },
      relations: [
        'user',
        'term',
        'acceptedCustomFields',
        'acceptedCustomFields.customField',
      ],
    });

    if (!record) return null;

    record.revokedAt = new Date();

    const revokeConsent = await this.userTermAcceptanceRepository.save(record);

    await this.historyService.log(
      HistoryAction.REVOKE_TERM,
      HistoryEntity.ACCEPTANCE,
      revokeConsent.id.toString(),
      revokeConsent, // Agora completo para audit trail
    );

    return revokeConsent;
  }

  async revokeCustomFieldConsent(acceptanceId: string, fieldId: string) {
    const acceptedField = await this.userAcceptedCustomFieldRepository.findOne({
      where: {
        userTermAcceptance: { id: acceptanceId },
        customField: { id: fieldId },
      },
      relations: [
        'userTermAcceptance',
        'userTermAcceptance.user',
        'userTermAcceptance.term',
        'customField'],
    });

    if (!acceptedField) {
      throw new NotFoundException('Campo aceito não encontrado ou já revogado.');
    }

    acceptedField.accepted = false;
    acceptedField.revokedAt = new Date();

    const revokeConsent = await this.userAcceptedCustomFieldRepository.save(acceptedField);

    await this.historyService.log(
      HistoryAction.REVOKE_TERM_FIELD,
      HistoryEntity.ACCEPTANCE,
      revokeConsent.id.toString(),
      revokeConsent,
    );

    return {
      message: 'Campo opcional revogado com sucesso',
      fieldId,
      acceptanceId,
    };
  }
}
