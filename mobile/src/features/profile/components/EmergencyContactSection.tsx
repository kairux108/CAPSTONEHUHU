import { StyleSheet, Text } from 'react-native';

import CuraCard from '../../../components/common/CuraCard';
import { Colors } from '../../../constants/colors';
import type {
  PatientProfile,
  ProfileFieldErrors,
  ProfileFormValues,
} from '../types/profile.types';
import ProfileField from './ProfileField';
import ProfileFormInput from './ProfileFormInput';

type Props =
  | {
      mode: 'view';
      patient: PatientProfile;
    }
  | {
      mode: 'edit';
      form: ProfileFormValues;
      errors: ProfileFieldErrors;
      onChange: <Field extends keyof ProfileFormValues>(
        field: Field,
        value: ProfileFormValues[Field]
      ) => void;
    };

export default function EmergencyContactSection(props: Props) {
  if (props.mode === 'view') {
    const { patient } = props;

    return (
      <CuraCard style={styles.card}>
        <Text style={styles.viewTitle}>Emergency Contact</Text>
        <ProfileField
          icon="person-circle-outline"
          label="Name"
          value={patient.emergency_contact_name || 'Not provided'}
        />
        <ProfileField
          icon="call-outline"
          label="Contact Number"
          value={patient.emergency_contact_number || 'Not provided'}
        />
      </CuraCard>
    );
  }

  const { form, errors, onChange } = props;

  return (
    <CuraCard style={styles.card}>
      <Text style={styles.title}>Emergency Contact</Text>
      <ProfileFormInput
        label="Contact Name"
        value={form.emergency_contact_name}
        error={errors.emergency_contact_name}
        onChangeText={value =>
          onChange('emergency_contact_name', value)
        }
      />
      <ProfileFormInput
        label="Contact Number"
        value={form.emergency_contact_number}
        error={errors.emergency_contact_number}
        keyboardType="phone-pad"
        onChangeText={value =>
          onChange('emergency_contact_number', value)
        }
      />
    </CuraCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 16,
  },

  title: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 10,
  },

  viewTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
});
