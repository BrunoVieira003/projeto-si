import { UserEntity } from 'src/modules/user/entities/user.entity';
import { TermEntity } from 'src/modules/term/entities/term.entity';

export class ListAcceptancesDTO {
  constructor(
    readonly id: string,
    readonly acceptedAt: Date | null,
    readonly revokedAt: Date | null,
    readonly user: UserEntity,
    readonly term: TermEntity,
  ) {}
}
