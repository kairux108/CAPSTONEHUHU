import {
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';

import CuraCard from '../common/CuraCard';
import { Colors } from '../../constants/colors';
import { PatientProfile } from '../../types/patientProfile';
import { formatLongDate } from '../../utils/dateUtils';

import ProfileField from './ProfileField';

type Props = {
  patient: PatientProfile;
};

export default function ProfileInfo({
  patient,
}: Props) {
  const sex = patient.sex
    ? patient.sex.charAt(0).toUpperCase() +
      patient.sex.slice(1)
    : 'Not provided';

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <CuraCard style={styles.card}>
        <Text style={styles.title}>
          Personal Information
        </Text>

        <ProfileField
          icon="calendar-outline"
          label="Birth Date"
          value={formatLongDate(
            patient.birth_date
          )}
        />

        <ProfileField
          icon="person-outline"
          label="Sex"
          value={sex}
        />

        <ProfileField
          icon="call-outline"
          label="Phone"
          value={
            patient.phone_number ||
            'Not provided'
          }
        />

        <ProfileField
          icon="mail-outline"
          label="Email"
          value={
            patient.email ||
            'Not provided'
          }
        />

        <ProfileField
          icon="water-outline"
          label="Blood Type"
          value={
            patient.blood_type ||
            'Not provided'
          }
        />
      </CuraCard>

      <CuraCard style={styles.card}>
        <Text style={styles.title}>
          Address
        </Text>

        <ProfileField
          icon="location-outline"
          label="Address"
          value={
            patient.address ||
            'Not provided'
          }
        />

        <ProfileField
          icon="business-outline"
          label="City"
          value={
            patient.city ||
            'Not provided'
          }
        />

        <ProfileField
          icon="map-outline"
          label="Province"
          value={
            patient.province ||
            'Not provided'
          }
        />
      </CuraCard>

      <CuraCard style={styles.card}>
        <Text style={styles.title}>
          Emergency Contact
        </Text>

        <ProfileField
          icon="person-circle-outline"
          label="Name"
          value={
            patient.emergency_contact_name ||
            'Not provided'
          }
        />

        <ProfileField
          icon="call-outline"
          label="Contact Number"
          value={
            patient.emergency_contact_number ||
            'Not provided'
          }
        />
      </CuraCard>
    </ScrollView>
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
    marginBottom: 8,
  },
});