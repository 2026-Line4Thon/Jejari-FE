import { useEffect, useRef, useState } from 'react';
import { authService } from '../services/authService';

export default function useSchoolAuth() {
  const [email, setEmailValue] = useState('');
  const [verificationCode, setCode] = useState('');
  const [sentEmail, setSentEmail] = useState('');
  const [pending, setPending] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const active = useRef(false);
  const busy = useRef(false);
  const generation = useRef(0);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  const normalizedEmail = email.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  const codeSent = Boolean(sentEmail && sentEmail === normalizedEmail);
  const run = async (action, operation) => {
    if (busy.current) return false;
    busy.current = true;
    const version = generation.current;
    setPending(action);
    setError('');
    try { await operation(); return active.current && version === generation.current; }
    catch (failure) { if (active.current && version === generation.current) setError(failure.message); return false; }
    finally { busy.current = false; if (active.current) setPending(''); }
  };
  const sendCode = () => {
    if (!validEmail) { setError('올바른 학교 이메일을 입력해 주세요.'); return; }
    const sentTo = normalizedEmail;
    const version = generation.current;
    return run('send', async () => {
      const response = await authService.sendCode(sentTo);
      if (!active.current || version !== generation.current) return;
      setSentEmail(sentTo);
      setCode('');
      setFeedback(response.message);
    });
  };
  return {
    email, verificationCode, codeSent, pending, error, feedback,
    canStart: validEmail && codeSent && /^\d{6}$/.test(verificationCode) && !pending,
    setEmail: (value) => { generation.current += 1; setEmailValue(value); setSentEmail(''); setCode(''); setFeedback(''); setError(''); },
    setVerificationCode: (value) => setCode(value.replace(/\D/g, '').slice(0, 6)),
    sendCode,
    verify: () => codeSent && /^\d{6}$/.test(verificationCode) ? run('verify', () => authService.verify(normalizedEmail, verificationCode)) : Promise.resolve(false),
  };
}
