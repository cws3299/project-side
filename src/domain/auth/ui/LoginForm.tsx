import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import useLogin from '../hooks/useLogin';
import { useUserStore } from '../../user/store/userStore';
import useLogout from '../hooks/useLogout';
import { useNavigate } from 'react-router';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import {
  AuthPageContainer,
  AuthFormContainer,
  AuthTitle,
  AuthButton,
  AuthLink,
  AuthMessage
} from './authStyle';

const LoginForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const {
    mutate: loginWithEmail,
    isSuccess,
    isError,
    error,
    isPending,
  } = useLogin();
  const { mutate: logout, isSuccess: logoutSuccess } = useLogout();

  const { user } = useUserStore();

  useEffect(() => {
    if (user) {
      console.log('로그인 한 user 정보 : ', user);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      console.log('Email:', email);
      console.log('Password:', password);
      loginWithEmail({ email: email, password: password });
    } else {
      logout();
    }
  };

  return (
    <AuthPageContainer>
      <AuthFormContainer
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <AuthTitle variant="h4">
          로그인
        </AuthTitle>

        {!user ? (
          <>
            <TextField
              id="email-input"
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              fullWidth
            />

            <TextField
              id="password-input"
              label="비밀번호"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              fullWidth
            />

            <AuthLink onClick={() => navigate('/join')}>
              계정이 없으신가요? 회원가입하기
              <ArrowRightAltIcon sx={{ ml: 0.5, fontSize: 16 }} />
            </AuthLink>

            <AuthButton 
              type="submit" 
              className={isPending ? 'loading' : ''}
              disabled={isPending || !email || !password}
            >
              {isPending ? '' : '로그인'}
            </AuthButton>
          </>
        ) : (
          <AuthMessage className="success">
            <AuthTitle variant="h6" sx={{ fontSize: '20px !important', mb: 1 }}>
              환영합니다! 👋
            </AuthTitle>
            <AuthTitle variant="body1" sx={{ fontSize: '16px !important', fontWeight: '500 !important' }}>
              {user.email}
            </AuthTitle>
            <AuthButton onClick={() => logout()} sx={{ mt: 2 }}>
              로그아웃
            </AuthButton>
          </AuthMessage>
        )}

        {/* 에러 메시지 */}
        {isError && (
          <AuthMessage className="error">
            <AuthTitle variant="body2" sx={{ fontSize: '14px !important', fontWeight: '500 !important' }}>
              {error?.message || '로그인에 실패했습니다.'}
            </AuthTitle>
          </AuthMessage>
        )}

        {/* 로그아웃 성공 메시지 */}
        {!user && logoutSuccess && (
          <AuthMessage className="success">
            <AuthTitle variant="body2" sx={{ fontSize: '14px !important', fontWeight: '500 !important' }}>
              로그아웃되었습니다.
            </AuthTitle>
          </AuthMessage>
        )}
      </AuthFormContainer>
    </AuthPageContainer>
  );
};

export default LoginForm;