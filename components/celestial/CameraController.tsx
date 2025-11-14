import React, { useReducer } from "react";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from 'three';
import { CAMERA_FOV, CAMERA_FAR } from "../../constants/celestial";

interface CameraControllerProps{
    quaternion: THREE.Quaternion; 
}

const CameraController: React.FC<CameraControllerProps> = ({
    quaternion
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

        // Apply the quaternion directly to the camera rotation
        perspectiveCamera.quaternion.copy(quaternion);
        
    }, [camera, quaternion]);
    return null;
}

export default CameraController;
