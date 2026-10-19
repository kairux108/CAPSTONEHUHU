import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '../../constants/colors';
import { PatientProfile } from '../../types/patientProfile';

type Props = {
  patient: PatientProfile;
  editing: boolean;
  onEdit: () => void;
};

export default function ProfileHeader({
  patient,
  editing,
  onEdit,
}: Props) {
  const fullName = [
    patient.first_name,
    patient.middle_name,
    patient.last_name,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <View style={styles.header}>
      <View style={styles.top}>
        <View />

        {!editing ? (
          <Pressable
            style={styles.editButton}
            onPress={onEdit}
          >
            <Ionicons
              name="create-outline"
              size={17}
              color={Colors.white}
            />

            <Text style={styles.editText}>
              Edit
            </Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.avatar}>
        <Ionicons
          name="person-outline"
          size={36}
          color={Colors.primary}
        />
      </View>

      <Text style={styles.name}>
        {fullName}
      </Text>

      <Text style={styles.patientNumber}>
        {patient.patient_number}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    paddingTop: 46,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },

  top: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  editText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  name: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
  },

  patientNumber: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.white,
    opacity: 0.85,
  },
});