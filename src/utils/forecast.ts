import type { Forecast5Response, ForecastEntry, Weather } from "@/types/openWeather";
import type { HourlyDetails } from "@/types/weather";
import { capitalize, formatTime } from "./common";

export const parseForecastResponse = (forecastEntries
    : Forecast5Response) => {

    const groupedForecastEntries: Map<string, ForecastEntry[]> = getGroupedForecastEntries(forecastEntries.list)



    const forecastSummary: any = []
    groupedForecastEntries.forEach((value, key) => {

        const date = new Date(key)

        const mainWeather = getMainWeatherCondition(value)

        const temperatures = value.map(item => item.main.temp)
        const maxTemperature = Math.round(Math.max(...temperatures))
        const minTemperature = Math.round(Math.min(...temperatures))
        forecastSummary.push({
            date,
            dayOfWeek: getDayOfTheWeek(date),
            formattedDay: date.toLocaleDateString('en-GB'),
            maxTemperature,
            minTemperature,
            mainWeather,
            hourlyDetails: getHourlyDetails(value)
        })
    })


    return forecastSummary;
}


const getDayOfTheWeek = (date: Date) => {
    const today = new Date()
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (isSameDay(today, date)) {
        return 'Today'
    }

    if (isSameDay(tomorrow, date)) {
        return 'Tomorrow'
    }


    return date.toLocaleDateString("en-US", {
        weekday: "long",
    });
}

export function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

const getGroupedForecastEntries = (forecastEntries: ForecastEntry[]) => {
    let groupedEntries: Map<string, ForecastEntry[]> = new Map()
    forecastEntries.reduce((grouped, item) => {
        const key = getKey(item.dt_txt)
        if (!grouped.has(key)) {
            grouped.set(key, [])
        }
        grouped.get(key)!.push(item)
        return grouped
    }, groupedEntries)

    return groupedEntries;
}

const getKey = (timestamp: string) => {
    return timestamp.split(' ')[0]
}

const getMainWeatherCondition = (entries: ForecastEntry[]): Weather => {

    const closestWeather = entries.reduce((closest, entry) => {
        const currentClosestDate = new Date(closest.dt * 1000).getHours();
        const entryDate = new Date(entry.dt * 1000).getHours()
        return Math.abs(entryDate - 12) < Math.abs(currentClosestDate - 12) ?
            closest : entry
    })

    return closestWeather.weather[0]
}

const getHourlyDetails = (forecastEntries: ForecastEntry[]): HourlyDetails[] => {
    return forecastEntries.map((item) => {
        const { main, weather, dt } = item
        return {
            dt,
            time: formatTime(dt),
            temp: Math.round(main.temp),
            feelsLike: Math.round(main.feels_like),
            icon: weather[0].icon,
            description: capitalize(weather[0].description)
        }
    })

}
