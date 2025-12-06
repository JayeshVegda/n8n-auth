import { useState, useEffect } from 'react';
import { Container, Paper, Title, TextInput, PasswordInput, Button, Stack, SegmentedControl, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { notifications } from '@mantine/notifications';
import { authAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { loginSchema, registerSchema } from '../utils/validation';

function AuthPage() {
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const navigate = useNavigate();

  const loginForm = useForm({
    initialValues: {
      identifier: '',
      password: '',
    },
    validate: zodResolver(loginSchema),
  });

  const registerForm = useForm({
    initialValues: {
      name: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    validate: zodResolver(registerSchema),
    validateInputOnBlur: true,
  });

  const handleModeChange = (value) => {
    setMode(value);
    loginForm.reset();
    registerForm.reset();
  };

  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) {
      return;
    }

    const usernameError = registerForm.getInputProps('username').error;
    if (usernameError && !usernameError.includes('already exists')) {
      return;
    }

    setCheckingUsername(true);
    try {
      const response = await authAPI.checkUsername(username);
      if (!response.success) {
        registerForm.setFieldError('username', 'Username already exists');
      } else {
        registerForm.clearFieldError('username');
      }
    } catch (error) {
      if (error.response?.data?.success === false) {
        registerForm.setFieldError('username', 'Username already exists');
      }
    } finally {
      setCheckingUsername(false);
    }
  };

  useEffect(() => {
    const username = registerForm.values.username;
    const timeoutId = setTimeout(() => {
      if (username && username.length >= 3) {
        checkUsernameAvailability(username);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerForm.values.username]);

  const handleLogin = async (values) => {
    setLoading(true);

    try {
      const response = await authAPI.login(values);
      notifications.show({
        title: 'Success',
        message: response.message,
        color: 'green',
      });
      navigate('/dashboard');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Login failed',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    setLoading(true);

    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...registerData } = values;
      const response = await authAPI.register(registerData);
      notifications.show({
        title: 'Success',
        message: response.message,
        color: 'green',
      });
      navigate('/dashboard');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Registration failed',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper shadow="md" p={30} radius="md" withBorder style={{ width: '100%' }}>
        <Stack gap="md">
          <Title order={2} ta="center">
            Welcome
          </Title>

          <SegmentedControl
            value={mode}
            onChange={handleModeChange}
            data={[
              { label: 'Login', value: 'login' },
              { label: 'Register', value: 'register' },
            ]}
            fullWidth
          />

          {mode === 'login' ? (
            <form onSubmit={loginForm.onSubmit(handleLogin)}>
              <Stack gap="md">
                <TextInput
                  label="Email or Username"
                  placeholder="Enter your email or username"
                  {...loginForm.getInputProps('identifier')}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  {...loginForm.getInputProps('password')}
                />

                <Button type="submit" fullWidth loading={loading}>
                  Login
                </Button>
              </Stack>
            </form>
          ) : (
            <form onSubmit={registerForm.onSubmit(handleRegister)}>
              <Stack gap="md">
                <TextInput
                  label="Name"
                  placeholder="Enter your name"
                  {...registerForm.getInputProps('name')}
                />

                <TextInput
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  {...registerForm.getInputProps('email')}
                />

                <TextInput
                  label="Username"
                  placeholder="Choose a username (3-15 characters, letters and numbers only)"
                  rightSection={checkingUsername ? <Loader size="xs" /> : null}
                  {...registerForm.getInputProps('username')}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Create a password"
                  description="Must contain uppercase, lowercase, number, and special character (@$!%*?&)"
                  {...registerForm.getInputProps('password')}
                />

                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  {...registerForm.getInputProps('confirmPassword')}
                />

                <Button type="submit" fullWidth loading={loading}>
                  Register
                </Button>
              </Stack>
            </form>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}

export default AuthPage;
