import type { DailyForecast } from '@/types/weather'
import { DailyForecastCard } from './DailyForecastCard'

export interface WeeklyForecast {
    dailyForecasts: DailyForecast[],
    handleSelectDay: (index: number) => void
    selectedDayIndex: number | null
}
export const WeeklyForecast = ({ dailyForecasts, handleSelectDay, selectedDayIndex }: WeeklyForecast) => {

    return (
        <div className='flex flex-row gap-2'>
            {dailyForecasts && dailyForecasts.map((forecast, index) => (
                <DailyForecastCard
                    forecast={forecast}
                    isSelected={selectedDayIndex === index}
                    onClick={() => handleSelectDay(index)}

                />

            ))}
        </div>)
}
