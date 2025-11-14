import React, { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { CELESTIAL_SPHERE_RADIUS, HORIZONTAL_PLANE_COLOR, HORIZONTAL_PLANE_OPACITY } from "../../constants/celestial";

interface HorizontalPlaneProps {
    radius?: number;
    color?: string;
    opacity?: number;
}

const HorizontalPlane: React.FC<HorizontalPlaneProps> = ({
    radius = CELESTIAL_SPHERE_RADIUS,
    color = HORIZONTAL_PLANE_COLOR,
    opacity = HORIZONTAL_PLANE_OPACITY,
}) => {

    /*
        The horizontal plane is a flat plane in the user's view
        We just place it flat along the y axis
        The latitude based tilt is handled by our initial camera orientation
        It should have no rotation and just sit flat
    */
    const planeRotation: [number, number, number] = [-Math.PI/ 2, 0, 0];
    
    // Make the plane 5x bigger than the celestial sphere
    const planeSize = radius * 5;
    
    return(
        <mesh 
            rotation={planeRotation}
            position={[0,-10,0]}
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