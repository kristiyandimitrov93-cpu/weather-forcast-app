// Root response from /data/2.5/forecast
export interface Forecast5Response {
  cod: string;             // HTTP code as string (e.g., "200")
  message: number;         // Internal message code
  cnt: number;             // Number of forecast entries returned
  list: ForecastEntry[];   // Array of forecast entries (up to 40)
  city: City;              // Metadata about the location
}

export interface ForecastEntry {
  dt: number;              // Unix timestamp (UTC)
  main: MainInfo;          // Primary weather metrics
  weather: Weather[];      // Weather conditions array (usually 1 element)
  clouds: Clouds;          // Cloudiness information
  wind: Wind;              // Wind information
  visibility?: number;     // Visibility in meters (optional)
  pop?: number;            // Probability of precipitation (0..1)
  rain?: Precipitation;    // Rain volume for last 3h (optional)
  snow?: Precipitation;    // Snow volume for last 3h (optional)
  sys: SysInfo;            // Additional system info (pod — part of day)
  dt_txt: string;          // ISO formatted date/time string
}

export interface MainInfo {
  temp: number;            // Temperature
  feels_like: number;      // Perceived temperature
  temp_min: number;        // Minimum temperature (forecast window)
  temp_max: number;        // Maximum temperature (forecast window)
  pressure: number;        // Atmospheric pressure (hPa)
  sea_level?: number;      // Pressure on sea level (optional)
  grnd_level?: number;     // Pressure on ground level (optional)
  humidity: number;        // Humidity percentage
  temp_kf?: number;        // Internal parameter (used for calculations)
}

export interface Weather {
  id: number;              // Weather condition id
  main: string;            // Group of weather parameters (Rain, Snow, etc.)
  description: string;     // Weather description
  icon: string;            // Weather icon id
}

export interface Clouds {
  all: number;             // Cloudiness percentage
}

export interface Wind {
  speed: number;           // Wind speed
  deg: number;             // Wind direction in degrees
  gust?: number;           // Wind gust speed (optional)
}

export interface Precipitation {
  "3h"?: number;           // Volume for last 3 hours in mm
}

export interface SysInfo {
  pod: "d" | "n";          // Part of day (day/night)
}

export interface City {
  id: number;              // City ID
  name: string;            // City name
  coord: Coordinates;      // Coordinates of the city
  country: string;         // Country code
  population?: number;     // Population (optional)
  timezone?: number;       // Shift in seconds from UTC (optional)
  sunrise?: number;        // Sunrise time (Unix UTC) (optional)
  sunset?: number;         // Sunset time (Unix UTC) (optional)
}

export interface Coordinates {
  lat: number;             // Latitude
  lon: number;             // Longitude
}
