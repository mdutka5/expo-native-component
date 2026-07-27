import { ContentTransitionTextView } from 'content-transition-text';
import { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';

export default function App() {
  const [value, setValue] = useState(39);

  return (
    <View style={styles.container}>
      <ContentTransitionTextView value={value} style={{ width: 400, height: 80 }} />
      <Button title="Increment" onPress={() => setValue(value + 11.11)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
