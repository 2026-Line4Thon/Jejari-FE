import { useCallback, useEffect, useRef, useState } from 'react';
import { chatService } from '../services/chatService';
import { apiEnabled } from '../api/config';

function useChatResource(load) {
  const [result, setResult] = useState(null);
  useEffect(() => {
    let active = true;
    let request = 0;
    let refreshing = false;
    const refresh = async () => {
      if (refreshing) return;
      refreshing = true;
      const current = ++request;
      try {
        const data = await load();
        if (active && current === request) setResult({ load, data, error: '' });
      } catch (error) {
        if (active && current === request) setResult({ load, data: null, error: error.message || '채팅 정보를 불러오지 못했어요.' });
      } finally { refreshing = false; }
    };
    const unsubscribe = chatService.subscribe(refresh);
    refresh();
    const timer = apiEnabled ? setInterval(refresh, 5000) : null;
    return () => { active = false; unsubscribe(); clearInterval(timer); };
  }, [load]);
  const current = result?.load === load ? result : null;
  return { data: current?.data ?? null, error: current?.error ?? '', isLoading: !current };
}

export function useChatList() {
  const [filter, setFilter] = useState('all');
  const load = useCallback(() => chatService.getChats({ unreadOnly: filter === 'unread' }), [filter]);
  return { ...useChatResource(load), filter, setFilter };
}

export function useChatRoom(roomId) {
  const load = useCallback(() => chatService.getMessages(roomId), [roomId]);
  const resource = useChatResource(load);
  const [draft, setDraft] = useState({ roomId, text: '' });
  const [action, setAction] = useState({ roomId, pending: false, error: '' });
  const generation = useRef(0);
  const inFlight = useRef(null);
  useEffect(() => {
    generation.current += 1;
    return () => { generation.current += 1; };
  }, [roomId]);
  const message = draft.roomId === roomId ? draft.text : '';
  const currentAction = action.roomId === roomId ? action : { pending: false, error: '' };
  const loaded = Boolean(resource.data);
  useEffect(() => {
    if (!loaded) return;
    // Reading and mock delivery have no network side effects.
    chatService.markRead(roomId);
    return chatService.startMockReply(roomId);
  }, [roomId, loaded]);

  const run = async (operation) => {
    const currentGeneration = generation.current;
    if (inFlight.current === currentGeneration) return null;
    inFlight.current = currentGeneration;
    setAction({ roomId, pending: true, error: '' });
    try {
      const value = await operation();
      return currentGeneration === generation.current ? value : null;
    } catch (error) {
      if (currentGeneration === generation.current) setAction({ roomId, pending: false, error: error.message || '요청을 처리하지 못했어요.' });
      return null;
    } finally {
      if (inFlight.current === currentGeneration) inFlight.current = null;
      if (currentGeneration === generation.current) setAction((previous) => ({ ...previous, pending: false }));
    }
  };
  const sendMessage = async () => {
    const sent = message;
    const room = await run(() => chatService.sendMessage(roomId, sent));
    if (room) setDraft((previous) => previous.roomId === roomId && previous.text === sent ? { roomId, text: '' } : previous);
  };
  return {
    ...resource, message, setMessage: (text) => setDraft({ roomId, text }),
    sendMessage, complete: () => run(() => chatService.completeChat(roomId)),
    isPending: currentAction.pending, actionError: currentAction.error,
  };
}
