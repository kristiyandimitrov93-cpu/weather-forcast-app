# 🌦️ React Weather Forecast App

A sleek, interactive weather forecast app built with **React + TypeScript**. Easily check the weather by city or by using your current location! Get a **5-day forecast** and dive into **hourly weather details** with a clean, responsive UI.

## ✨ Features

- 🔍 **Search by City** — Enter any city to view the weather forecast.
- 📍 **Use My Location** — Automatically fetch weather based on your current geolocation.
- 📅 **Daily Forecast** — View summarized weather for the next 5 days.
- ⏰ **Hourly Forecast** — Click on a day to explore hourly temperature, "feels like", and conditions.
- 📱 **Responsive Design** — Optimized for both desktop and mobile.

## 🖼️ Preview

Coming soon...

## ⚙️ Tech Stack

- **React** + **TypeScript**
- **Custom Hooks** for geolocation and weather data
- **OpenWeatherMap API**
- Tailwind CSS (assumed from class names)
- Modular component structure

## 🧠 Components Overview

- `App.tsx`: Main layout and logic for handling search, location, and selected day state:contentReference[oaicite:0]{index=0}.
- `Forecast.tsx`: Combines daily and hourly views, manages selected day logic:contentReference[oaicite:1]{index=1}.
- `WeatherSummary.tsx`: Maps daily weather data into interactive cards:contentReference[oaicite:2]{index=2}.
- `WeatherCard.tsx`: Displays weather summary for an individual day:contentReference[oaicite:3]{index=3}.
- `HourlyForecast.tsx`: Shows a detailed, scrollable hourly view for selected day:contentReference[oaicite:4]{index=4}.
- `useGeolocation.ts`: Hook to get current user location.
- `useWeather.ts`: Hook to fetch weather data (by coordinates or city).
- `openWeather.ts`: Utility to fetch and format data from OpenWeatherMap API.
- `common.ts`, `forecast.ts`: Utilities and type definitions.

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/react-weather-app.git
cd react-weather-app
```

### 2. Install dependncies

```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```
Then open http://localhost:5173 in your browser.


## Project Structure
```css
├── components/
│   ├── forecast/
│   │   ├── Forecast.tsx
│   │   ├── WeatherSummary.tsx
│   │   ├── WeatherCard.tsx
│   │   └── HourlyForecast.tsx
├── hooks/
│   ├── useGeolocation.ts
│   ├── useWeather.ts
├── api/
│   └── openWeather.ts
├── utils/
│   ├── forecast.ts
│   └── common.ts
├── App.tsx
├── main.tsx
```

## 📦 TODO / Improvements

-  **Add more unit and integration tests**
-  **Better error handling**
-  **Add unit conversion** (Celsius ↔ Fahrenheit)
- **Add map integration** for location preview
- **Add charts** for temperature trends