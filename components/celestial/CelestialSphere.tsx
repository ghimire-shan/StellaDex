import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import StarField from './StarField';
import ConstellationLines from './ConstellationLines';
import * as Astronmy from 'astronomy-engine';
import { CELESTIAL_SPHERE_RADIUS, CONSTELLATION_LINES_COLOR, raDecToCartesian} from '../../constants/celestial';

interface CelestialSphereProps {
    latitude: number;
    lst: number;
    radius?: number;
    onRotationCalculated?: (quaternion: THREE.Quaternion) => void; 
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
    onRotationCalculated
}) => {
    const sphereRotation = useMemo(()=>{
        /**
         * Transform celestial coordinates to local horizon coordinates
         * Step 1. Rotate around Y axis by LST
         *  - LST tells us what RA is crossing the Meridian 
         *  - Convert lst to radians to align RA with local time
         * Step 2. Rotate around X axis by (90 - lat)
         *  - tilt the celestial equator to match local horizon
         * 
         */
        const latRad = (latitude * Math.PI) / 180; 
        const lstRad = (lst * 15 * Math.PI) / 180; 

        // Create individual rotation quaternions
        const latQuat = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(1, 0, 0),
            - (Math.PI/ 2 - latRad)
        );
        const lstQuat = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            - lstRad
        );


        const combined = new THREE.Quaternion().multiplyQuaternions(lstQuat, latQuat);
        return combined; 
    }, [latitude, lst]);

    useEffect(() => {
        if (onRotationCalculated){
            onRotationCalculated(sphereRotation);
        }
    }, [sphereRotation, onRotationCalculated])

    console.log('Celestial Sphere rotation', {
        latitude, 
        lst: `${lst.toFixed(2)} hr`,
    })
    

    return (
        <group quaternion={sphereRotation}>
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