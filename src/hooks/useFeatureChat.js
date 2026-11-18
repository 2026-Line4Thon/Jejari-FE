import { useEffect, useRef, useState } from 'react';
import { apiEnabled } from '../api/config';
import { jejariApi } from '../api/endpoints';
import { registrationService } from '../services/registrationService';

export default function useFeatureChat(draft) {
  const [resource, setResource] = useState(null);
  const [turns, setTurns] = useState([]);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const active = useRef(false);
  const busy = useRef(false);
  useEffect(() => {
    active.current = true;
    let cancelled = false;
    if (apiEnabled) registrationService.prepareLost(draft).then((data) => {
      if (!cancelled) setResource({ draft, data });
    }).catch((failure) => { if (!cancelled) setError(failure.message); });
    return () => { active.current = false; cancelled = true; };
  }, [draft]);
  const chat = resource?.draft === draft ? resource.data : null;
  const run = async (operation) => {
    if (busy.current || !chat) return null;
    busy.current = true; setPending(true); setError('');
    try { return await operation(); }
    catch (failure) { if (active.current) setError(failure.message); return null; }
    finally { busy.current = false; if (active.current) setPending(false); }
  };
  const submit = (answer) => run(async () => {
    if (!chat.question || chat.is_finished || !answer.trim()) return false;
    const response = await jejariApi.answerFeatures(chat.chat_id, { step: chat.question.step, answer: answer.trim(), is_skipped: answer === '잘 모르겠어요' });
    if (!active.current) return false;
    setTurns((previous) => [...previous, { question: chat.question, answer }]);
    setResource({ draft, data: { ...chat, ...response } });
    return true;
  });
  const recent = turns.slice(chat?.is_finished ? -2 : -1);
  const first = recent[0] ?? { question: chat?.question, answer: '' };
  const second = chat?.is_finished ? recent[1] : turns.length ? { question: chat?.question, answer: '' } : null;
  return {
    chat, pending, error, isLoading: apiEnabled && !chat && !error, submit,
    first, second, firstActive: !turns.length && !chat?.is_finished, secondActive: Boolean(turns.length && !chat?.is_finished),
    register: () => run(() => registrationService.registerLost(draft, chat)),
  };
}
