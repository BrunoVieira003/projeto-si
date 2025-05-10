export class ListTermsDTO {
    constructor(
      readonly id: string,
      readonly title: string,
      readonly content: string,
      readonly version: number,
      readonly createdAt: Date,
      readonly isActive: boolean,
    ) {}
  }
  