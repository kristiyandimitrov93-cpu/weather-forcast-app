import { useState, useCallback, useEffect } from "react";

const options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000,
}

export interface LocationCoordinates {
    latitude: number
    longitude: number;
}

export const useGeolocation = () => {
    const [location, setLocation] = useState<LocationCoordinates | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        } else {
            setIsLoading(true)
        }


        navigator.geolocation.getCurrentPosition((position) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
            setIsLoading(false)
        }, (error) => {
            setError(parseError(error.code));
            setIsLoading(false)

        }, options)
    }, [options])




    return { isLoading, error, location, getLocation }
}

const parseError = (errorCode: any): string => {
    switch (errorCode) {
        case GeolocationPositionError.PERMISSION_DENIED:
            return 'Location permission denied. Please enable access to you location.'
        case GeolocationPositionError.POSITION_UNAVAILABLE:
            return 'Location position unavailable.'
        case GeolocationPositionError.TIMEOUT:
            return 'Location request timed out'
        default:
            return 'Failed to get location'
    }
}