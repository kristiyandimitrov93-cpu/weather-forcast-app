import { HourlyForecast } from "./HourlyForecast"
import { WeatherSummary } from "./WeatherSummary"


export interface ForecastProps {
    weatherSummaries: any[]
    onHandleSelectDay: (index: number) => void
    selectedDayIndex: number | null
}
export const Forecast = ({ weatherSummaries, onHandleSelectDay, selectedDayIndex }: ForecastProps) => {
    const selected = selectedDayIndex !== null ? weatherSummaries[selectedDayIndex] : undefined;

    return (
        <div className="flex h-full min-h-0 flex-col gap-3">

            <div className="shrink-0 rounded-xl border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold">Daily forecast</h2>
                    <span className="text-xs text-muted-foreground">Select a day for hourly details</span>
                </div>

                <WeatherSummary
                    weatherSummaries={weatherSummaries}
                    handleSelectDay={onHandleSelectDay}
                    selectedDayIndex={selectedDayIndex}
                />
            </div>


            <div className="flex min-h-0 rounded-xl border bg-card flex-col mb-6">
                {!selected ? (
                    <div className="p-4 text-sm text-muted-foreground">
                        Select a day to see hourly details.
                    </div>
                ) : (
                    <>
                        <div className="shrink-0 border-b px-4 py-3 text-sm font-semibold text-center">
                            {selected.dayOfWeek}, {selected.formattedDay} — Hourly details
                        </div>

                        <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-3 pb-6">
                            <HourlyForecast hourlyDetails={selected.hourlyDetails} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
