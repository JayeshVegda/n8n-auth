import { useState, useEffect } from 'react';
import { Container, Stack, Button, Title, Text, Modal, TextInput, Paper, Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconBrandGithub, IconBrandLinkedin, IconShieldCheck, IconCheck } from '@tabler/icons-react';
import { authAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.success) {
        setUser(response.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/');
      }
    } finally {
      setLoadingUser(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      notifications.show({
        title: 'Success',
        message: 'Logged out successfully',
        color: 'green',
      });
      navigate('/');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Logout failed',
        color: 'red',
      });
    }
  };

  const handleRequestVerification = async () => {
    setRequestingOtp(true);
    try {
      const response = await authAPI.requestVerification();
      notifications.show({
        title: 'OTP Sent',
        message: response.message || 'Verification OTP sent to your email',
        color: 'green',
      });
      setVerifyModalOpen(true);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to send OTP',
        color: 'red',
      });
    } finally {
      setRequestingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      notifications.show({
        title: 'Error',
        message: 'Please enter a valid 6-digit OTP',
        color: 'red',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyOtp(otp);
      notifications.show({
        title: 'Success',
        message: response.message || 'Account verified successfully',
        color: 'green',
      });
      setVerifyModalOpen(false);
      setOtp('');
      if (response.user) {
        setUser(response.user);
      } else {
        fetchUser();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Invalid OTP',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser) {
    return (
      <Container size="sm" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader size="lg" />
      </Container>
    );
  }

  const isVerified = user?.isAccountVerified;

  return (
    <Container size="sm" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Stack gap="xl" style={{ width: '100%' }}>
        <Title order={1} ta="center">
          Dashboard
        </Title>

        <Paper p="md" withBorder radius="md">
          <Stack gap="md">
            <Button
              leftSection={isVerified ? <IconCheck size={20} /> : <IconShieldCheck size={20} />}
              variant={isVerified ? "filled" : "light"}
              color={isVerified ? "green" : "blue"}
              size="lg"
              fullWidth
              onClick={handleRequestVerification}
              loading={requestingOtp}
              disabled={isVerified}
            >
              {isVerified ? 'You are verified' : 'Verify Account'}
            </Button>

            {!isVerified && (
              <Text size="sm" c="dimmed" ta="center">
                Uses n8n workflow to send OTP via email
              </Text>
            )}

            <Button
              leftSection={<IconBrandGithub size={20} />}
              variant="outline"
              size="lg"
              fullWidth
              component="a"
              href="https://github.com"
              target="_blank"
            >
              My GitHub
            </Button>

            <Button
              leftSection={<IconBrandLinkedin size={20} />}
              variant="outline"
              size="lg"
              fullWidth
              component="a"
              href="https://linkedin.com"
              target="_blank"
            >
              My LinkedIn
            </Button>

            <Button variant="subtle" color="red" onClick={handleLogout} mt="md">
              Logout
            </Button>
          </Stack>
        </Paper>
      </Stack>

      <Modal
        opened={verifyModalOpen}
        onClose={() => {
          setVerifyModalOpen(false);
          setOtp('');
        }}
        title="Verify Account"
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Enter the 6-digit OTP sent to your email
          </Text>

          <TextInput
            label="OTP"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            required
          />

          <Button onClick={handleVerifyOtp} loading={loading} fullWidth>
            Verify
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
}

export default Dashboard;


