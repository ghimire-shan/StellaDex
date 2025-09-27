import React from "react";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from 'three';


interface CameraControllerProps{
    rotationX?: number;
    rotationY?: number;
}

const CameraController: React.FC<CameraControllerProps> = ({
    rotationX = 0,
    rotationY = 0
}) => {
    const {camera} = useThree();

    useEffect(() =>{
        const perspectiveCamera = camera as THREE.PerspectiveCamera;
        // Set the camera position at center
        perspectiveCamera.position.set(0,0,0);

        // Now apply rotation from the gestures
        perspectiveCamera.rotation.set(rotationX, rotationY, 0);

        perspectiveCamera.fov = 75;
        perspectiveCamera.near = 0.1;
        perspectiveCamera.far = 2000;

        perspectiveCamera.updateProjectionMatrix();
    }, [camera, rotationX, rotationY]);
    return null;
}

export default CameraController;