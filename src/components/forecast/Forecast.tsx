import { WeatherSummary } from "./WeatherSummary"


export interface ForecastProps {
    weatherSummaries: any[]
    onHandleSelectDay: (index: number) => void
    selectedDayIndex: number | null
}
export const Forecast = ({ weatherSummaries, onHandleSelectDay, selectedDayIndex }: ForecastProps) => {

    return (
        <WeatherSummary weatherSummaries={weatherSummaries} handleSelectDay={onHandleSelectDay} selectedDayIndex={selectedDayIndex} />
    )
}