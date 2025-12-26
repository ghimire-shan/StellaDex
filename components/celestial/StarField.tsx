import React, {useMemo, useRef, useEffect, useState} from 'react';
import * as THREE from 'three';
import hygJsonData from '../../assets/hyg_visible.json';
import { CELESTIAL_SPHERE_RADIUS, raDecToCartesian } from '../../constants/celestial';
import { ThreeEvent } from '@react-three/fiber';


interface StarData{
    ra: number;
    dec: number;
    mag?: number;
    proper_name?: string;
    id? : string | number; 
}

interface StarFieldProps{
    radius?: number;
    onStarClick?: (star: StarData) => void; 
}

const StarField: React.FC<StarFieldProps> = ({
    radius = CELESTIAL_SPHERE_RADIUS,
    onStarClick
}) => {
    // Removing the useRef and useState for memory optimization

    const {positions, sizes, alphas, data} = useMemo(() => {
        // Process the data
        const rawData = hygJsonData as StarData[];
        if (!rawData || rawData.length == 0) {
            return {positions: new Float32Array(0),
                    sizes: new Float32Array(0),
                    alphas: new Float32Array(0),
                    data: []
            };
        }
        const count = rawData.length;
        const posArray = new Float32Array(count * 3);
        const sizeArray = new Float32Array(count);
        const alphaArray = new Float32Array(count);
        
        for (let i=0; i < count; i++) {
            const star = rawData[i]

            const [x, y, z] = raDecToCartesian(star.ra, star.dec, radius);
            posArray[i*3] = x;
            posArray[i*3 + 1] = y;
            posArray[i*3 + 2] = z; 
 
            /*
            * Tweak size and magnitude. Lower magnitude is means it is a brighter star
            * Have a base size of a bright star of (6.0) & have a slope (0.5) that controls the contrast
            *   How fast stars shrink as they get dimmer & Floor at 2.0 so nothing is too small to see
            */ 
            const mag = star.mag ?? 6;
            const normalizedSize = Math.max(2.0, 6.0 -(mag * 0.5));
            sizeArray[i] = normalizedSize;

            /*
            * Alpha: Opacity caclculation. Ranges from 0.3 (dim) - 1.0 (bright) 
            * 8 is a divisor to flip brighter stars (lower mag) to behave correctly
            */
            const normalizedAlpha = Math.min(1.0, Math.max(0.3, (8-mag)/8));
            alphaArray[i] = normalizedAlpha;
        }
        return {positions: posArray,
                sizes: sizeArray,
                alphas: alphaArray,
                data: rawData,
        };
    }, [radius]);

    // Handle Interactions when clicked here
    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (e.index !== undefined && data[e.index]) {
            if (onStarClick) onStarClick(data[e.index])
        }
    }

    // Shader Definition. Memoized to prevent recompilation
    const shaderArgs = useMemo(()=> ({
        uniforms: {
            color: {value: new THREE.Color('White')},
        },
        /*
        * Implemented a shader to make the stars look circle rather than squares.
        * Applied anti-aliasing with smoothstep where 0.4 <= r <= 0.5 it smoothly fades
        * Also, at center 100% opacoty and at edge 0 -> creates a fuzzy, soft edge
        */
        vertexShader: `
            attribute float size;
            attribute float alpha;
            varying float vAlpha;
            void main() {
                vAlpha = alpha;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size; 
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            varying float vAlpha;
            void main() {
                // Circle Logic: distance from center (0.5, 0.5)
                float r = distance(gl_PointCoord, vec2(0.5));
                if (r > 0.5) discard;
                
                // Smoothstep creates a nice fade at the edge instead of a jagged pixel cut
                float alpha = vAlpha * (1.0 - smoothstep(0.4, 0.5, r));

                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        depthWrite: false,
    }), []);

    if (positions.length ===0) return null;

    return(
        <points onClick={handleClick}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[sizes, 1]}
                />
                <bufferAttribute
                    attach="attributes-alpha"
                    args={[alphas, 1]}
                />
            </bufferGeometry>
            <shaderMaterial args={[shaderArgs]} />
        </points>
    )
}

export default StarField;