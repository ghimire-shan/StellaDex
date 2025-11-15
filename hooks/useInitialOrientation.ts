import { useState, useEffect } from "react";
import * as Astronmy from 'astronomy-engine';

interface LocationData {
    latitude: number,
    longitude: number,
}

interface UseIntiailOrientationReturn {
    initialRotationX: number,
    initialRotationY: number,
    status: boolean,
    lst: number,
    // loading: boolean,
    // error: string | null;
}

export const useInitialOrientation = (
    location: LocationData | null
): UseIntiailOrientationReturn => {
    const [initialRotationX, setInitialRotationX] = useState<number>(0);
    const [initialRotationY, setInitialRotationY] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<boolean>(false);
    const [lst, setLst] = useState<number>(0);

    useEffect(()=>{
        if (!location){
            // When the location isn't given, we use the default orientation
            setLoading(false);
            return;
        }
        try {
            console.log('Calculating initial orientation using the location, ', location);
            
            // Get the date and time
            const now = new Date();
            const astronomyTime = Astronmy.MakeTime(now);

            // Astronomy engine returns the Sidereal time in GAST, need to convert it to local
            const gast = Astronmy.SiderealTime(astronomyTime);
            
            // Convert to local Sidereal time, lontitude in degrees / 15 = hours of time diff
            const longitudeHours = location.longitude / 15; 
            let lst = gast + longitudeHours; 

            // Add wrap around to 24 hours
            if (lst < 0) lst += 24;
            if (lst >= 24) lst -= 24; 


            /* Initial View Setup
            * We want to start looking North at a comfortable angle
            * Horizontal (Y rotation - azimuth)
            * - North - 0 azimuth & set Y rotation to point camera North
            * Vertical (X rotation - altitude)
            * - Look up at angle equal to latitude 
            */
            const verticalRotation = 45 * Astronmy.DEG2RAD; 

            // Convert hours to radians
            // LST tells us what RA is on the meridian
            const lstRadians = (lst * 15) * Astronmy.DEG2RAD; 
            // Start facing north which is RA that's 180 degrees away (12 hours)
            const horizontalRotation = 0;

            setInitialRotationX(verticalRotation);
            setInitialRotationY(horizontalRotation);
            setLst(lst);
            setLoading(false);
            setStatus(true);
        } catch (error) {
            console.log("Error while calculating the orientation: ", error);
            // Use default orientation on failure
            setInitialRotationX(0);
            setInitialRotationY(0);
            setLst(0);
            setError('Failed to calculate sky orientations. Using default view.');
            setLoading(false);
        }
    }, [location]);

    return{
        initialRotationX, 
        initialRotationY,
        status,
        lst, 
        // loading,
        // error  
    };
};