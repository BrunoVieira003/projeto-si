export class ListTermsDTO {
  constructor(
    public id: string,
    public title: string,
    public content: string,
    public version: number,
    public createdAt: Date,
    public isActive: boolean,
    public revocable: boolean,
    public purpose: string,
    public createdBy: string,
    public appliesToRoles: string | null,
    public validFrom: Date | null,
    public validUntil: Date | null,
    public acceptanceRequired: boolean | null,
  ) {}
}
