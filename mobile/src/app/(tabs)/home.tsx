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
import { Colors } from '../../constants/colors';
import useAuth from '../../hooks/useAuth';
import QuickActions from '../../components/home/QuickActions';
export default function PatientHomeScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HomeHeader
          patientName={
            user?.name ?? 'Patient'
          }
          onNotificationPress={() => {
            // Notifications screen comes later.
          }}
          onProfilePress={() =>
            router.push('/(tabs)/profile')
          }
        />

        <View style={styles.body}>
          <UpcomingAppointmentCard
            appointment={null}
            onBookPress={() =>
              router.push('/(tabs)/book')
            }
          />

          {/* Queue comes next */}
<QueueStatusCard
  queue={null}
  onPress={() => {
    // Queue tracker screen will be connected later.
  }}
/>
          {/* Medicines come next */}
<TodayMedicationsCard
  medications={[]}
  onSeeAllPress={() =>
    router.push('/(tabs)/medicine')
  }
/>
          {/* Quick Actions come next */}
          <QuickActions
  onBookPress={() =>
    router.push('/(tabs)/book')
  }
  onPrescriptionsPress={() =>
    router.push('/(tabs)/medicine')
  }
  onRecordsPress={() =>
    router.push('/(tabs)/records')
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
    backgroundColor: Colors.background,
  },

  content: {
    paddingBottom: 105,
  },

  body: {
    paddingHorizontal: 20,
  },
});