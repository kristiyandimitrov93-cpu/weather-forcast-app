import type { DailyForecast } from "@/types/weather"
import { HourlyForecast } from "./HourlyForecast"
import { WeeklyForecast } from "./WeeklyForecast"


export interface ForecastProps {
    dailyForecasts: DailyForecast[]
    onHandleSelectDay: (index: number) => void
    selectedDayIndex: number | null
}

export const Forecast = ({ dailyForecasts, onHandleSelectDay, selectedDayIndex }: ForecastProps) => {
    const selected = selectedDayIndex !== null ? dailyForecasts[selectedDayIndex] : undefined;

    return (
        <div className="flex h-full min-h-0 flex-col gap-3">

            <div className="shrink-0 rounded-xl border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold">Daily forecast</h2>
                </div>

                <WeeklyForecast
                    dailyForecasts={dailyForecasts}
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
