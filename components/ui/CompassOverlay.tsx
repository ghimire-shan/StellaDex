import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import * as THREE from 'three';

interface CompassOverlayProps {
    quaternion: THREE.Quaternion;
}

const CompassOverlay: React.FC<CompassOverlayProps> = ({quaternion}) => {
    // Convert radians to degrees and invert (compass rotates opposite to the camera)
    const euler = new THREE.Euler().setFromQuaternion(quaternion, 'YXZ');
    const rotationY = euler.y; 

    const rotationDegrees = -(rotationY * (180 / Math.PI));

  return (
    <View style={styles.container}>
      <View style={styles.compassCircle}>
        {/* North */}
        <Text style={[styles.direction, styles.north]}>N</Text>

        {/* East */}
        <Text style={[styles.direction, styles.east]}>E</Text>

        {/* West */}
        <Text style={[styles.direction, styles.west]}>W</Text>

        {/* South */}
        <Text style={[styles.direction, styles.south]}>S</Text>

        <View
          style={[
            styles.needleContainer,
            { transform: [{ rotate: `${rotationDegrees}deg` }] },
          ]}
        >
          {/* Compass pointer that points North, */}
          <View style={[styles.northPointer]}></View>
          {/* Compass pointer that points North, */}
          <View style={[styles.southPointer]}></View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    zIndex: 10,
  },
  compassCircle: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  direction: {
    position: "absolute",
    fontSize: 14,
    fontWeight: "semibold",
    color: "rgba(255, 255, 255, 0.6)",
  },
  north: {
    top: 10,
  },
  east: {
    right: 10,
  },
  west: {
    left: 10,
  },
  south: {
    bottom: 10,
  },
  needleContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  northPointer: {
    position: "absolute",
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#ff4444",
  },
  southPointer: {
    position: "absolute",
    bottom: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#666666",
  },
});

export default CompassOverlay;
