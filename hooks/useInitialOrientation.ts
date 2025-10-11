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
            console.log('current time, ', now);

            const astronomyTime = Astronmy.MakeTime(now);
            // Calculate the local sidereal time
            const lst = Astronmy.SiderealTime(astronomyTime);
            console.log("The lst is: ", lst);

            // Make a Astronomy Observer object with 0 height
            const observer = new Astronmy.Observer(
                location.latitude,
                location.longitude,
                0
            )

            /* Now convert location + LST => camera orientation
            Naive/ Simple approach of 
                X-rotation (vertical): Based on latitude
                Looking at horizon from your latitude
                Y-rotaion (horizontal): Based on LST & longitude. LST is in sidereal hours, convert to radians
                Orients us to face North
            */
           const latitudeRadians = location.latitude * Astronmy.DEG2RAD;
           // vert rotation is 90 - latitude
           const verticalRotation = (90 * Astronmy.DEG2RAD) - latitudeRadians; 
           
           // there are 15 degrees per sidereal hour
           const lstDegrees = lst * 15
           const horizontalRotation = lstDegrees * Astronmy.DEG2RAD;

           console.log('Calculated rotaions', {
            vertcal: verticalRotation,
            horizontal: horizontalRotation
           });

           setInitialRotationX(verticalRotation);
           setInitialRotationY(horizontalRotation);
           setLoading(false);
           setStatus(true);
        } catch (error) {
            console.log("Error while calculating the orientation: ", error);
            setError('Failed to calculate sky orientations. Using default view.');
            setLoading(false);
        }
    }, [location]);
    
return{
    initialRotationX, 
    initialRotationY,
    status,
    // loading,
    // error  
};
};