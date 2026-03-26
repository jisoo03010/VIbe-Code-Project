import { useState } from 'react';

interface AuthPageProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
}

type Mode = 'signin' | 'signup';

export function AuthPage({ onSignIn, onSignUp }: AuthPageProps) {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      if (mode === 'signin') {
        await onSignIn(email, password);
      } else {
        await onSignUp(email, password);
        setMessage('가입 완료! 이메일을 확인해 인증 후 로그인하세요.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '오류가 발생했습니다.';
      setError(
        msg.includes('Invalid login credentials') ? '이메일 또는 비밀번호가 틀렸습니다.' :
        msg.includes('already registered') ? '이미 가입된 이메일입니다.' :
        msg.includes('Password should be') ? '비밀번호는 6자 이상이어야 합니다.' :
        msg
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo__bean">🫘</span>
          <span className="auth-logo__name">Keep-It</span>
          <span className="auth-logo__sub">꾸준함 관리 TODO</span>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab${mode === 'signin' ? ' auth-tab--active' : ''}`}
            onClick={() => { setMode('signin'); setError(''); setMessage(''); }}
          >
            로그인
          </button>
          <button
            className={`auth-tab${mode === 'signup' ? ' auth-tab--active' : ''}`}
            onClick={() => { setMode('signup'); setError(''); setMessage(''); }}
          >
            회원가입
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-field__label">이메일</label>
            <input
              className="auth-field__input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="auth-field">
            <label className="auth-field__label">비밀번호</label>
            <input
              className="auth-field__input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="6자 이상"
              required
              minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-message">{message}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? '처리 중...' : mode === 'signin' ? '로그인' : '가입하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
