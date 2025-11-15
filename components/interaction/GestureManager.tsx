import React, {useRef, useState} from 'react';
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as THREE from 'three';

interface GestureManagerProps {
    children: React.ReactNode;
    onCameraUpdate: (quaternion: THREE.Quaternion) => void;
    initialQuaternion: THREE.Quaternion;
}

function calculateRotation(
    prevQuaternion: THREE.Quaternion,
    deltaX: number, 
    deltaY: number,
    sensitivity: number,
): THREE.Quaternion {
    /*
        Initially have already rotated the Celestial Sphere to match the current user's horizon
        Now, the celestial sphere is fixed and we only move the camera inside the sphere.
        Convert the previous Quaternion to Euler. 
            Quaternion rotation caused various issues, so sticking with Euler
            Have a vertical limit at ± 80 to avoid gimbal lock.
    */
    const euler = new THREE.Euler().setFromQuaternion(prevQuaternion, 'YXZ');
    
    // Apply the rotations, first horizontally then vertically
    euler.y += deltaX * sensitivity;
    euler.x += -deltaY * sensitivity;
    
    // After the rotation clamp the vertical axises at ±80. Avoid gimbal lock + avoid flipping. 
    const maxVertical = Math.PI / 2 - 0.1;
    euler.x = Math.max(-maxVertical, Math.min(maxVertical, euler.x));
    
    // When panning horizontally, it should wrap around. 
    if (euler.y > Math.PI) euler.y -= Math.PI * 2;
    if (euler.y < -Math.PI) euler.y += Math.PI * 2;
    
    return new THREE.Quaternion().setFromEuler(euler, 'YXZ');
}

const GestureManager: React.FC<GestureManagerProps> = ({
    children,
    onCameraUpdate,
    initialQuaternion,
}) => {
    const lastTranslation = useRef({x:0, y:0});
    const cameraQuaternion = useRef(initialQuaternion.clone());

    const panGesture = Gesture.Pan()
    .minPointers(1)
    .maxPointers(2)
    .minDistance(1)
    .activeOffsetX([-3, 3])
    .activeOffsetY([-3, 3])
    .onBegin((event) =>{
        lastTranslation.current = { x: event.translationX, y: event.translationY };
    })
    .onUpdate((event) => {
        const deltaX = event.translationX - lastTranslation.current.x;
        const deltaY = event.translationY - lastTranslation.current.y;

        lastTranslation.current = {
            x: event.translationX,
            y: event.translationY
        }
        const sensitivity = 0.004;

        const newQuaternion = calculateRotation(
            cameraQuaternion.current,
            deltaX,
            deltaY,
            sensitivity,
        );

        cameraQuaternion.current = newQuaternion;
        onCameraUpdate(newQuaternion);
    })
    .onEnd(() =>{
        lastTranslation.current = { x:0, y:0 };
    });

    // Add other gestures here

    const composedGestures = Gesture.Simultaneous(panGesture);

    return (
        <GestureDetector gesture={composedGestures}>
            {children}
        </GestureDetector>
    )
}

export default GestureManager; 