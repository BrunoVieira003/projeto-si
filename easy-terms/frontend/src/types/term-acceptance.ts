export interface TermAcceptanceLog {
  id: string;
  acceptedAt: string | null;
  revokedAt: string | null;
  user: { id: string; name: string };
  term: {
    id: string;
    title: string;
    version: number;
    customFields: {
      id: string;
      name: string;
      value: string;
      type: 'string' | 'number' | 'boolean' | 'date';
    }[];
  };
  acceptedCustomFields: {
    customField: {
      id: string;
      name: string;
      value: string;
      type: 'string' | 'number' | 'boolean' | 'date';
    };
    accepted: boolean;
  }[];
}
