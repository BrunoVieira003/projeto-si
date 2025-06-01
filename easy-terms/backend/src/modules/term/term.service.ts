import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TermEntity } from "./entities/term.entity";
import { CreateTermDTO } from "./dto/create-term.dto";
import { ListTermsDTO } from "./dto/list-term.dto";
import { HistoryAction } from "../history/enums/history-action.enum";
import { HistoryService } from "../history/history.service";
import { HistoryEntity } from "../history/enums/history-entity.enum";

@Injectable()
export class TermService {
  constructor(
    @InjectRepository(TermEntity)
    private readonly termRepository: Repository<TermEntity>,
    private readonly historyService: HistoryService,
  ) { }

  async createTerm(data: CreateTermDTO) {

    const { title, content, createdBy, customFields } = data;

    // Busca o último termo com o mesmo título para obter a maior versão
    const lastTerm = await this.termRepository.findOne({
      where: { title: data.title },
      order: { version: 'DESC' },
    });

    const nextVersion = (lastTerm?.version ?? 0) + 1;

    // Cria nova instância com a próxima versão
    const termEntity = this.termRepository.create({
      title,
      content,
      createdBy,
      version: nextVersion,
      isActive: true,
      customFields
    });

    const termCreated = await this.termRepository.save(termEntity);

    await this.historyService.log(
      HistoryAction.CREATE_TERM,
      HistoryEntity.TERM,
      termCreated.id.toString(),
      termCreated,
    );

    return termCreated;
  }

  async listTerms() {
    const termsSaved = await this.termRepository.find();

    const termsList = termsSaved.map(
      (term) =>
        new ListTermsDTO(
          term.id.toString(),
          term.title,
          term.content,
          term.createdBy,
          term.version,
          term.isActive,
          term.createdAt,
          term.customFields || []
        )
    );

    return termsList;
  }

  async deleteTerm(id: string) {
    const term = await this.termRepository.findOneBy({ id });

    if (!term) {
      throw new NotFoundException("O termo não foi encontrado");
    }

    await this.termRepository.delete(term.id);

    return term;
  }
}
