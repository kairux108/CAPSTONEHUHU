import {
  ScrollView,
  StyleSheet,
} from 'react-native';

import type { PatientProfile } from '../types/profile.types';
import AddressSection from './AddressSection';
import EmergencyContactSection from './EmergencyContactSection';
import PersonalInfoSection from './PersonalInfoSection';

type Props = {
  patient: PatientProfile;
};

export default function ProfileInfo({ patient }: Props) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <PersonalInfoSection mode="view" patient={patient} />
      <AddressSection mode="view" patient={patient} />
      <EmergencyContactSection mode="view" patient={patient} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 110,
  },
});
