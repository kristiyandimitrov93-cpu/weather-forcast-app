import { useQuery } from "@tanstack/react-query"
import type { LocationCoordinates } from "./useGeolocation"
import { fetchByCoordinates } from "@/api/openWeather"
import { parseForecastResponse } from "@/utils/forecast"

export const useWeather = (coordinates?: LocationCoordinates) => {

    return useQuery({

        queryKey: ['weather', 'coordinates', coordinates?.latitude, coordinates?.longitude],
        queryFn: async () => {
            let response = await fetchByCoordinates(coordinates?.latitude, coordinates?.longitude)


            const parsedForcast = parseForecastResponse(response)
            return parsedForcast;
        }
    })





}