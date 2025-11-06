import React from "react";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from 'three';
import { CAMERA_FOV, CAMERA_FAR } from "../constants/celestial";

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
        // console.log('Setting camera rotation to:', rotationX, rotationY);
        // perspectiveCamera.rotation.set(rotationX, rotationY, 0, 'XYZ');

        perspectiveCamera.fov = CAMERA_FOV;
        perspectiveCamera.near = 0.1;
        perspectiveCamera.far = CAMERA_FAR;

        perspectiveCamera.updateProjectionMatrix();
    }, [camera, rotationX, rotationY]);
    return null;
}

export default CameraController;
