import type { Forecast5Response } from "@/types/openWeather";

const API_KEY = '31f6815f4687290c1904ada0f6d80bfd'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export const fetchByCoordinates = async (latitude: number, longitude: number): Promise<Forecast5Response> => {
    const url = `${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        throw new Error('Failed to fetch weather data for' + data.cod)
    }

    return data as Forecast5Response
}

export const getWeatherIconUrl = (iconCode: string): string => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}