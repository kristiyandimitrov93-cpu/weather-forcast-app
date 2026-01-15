import { getWeatherIconUrl } from "@/api/openWeather";
import { Card, CardContent } from "@/components/ui/card";
import type { DailyForecast } from "@/types/weather";

interface DailyForecastProps {
    forecast: DailyForecast;
    isSelected: boolean;
    onClick: () => void;
}

export const DailyForecastCard = ({ forecast, isSelected, onClick }: DailyForecastProps) => {
    const { dayOfWeek, formattedDay, maxTemperature, minTemperature, mainWeather } = forecast;

    return (
        <Card
            className={`w-32 cursor-pointer transition-shadow hover:shadow-md ${isSelected ? "ring-2 ring-primary/40 shadow-md" : "hover:ring-1 hover:ring-border"
                }`}
            onClick={onClick}
            role="button"
            tabIndex={0}
        >
            <CardContent className="flex h-44 flex-col justify-between p-4 text-center">
                <div>
                    <div className="font-semibold text-foreground">{dayOfWeek}</div>
                    <div className="text-sm text-muted-foreground">{formattedDay}</div>
                </div>

                <div className="flex flex-col items-center">
                    <img
                        src={getWeatherIconUrl(mainWeather.icon)}
                        alt={mainWeather.description}
                        className="h-12 w-12"
                        loading="lazy"
                    />

                    <div className="mt-2 h-10 w-full text-sm text-muted-foreground leading-5 line-clamp-2 capitalize">
                        {mainWeather.description}
                    </div>
                </div>

                <div className="flex justify-center gap-2 text-lg font-medium">
                    <span className="text-foreground">{maxTemperature}°</span>
                    <span className="text-muted-foreground">{minTemperature}°</span>
                </div>
            </CardContent>
        </Card>
    );
};
