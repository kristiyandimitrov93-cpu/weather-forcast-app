import type { Weather } from "./openWeather"

export interface DailyForecast {
    date: Date,
    dayOfWeek: string,
    formattedDay: string,
    maxTemperature: number,
    minTemperature: number,
    mainWeather: Weather,
    hourlyDetails: HourlyDetails[]
}

export interface HourlyDetails {
    dt: number
    time: string
    temp: number
    feelsLike: number
    icon: string
    description: string


}