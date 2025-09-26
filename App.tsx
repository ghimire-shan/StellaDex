import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import StarField from './components/StarField';
import { PerspectiveCamera } from 'three';

export default function App() {
  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <perspectiveCamera
          position={[0,0,2]}
          fov={75}
          near={0.1}
          far={2000}
        />
        {/* To give the black background */}
        <color attach="background" args={['black']} />
        {/* To attach the Star Field */}
        <StarField starCount={1000} radius={1000} />
        
      </Canvas>
    </View>
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
