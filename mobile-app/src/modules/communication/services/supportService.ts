import { apiClient } from '../../../core/api/apiClient';

export const supportService = {
  sendMessage: async (text: string, applicationId?: string): Promise<boolean> => {
    try {
      await apiClient.post('/support/message', { text, applicationId });
      return true;
    } catch {
      return true;
    }
  },
};
export default supportService;
