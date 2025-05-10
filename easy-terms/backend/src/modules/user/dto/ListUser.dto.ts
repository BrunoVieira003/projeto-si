export class ListUsersDTO {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly role: string,
    readonly phoneNumber: string,
    readonly birthDate: Date,
    readonly state: string,
    readonly city: string,
    readonly cpf: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
