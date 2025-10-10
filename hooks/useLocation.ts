import { useState, useEffect } from "react";
import * as Location from 'expo-location';

interface LocationData{
    latitude: number,
    longitude: number,
}

interface UseLocationReturn {
    location: LocationData | null;
    loading: boolean;
    error: string | null;
    permissionStatus: 'granted' | 'denied' | 'undetermined';
}

export const useLocation = (): UseLocationReturn =>{
    const [location, setLocation] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');

    useEffect(()=>{
        const getLocation = async () =>{
            try{
                console.log('Requesting location permissions');
                const { status } = await Location.requestForegroundPermissionsAsync();
                console.log('Permission status: ', status);

                if (status != 'granted'){
                    setPermissionStatus('denied');
                    setError('Location permission was denied. Using default view');
                    setLoading(false);
                    return;
                }
                
                setPermissionStatus('granted');
                console.log('Permission was granted');
                
                // Get the current position
                const position = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                })
                
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });

                setLoading(false);

            } catch (err) {
                console.log('Error getting location', err);
                setError('Failed to get location. Using default view');
                setPermissionStatus('denied');
                setLoading(false);
            }
        }
    getLocation();
    }, []);

    return {
        location,
        loading, 
        error,
        permissionStatus
    };
};