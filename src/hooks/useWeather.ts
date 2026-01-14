import { useQuery } from "@tanstack/react-query"
import type { LocationCoordinates } from "./useGeolocation"
import { fetchByCity, fetchByCoordinates } from "@/api/openWeather"
import { parseForecastResponse } from "@/utils/forecast"
import type { Forecast5Response } from "@/types/openWeather"

export const useWeather = (coordinates?: LocationCoordinates, city?: string) => {

    const queryKey = city ? ['weather', 'city', city] :
        coordinates ? ['weather', 'coordinates', coordinates?.latitude, coordinates?.longitude]
            : ['weather']

    const enabled = Boolean(coordinates || city);
    return useQuery({

        queryKey,
        queryFn: async () => {
            let response: Forecast5Response;
            if (city) {
                response = await fetchByCity(city)
            } else if (coordinates) {
                response = await fetchByCoordinates(coordinates?.latitude, coordinates?.longitude)
            } else {
                throw Error('Location not provided.')
            }


            const parsedForcast = parseForecastResponse(response)
            return parsedForcast;
        },
        enabled,
        staleTime: 5 * 60 * 1000,
        retry: 1
    })
}