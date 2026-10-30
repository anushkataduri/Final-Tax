import { useSupportStore } from '../store/supportStore';

export function useSupport() {
  const messages = useSupportStore((s) => s.messages);
  const sendMessage = useSupportStore((s) => s.sendMessage);
  const receiveReply = useSupportStore((s) => s.receiveReply);

  return { messages, sendMessage, receiveReply };
}
