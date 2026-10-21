import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '../../../constants/colors';

type Props = {
  onGooglePress: () => void;
  onFacebookPress: () => void;
};

export default function SocialLoginButtons({
  onGooglePress,
  onFacebookPress,
}: Props) {
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.button}
        onPress={onGooglePress}
      >
        <Text style={styles.google}>G</Text>
        <Text style={styles.text}>Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={onFacebookPress}
      >
        <Ionicons
          name="logo-facebook"
          size={21}
          color="#1877F2"
        />

        <Text style={styles.text}>Facebook</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },

  button: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  google: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4285F4',
  },

  text: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
});