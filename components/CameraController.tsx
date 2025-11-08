import React, { useReducer } from "react";
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

    // Initial Camera setup that has to run only once
    useEffect(() =>{
        const perspectiveCamera = camera as THREE.PerspectiveCamera;
        // Set the camera position at center
        perspectiveCamera.position.set(0,0,0);
        
        perspectiveCamera.fov = CAMERA_FOV;
        perspectiveCamera.near = 0.1;
        perspectiveCamera.far = CAMERA_FAR;

        perspectiveCamera.updateProjectionMatrix();

    }, [camera]);
    
    // Apply rotation everytime rotation happens
    useEffect(() => {
        const perspectiveCamera = camera as THREE.PerspectiveCamera;

        // Apply rotation: X for vertical (pitch), Y for horizontal (yaw)
        perspectiveCamera.rotation.set(rotationX, rotationY, 0, 'XYZ');
    }, [camera, rotationX, rotationY]);
    return null;
}

export default CameraController;
