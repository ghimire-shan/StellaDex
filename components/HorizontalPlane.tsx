import React, { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { plane } from "three/examples/jsm/Addons.js";
import { CELESTIAL_SPHERE_RADIUS, HORIZONTAL_PLANE_COLOR, HORIZONTAL_PLANE_OPACITY } from "../constants/celestial";

interface HorizontalPlaneProps {
    latitude: number;
    radius?: number;
    color?: string;
    opacity?: number;
}

const HorizontalPlane: React.FC<HorizontalPlaneProps> = ({
    latitude,
    radius = CELESTIAL_SPHERE_RADIUS, // Radius should be consistent, need to change with constants
    color = HORIZONTAL_PLANE_COLOR,
    opacity = HORIZONTAL_PLANE_OPACITY,
}) => {

    const planeRotation = useMemo(() => {
        // Convert latitude to radians
        const latRad = (latitude * Math.PI) / 180;

        // Plane is perpendicular to the observer's zenith
        // Rotation around X-axis by 90 - lat
        const tiltAngle = (Math.PI/ 2) - latRad; 

        return [-tiltAngle, 0, 0]  as [number, number, number];       
    }, [latitude])
    
    // Make the plane 2.5x bigger than the celestial sphere
    const planeSize = radius * 2.5;
    
    return(
        <mesh 
            rotation={planeRotation}
            position={[0,0,0]}
        >
            <planeGeometry args={[planeSize, planeSize]} />
            <meshBasicMaterial
                color={color}
                transparent={true}
                opacity={opacity}
                side={THREE.DoubleSide}
            />
        </mesh>
    )
}

export default HorizontalPlane;