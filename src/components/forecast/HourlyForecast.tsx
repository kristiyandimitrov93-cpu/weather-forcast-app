import React from "react";
import { getWeatherIconUrl } from "@/api/openWeather";
import type { HourlyDetails } from "@/types/weather";

export interface HourlyForecastProps {
    hourlyDetails: HourlyDetails[];
}

export const HourlyForecast = ({ hourlyDetails }: HourlyForecastProps) => {
    return (
        <div className="min-w-[600px] grid grid-cols-5 gap-4 text-sm text-center place-items-center">
            <div className="font-medium text-muted-foreground">Time</div>
            <div className="font-medium text-muted-foreground">Weather</div>
            <div className="font-medium text-muted-foreground">Temp</div>
            <div className="font-medium text-muted-foreground">Feels like</div>
            <div className="font-medium text-muted-foreground">Icon</div>

            {hourlyDetails.map((h, i) => (
                <React.Fragment key={i}>
                    <div>{h.time}</div>
                    <div>{h.description}</div>
                    <div>{h.temp}°</div>
                    <div>{h.feelsLike}°</div>
                    <div>
                        <img
                            src={getWeatherIconUrl(h.icon)}
                            alt={h.icon}
                            className="h-6 w-6"
                            loading="lazy"
                        />
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};
