import { Ionicons } from '@expo/vector-icons';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '../../constants/colors';

type Props = {
  patientName: string;
  onNotificationPress: () => void;
  onProfilePress: () => void;
};

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  }

  if (hour < 18) {
    return 'Good afternoon';
  }

  return 'Good evening';
}

function getCurrentDate() {
  return new Intl.DateTimeFormat(
    'en-PH',
    {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }
  ).format(new Date());
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return 'P';
  }

  if (parts.length === 1) {
    return parts[0]
      .charAt(0)
      .toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

export default function HomeHeader({
  patientName,
  onNotificationPress,
  onProfilePress,
}: Props) {
  const displayName =
    patientName.trim() || 'Patient';

  return (
    <View style={styles.header}>
      <View style={styles.tealBlob} />
      <View style={styles.mintBlob} />
      <View style={styles.purpleBlob} />

      <View style={styles.content}>
        <View style={styles.greetingArea}>
          <Text style={styles.greeting}>
            {getGreeting()},
          </Text>

          <Text
            style={styles.patientName}
            numberOfLines={1}
          >
            {displayName} 👋
          </Text>

          <Text style={styles.date}>
            {getCurrentDate()}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.iconButton}
            onPress={onNotificationPress}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={Colors.primary}
            />

            <View style={styles.notificationDot} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.avatar}
            onPress={onProfilePress}
          >
            <Text style={styles.avatarText}>
              {getInitials(displayName)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 172,
    paddingHorizontal: 20,
    paddingTop: 34,
    paddingBottom: 24,

    backgroundColor: '#F4F8F7',

    overflow: 'hidden',

    borderBottomWidth: 1,
    borderBottomColor: '#E7EFEE',
  },

  tealBlob: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,

    backgroundColor:
      'rgba(61, 217, 196, 0.20)',

    top: -130,
    left: -55,
  },

  mintBlob: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,

    backgroundColor:
      'rgba(143, 240, 221, 0.17)',

    bottom: -150,
    left: 105,
  },

  purpleBlob: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,

    backgroundColor:
      'rgba(185, 169, 245, 0.18)',

    top: -105,
    right: -75,
  },

  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',

    zIndex: 1,
  },

  greetingArea: {
    flex: 1,
    paddingRight: 12,
  },

  greeting: {
    fontSize: 13.5,
    color: '#4B5A57',
  },

  patientName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,

    marginTop: 3,
  },

  date: {
    fontSize: 12,
    color: '#4B5A57',

    marginTop: 9,
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,

    backgroundColor: Colors.white,

    alignItems: 'center',
    justifyContent: 'center',

    shadowColor:
      'rgba(11, 110, 98, 0.18)',

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 1,
    shadowRadius: 6,

    elevation: 3,
  },

  notificationDot: {
    position: 'absolute',
    top: 7,
    right: 7,

    width: 8,
    height: 8,
    borderRadius: 4,

    backgroundColor: '#F87171',

    borderWidth: 1.5,
    borderColor: Colors.white,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,

    backgroundColor: Colors.white,

    alignItems: 'center',
    justifyContent: 'center',

    shadowColor:
      'rgba(11, 110, 98, 0.18)',

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 1,
    shadowRadius: 6,

    elevation: 3,
  },

  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
});