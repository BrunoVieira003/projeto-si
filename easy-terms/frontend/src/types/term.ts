export interface CreateTermPayload {
    title: string;
    content: string;
    revocable: boolean;
    purpose: string;
    createdBy: string;
    role: 'ADMIN' | 'EMPLOYEE';
    validFrom?: string; // formato ISO: 'YYYY-MM-DD'
    validUntil?: string;
    acceptanceRequired?: boolean;
}