import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StarViewWithGestures from './screens/StarViewWithGestures';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <StarViewWithGestures />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  canvas:{
    flex:1,
  },
});
