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
  acceptedCustomFields: AcceptedCustomField[];
}

export type AcceptedCustomField = {
  id: string | null;
  accepted: boolean;
  acceptedAt: string | null;
  revokedAt: string | null;
  customField: {
    id: string;
    name: string;
    value: string;
    type: 'string' | 'number' | 'boolean' | 'date';
  };
};
