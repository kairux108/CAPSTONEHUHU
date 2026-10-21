import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useState } from 'react';

import EditProfileForm from '../components/EditProfileForm';
import ProfileHeader from '../components/ProfileHeader';
import ProfileInfo from '../components/ProfileInfo';

import { Colors } from '../../../constants/colors';

import useAuth from '../../auth/hooks/useAuth';
import usePatient from '../hooks/usePatient';

export default function ProfileScreen() {
  const {
    patient,
    loading,
    saving,
    error,
    savePatient,
  } = usePatient();

  const { refreshUser } = useAuth();

  const [editing, setEditing] =
    useState(false);

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

  if (!patient) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          {error ??
            'Patient profile not found.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileHeader
        patient={patient}
        editing={editing}
        onEdit={() =>
          setEditing(true)
        }
      />

      {editing ? (
        <EditProfileForm
          patient={patient}
          saving={saving}
          onSave={savePatient}
          onCancel={() =>
            setEditing(false)
          }
          onSaved={async () => {
            await refreshUser();
            setEditing(false);
          }}
        />
      ) : (
        <ProfileInfo
          patient={patient}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.background,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      Colors.background,
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