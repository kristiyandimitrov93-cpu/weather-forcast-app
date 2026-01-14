import { getWeatherIconUrl } from "@/api/openWeather";
import { Card, CardContent } from "@/components/ui/card";

interface DayCardProps {
    forecast: any;
    isSelected: boolean;
    onClick: () => void;
}

export const WeatherCard = ({ forecast, isSelected, onClick }: DayCardProps) => {
    const { dayName, dateString, maxTemperature, minTemperature, mainWeather } =
        forecast;

    return (
        <Card
            className={`w-32 cursor-pointer transition-all hover:shadow-md ${isSelected
                ? "ring-2 ring-primary/40 shadow-md"
                : "hover:ring-1 hover:ring-border"
                }`}
            onClick={onClick}
            role="button"
            tabIndex={0}
        >
            <CardContent className="p-4 text-center flex flex-col h-44">
                <div className="font-semibold text-foreground">{dayName}</div>
                <div className="text-sm text-muted-foreground">{dateString}</div>

                <div className="my-2 flex justify-center">
                    <img
                        src={getWeatherIconUrl(mainWeather.icon)}
                        alt={mainWeather.description}
                        className="h-12 w-12"
                        loading="lazy"
                    />
                </div>

                <div className="text-sm capitalize text-muted-foreground mb-2">
                    {mainWeather.description}
                </div>

                <div className="flex justify-center gap-2 text-lg font-medium mt-auto">
                    <span className="text-foreground">{maxTemperature}°</span>
                    <span className="text-muted-foreground">{minTemperature}°</span>
                </div>

            </CardContent>
        </Card>
    );
}