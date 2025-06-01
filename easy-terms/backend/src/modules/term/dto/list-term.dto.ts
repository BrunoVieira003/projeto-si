import { CustomFieldDTO } from "./custom-field.dto";

export class ListTermsDTO {
  constructor(
    public id: string,
    public title: string,
    public content: string,
    public createdBy: string,
    public version: number,
    public isActive: boolean,
    public createdAt: Date,
    public customFields: CustomFieldDTO[]
  ) { }
}
