import { apiClient } from '../../../core/api/apiClient';
import type { ChatMessage } from '../types/support.types';

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
