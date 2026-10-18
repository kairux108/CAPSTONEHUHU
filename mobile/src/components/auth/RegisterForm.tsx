import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '../../constants/colors';
import useRegister from '../../hooks/useRegister';

import FormField from '../common/FormField';
import PrimaryButton from '../common/PrimaryButton';

import DateOfBirthField from './DateOfBirthField';
import SexSelector from './SexSelector';
import SocialLoginButtons from './SocialLoginButtons';

export default function RegisterForm() {
  const {
    firstName,
    middleName,
    lastName,
    birthDate,
    age,
    sex,
    phone,
    email,
    password,
    acceptedTerms,
    error,
loading,

    setFirstName,
    setMiddleName,
    setLastName,
    setBirthDate,
    setSex,
    setPhone,
    setEmail,
    setPassword,
    setAcceptedTerms,

    handleRegister,
  } = useRegister();

 const submitRegister = async () => {
  const response = await handleRegister();

  if (!response) {
    return;
  }

  Alert.alert(
    'Account Created',
    `Your CURA account was created successfully.\n\nPatient ID: ${response.patient.patient_number}`,
    [
      {
        text: 'Sign In',
        onPress: () =>
          router.replace('/(auth)/login'),
      },
    ]
  );
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Create Account ✨
      </Text>

      <Text style={styles.subtitle}>
        Enter your basic information to get started
      </Text>

      <FormField
        label="First Name"
        icon="person-outline"
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First name"
      />

      <FormField
        label="Middle Name (Optional)"
        icon="person-outline"
        value={middleName}
        onChangeText={setMiddleName}
        placeholder="Middle name"
      />

      <FormField
        label="Last Name"
        icon="person-outline"
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last name"
      />

      <DateOfBirthField
        value={birthDate}
        onChange={setBirthDate}
      />

      {age !== null && (
        <View style={styles.ageBox}>
          <Text style={styles.ageLabel}>
            Age
          </Text>

          <Text style={styles.ageValue}>
            {age} years old
          </Text>
        </View>
      )}

      <SexSelector
        value={sex}
        onChange={setSex}
      />

      <FormField
        label="Phone Number"
        icon="phone-portrait-outline"
        value={phone}
        onChangeText={setPhone}
        placeholder="+63 900 000 0000"
        keyboardType="phone-pad"
      />

      <FormField
        label="Email Address"
        icon="mail-outline"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
      />

      <FormField
        label="Password"
        icon="lock-closed-outline"
        value={password}
        onChangeText={setPassword}
        placeholder="Create a password"
        secureTextEntry
      />

      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}

      <TouchableOpacity
        style={styles.termsRow}
        activeOpacity={0.8}
        onPress={() =>
          setAcceptedTerms(
            !acceptedTerms
          )
        }
      >
        <View
          style={[
            styles.checkbox,
            acceptedTerms &&
              styles.checkboxChecked,
          ]}
        >
          {acceptedTerms && (
            <Ionicons
              name="checkmark"
              size={14}
              color={Colors.white}
            />
          )}
        </View>

        <Text style={styles.termsText}>
          I agree to CURA's Terms of Service and Privacy Policy
        </Text>
      </TouchableOpacity>

      <PrimaryButton
  title={
    loading
      ? 'Creating Account...'
      : 'Create Account'
  }
  onPress={submitRegister}
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
            'Google Sign Up',
            'Google registration will be connected later.'
          )
        }
        onFacebookPress={() =>
          Alert.alert(
            'Facebook Sign Up',
            'Facebook registration will be connected later.'
          )
        }
      />

      <View style={styles.signInRow}>
        <Text style={styles.normalText}>
          Already have an account?{' '}
        </Text>

        <TouchableOpacity
          onPress={() =>
            router.replace(
              '/(auth)/login'
            )
          }
        >
          <Text style={styles.signInText}>
            Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingTop: 28,
    paddingBottom: 45,
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

  ageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    backgroundColor: '#E1F7F3',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: -6,
    marginBottom: 18,
  },

  ageLabel: {
    fontSize: 12,
    color: Colors.muted,
  },

  ageValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },

  error: {
    color: Colors.danger,
    fontSize: 12,
    fontWeight: '600',
    marginTop: -5,
    marginBottom: 14,
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 22,
  },

  checkbox: {
    width: 19,
    height: 19,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: 10,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  termsText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    color: Colors.muted,
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
    fontSize: 12,
    color: Colors.muted,
    marginHorizontal: 12,
  },

  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 24,
  },

  normalText: {
    fontSize: 13,
    color: Colors.muted,
  },

  signInText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
});