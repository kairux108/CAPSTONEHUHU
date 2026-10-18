import { Ionicons } from '@expo/vector-icons';

import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '../../constants/colors';
import SectionHeader from '../common/SectionHeader';

type Props = {
  onBookPress: () => void;
  onPrescriptionsPress: () => void;
  onRecordsPress: () => void;
};

type QuickActionProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBackground: string;
  onPress: () => void;
};

function QuickActionCard({
  label,
  icon,
  iconColor,
  iconBackground,
  onPress,
}: QuickActionProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      style={styles.card}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor:
              iconBackground,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={23}
          color={iconColor}
        />
      </View>

      <Text style={styles.label}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function QuickActions({
  onBookPress,
  onPrescriptionsPress,
  onRecordsPress,
}: Props) {
  return (
    <View>
      <SectionHeader title="Quick Actions" />

      <View style={styles.grid}>
        <QuickActionCard
          label="Book Appointment"
          icon="calendar-outline"
          iconColor={Colors.success}
          iconBackground={
            Colors.successBackground
          }
          onPress={onBookPress}
        />

        <QuickActionCard
          label="Chat with Clinic"
          icon="chatbubble-ellipses-outline"
          iconColor="#2563EB"
          iconBackground="#DBEAFE"
          onPress={() => {
            Alert.alert(
              'Chat with Clinic',
              'Clinic messaging will be available here later.'
            );
          }}
        />

        <QuickActionCard
          label="Prescriptions"
          icon="medkit-outline"
          iconColor={Colors.purple}
          iconBackground={
            Colors.purpleBackground
          }
          onPress={
            onPrescriptionsPress
          }
        />

        <QuickActionCard
          label="Medical Records"
          icon="document-text-outline"
          iconColor={Colors.warning}
          iconBackground={
            Colors.warningBackground
          }
          onPress={onRecordsPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  card: {
    width: '48%',

    minHeight: 112,

    backgroundColor:
      'rgba(255,255,255,0.82)',

    borderRadius: 16,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 10,
    paddingVertical: 18,

    shadowColor:
      'rgba(11,110,98,0.08)',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 1,
    shadowRadius: 7,

    elevation: 2,
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 10,
  },

  label: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
});