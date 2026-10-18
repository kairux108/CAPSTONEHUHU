import {
  PropsWithChildren,
} from 'react';

import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { Colors } from '../../constants/colors';

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}>;

export default function CuraCard({
  children,
  style,
  onPress,
}: Props) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.card, style]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,

    borderWidth: 1,
    borderColor:
      'rgba(18, 23, 42, 0.10)',

    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 9,

    elevation: 3,
  },
});