import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { Ionicons } from '@expo/vector-icons';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  useEffect,
  useState,
} from 'react';

import CuraCard from '../common/CuraCard';
import { Colors } from '../../constants/colors';

import {
  PatientProfile,
  UpdatePatientProfileData,
} from '../../types/patientProfile';

import {
  formatDate,
  formatLongDate,
} from '../../utils/dateUtils';

type EditForm = {
  first_name: string;
  middle_name: string;
  last_name: string;
  birth_date: string;

  sex: 'male' | 'female';

  phone_number: string;
  email: string;

  address: string;
  city: string;
  province: string;

  blood_type: string;

  emergency_contact_name: string;
  emergency_contact_number: string;
};

type SaveResult = {
  success: boolean;
  message: string;
};

type Props = {
  patient: PatientProfile;
  saving: boolean;

  onSave: (
    data: UpdatePatientProfileData
  ) => Promise<SaveResult>;

  onCancel: () => void;

  onSaved: () =>
    | void
    | Promise<void>;
};

function createForm(
  patient: PatientProfile
): EditForm {
  return {
    first_name:
      patient.first_name ?? '',

    middle_name:
      patient.middle_name ?? '',

    last_name:
      patient.last_name ?? '',

    birth_date:
      patient.birth_date ?? '',

    sex:
      patient.sex === 'female'
        ? 'female'
        : 'male',

    phone_number:
      patient.phone_number ?? '',

    email:
      patient.email ?? '',

    address:
      patient.address ?? '',

    city:
      patient.city ?? '',

    province:
      patient.province ?? '',

    blood_type:
      patient.blood_type ?? '',

    emergency_contact_name:
      patient.emergency_contact_name ?? '',

    emergency_contact_number:
      patient.emergency_contact_number ?? '',
  };
}

function getBirthDate(
  value: string
): Date {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})/
  );

  if (!match) {
    return new Date();
  }

  return new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3])
  );
}

export default function EditProfileForm({
  patient,
  saving,
  onSave,
  onCancel,
  onSaved,
}: Props) {
  const [form, setForm] =
    useState<EditForm>(
      createForm(patient)
    );

  const [
    showDatePicker,
    setShowDatePicker,
  ] = useState(false);

  useEffect(() => {
    setForm(createForm(patient));
  }, [patient]);

  const updateField = (
    field: keyof EditForm,
    value: string
  ) => {
    setForm(current => ({
      ...current,
      [field]: value,
    }));
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    date?: Date
  ) => {
    setShowDatePicker(false);

    if (
      event.type === 'dismissed' ||
      !date
    ) {
      return;
    }

    updateField(
      'birth_date',
      formatDate(date)
    );
  };

  const handleSave = async () => {
    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.birth_date ||
      !form.phone_number.trim() ||
      !form.email.trim()
    ) {
      Alert.alert(
        'Missing Information',
        'Please complete all required fields.'
      );

      return;
    }

    const result = await onSave({
      first_name:
        form.first_name.trim(),

      middle_name:
        form.middle_name.trim() ||
        null,

      last_name:
        form.last_name.trim(),

      birth_date:
        formatDate(
          getBirthDate(
            form.birth_date
          )
        ),

      sex: form.sex,

      phone_number:
        form.phone_number.trim(),

      email:
        form.email.trim(),

      address:
        form.address.trim() ||
        null,

      city:
        form.city.trim() ||
        null,

      province:
        form.province.trim() ||
        null,

      blood_type:
        form.blood_type.trim() ||
        null,

      emergency_contact_name:
        form.emergency_contact_name
          .trim() || null,

      emergency_contact_number:
        form.emergency_contact_number
          .trim() || null,
    });

    if (!result.success) {
      Alert.alert(
        'Unable to Save',
        result.message
      );

      return;
    }

    await onSaved();

    Alert.alert(
      'Profile Updated',
      'Your information has been saved successfully.'
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={
        styles.content
      }
    >
      <CuraCard style={styles.card}>
        <Text style={styles.title}>
          Personal Information
        </Text>

        <EditField
          label="First Name *"
          value={form.first_name}
          onChangeText={value =>
            updateField(
              'first_name',
              value
            )
          }
        />

        <EditField
          label="Middle Name"
          value={form.middle_name}
          onChangeText={value =>
            updateField(
              'middle_name',
              value
            )
          }
        />

        <EditField
          label="Last Name *"
          value={form.last_name}
          onChangeText={value =>
            updateField(
              'last_name',
              value
            )
          }
        />

        <Text style={styles.label}>
          Birth Date *
        </Text>

        <Pressable
          style={styles.dateInput}
          onPress={() =>
            setShowDatePicker(true)
          }
        >
          <Ionicons
            name="calendar-outline"
            size={18}
            color={Colors.primary}
          />

          <Text style={styles.dateText}>
            {formatLongDate(
              form.birth_date
            )}
          </Text>
        </Pressable>

        {showDatePicker ? (
          <DateTimePicker
            value={getBirthDate(
              form.birth_date
            )}
            mode="date"
            maximumDate={new Date()}
            onChange={handleDateChange}
          />
        ) : null}

        <Text style={styles.label}>
          Sex *
        </Text>

        <View style={styles.sexRow}>
          <SexButton
            label="Male"
            active={
              form.sex === 'male'
            }
            onPress={() =>
              setForm(current => ({
                ...current,
                sex: 'male',
              }))
            }
          />

          <SexButton
            label="Female"
            active={
              form.sex === 'female'
            }
            onPress={() =>
              setForm(current => ({
                ...current,
                sex: 'female',
              }))
            }
          />
        </View>

        <EditField
          label="Phone Number *"
          value={form.phone_number}
          keyboardType="phone-pad"
          onChangeText={value =>
            updateField(
              'phone_number',
              value
            )
          }
        />

        <EditField
          label="Email *"
          value={form.email}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={value =>
            updateField(
              'email',
              value
            )
          }
        />

        <EditField
          label="Blood Type"
          value={form.blood_type}
          autoCapitalize="characters"
          onChangeText={value =>
            updateField(
              'blood_type',
              value
            )
          }
        />
      </CuraCard>

      <CuraCard style={styles.card}>
        <Text style={styles.title}>
          Address
        </Text>

        <EditField
          label="Address"
          value={form.address}
          multiline
          onChangeText={value =>
            updateField(
              'address',
              value
            )
          }
        />

        <EditField
          label="City"
          value={form.city}
          onChangeText={value =>
            updateField(
              'city',
              value
            )
          }
        />

        <EditField
          label="Province"
          value={form.province}
          onChangeText={value =>
            updateField(
              'province',
              value
            )
          }
        />
      </CuraCard>

      <CuraCard style={styles.card}>
        <Text style={styles.title}>
          Emergency Contact
        </Text>

        <EditField
          label="Contact Name"
          value={
            form.emergency_contact_name
          }
          onChangeText={value =>
            updateField(
              'emergency_contact_name',
              value
            )
          }
        />

        <EditField
          label="Contact Number"
          value={
            form.emergency_contact_number
          }
          keyboardType="phone-pad"
          onChangeText={value =>
            updateField(
              'emergency_contact_number',
              value
            )
          }
        />
      </CuraCard>

      <View style={styles.actions}>
        <Pressable
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={saving}
        >
          <Text style={styles.cancelText}>
            Cancel
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.saveButton,
            saving &&
              styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator
              size="small"
              color={Colors.white}
            />
          ) : (
            <>
              <Ionicons
                name="checkmark-outline"
                size={18}
                color={Colors.white}
              />

              <Text style={styles.saveText}>
                Save Changes
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

type EditFieldProps = {
  label: string;
  value: string;

  onChangeText: (
    value: string
  ) => void;

  keyboardType?:
    | 'default'
    | 'email-address'
    | 'phone-pad';

  autoCapitalize?:
    | 'none'
    | 'sentences'
    | 'words'
    | 'characters';

  multiline?: boolean;
};

function EditField({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'words',
  multiline = false,
}: EditFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        style={[
          styles.input,
          multiline &&
            styles.multiline,
        ]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        textAlignVertical={
          multiline
            ? 'top'
            : 'center'
        }
      />
    </View>
  );
}

type SexButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function SexButton({
  label,
  active,
  onPress,
}: SexButtonProps) {
  return (
    <Pressable
      style={[
        styles.sexButton,
        active &&
          styles.sexButtonActive,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.sexText,
          active &&
            styles.sexTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 110,
  },

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

  field: {
    marginBottom: 14,
  },

  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.muted,
    marginBottom: 6,
  },

  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 13,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.white,
  },

  multiline: {
    minHeight: 85,
    paddingTop: 12,
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

  dateText: {
    fontSize: 14,
    color: Colors.text,
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

  actions: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 18,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },

  cancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },

  saveButton: {
    flex: 1.5,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  saveText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.white,
  },

  disabledButton: {
    opacity: 0.6,
  },
});