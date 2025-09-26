import React, {useMemo, useRef} from 'react';
import * as THREE from 'three';

interface StarFieldProps{
    starCount?: number;
    radius?: number;
}

const StarField: React.FC<StarFieldProps> = ({
    starCount = 3000,
    radius = 1000
}) => {
    const pointsRef = useRef<THREE.Points>(null);

    // Get some random points on the sphere
    const positions = useMemo(()=>{
        const positions = new Float32Array(starCount * 3);

        for (let i=0; i < starCount; i++){
            // Get random spherical coordinates for now
            // We should change this to the astronomical coordinates later

            // For now use 0 to 2pi for long and 0 to pi for lat
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.acos(2 * Math.random() - 1); 

            // Convert those to cartesian coordinates
            const x = radius * Math.sin(theta) * Math.cos(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(theta);

            positions[i *3] = x;
            positions[i*3 + 1] = y;
            positions[i*3 + 2] = z;
        }
        return positions;
    }, [starCount, radius]);

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