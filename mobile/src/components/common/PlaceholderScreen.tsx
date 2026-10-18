import { Ionicons } from '@expo/vector-icons';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '../../constants/colors';

type Props = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export default function PlaceholderScreen({
  title,
  description,
  icon,
}: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Ionicons
            name={icon}
            size={30}
            color={Colors.primary}
          />
        </View>

        <Text style={styles.title}>
          {title}
        </Text>

        <Text style={styles.description}>
          {description}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 80,
  },

  iconBox: {
    width: 66,
    height: 66,
    borderRadius: 22,

    backgroundColor: '#E1F7F3',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 18,
  },

  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },

  description: {
    fontSize: 13.5,
    lineHeight: 20,
    color: Colors.muted,
    textAlign: 'center',
    marginTop: 7,
  },
});