
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';

import type { PatientProfile } from '../types/profile.types';

import PersonalInfoSection from './PersonalInfoSection';
import AddressSection from './AddressSection';
import EmergencyContactSection from './EmergencyContactSection';

type Props = {
  patient: PatientProfile;
  onLogout: () => void;
  signingOut: boolean;
};

export default function ProfileInfo({
  patient,
  onLogout,
  signingOut,
}: Props) {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <PersonalInfoSection
        mode="view"
        patient={patient}
      />

      <AddressSection
        mode="view"
        patient={patient}
      />

      <EmergencyContactSection
        mode="view"
        patient={patient}
      />

      {/* Log Out directly below Emergency Contact */}
      <Pressable
        onPress={onLogout}
        disabled={signingOut}
        accessibilityRole="button"
        style={[
          styles.logoutButton,
          signingOut && styles.disabled,
        ]}
      >
        {signingOut ? (
          <ActivityIndicator color="#B42318" />
        ) : (
          <Text style={styles.logoutText}>
            Log Out
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingBottom: 130,
  },

  logoutButton: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 15,
    backgroundColor: '#FFF3F2',
    borderColor: '#F0C8C4',
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
  },

  logoutText: {
    color: '#B42318',
    fontWeight: '700',
    fontSize: 15,
  },

  disabled: {
    opacity: 0.5,
  },
});
