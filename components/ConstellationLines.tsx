import React, { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import constellation_lines from "../assets/constellation_lines.json";
import { 
    CELESTIAL_SPHERE_RADIUS, 
    CELSTIAL_SPHERE_SCALE_FACTOR, 
    CONSTELLATION_LINES_COLOR, raDecToCartesian } from "../constants/celestial";

interface StarPoint {
    ra: number;
    dec: number;
}

interface ConstellationLine {
    from: StarPoint;
    to: StarPoint;
}

interface ConstellationData {
    [constellationAbbreviation: string]: ConstellationLine[][];
}

interface ConstellationLineProps {
    radius?: number;
    color?: string;
}

const ConstellationLines: React.FC<ConstellationLineProps> = ({
    radius = CELESTIAL_SPHERE_RADIUS,
    color = CONSTELLATION_LINES_COLOR,
}) => {
    const lineRef = useRef<THREE.LineSegments>(null);
    const [constellationData, setConstellationData] = useState<ConstellationData | null>(null);

    // Load the constellation lines .json file
    useEffect(() => {
        const loadConstellationLinesData = async () => {
            try {
                const data = constellation_lines as ConstellationData;
                setConstellationData(data);
            } catch (error) {
                console.log(
                    "Failed to load Constellation lines data : ",
                    error,
                );
            }
        };
        loadConstellationLinesData();
    }, []);

    // Generate line positions from the data
    const positions = useMemo(() => {
        if (!constellationData) {
            console.log("No constellation data loaded yet");
            return new Float32Array(0);
        }

        // Count total line segments to allocate array
        let totalSegments = 0;
        Object.values(constellationData).forEach((constellation) => {
            constellation.forEach((lineGroup) => {
                totalSegments += lineGroup.length;
            });
        });

        if (totalSegments === 0){
            console.warn('No constellation segements found');
            return new Float32Array(0);
        }
        console.log(`Processing ${totalSegments} line segments`);

        // Each segment needs 2 points (from , to) & each point has 3 coordinates (x, y, z)
        const positions = new Float32Array(totalSegments * 2 * 3);
        let index = 0;

        // Iterate through each constellation
        Object.entries(constellationData).forEach(([abbr, constellation]) => {
            constellation.forEach((lineGroup) => {
                lineGroup.forEach((segment) => {
                    // Convert from ra, dec to x,y , z
                    const [fromX, fromY, fromZ] = raDecToCartesian(
                        segment.from.ra,
                        segment.from.dec,
                        radius
                    );

                    const [toX, toY, toZ] = raDecToCartesian(
                        segment.to.ra,
                        segment.to.dec,
                        radius
                    );

                    // From point
                    positions[index++] = fromX;
                    positions[index++] = fromY;
                    positions[index++] = fromZ;

                    // To point
                    positions[index++] = toX;
                    positions[index++] = toY;
                    positions[index++] = toZ;
                });
            });
        });
        return positions;
    }, [constellationData, radius]);

    if (!constellationData || positions.length == 0) {
        return null;
    }

    return (
        <lineSegments ref={lineRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <lineBasicMaterial
                color={color}
                transparent={true}
                opacity={0.6} />
        </lineSegments>
    );
};

export default ConstellationLines;
