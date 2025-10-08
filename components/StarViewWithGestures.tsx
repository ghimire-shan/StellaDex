import React, {useState, useRef} from "react";
import { StyleSheet } from "react-native";
import { Canvas } from "@react-three/fiber/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import StarField from "./StarField";
import CameraController from "./CameraController";

const StarViewWithGestures = () =>{
    const [rotationX, setRotationX] = useState(0);
    const [rotationY, setRotationY] = useState(0);
    const lastTranslation = useRef({x:0, y:0});

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
        // Calculate the delta (change in translation from the last translation)
       const deltaX = event.translationX - lastTranslation.current.x;
       const deltaY = event.translationY - lastTranslation.current.y;
       
       // Update the last position
       lastTranslation.current = {
           x: event.translationX,
           y: event.translationY
        }
        
        const sensitivity = 0.004;
        setRotationY(prevY => {
            let newY = prevY + deltaX * sensitivity;
            // Implementing the horizontal wrap around where going left -> left -> ... brings you back to starting
            // Wrap around from (0 to 2pi)
            newY = ((newY % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
            return newY;
        })

        setRotationX(prevX =>{
            let newX = prevX - deltaY * sensitivity;
            const maxVerticalRotation = Math.PI / 2;
            newX = Math.max(-maxVerticalRotation, Math.min(maxVerticalRotation, newX));
            return newX;
        })
    })
    .onEnd(()=>{
        lastTranslation.current = { x:0, y:0 };
    });

    return (
        <GestureDetector gesture={panGesture}>
            <Canvas style={styles.canvas}>
                <CameraController rotationX={rotationX} rotationY={rotationY} />
                {/* To give the black background */}
                <color attach="background" args={['black']} />
                {/* To attach the Star Field */}
                <StarField radius={2000} />

                {/* Adding a test cube */}
                <mesh position = {[100,0,0]}>
                    <boxGeometry args={[10,10,10]} />
                        <meshBasicMaterial color={"cyan"} />
                </mesh>
                <ambientLight intensity={1} />
            </Canvas>
        </GestureDetector>
    )
};

const styles = StyleSheet.create({
    canvas: {
        flex: 1,
    },
});

export default StarViewWithGestures;
