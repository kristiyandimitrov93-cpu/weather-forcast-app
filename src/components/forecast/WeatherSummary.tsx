import { WeatherCard } from './WeatherCard'

export interface WeatherSummaryProps {
    weatherSummaries: any[],
    handleSelectDay: (index: number) => void
    selectedDayIndex: number
}
export const WeatherSummary = ({ weatherSummaries, handleSelectDay, selectedDayIndex }: WeatherSummaryProps) => {

    return (
        <div className='flex flex-row gap-2'>
            {weatherSummaries && weatherSummaries.map((forecast, index) => (
                <WeatherCard
                    forecast={forecast}
                    isSelected={selectedDayIndex === index}
                    onClick={() => handleSelectDay(index)}

                />

            ))}
        </div>)
}
