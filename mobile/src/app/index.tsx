import { Redirect } from 'expo-router';

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

import { Colors } from '../constants/colors';
import useAuth from '../features/auth/hooks/useAuth';

export default function Index() {
  const {
    authenticated,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
        />
      </View>
    );
  }

  if (authenticated) {
    return (
      <Redirect href="/(tabs)/home" />
    );
  }

  return (
    <Redirect href="/(auth)/login" />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
});