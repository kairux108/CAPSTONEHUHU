
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useState } from 'react';
import { useRouter } from 'expo-router';

import EditProfileForm from './EditProfileForm';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';

import { Colors } from '../../../constants/colors';

import useAuth from '../../auth/hooks/useAuth';
import usePatient from '../hooks/usePatient';

export default function ProfileScreen() {
  const router = useRouter();

  const {
    patient,
    loading,
    saving,
    error,
    savePatient,
  } = usePatient();

  const { refreshUser, logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    if (signingOut) return;

    setSigningOut(true);

    try {
      await logout();

      router.replace('/(auth)/login');
    } catch {
      setSigningOut(false);

      Alert.alert(
        'Logout Failed',
        'Unable to log out. Please try again.'
      );
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of CURA?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            void handleLogout();
          },
        },
      ]
    );
  };

  // Wait until patient data has loaded.
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
        />

        <Text style={styles.loading}>
          Loading your profile...
        </Text>
      </View>
    );
  }

  // Prevent undefined patient data from reaching ProfileInfo.
  if (!patient) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          {error ?? 'Patient profile not found.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileHeader
        patient={patient}
        editing={editing}
        onEdit={() => setEditing(true)}
      />

      {editing ? (
        <EditProfileForm
          patient={patient}
          saving={saving}
          onSave={savePatient}
          onCancel={() => setEditing(false)}
          onSaved={async () => {
            await refreshUser();
            setEditing(false);
          }}
        />
      ) : (
        <ProfileInfo
          patient={patient}
          onLogout={confirmLogout}
          signingOut={signingOut}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 30,
  },

  loading: {
    marginTop: 10,
    color: Colors.muted,
  },

  error: {
    color: Colors.muted,
    textAlign: 'center',
  },
});
