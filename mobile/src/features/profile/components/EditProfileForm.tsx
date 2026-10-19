import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '../../../constants/colors';
import type {
  PatientProfile,
  ProfileSaveResult,
  UpdatePatientProfileData,
} from '../types/profile.types';
import useProfileForm from '../hooks/useProfileForm';
import AddressSection from './AddressSection';
import EmergencyContactSection from './EmergencyContactSection';
import PersonalInfoSection from './PersonalInfoSection';

type Props = {
  patient: PatientProfile;
  saving: boolean;
  onSave: (
    data: UpdatePatientProfileData
  ) => Promise<ProfileSaveResult>;
  onCancel: () => void;
  onSaved: () => void | Promise<void>;
};

export default function EditProfileForm({
  patient,
  saving,
  onSave,
  onCancel,
  onSaved,
}: Props) {
  const {
    form,
    errors,
    updateField,
    submit,
  } = useProfileForm({ patient, onSave, onSaved });

  const handleSave = async () => {
    try {
      const result = await submit();

      if (!result) {
        Alert.alert(
          'Check Your Information',
          'Please correct the highlighted fields.'
        );
        return;
      }

      if (!result.success) {
        Alert.alert('Unable to Save', result.message);
        return;
      }

      Alert.alert(
        'Profile Updated',
        'Your information has been saved successfully.'
      );
    } catch {
      Alert.alert(
        'Unable to Complete',
        'Your profile could not be confirmed as saved. Your entered information is still available; please try again.'
      );
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
    >
      <PersonalInfoSection
        mode="edit"
        form={form}
        errors={errors}
        onChange={updateField}
      />

      <AddressSection
        mode="edit"
        form={form}
        errors={errors}
        onChange={updateField}
      />
      <EmergencyContactSection
        mode="edit"
        form={form}
        errors={errors}
        onChange={updateField}
      />

      <View style={styles.actions}>
        <Pressable
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={saving}
          accessibilityRole="button"
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>

        <Pressable
          style={[
            styles.saveButton,
            saving && styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={saving}
          accessibilityRole="button"
        >
          {saving ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Ionicons
                name="checkmark-outline"
                size={18}
                color={Colors.white}
              />
              <Text style={styles.saveText}>Save Changes</Text>
            </>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 110,
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
