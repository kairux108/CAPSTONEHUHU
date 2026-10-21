import { router } from 'expo-router';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '../../../constants/colors';
import useLogin from '../hooks/useLogin';
import FormField from '../../../components/common/FormField';
import PrimaryButton from '../../../components/common/PrimaryButton';
import SocialLoginButtons from './SocialLoginButtons';
import useAuth from '../hooks/useAuth';

export default function LoginForm() {
  const { setUser } = useAuth();
  const {
    email,
    password,
    error,
    loading,
    setEmail,
    setPassword,
    handleLogin,
  } = useLogin();

 const submitLogin = async () => {
  const response =
    await handleLogin();

  if (!response) {
    return;
  }

  setUser(response.user);

  router.replace('/(tabs)/home');
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome back 👋
      </Text>

      <Text style={styles.subtitle}>
        Sign in to continue to your account
      </Text>

      <FormField
        label="Email Address"
        icon="mail-outline"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <FormField
        label="Password"
        icon="lock-closed-outline"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />

      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}

      <TouchableOpacity
        style={styles.forgot}
        disabled={loading}
      >
        <Text style={styles.forgotText}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      <PrimaryButton
        title={
          loading
            ? 'Signing In...'
            : 'Sign In'
        }
        onPress={submitLogin}
        disabled={loading}
      />

      <View style={styles.divider}>
        <View style={styles.line} />

        <Text style={styles.dividerText}>
          or continue with
        </Text>

        <View style={styles.line} />
      </View>

      <SocialLoginButtons
        onGooglePress={() =>
          Alert.alert(
            'Google Sign In',
            'Google login will be connected later.'
          )
        }
        onFacebookPress={() =>
          Alert.alert(
            'Facebook Sign In',
            'Facebook login will be connected later.'
          )
        }
      />

      <View style={styles.registerRow}>
        <Text style={styles.normalText}>
          Don't have an account?{' '}
        </Text>

        <TouchableOpacity
          disabled={loading}
          onPress={() =>
            router.push('/(auth)/register')
          }
        >
          <Text style={styles.registerText}>
            Register now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingTop: 32,
    paddingBottom: 40,
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    color: Colors.text,
  },

  subtitle: {
    fontSize: 14,
    color: Colors.muted,
    marginTop: 6,
    marginBottom: 26,
  },

  error: {
    color: Colors.danger,
    fontSize: 12,
    fontWeight: '600',
    marginTop: -6,
    marginBottom: 12,
  },

  forgot: {
    alignSelf: 'flex-end',
    marginTop: -6,
    marginBottom: 22,
  },

  forgotText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },

  dividerText: {
    color: Colors.muted,
    fontSize: 12,
    marginHorizontal: 12,
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    flexWrap: 'wrap',
  },

  normalText: {
    fontSize: 13,
    color: Colors.muted,
  },

  registerText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
});