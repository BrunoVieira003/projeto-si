export interface CreateTermPayload {
    title: string;
    content: string;
    createdBy: string;
    customFields: {
        name: string;
        value: string;
        type: 'boolean';
    }[]
}