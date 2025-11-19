import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import StarField from './StarField';
import ConstellationLines from './ConstellationLines';
import { CELESTIAL_SPHERE_RADIUS, CONSTELLATION_LINES_COLOR, raDecToCartesian} from '../../constants/celestial';

interface CelestialSphereProps {
    latitude: number;
    lst: number;
    radius?: number;
}

/*
    This wraps the starfield and constellation lines in a group to rotate
    Aligns the celestial coordinates (ra/dec) to local horizon
    based on observer's latitude and local sidereal time (lst)
*/
const CelestialSphere: React.FC<CelestialSphereProps> = ({
    latitude,
    lst,
    radius = CELESTIAL_SPHERE_RADIUS,
}) => {
    const sphereRotation = useMemo(()=>{
        // Convert them to radians
        const latRad = (latitude * Math.PI) / 180; 
        const lstRad = (lst * 15 * Math.PI) / 180; 

        // Create individual rotation quaternions
        /* - 1. Latitude Tilt -
        * We rotate around the X-axis (East West line)
        * To move the Celestial Pole (Y+) down to the North Horizon (Z-), need to 
        * NEGATIVE rotation of (90 - Latitude)
        */
        const tiltAngle = (Math.PI/ 2) - latRad; 
        const latQuat = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(1, 0, 0),
            - tiltAngle
        );

        /*
        * - 2. LST Spin (Earth Rotation) - 
        * With the Z flip in Step 1, RA is 0 at +X (East)
        * We want the RA that matches the current LST to be at the Meridian (+Z / South)
        * Phase offset of -90 degrees (-PI/2) moves +X to +Z when RA is 0hr.
        */
        const phaseOffset = - Math.PI / 2;
        const lstQuat = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            phaseOffset - lstRad
        );
        
        // Combine the rotation quaternions with Spin (LST) first and Tilt (Latitude)
        const combined = new THREE.Quaternion();
        combined.multiplyQuaternions(latQuat, lstQuat)
        return combined
    }, [latitude, lst]);

    /* Creating a reference to the sphere rotation. This is done as passing 
    * quaternion to group property breaks on Expo Go.
    * Theoretically the spherical rotation is only done once as lat and lst rarely changes.
    */
    const groupRef = useRef<THREE.Group>(null);

    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.quaternion.copy(sphereRotation);
        }
    }, [sphereRotation]);

    return (
        <group ref={groupRef}>
            <StarField radius={radius} />
            <ConstellationLines 
                radius={CELESTIAL_SPHERE_RADIUS} 
                color= {CONSTELLATION_LINES_COLOR}
            />
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
        </group>
    );
};

export default CelestialSphere;