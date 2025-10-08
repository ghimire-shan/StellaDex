import React from "react";
import { View, Text, StyleSheet } from 'react-native';

interface CompassOverlayProps {
    rotationY: number;
}

const CompassOverlay: React.FC<CompassOverlayProps> = ({rotationY}) => {
    // Convert radians to degrees and invert (compass rotates opposite to the camera)
    const rotationDegrees = (-rotationY * (180/ Math.PI));

    return (
        <View style={styles.container}>
            <View
                style = {[
                    styles.compassCircle,
                    {transform: [{rotate: `${rotationDegrees}deg`}]}
                ]}
            >
                {/* North */}
                <Text style= {[styles.direction, styles.north]}>N</Text>

                {/* East */}
                <Text style= {[styles.direction, styles.east]}>E</Text>

                {/* West */}
                <Text style= {[styles.direction, styles.west]}>W</Text>

                {/* South */}
                <Text style= {[styles.direction, styles.south]}>S</Text>

                {/* Compass center indicator/ Needle */}
                <View style={styles.compassNeedle}></View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        zIndex: 10,
    },
    compassCircle: {
        width: 90,
        height: 90,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',

    },
    direction : {
        position: 'absolute',
        fontSize: 14,
        fontWeight: 'semibold',
        color: 'rgba(255, 255, 255, 0.6)',
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
    compassNeedle: {
        height: 0,
        width: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#ff4444',
        transform: [{rotate: '180deg'}],
    },
});

export default CompassOverlay;