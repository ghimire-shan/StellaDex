import React, {useState, useRef, useEffect} from "react";
import { StyleSheet, View, Text } from "react-native";
import { Canvas } from "@react-three/fiber/native";
import CameraController from "../components/celestial/CameraController";
import CompassOverlay from "../components/ui/CompassOverlay";
import { useLocation } from "../hooks/useLocation";
import { useInitialOrientation } from "../hooks/useInitialOrientation";
import HorizontalPlane from "../components/celestial/HorizontalPlane";
import { 
    CELESTIAL_SPHERE_RADIUS,
    CONSTELLATION_LINES_COLOR, 
    HORIZONTAL_PLANE_COLOR, 
    HORIZONTAL_PLANE_OPACITY,
    raDecToCartesian,
    } from "../constants/celestial";
import * as THREE from 'three';
import CelestialSphere from "../components/celestial/CelestialSphere";
import GestureManager from "../components/interaction/GestureManager";

const StarViewWithGestures = () =>{
    const [cameraQuaternion, setCameraQuaternion] = useState(new THREE.Quaternion());
    const [sphereQuaternion, setSphereQuaternion] = useState(new THREE.Quaternion());
    const {location, loading, error, permissionStatus} = useLocation();
    const {initialRotationX, initialRotationY, lst, status} = useInitialOrientation(location);

    // Set initial orientation when calculated
    useEffect(()=>{
        if (location && status){
            console.log(location.latitude, location.longitude);
            
            // The Celestial sphere handles the rotation, so we can just look straight

            const initialQuaternion = new THREE.Quaternion().identity();
            setCameraQuaternion(initialQuaternion);
        }
    }, [status, initialRotationX, initialRotationY, location]);

    const handleCameraUpdate = (newQuaternion: THREE.Quaternion) => {
        setCameraQuaternion(newQuaternion);
    }

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


    return (
        <>
            <GestureManager
                onCameraUpdate={handleCameraUpdate}
                initialQuaternion={cameraQuaternion}
                sphereRotation={sphereQuaternion}
            >
                <Canvas style={styles.canvas}>
                    <CameraController quaternion={cameraQuaternion} />
                    {/* To give the black background */}
                    <color attach="background" args={['black']} />
                    <CelestialSphere 
                        latitude={location?.latitude || 0}
                        lst={lst}
                        radius={CELESTIAL_SPHERE_RADIUS} 
                        onRotationCalculated={setSphereQuaternion}
                    />

                    <HorizontalPlane
                        radius={CELESTIAL_SPHERE_RADIUS}
                        color={HORIZONTAL_PLANE_COLOR}
                        opacity={HORIZONTAL_PLANE_OPACITY}
                    />

                    <ambientLight intensity={1} />
                </Canvas>
            </GestureManager>
            <CompassOverlay  quaternion={cameraQuaternion} />
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
