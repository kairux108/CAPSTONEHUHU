import { router } from 'expo-router';

import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import HomeHeader from '../../components/home/HomeHeader';
import UpcomingAppointmentCard from '../../components/home/UpcomingAppointmentCard';
import TodayMedicationsCard from '../../components/home/TodayMedicationsCard';
import QueueStatusCard from '../../components/home/QueueStatusCard';
import QuickActions from '../../components/home/QuickActions';

import { Colors } from '../../constants/colors';

import useAuth from '../../hooks/useAuth';
import useAppointments from '../../hooks/useAppointments';

export default function PatientHomeScreen() {
  const { user } = useAuth();

  const {
    upcomingAppointment,
    loading: appointmentLoading,
    error: appointmentError,
    refreshAppointments,
  } = useAppointments();

  const appointment =
    upcomingAppointment
      ? {
          id: upcomingAppointment.id,

          doctorName:
            upcomingAppointment.doctor
              ?.name ??
            'Doctor not assigned',

          appointmentType:
            upcomingAppointment
              .appointment_type,

          appointmentDate:
            upcomingAppointment
              .appointment_date,

          appointmentTime:
            upcomingAppointment
              .appointment_time,

          status:
            upcomingAppointment.status,
        }
      : null;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        <HomeHeader
          patientName={
            user?.name ?? 'Patient'
          }
          onNotificationPress={() => {
            // Notifications screen later.
          }}
          onProfilePress={() =>
            router.push(
              '/(tabs)/profile'
            )
          }
        />

        <View style={styles.body}>
          <UpcomingAppointmentCard
            appointment={appointment}
            loading={
              appointmentLoading
            }
            error={
              appointmentError
            }
            onRetry={
              refreshAppointments
            }
            onBookPress={() =>
              router.push(
                '/(tabs)/book'
              )
            }
          />

          <QueueStatusCard
            queue={null}
            onPress={() => {
              // Queue tracker later.
            }}
          />

          <TodayMedicationsCard
            medications={[]}
            onSeeAllPress={() =>
              router.push(
                '/(tabs)/medicine'
              )
            }
          />

          <QuickActions
            onBookPress={() =>
              router.push(
                '/(tabs)/book'
              )
            }
            onPrescriptionsPress={() =>
              router.push(
                '/(tabs)/medicine'
              )
            }
            onRecordsPress={() =>
              router.push(
                '/(tabs)/records'
              )
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.background,
  },

  content: {
    paddingBottom: 105,
  },

  body: {
    paddingHorizontal: 20,
  },
});