import { StyleSheet, Text, View } from 'react-native';

function MyPageScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>내 프로필</Text>
      <Text style={styles.screenDescription}>내 프로필 화면입니다</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  screenDescription: {
    fontSize: 16,
    color: '#666666',
  },
});

export default MyPageScreen;
