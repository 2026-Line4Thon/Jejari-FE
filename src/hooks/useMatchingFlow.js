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
  const busy = useRef(false);
  const run = async (operation) => {
    if (busy.current) return null;
    busy.current = true;
    setIsPending(true);
    setError('');
    try { const value = await operation(); return active.current ? value : null; }
    catch (actionError) { if (active.current) setError(actionError.message || '요청을 처리하지 못했어요.'); return null; }
    finally { busy.current = false; if (active.current) setIsPending(false); }
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
  const [updated, setUpdated] = useState(null);
  const data = String(updated?.candidateId) === String(candidateId) ? updated : resource.data;
  const answer = draft.candidateId === candidateId ? draft.value : '';
  const sendAnswer = (skip = false) => action.run(async () => {
    const result = skip ? await matchingService.skipOwnershipAnswer(data.id) : await matchingService.submitOwnershipAnswer(data.id, answer);
    setUpdated(result);
    setDraft({ candidateId, value: '' });
    return result;
  });
  return {
    ...resource, data, answer, setAnswer: (value) => setDraft({ candidateId, value }),
    isPending: action.isPending, actionError: action.error || (['unverified', 'locked'].includes(data?.status) ? data.message || '답변이 일치하지 않아요.' : ''),
    submit: () => sendAnswer(),
    skip: () => sendAnswer(true),
  };
}

export function useReturnConnection(candidateId, checkId) {
  const load = useCallback(() => matchingService.getReturnConnection(candidateId, checkId), [candidateId, checkId]);
  const resource = useMatchingResource(load);
  const action = useMatchingAction();
  return {
    ...resource, isPending: action.isPending, actionError: action.error,
    startChat: () => action.run(() => matchingService.createChat(candidateId, checkId)),
  };
}
