import React, {useState, useRef, useEffect} from "react";
import { StyleSheet, View, Text } from "react-native";
import { Canvas } from "@react-three/fiber/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import StarField from "./StarField";
import CameraController from "./CameraController";
import CompassOverlay from "./CompassOverlay";
import { useLocation } from "../hooks/useLocation";
import { useInitialOrientation } from "../hooks/useInitialOrientation";
import ConstellationLines from "./ConstellationLines";

const StarViewWithGestures = () =>{
    const [rotationX, setRotationX] = useState(0);
    const [rotationY, setRotationY] = useState(0);
    const lastTranslation = useRef({x:0, y:0});
    const {location, loading, error, permissionStatus} = useLocation();
    const {initialRotationX, initialRotationY, status} = useInitialOrientation(location);

    // Set initial orientation when calculated
    useEffect(()=>{
        if (location && status){
            console.log(location.latitude, location.longitude);
            setRotationX(initialRotationX);
            setRotationY(initialRotationY);
        }
    }, [status, initialRotationX, initialRotationY]);

    if (loading){
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Getting your location..</Text>
            </View>
        )
    }

    if (error){
        console.warn(error);
    }

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
        <>
            <GestureDetector gesture={panGesture}>
                <Canvas style={styles.canvas}>
                    <CameraController rotationX={rotationX} rotationY={rotationY} />
                    {/* To give the black background */}
                    <color attach="background" args={['black']} />
                    {/* To attach the Star Field */}
                    <StarField radius={2000} />

                    {/*Add the Constellation Lines*/}
                    <ConstellationLines radius={2000} color="#4488ff" />

                    {/* Adding a test cube */}
                    <mesh position = {[1.3431 * 20, 1.047629 * 20, 132.614909 * 20]}>
                        <boxGeometry args={[50,60,50]} />
                            <meshBasicMaterial color={"red"} />
                    </mesh>
                    <ambientLight intensity={1} />
                </Canvas>
            </GestureDetector>
            <CompassOverlay  rotationY={rotationY} />
        </>

    )
};

const styles = StyleSheet.create({
    canvas: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    loadingText: {
        color: 'white',
        fontSize: 16,
    },
});

export default StarViewWithGestures;
