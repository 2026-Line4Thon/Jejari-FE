import { useCallback, useEffect, useRef, useState } from 'react';
import { matchingService } from '../services/matchingService';

function useMatchingResource(load) {
  const [result, setResult] = useState(null);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(load).then((data) => {
      if (active) setResult({ load, data, error: '' });
    }).catch((error) => {
      if (active) setResult({ load, data: null, error: error.message || '정보를 불러오지 못했어요.' });
    });
    return () => { active = false; };
  }, [load]);
  const current = result?.load === load ? result : null;
  return { data: current?.data ?? null, error: current?.error ?? '', isLoading: !current };
}

function useMatchingAction() {
  const active = useRef(true);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');
  const run = async (operation) => {
    setIsPending(true);
    setError('');
    try { const value = await operation(); return active.current ? value : null; }
    catch (actionError) { if (active.current) setError(actionError.message || '요청을 처리하지 못했어요.'); return null; }
    finally { if (active.current) setIsPending(false); }
  };
  return { run, isPending, error };
}

export function useMatchCandidates(lostItemId = 101) {
  const load = useCallback(() => matchingService.getCandidates(lostItemId), [lostItemId]);
  return useMatchingResource(load);
}

export function useMatchCandidate(candidateId) {
  const load = useCallback(() => matchingService.getCandidate(candidateId), [candidateId]);
  const resource = useMatchingResource(load);
  const action = useMatchingAction();
  return { ...resource, isPending: action.isPending, actionError: action.error, reject: () => action.run(() => matchingService.rejectCandidate(candidateId)) };
}

export function useOwnershipCheck(candidateId) {
  const load = useCallback(() => matchingService.createOwnershipCheck(candidateId), [candidateId]);
  const resource = useMatchingResource(load);
  const action = useMatchingAction();
  const [draft, setDraft] = useState({ candidateId, value: '' });
  const answer = draft.candidateId === candidateId ? draft.value : '';
  return {
    ...resource, answer, setAnswer: (value) => setDraft({ candidateId, value }),
    isPending: action.isPending, actionError: action.error,
    submit: () => action.run(() => matchingService.submitOwnershipAnswer(resource.data.id, answer)),
    skip: () => action.run(() => matchingService.skipOwnershipAnswer(resource.data.id)),
  };
}

export function useReturnConnection(candidateId, checkId) {
  const load = useCallback(() => matchingService.getReturnConnection(candidateId, checkId), [candidateId, checkId]);
  const resource = useMatchingResource(load);
  const action = useMatchingAction();
  const [room, setRoom] = useState(null);
  const [message, setMessage] = useState('');
  const startChat = async () => {
    const nextRoom = await action.run(() => matchingService.createChat(candidateId, checkId));
    if (nextRoom) setRoom(nextRoom);
    return nextRoom;
  };
  const sendMessage = async () => {
    if (!room) return;
    const nextRoom = await action.run(() => matchingService.sendMessage(room.id, message));
    if (nextRoom) { setRoom(nextRoom); setMessage(''); }
  };
  return { ...resource, room, message, setMessage, startChat, sendMessage, isPending: action.isPending, actionError: action.error };
}
