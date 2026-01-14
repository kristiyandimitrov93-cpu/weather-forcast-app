import type { Forecast5Response, ForecastEntry, Weather } from "@/types/openWeather";

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

        console.log(getMainWeatherCondition(value))

        //min temp
        //max 
        //icon
        //average wind speed

        //items

        forecastSummary.push({
            date,
            maxTemperature,
            minTemperature,
            mainWeather,
            hourlyData: value
        })
    })

    console.log(forecastSummary)
    console.log(groupedForecastEntries)
    return forecastSummary;
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