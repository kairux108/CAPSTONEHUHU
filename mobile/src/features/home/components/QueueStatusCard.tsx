import { Ionicons } from '@expo/vector-icons';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '../../../constants/colors';

export type QueueStatusData = {
  position: number;
  estimatedWaitMinutes: number | null;
  patientsAhead: number | null;
  status: string;
};

type Props = {
  queue: QueueStatusData | null;
  onPress?: () => void;
};

export default function QueueStatusCard({
  queue,
  onPress,
}: Props) {
  if (!queue) {
    return null;
  }

  const waitText =
    queue.estimatedWaitMinutes !== null
      ? `Estimated wait ~${queue.estimatedWaitMinutes} min`
      : 'Waiting time updating';

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.positionCircle}>
        <Text style={styles.position}>
          {queue.position}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>
            Queue Position
          </Text>

          <View style={styles.liveDot} />
        </View>

        <Text style={styles.subtitle}>
          You're #{queue.position} · {waitText}
        </Text>

        {queue.patientsAhead !== null ? (
          <Text style={styles.aheadText}>
            {queue.patientsAhead === 0
              ? 'You are next in line'
              : `${queue.patientsAhead} ${
                  queue.patientsAhead === 1
                    ? 'patient'
                    : 'patients'
                } ahead of you`}
          </Text>
        ) : null}
      </View>

      <View style={styles.icon}>
        <Ionicons
          name="pulse-outline"
          size={27}
          color={Colors.white}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,

    minHeight: 82,

    borderRadius: 18,

    backgroundColor: Colors.primary,

    paddingHorizontal: 16,
    paddingVertical: 15,

    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: Colors.primaryDark,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.22,
    shadowRadius: 11,

    elevation: 5,
  },

  positionCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,

    backgroundColor: Colors.white,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 13,
  },

  position: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.primary,
  },

  content: {
    flex: 1,
    paddingRight: 8,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },

  subtitle: {
    fontSize: 11.5,
    lineHeight: 17,
    color: Colors.white,
    opacity: 0.92,

    marginTop: 3,
  },

  aheadText: {
    fontSize: 10.5,
    color: Colors.white,
    opacity: 0.78,

    marginTop: 2,
  },

  icon: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});