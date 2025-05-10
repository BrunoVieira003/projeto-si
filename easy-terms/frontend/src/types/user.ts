export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'EMPLOYEE';
  acceptedTermIds?: string[];
  
  // opcionais:
  phoneNumber?: string;
  birthDate?: string;       // formato ISO: 'yyyy-MM-dd'
  cpf?: string;
  city?: string;
  state?: string;
}


export interface UpdateUserPayload {
  id: string;                 
  name: string;               
  phoneNumber?: string;       // opcional
  birthDate?: string;         // opcional — melhor usar string (ISO) do que Date
  cpf?: string;               // opcional
  city?: string;              // opcional
  state?: string;             // opcional
}

export interface LoginPayload {
    email: string;
    password: string;
}
