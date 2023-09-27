import { FC, useState, Suspense, useEffect } from 'react';
import { Form, Input, Button, Typography, Divider, Space } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { inputStyle, buttonStyle } from '../../assets/styles/globalStyle';
import '../../assets/styles/AuthPage.css';
import { useTranslation } from 'react-i18next';
import useTitle from '../../hooks/useTitle';
import useAuth from '../../services/auth';
import { useSearchParams } from 'react-router-dom';
type FormType = 'signIn' | 'signUp' | 'forgot' | 'reset';
interface FormProps {
  isLoading?: boolean;
  setFormType?: (type: FormType) => void;
}
const SignInInputs: FC<FormProps> = ({ setFormType, isLoading }) => {
  const { t } = useTranslation();
  return (
    <>
      <Typography.Title level={3} className="text-center" style={{ marginBottom: '24px' }}>
        {t('sign in')}
      </Typography.Title>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: t('please enter your email').toString() },
          { whitespace: true, message: t('please enter your email').toString() },
          { type: 'email', message: t('invalid email address').toString() },
        ]}
      >
        <Input size="large" prefix={<MailOutlined className="site-form-item-icon" />} spellCheck={false} placeholder="Email..." style={inputStyle} />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: t('please enter your password').toString() }]}>
        <Input.Password
          size="large"
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder={t('password...').toString()}
          style={inputStyle}
        />
      </Form.Item>
      <span onClick={() => (setFormType as any)('forgot')} className="forgot-password">
        {t('forgot password?')}
      </span>
      <Form.Item>
        <Button loading={isLoading} size="large" shape="round" type="primary" htmlType="submit" block className="submit-btn" style={buttonStyle}>
          {t('sign in')}
        </Button>
      </Form.Item>
    </>
  );
};

const SignUpInputs: FC<FormProps> = ({ isLoading }) => {
  const { t } = useTranslation();
  return (
    <>
      <Typography.Title level={3} className="text-center" style={{ marginBottom: '24px' }}>
        {t('sign up')}
      </Typography.Title>
      <Form.Item
        name="firstName"
        rules={[
          { required: true, message: t('required').toString() },
          { whitespace: true, message: t('required').toString() },
        ]}
      >
        <Input size="large" spellCheck={false} placeholder={t('first name...').toString()} style={inputStyle} />
      </Form.Item>
      <Form.Item
        name="lastName"
        rules={[
          { required: true, message: t('required').toString() },
          { whitespace: true, message: t('required').toString() },
        ]}
      >
        <Input size="large" spellCheck={false} placeholder={t('last name...').toString()} style={inputStyle} />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: t('please enter your email').toString() },
          { whitespace: true, message: t('please enter your email').toString() },
          { type: 'email', message: t('invalid email address').toString() },
        ]}
      >
        <Input size="large" prefix={<MailOutlined className="site-form-item-icon" />} spellCheck={false} placeholder="Email..." style={inputStyle} />
      </Form.Item>
      <Space size="small">
        <Form.Item name="password" rules={[{ required: true, message: t('please enter your password').toString() }]}>
          <Input.Password
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder={t('password...').toString()}
            style={inputStyle}
          />
        </Form.Item>
        <Form.Item
          name="cf-password"
          rules={[
            { required: true, message: t('please enter your password').toString() },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(t('password do not match').toString());
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder={t('confirm password...').toString()}
            style={inputStyle}
          />
        </Form.Item>
      </Space>
      <Form.Item>
        <Button size="large" shape="round" type="primary" htmlType="submit" block className="submit-btn" style={buttonStyle} loading={isLoading}>
          {t('sign up')}
        </Button>
      </Form.Item>
    </>
  );
};

const ForgotInputs: FC<FormProps> = ({ isLoading }) => {
  const { t } = useTranslation();
  return (
    <>
      <Typography.Title level={3} className="text-center" style={{ marginBottom: '24px' }}>
        {t('forgot password')}
      </Typography.Title>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: t('please enter your email').toString() },
          { whitespace: true, message: t('please enter your email').toString() },
          { type: 'email', message: t('invalid email address').toString() },
        ]}
      >
        <Input size="large" prefix={<MailOutlined className="site-form-item-icon" />} spellCheck={false} placeholder="Email..." style={inputStyle} />
      </Form.Item>
      <Form.Item>
        <Button loading={isLoading} size="large" shape="round" type="primary" htmlType="submit" block className="submit-btn" style={buttonStyle}>
          {t('submit')}
        </Button>
      </Form.Item>
    </>
  );
};

const ResetInputs: FC<FormProps> = ({ isLoading }) => {
  const { t } = useTranslation();
  return (
    <>
      <Typography.Title level={3} className="text-center" style={{ marginBottom: '24px' }}>
        {t('reset password')}
      </Typography.Title>
      <Form.Item name="password" rules={[{ required: true, message: t('please enter your password').toString() }]}>
        <Input.Password
          size="large"
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder={t('password...').toString()}
          style={inputStyle}
        />
      </Form.Item>
      <Form.Item
        name="cf-password"
        rules={[
          { required: true, message: t('please enter your password').toString() },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(t('password do not match').toString());
            },
          }),
        ]}
      >
        <Input.Password
          size="large"
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder={t('confirm password...').toString()}
          style={inputStyle}
        />
      </Form.Item>
      <Form.Item>
        <Button loading={isLoading} size="large" shape="round" type="primary" htmlType="submit" block className="submit-btn" style={buttonStyle}>
          {t('submit')}
        </Button>
      </Form.Item>
    </>
  );
};

const AuthPage: FC = () => {
  const [form] = Form.useForm();
  const [formType, setFormType] = useState<FormType>('signIn');
  const { signInMutation, forgotPasswordMutation, signUpMutation, resetPasswordMutation } = useAuth();
  const [query, setQuery] = useSearchParams();

  const { t } = useTranslation();
  useTitle(`${t('account').toString()} - 7FF`);

  const onSignIn = async (values: any) => {
    signInMutation.mutate(values);
  };

  const onSignUp = (values: any) => {
    signUpMutation.mutate(values);
  };

  const onForgotPassword = async (values: any) => {
    await forgotPasswordMutation.mutateAsync({ email: values.email });
    form.resetFields();
  };

  const onResetPassword = async (values: any) => {
    const token = query.get('token') as string;
    await resetPasswordMutation.mutateAsync({ password: values.password, token });
    form.resetFields();
    query.delete('token');
    setQuery(query);
    setFormType('signIn');
  };

  const formEventHandlers = {
    signIn: (values: any) => onSignIn(values),
    signUp: (values: any) => onSignUp(values),
    forgot: (values: any) => onForgotPassword(values),
    reset: (values: any) => onResetPassword(values),
  };

  const onFinish = (values: any) => {
    formEventHandlers[formType](values);
  };

  useEffect(() => {
    if (query.get('type')) {
      setFormType(query.get('type') as FormType);
    }
    return () => {
      query.delete('type');
      setQuery(query);
    };
  }, [query]);

  return (
    <div className="auth-page">
      <Form layout="vertical" className="auth-form" onFinish={onFinish} validateTrigger="onSubmit" form={form}>
        {formType === 'signIn' && <SignInInputs setFormType={setFormType} isLoading={signInMutation.isLoading} />}
        {formType === 'signUp' && <SignUpInputs isLoading={signUpMutation.isLoading} />}
        {formType === 'forgot' && <ForgotInputs isLoading={forgotPasswordMutation.isLoading} />}
        {formType === 'reset' && <ResetInputs isLoading={resetPasswordMutation.isLoading} />}

        {formType !== 'forgot' && formType !== 'reset' && (
          <>
            <Divider style={{ borderColor: '#101319', marginBottom: '8px' }}>
              {formType === 'signIn' ? t('or sign in using') : t('or sign up using')}{' '}
            </Divider>
            <div className="social-auth-options">
              <img src="/google-brand.png" />
              <img src="/github-mark.png" />
              <img src="/facebook-brand.png" />
            </div>
          </>
        )}

        <div className="text-center">
          {formType === 'signIn' ? t("don't have an account?") + ' ' : t('already have an account?') + ' '}
          <strong onClick={() => setFormType(formType === 'signIn' ? 'signUp' : 'signIn')}>
            {formType === 'signIn' ? t('sign up') : t('sign in')}
          </strong>
        </div>
      </Form>
    </div>
  );
};

export default AuthPage;
