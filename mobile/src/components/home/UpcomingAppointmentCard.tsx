import { Ionicons } from '@expo/vector-icons';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '../../constants/colors';

import CuraCard from '../common/CuraCard';
import StatusPill from '../common/StatusPill';

export type UpcomingAppointment = {
  id: number;
  doctorName: string;
  specialty: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
};

type Props = {
  appointment: UpcomingAppointment | null;
  onPress?: () => void;
  onBookPress: () => void;
};

function getDoctorInitials(name: string) {
  const cleaned = name
    .replace(/^Dr\.?\s*/i, '')
    .trim();

  const parts = cleaned
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return 'DR';
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

export default function UpcomingAppointmentCard({
  appointment,
  onPress,
  onBookPress,
}: Props) {
  if (!appointment) {
    return (
      <CuraCard style={styles.emptyCard}>
        <View style={styles.emptyIcon}>
          <Ionicons
            name="calendar-outline"
            size={25}
            color={Colors.primary}
          />
        </View>

        <Text style={styles.emptyTitle}>
          No upcoming appointment
        </Text>

        <Text style={styles.emptyText}>
          Book an appointment when you need
          to visit the clinic.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.bookButton}
          onPress={onBookPress}
        >
          <Ionicons
            name="calendar-outline"
            size={17}
            color={Colors.white}
          />

          <Text style={styles.bookButtonText}>
            Book Appointment
          </Text>
        </TouchableOpacity>
      </CuraCard>
    );
  }

  return (
    <CuraCard
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <Text style={styles.label}>
          UPCOMING APPOINTMENT
        </Text>

        <StatusPill
          label={appointment.status}
          type="success"
          showCheck
        />
      </View>

      <View style={styles.doctorRow}>
        <View style={styles.doctorAvatar}>
          <Text style={styles.doctorInitials}>
            {getDoctorInitials(
              appointment.doctorName
            )}
          </Text>
        </View>

        <View style={styles.doctorInfo}>
          <Text
            style={styles.doctorName}
            numberOfLines={1}
          >
            {appointment.doctorName}
          </Text>

          <Text style={styles.specialty}>
            {appointment.specialty}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.metaRow}>
        <View style={styles.metaDetails}>
          <View style={styles.metaItem}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={Colors.muted}
            />

            <Text style={styles.metaText}>
              {appointment.appointmentDate}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons
              name="time-outline"
              size={16}
              color={Colors.muted}
            />

            <Text style={styles.metaText}>
              {appointment.appointmentTime}
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={Colors.muted}
        />
      </View>
    </CuraCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.primary,
  },

  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  doctorAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#D1E3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  doctorInitials: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E3FCB',
  },

  doctorInfo: {
    flex: 1,
  },

  doctorName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },

  specialty: {
    fontSize: 12.5,
    color: Colors.muted,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 14,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  metaDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    gap: 12,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },

  emptyCard: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 24,
  },

  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#E1F7F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },

  emptyText: {
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'center',
    color: Colors.muted,
    marginTop: 5,
    marginBottom: 16,
    paddingHorizontal: 20,
  },

  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    height: 42,
    borderRadius: 12,
  },

  bookButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
});