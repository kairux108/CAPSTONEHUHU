import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '../../constants/colors';

type Props = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export default function SectionHeader({
  title,
  actionLabel,
  onActionPress,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>

      {actionLabel && onActionPress ? (
        <TouchableOpacity
          onPress={onActionPress}
        >
          <Text style={styles.action}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: 22,
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },

  action: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
});