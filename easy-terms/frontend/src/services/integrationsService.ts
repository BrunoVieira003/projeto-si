import api from "./axios";

interface CreateIntegrationOrgPayload{
  name: string
  website: string
  email: string
}

export const getIntegrations = async () => {
  const { data } = await api.get('/integration')
  return data as any[]
};

export const getOrgs = async () => {
  const { data } = await api.get('/integration-org')
  return data as any[]
};

export const deleteIntegration = async (id: string) => {
  return await api.delete(`/integration/${id}`);
};

export const createIntegrationOrg = async (data: CreateIntegrationOrgPayload) => {
  return await api.post('/integration-org', data)
}
