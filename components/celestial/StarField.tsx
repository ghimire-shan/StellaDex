import React, {useMemo, useRef, useEffect, useState} from 'react';
import * as THREE from 'three';
import hygJsonData from '../../assets/hyg_visible.json';
import { CELESTIAL_SPHERE_RADIUS, raDecToCartesian } from '../../constants/celestial';


interface StarData{
    ra: number;
    dec: number;
    mag?: number;
    proper_name?: string;
}

interface StarFieldProps{
    radius?: number;
}

const StarField: React.FC<StarFieldProps> = ({
    radius = CELESTIAL_SPHERE_RADIUS
}) => {
    const pointsRef = useRef<THREE.Points>(null);
    const [hygData, setHygData] = useState<StarData[]>([]);

    // Load the HYG data from the JSON file (inside assets)
    useEffect(()=>{
        const loadHygData = async () =>{
            try{
                const data = hygJsonData as StarData[];  
                setHygData(data);
            } catch (error){
                console.log("Failed to load hyg data: ", error);
            }
        };
        loadHygData();
    }, []);

    // Generate positions from the HYG data
    const positions = useMemo(()=>{
        if (hygData.length === 0){
            return new Float32Array(0);
        }
        const positions = new Float32Array(hygData.length * 3);

        hygData.forEach((star, i) =>{
            const [x, y, z] = raDecToCartesian(star.ra, star.dec, radius);
            positions[i*3] = x;
            positions[i*3 + 1] = y;
            positions[i*3 + 2] = z; 
        });
        return positions;
    }, [hygData, radius]);

    // If no data is given, do not render anything
    if (hygData.length ===0){
        return null;
    }
    return(
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                color={"white"}
                size={2}
                // Keep size constant regardless of distance
                sizeAttenuation={false}
            />
        </points>
    )
}
export default StarField;