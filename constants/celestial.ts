// Properties of the celestial sphere
export const CELESTIAL_SPHERE_RADIUS = 5000;
export const CELSTIAL_SPHERE_SCALE_FACTOR = 100;

// Camera properties
export const CAMERA_FOV = 50;
export const CAMERA_FAR = CELESTIAL_SPHERE_RADIUS * 2.5;

// Colors
export const CONSTELLATION_LINES_COLOR = "#4488ff";
export const HORIZONTAL_PLANE_COLOR = "red";
export const HORIZONTAL_PLANE_OPACITY = 0.15;

// Functions that are needeed
export function raDecToCartesian(ra: number, dec: number, radius: number): [number, number, number]{
    const raRad = (ra * Math.PI) / 12; 
    const decRad = (dec * Math.PI) / 180; 

    /*
        In standard math, we create a circle that rotates counter clockwise
        In Three.js (Right handed system) -> looking top down (Y-axis), rotating from + X to + Z is a clockwise moment
        So we flip Z to align Math East and Three.js East
    */

    const x = radius * Math.cos(raRad) * Math.cos(decRad);
    const y = radius * Math.sin(decRad);
    const z = - radius * Math.sin(raRad) * Math.cos(decRad);

    return [x,y,z]
}