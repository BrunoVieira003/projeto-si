export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'EMPLOYEE';
  // opcionais:
  acceptedTermIds?: string[];
  acceptedFieldIds?: string[];
  phoneNumber?: string;
  birthDate?: string;       
  cpf?: string;
  city?: string;
  state?: string;
}


export interface UpdateUserPayload {
  id: string;                 
  name: string;               
  phoneNumber?: string;    
  birthDate?: string;        
  cpf?: string;              
  city?: string;              
  state?: string;           
}

export interface LoginPayload {
    email: string;
    password: string;
}
