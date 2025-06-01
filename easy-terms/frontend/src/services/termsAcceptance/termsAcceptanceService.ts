import api from '../axios';

export const getTermsAcceptanced = () => {
    return api.get('/user-term-acceptance');
};

export const confirmConsent = (userId: string, termId: string) => {
    return api.post('/terms/consent/confirm', { userId, termId });
};

export const revokeConsent = (acceptanceId: string) => {
    return api.patch(`/user-term-acceptance/${acceptanceId}/revoke`);
};

export const revokeCustomFieldConsent = (acceptanceId: string, fieldId: string) => {
    return api.patch(`/user-term-acceptance/${acceptanceId}/revoke-field/${fieldId}`);
};

export const updateAcceptedFields = (acceptanceId: string, acceptedFieldIds: string[]) => {
  return api.patch(`/user-term-acceptance/${acceptanceId}/update-fields`, { acceptedFieldIds });
};
