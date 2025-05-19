import api from "./axios";

export const getIntegrations = async () => {
  const { data } = await api.get('/integration')
  return data as any[]
};

export const deleteIntegration = async (id: string) => {
  return await api.delete(`/integration/${id}`);
};
