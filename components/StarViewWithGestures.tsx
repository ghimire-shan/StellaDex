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
import HorizontalPlane from "./HorizontalPlane";
import { 
    CELESTIAL_SPHERE_RADIUS,
    CONSTELLATION_LINES_COLOR, 
    HORIZONTAL_PLANE_COLOR, 
    HORIZONTAL_PLANE_OPACITY,
    raDecToCartesian,
    } from "../constants/celestial";
import * as THREE from 'three';

const StarViewWithGestures = () =>{
    const [rotationX, setRotationX] = useState(0);
    const [rotationY, setRotationY] = useState(0);
    const [cameraQuaternion, setCameraQuaternion] = useState(new THREE.Quaternion());
    const lastTranslation = useRef({x:0, y:0});
    const {location, loading, error, permissionStatus} = useLocation();
    const {initialRotationX, initialRotationY, status} = useInitialOrientation(location);

    // Set initial orientation when calculated
    useEffect(()=>{
        if (location && status){
            console.log(location.latitude, location.longitude);
            
            // Take the initial Euler angles and convert them to quaternion
            const euler = new THREE.Euler(initialRotationX, initialRotationY, 0, 'YXZ');
            const initialQuaternion = new THREE.Quaternion()
                .identity()
                .setFromEuler(euler);
            setCameraQuaternion(initialQuaternion);
        }
    }, [status, initialRotationX, initialRotationY, location]);

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
        const maxVerticalRotation = Math.PI / 2 ; 

        // Make changes to the quaternion when there is a translation or event
        setCameraQuaternion(prevQuaternion => {
            let newQuanterion = prevQuaternion.clone();

            // Extract the current forward and up vectors
            const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(newQuanterion);
            const up = new THREE.Vector3(0, 1, 0);
            const right = new THREE.Vector3(1, 0, 0).applyQuaternion(newQuanterion);
            
            // Apply vertical rotation. Always around local x axis
            if (deltaY != 0){
                const pitchQuat = new THREE.Quaternion().setFromAxisAngle(
                    right,
                    -deltaY * sensitivity
                );
                newQuanterion.multiply(pitchQuat);
            }
            // Apply horizontal rotation. This is applied aroumd the world Y axis
            if (deltaX != 0){
                const yawQuat = new THREE.Quaternion().setFromAxisAngle(
                    up,
                    deltaX * sensitivity
                );
                newQuanterion.premultiply(yawQuat);
            }

            // Convert quaternions => euler, to check for vertical limit. Clamp on vertical limit
            const euler = new THREE.Euler().setFromQuaternion(newQuanterion, 'YXZ');
            if (Math.abs(euler.x) > maxVerticalRotation){
                euler.x = Math.sign(euler.x) * maxVerticalRotation;
                return new THREE.Quaternion().setFromEuler(euler, 'YXZ');
            }
            return newQuanterion; 
        });
    })
    .onEnd(()=>{
        lastTranslation.current = { x:0, y:0 };
    });

    return (
        <>
            <GestureDetector gesture={panGesture}>
                <Canvas style={styles.canvas}>
                    <CameraController quaternion={cameraQuaternion} />
                    {/* To give the black background */}
                    <color attach="background" args={['black']} />
                    {/* To attach the Star Field */}
                    <StarField radius={CELESTIAL_SPHERE_RADIUS} />

                    {/*Add the Constellation Lines*/}
                    <ConstellationLines radius={CELESTIAL_SPHERE_RADIUS} color= {CONSTELLATION_LINES_COLOR} />

                    {/* Adding known some known stars as cube on the surface
                        Adding Polaris, Betelgeuse, Sirius
                    */}
                    <mesh position={raDecToCartesian(2.52975, 89.264109, CELESTIAL_SPHERE_RADIUS)}>
                        <boxGeometry args={[30, 30, 30]} />
                            <meshBasicMaterial color={"red"} />
                    </mesh>
                    <mesh position={raDecToCartesian(5.919529, 7.407063, CELESTIAL_SPHERE_RADIUS)}>
                        <boxGeometry args={[30, 30, 30]} />
                            <meshBasicMaterial color={"cyan"} />
                    </mesh>
                    <mesh position={raDecToCartesian(6.752481,  -16.716116, CELESTIAL_SPHERE_RADIUS)}>
                        <boxGeometry args={[30, 30, 30]} />
                            <meshBasicMaterial color={"green"} />
                    </mesh>

                    <HorizontalPlane
                        latitude={location?.latitude || 0}
                        radius={CELESTIAL_SPHERE_RADIUS}
                        color={HORIZONTAL_PLANE_COLOR}
                        opacity={HORIZONTAL_PLANE_OPACITY}
                    />

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
