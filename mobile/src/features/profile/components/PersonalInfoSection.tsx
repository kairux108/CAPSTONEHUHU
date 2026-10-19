import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useState } from 'react';

import CuraCard from '../../../components/common/CuraCard';
import { Colors } from '../../../constants/colors';
import { formatDate, formatLongDate } from '../../../utils/dateUtils';
import type {
  PatientProfile,
  ProfileFieldErrors,
  ProfileFormValues,
} from '../types/profile.types';
import ProfileField from './ProfileField';
import ProfileFormInput from './ProfileFormInput';

function formatPatientBirthDate(value: string | null | undefined) {
  if (!value) {
    return 'Not provided';
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);

  if (!match) {
    return value;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return value;
  }

  return formatLongDate(value);
}

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

function getPickerDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);

  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return date;
    }
  }

  return new Date();
}

export default function PersonalInfoSection(props: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  if (props.mode === 'view') {
    const { patient } = props;
    const sex = patient.sex
      ? patient.sex.charAt(0).toUpperCase() + patient.sex.slice(1)
      : 'Not provided';

    return (
      <CuraCard style={styles.card}>
        <Text style={styles.viewTitle}>Personal Information</Text>
        <ProfileField
          icon="calendar-outline"
          label="Birth Date"
          value={formatPatientBirthDate(patient.birth_date)}
        />
        <ProfileField icon="person-outline" label="Sex" value={sex} />
        <ProfileField
          icon="call-outline"
          label="Phone"
          value={patient.phone_number || 'Not provided'}
        />
        <ProfileField
          icon="mail-outline"
          label="Email"
          value={patient.email || 'Not provided'}
        />
        <ProfileField
          icon="water-outline"
          label="Blood Type"
          value={patient.blood_type || 'Not provided'}
        />
      </CuraCard>
    );
  }
  const { form, errors, onChange } = props;

  const handleDateChange = (
    event: DateTimePickerEvent,
    date?: Date
  ) => {
    setShowDatePicker(false);

    if (event.type !== 'set' || !date) {
      return;
    }

    onChange('birth_date', formatDate(date));
  };

  return (
    <CuraCard style={styles.card}>
      <Text style={styles.title}>Personal Information</Text>
      <ProfileFormInput
        label="First Name *"
        value={form.first_name}
        error={errors.first_name}
        onChangeText={value => onChange('first_name', value)}
      />
      <ProfileFormInput
        label="Middle Name"
        value={form.middle_name}
        error={errors.middle_name}
        onChangeText={value => onChange('middle_name', value)}
      />
      <ProfileFormInput
        label="Last Name *"
        value={form.last_name}
        error={errors.last_name}
        onChangeText={value => onChange('last_name', value)}
      />

      <Text style={styles.label}>Birth Date *</Text>
      <Pressable
        style={[styles.dateInput, errors.birth_date && styles.dateInputError]}
        onPress={() => setShowDatePicker(true)}
        accessibilityRole="button"
        accessibilityLabel="Choose birth date"
        accessibilityHint={errors.birth_date}
      >
        <Ionicons
          name="calendar-outline"
          size={18}
          color={Colors.primary}
        />
        <Text style={styles.dateText}>
          {formatPatientBirthDate(form.birth_date)}
        </Text>
      </Pressable>
      {errors.birth_date ? (
        <Text style={styles.fieldError}>{errors.birth_date}</Text>
      ) : null}
      {showDatePicker ? (
        <DateTimePicker
          value={getPickerDate(form.birth_date)}
          mode="date"
          maximumDate={new Date()}
          onChange={handleDateChange}
        />
      ) : null}

      <Text style={styles.label}>Sex *</Text>
      <View style={styles.sexRow}>
        <SexButton
          label="Male"
          active={form.sex === 'male'}
          onPress={() => onChange('sex', 'male')}
        />
        <SexButton
          label="Female"
          active={form.sex === 'female'}
          onPress={() => onChange('sex', 'female')}
        />
      </View>
      {errors.sex ? (
        <Text style={styles.fieldError}>{errors.sex}</Text>
      ) : null}

      <ProfileFormInput
        label="Phone Number *"
        value={form.phone_number}
        error={errors.phone_number}
        keyboardType="phone-pad"
        onChangeText={value => onChange('phone_number', value)}
      />
      <ProfileFormInput
        label="Email *"
        value={form.email}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={value => onChange('email', value)}
      />
      <ProfileFormInput
        label="Blood Type"
        value={form.blood_type}
        error={errors.blood_type}
        autoCapitalize="characters"
        onChangeText={value => onChange('blood_type', value)}
      />
    </CuraCard>
  );
}

type SexButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function SexButton({ label, active, onPress }: SexButtonProps) {
  return (
    <Pressable
      style={[styles.sexButton, active && styles.sexButtonActive]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.sexText, active && styles.sexTextActive]}>
        {label}
      </Text>
    </Pressable>
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

  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.muted,
    marginBottom: 6,
  },

  dateInput: {
    height: 46,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.white,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 14,
  },

  dateInputError: {
    borderColor: Colors.danger,
  },

  dateText: {
    fontSize: 14,
    color: Colors.text,
  },

  fieldError: {
    color: Colors.danger,
    fontSize: 11,
    marginTop: -9,
    marginBottom: 14,
  },

  sexRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },

  sexButton: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },

  sexButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: '#E1F7F3',
  },

  sexText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.muted,
  },

  sexTextActive: {
    color: Colors.primary,
  },
});
