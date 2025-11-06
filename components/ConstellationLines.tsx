import React, { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import constellation_lines from "../assets/constellation_lines.json";
import { CELESTIAL_SPHERE_RADIUS, CELSTIAL_SPHERE_SCALE_FACTOR, CONSTELLATION_LINES_COLOR } from "../constants/celestial";

interface Point3D {
    x: number;
    y: number;
    z: number;
}

interface LineSegment {
    from: Point3D;
    to: Point3D;
}

interface ConstellationData {
    [constellationAbbreviation: string]: LineSegment[][];
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
    const [constellationData, setConstellationData] =
        useState<ConstellationData | null>(null);

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
        console.log(`Processing ${totalSegments} line segments`);

        // Each segment needs 2 points (from , to) & each point has 3 coordinates (x, y, z)
        const positions = new Float32Array(totalSegments * 2 * 3);
        let index = 0;

        // Iterate through each constellation
        Object.entries(constellationData).forEach(([name, constellation]) => {
            constellation.forEach((lineGroup) => {
                lineGroup.forEach((segment) => {
                    // This scale has to remain consistent with StarField
                    const scale = radius / CELSTIAL_SPHERE_SCALE_FACTOR;

                    // From point
                    positions[index++] = segment.from.x * scale;
                    positions[index++] = segment.from.y * scale;
                    positions[index++] = - segment.from.z * scale;

                    // To point
                    positions[index++] = segment.to.x * scale;
                    positions[index++] = segment.to.y * scale;
                    positions[index++] = - segment.to.z * scale;
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
