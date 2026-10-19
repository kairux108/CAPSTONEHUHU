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

export default function AddressSection(props: Props) {
  if (props.mode === 'view') {
    const { patient } = props;

    return (
      <CuraCard style={styles.card}>
        <Text style={styles.viewTitle}>Address</Text>
        <ProfileField
          icon="location-outline"
          label="Address"
          value={patient.address || 'Not provided'}
        />
        <ProfileField
          icon="business-outline"
          label="City"
          value={patient.city || 'Not provided'}
        />
        <ProfileField
          icon="map-outline"
          label="Province"
          value={patient.province || 'Not provided'}
        />
      </CuraCard>
    );
  }

  const { form, errors, onChange } = props;

  return (
    <CuraCard style={styles.card}>
      <Text style={styles.title}>Address</Text>
      <ProfileFormInput
        label="Address"
        value={form.address}
        error={errors.address}
        multiline
        onChangeText={value => onChange('address', value)}
      />
      <ProfileFormInput
        label="City"
        value={form.city}
        error={errors.city}
        onChangeText={value => onChange('city', value)}
      />
      <ProfileFormInput
        label="Province"
        value={form.province}
        error={errors.province}
        onChangeText={value => onChange('province', value)}
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
