export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'bot';
  text: string;
  timestamp: string;
  avatar?: string;
  attachments?: string[];
}
