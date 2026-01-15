import type { Forecast5Response, ForecastEntry, Weather } from "@/types/openWeather";
import { parseForecastResponse, isSameDay } from "./forecast";
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";


const createWeather = (overrides: Partial<Weather> = {}): Weather => ({
  id: 800,
  main: "Clear",
  description: "clear sky",
  icon: "01d",
  ...overrides,
});

const createForecastEntry = (
  dt: number,
  dt_txt: string,
  temp: number,
  overrides: Partial<ForecastEntry> = {}
): ForecastEntry => ({
  dt,
  main: {
    temp,
    feels_like: temp - 2,
    temp_min: temp - 1,
    temp_max: temp + 1,
    pressure: 1013,
    humidity: 50,
  },
  weather: [createWeather()],
  clouds: { all: 0 },
  wind: { speed: 5, deg: 180 },
  visibility: 10000,
  pop: 0,
  sys: { pod: "d" },
  dt_txt,
  ...overrides,
});

const createForecast5Response = (
  list: ForecastEntry[] = []
): Forecast5Response => ({
  cod: "200",
  message: 0,
  cnt: list.length,
  list,
  city: {
    id: 2643743,
    name: "London",
    coord: { lat: 51.5085, lon: -0.1257 },
    country: "GB",
    population: 1000000,
    timezone: 0,
    sunrise: 1609488000,
    sunset: 1609516800,
  },
});


const createTimestamp = (dateStr: string, hours: number): number => {
  const date = new Date(dateStr);
  date.setHours(hours, 0, 0, 0);
  return Math.floor(date.getTime() / 1000);
};

describe("parseForecastResponse", () => {
  let originalDate: typeof Date;

  beforeEach(() => {
    originalDate = globalThis.Date;
    const mockDate = new Date("2024-01-15T10:00:00");
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("basic functionality", () => {
    it("returns empty array for empty forecast list", () => {
      const response = createForecast5Response([]);
      const result = parseForecastResponse(response);
      expect(result).toEqual([]);
    });

    it("parses single forecast entry correctly", () => {
      const entry = createForecastEntry(
        createTimestamp("2024-01-15", 12),
        "2024-01-15 12:00:00",
        20
      );
      const response = createForecast5Response([entry]);
      const result = parseForecastResponse(response);

      expect(result).toHaveLength(1);
      expect(result[0].maxTemperature).toBe(20);
      expect(result[0].minTemperature).toBe(20);
    });

    it("groups entries by date correctly", () => {
      const entries = [
        createForecastEntry(createTimestamp("2024-01-15", 9), "2024-01-15 09:00:00", 18),
        createForecastEntry(createTimestamp("2024-01-15", 12), "2024-01-15 12:00:00", 22),
        createForecastEntry(createTimestamp("2024-01-16", 9), "2024-01-16 09:00:00", 19),
        createForecastEntry(createTimestamp("2024-01-16", 12), "2024-01-16 12:00:00", 23),
      ];
      const response = createForecast5Response(entries);
      const result = parseForecastResponse(response);

      expect(result).toHaveLength(2);
    });

    it("returns DailyForecast with correct structure", () => {
      const entry = createForecastEntry(
        createTimestamp("2024-01-15", 12),
        "2024-01-15 12:00:00",
        20
      );
      const response = createForecast5Response([entry]);
      const result = parseForecastResponse(response);

      expect(result[0]).toHaveProperty("date");
      expect(result[0]).toHaveProperty("dayOfWeek");
      expect(result[0]).toHaveProperty("formattedDay");
      expect(result[0]).toHaveProperty("maxTemperature");
      expect(result[0]).toHaveProperty("minTemperature");
      expect(result[0]).toHaveProperty("mainWeather");
      expect(result[0]).toHaveProperty("hourlyDetails");
    });
  });

  describe("temperature calculations", () => {
    it("calculates correct max and min temperatures", () => {
      const entries = [
        createForecastEntry(createTimestamp("2024-01-15", 6), "2024-01-15 06:00:00", 10),
        createForecastEntry(createTimestamp("2024-01-15", 12), "2024-01-15 12:00:00", 25),
        createForecastEntry(createTimestamp("2024-01-15", 18), "2024-01-15 18:00:00", 18),
      ];
      const response = createForecast5Response(entries);
      const result = parseForecastResponse(response);

      expect(result[0].maxTemperature).toBe(25);
      expect(result[0].minTemperature).toBe(10);
    });

    it("rounds temperatures correctly for positive decimals", () => {
      const entries = [
        createForecastEntry(createTimestamp("2024-01-15", 12), "2024-01-15 12:00:00", 20.4),
        createForecastEntry(createTimestamp("2024-01-15", 15), "2024-01-15 15:00:00", 21.6),
      ];
      const response = createForecast5Response(entries);
      const result = parseForecastResponse(response);

      expect(result[0].maxTemperature).toBe(22); // 21.6 rounds to 22
      expect(result[0].minTemperature).toBe(20); // 20.4 rounds to 20
    });

    it("handles negative temperatures correctly", () => {
      const entries = [
        createForecastEntry(createTimestamp("2024-01-15", 6), "2024-01-15 06:00:00", -15),
        createForecastEntry(createTimestamp("2024-01-15", 12), "2024-01-15 12:00:00", -5),
      ];
      const response = createForecast5Response(entries);
      const result = parseForecastResponse(response);

      expect(result[0].maxTemperature).toBe(-5);
      expect(result[0].minTemperature).toBe(-15);
    });

    it("handles extreme temperatures", () => {
      const entries = [
        createForecastEntry(createTimestamp("2024-01-15", 6), "2024-01-15 06:00:00", -40),
        createForecastEntry(createTimestamp("2024-01-15", 12), "2024-01-15 12:00:00", 50),
      ];
      const response = createForecast5Response(entries);
      const result = parseForecastResponse(response);

      expect(result[0].maxTemperature).toBe(50);
      expect(result[0].minTemperature).toBe(-40);
    });

    it("rounds half values using standard rounding", () => {
      const entries = [
        createForecastEntry(createTimestamp("2024-01-15", 12), "2024-01-15 12:00:00", 10.5),
      ];
      const response = createForecast5Response(entries);
      const result = parseForecastResponse(response);

      expect(result[0].maxTemperature).toBe(11);
    });
  });

  describe("day of week labels", () => {
    it("returns 'Today' for current date", () => {
      const entry = createForecastEntry(
        createTimestamp("2024-01-15", 12),
        "2024-01-15 12:00:00",
        20
      );
      const response = createForecast5Response([entry]);
      const result = parseForecastResponse(response);

      expect(result[0].dayOfWeek).toBe("Today");
    });

    it("returns 'Tomorrow' for next day", () => {
      const entry = createForecastEntry(
        createTimestamp("2024-01-16", 12),
        "2024-01-16 12:00:00",
        20
      );
      const response = createForecast5Response([entry]);
      const result = parseForecastResponse(response);

      expect(result[0].dayOfWeek).toBe("Tomorrow");
    });

    it("returns weekday name for future dates", () => {
      const entry = createForecastEntry(
        createTimestamp("2024-01-17", 12),
        "2024-01-17 12:00:00",
        20
      );
      const response = createForecast5Response([entry]);
      const result = parseForecastResponse(response);

      expect(result[0].dayOfWeek).toBe("Wednesday");
    });

    it("formats date correctly in en-GB format", () => {
      const entry = createForecastEntry(
        createTimestamp("2024-01-15", 12),
        "2024-01-15 12:00:00",
        20
      );
      const response = createForecast5Response([entry]);
      const result = parseForecastResponse(response);

      expect(result[0].formattedDay).toBe("15/01/2024");
    });
  });

  describe("main weather condition selection", () => {
    it("selects weather closest to noon", () => {
      const morningWeather = createWeather({ main: "Clouds", description: "cloudy" });
      const noonWeather = createWeather({ main: "Clear", description: "clear sky" });
      const eveningWeather = createWeather({ main: "Rain", description: "light rain" });

      const entries = [
        createForecastEntry(createTimestamp("2024-01-15", 6), "2024-01-15 06:00:00", 15, {
          weather: [morningWeather],
        }),
        createForecastEntry(createTimestamp("2024-01-15", 12), "2024-01-15 12:00:00", 20, {
          weather: [noonWeather],
        }),
        createForecastEntry(createTimestamp("2024-01-15", 18), "2024-01-15 18:00:00", 17, {
          weather: [eveningWeather],
        }),
      ];
      const response = createForecast5Response(entries);
      const result = parseForecastResponse(response);

      expect(result[0].mainWeather.main).toBe("Clear");
    });

    it("handles all morning entries (no noon entry)", () => {
      const weather9am = createWeather({ main: "Clouds" });
      const weather6am = createWeather({ main: "Fog" });

      const entries = [
        createForecastEntry(createTimestamp("2024-01-15", 6), "2024-01-15 06:00:00", 10, {
          weather: [weather6am],
        }),
        createForecastEntry(createTimestamp("2024-01-15", 9), "2024-01-15 09:00:00", 12, {
          weather: [weather9am],
        }),
      ];
      const response = createForecast5Response(entries);
      const result = parseForecastResponse(response);

      expect(result[0].mainWeather.main).toBe("Clouds");
    });

    it("handles all evening entries", () => {
      const weather15 = createWeather({ main: "Clear" });
      const weather18 = createWeather({ main: "Clouds" });
      const weather21 = createWeather({ main: "Rain" });

      const entries = [
        createForecastEntry(createTimestamp("2024-01-15", 15), "2024-01-15 15:00:00", 20, {
          weather: [weather15],
        }),
        createForecastEntry(createTimestamp("2024-01-15", 18), "2024-01-15 18:00:00", 17, {
          weather: [weather18],
        }),
        createForecastEntry(createTimestamp("2024-01-15", 21), "2024-01-15 21:00:00", 14, {
          weather: [weather21],
        }),
      ];
      const response = createForecast5Response(entries);
      const result = parseForecastResponse(response);

      expect(result[0].mainWeather.main).toBe("Clear");
    });

    it("handles entry exactly at noon", () => {
      const noonWeather = createWeather({ main: "Sunny", description: "sunny" });

      const entries = [
        createForecastEntry(createTimestamp("2024-01-15", 12), "2024-01-15 12:00:00", 20, {
          weather: [noonWeather],
        }),
      ];
      const response = createForecast5Response(entries);
      const result = parseForecastResponse(response);

      expect(result[0].mainWeather.main).toBe("Sunny");
    });
  });

  describe("hourly details", () => {
    it("includes all forecast entries as hourly details", () => {
      const entries = [
        createForecastEntry(createTimestamp("2024-01-15", 6), "2024-01-15 06:00:00", 10),
        createForecastEntry(createTimestamp("2024-01-15", 9), "2024-01-15 09:00:00", 15),
        createForecastEntry(createTimestamp("2024-01-15", 12), "2024-01-15 12:00:00", 20),
        createForecastEntry(createTimestamp("2024-01-15", 15), "2024-01-15 15:00:00", 22),
      ];
      const response = createForecast5Response(entries);
      const result = parseForecastResponse(response);

      expect(result[0].hourlyDetails).toHaveLength(4);
    });

    it("maps hourly details with correct structure", () => {
      const entry = createForecastEntry(
        createTimestamp("2024-01-15", 12),
        "2024-01-15 12:00:00",
        20,
        {
          main: { temp: 20, feels_like: 18, temp_min: 19, temp_max: 21, pressure: 1013, humidity: 50 },
          weather: [createWeather({ icon: "01d", description: "clear sky" })],
        }
      );
      const response = createForecast5Response([entry]);
      const result = parseForecastResponse(response);

      const hourly = result[0].hourlyDetails[0];
      expect(hourly).toHaveProperty("dt");
      expect(hourly).toHaveProperty("time");
      expect(hourly).toHaveProperty("temp");
      expect(hourly).toHaveProperty("feelsLike");
      expect(hourly).toHaveProperty("icon");
      expect(hourly).toHaveProperty("description");
    });

    it("rounds hourly temperatures correctly", () => {
      const entry = createForecastEntry(
        createTimestamp("2024-01-15", 12),
        "2024-01-15 12:00:00",
        20.7,
        {
          main: { temp: 20.7, feels_like: 18.3, temp_min: 19, temp_max: 21, pressure: 1013, humidity: 50 },
        }
      );
      const response = createForecast5Response([entry]);
      const result = parseForecastResponse(response);

      expect(result[0].hourlyDetails[0].temp).toBe(21);
      expect(result[0].hourlyDetails[0].feelsLike).toBe(18);
    });

    it("capitalizes weather descriptions", () => {
      const entry = createForecastEntry(
        createTimestamp("2024-01-15", 12),
        "2024-01-15 12:00:00",
        20,
        {
          weather: [createWeather({ description: "light rain" })],
        }
      );
      const response = createForecast5Response([entry]);
      const result = parseForecastResponse(response);

      expect(result[0].hourlyDetails[0].description).toBe("Light rain");
    });

    it("handles negative temperatures in hourly details", () => {
      const entry = createForecastEntry(
        createTimestamp("2024-01-15", 12),
        "2024-01-15 12:00:00",
        -10.4,
        {
          main: { temp: -10.4, feels_like: -15.6, temp_min: -11, temp_max: -10, pressure: 1013, humidity: 50 },
        }
      );
      const response = createForecast5Response([entry]);
      const result = parseForecastResponse(response);

      expect(result[0].hourlyDetails[0].temp).toBe(-10);
      expect(result[0].hourlyDetails[0].feelsLike).toBe(-16);
    });

    it("includes correct icon from weather data", () => {
      const entry = createForecastEntry(
        createTimestamp("2024-01-15", 12),
        "2024-01-15 12:00:00",
        20,
        {
          weather: [createWeather({ icon: "10d" })],
        }
      );
      const response = createForecast5Response([entry]);
      const result = parseForecastResponse(response);

      expect(result[0].hourlyDetails[0].icon).toBe("10d");
    });
  });

  describe("multiple days", () => {
    it("handles 5 days of forecast data", () => {
      const entries: ForecastEntry[] = [];
      for (let day = 15; day <= 19; day++) {
        for (let hour = 0; hour < 24; hour += 3) {
          entries.push(
            createForecastEntry(
              createTimestamp(`2024-01-${day}`, hour),
              `2024-01-${day} ${hour.toString().padStart(2, "0")}:00:00`,
              15 + Math.random() * 10
            )
          );
        }
      }
      const response = createForecast5Response(entries);
      const result = parseForecastResponse(response);

      expect(result).toHaveLength(5);
    });

    it("maintains day order in output", () => {
      const entries = [
        createForecastEntry(createTimestamp("2024-01-15", 12), "2024-01-15 12:00:00", 20),
        createForecastEntry(createTimestamp("2024-01-16", 12), "2024-01-16 12:00:00", 22),
        createForecastEntry(createTimestamp("2024-01-17", 12), "2024-01-17 12:00:00", 18),
      ];
      const response = createForecast5Response(entries);
      const result = parseForecastResponse(response);

      expect(result[0].dayOfWeek).toBe("Today");
      expect(result[1].dayOfWeek).toBe("Tomorrow");
      expect(result[2].dayOfWeek).toBe("Wednesday");
    });
  });

  describe("edge cases with data format", () => {
    it("handles entries with all 8 time slots per day (3-hour intervals)", () => {
      const hours = [0, 3, 6, 9, 12, 15, 18, 21];
      const entries = hours.map((hour) =>
        createForecastEntry(
          createTimestamp("2024-01-15", hour),
          `2024-01-15 ${hour.toString().padStart(2, "0")}:00:00`,
          10 + hour
        )
      );
      const response = createForecast5Response(entries);
      const result = parseForecastResponse(response);

      expect(result).toHaveLength(1);
      expect(result[0].hourlyDetails).toHaveLength(8);
      expect(result[0].maxTemperature).toBe(31);
      expect(result[0].minTemperature).toBe(10);
    });

    it("handles mixed order of entries", () => {
      const entries = [
        createForecastEntry(createTimestamp("2024-01-16", 12), "2024-01-16 12:00:00", 22),
        createForecastEntry(createTimestamp("2024-01-15", 12), "2024-01-15 12:00:00", 20),
        createForecastEntry(createTimestamp("2024-01-15", 6), "2024-01-15 06:00:00", 15),
        createForecastEntry(createTimestamp("2024-01-16", 6), "2024-01-16 06:00:00", 17),
      ];
      const response = createForecast5Response(entries);
      const result = parseForecastResponse(response);

      expect(result).toHaveLength(2);
    });

    it("handles single entry at midnight", () => {
      const entry = createForecastEntry(
        createTimestamp("2024-01-15", 0),
        "2024-01-15 00:00:00",
        5
      );
      const response = createForecast5Response([entry]);
      const result = parseForecastResponse(response);

      expect(result).toHaveLength(1);
      expect(result[0].hourlyDetails).toHaveLength(1);
    });
  });
})
describe("isSameDay", () => {
  it("returns true for identical dates", () => {
    const date = new Date("2024-01-15T12:00:00");
    expect(isSameDay(date, date)).toBe(true);
  });

  it("returns true for same day with different times", () => {
    const morning = new Date("2024-01-15T06:00:00");
    const evening = new Date("2024-01-15T22:00:00");
    expect(isSameDay(morning, evening)).toBe(true);
  });

  it("returns false for different days", () => {
    const day1 = new Date("2024-01-15T12:00:00");
    const day2 = new Date("2024-01-16T12:00:00");
    expect(isSameDay(day1, day2)).toBe(false);
  });

  it("handles midnight boundary correctly", () => {
    const beforeMidnight = new Date("2024-01-15T23:59:59");
    const afterMidnight = new Date("2024-01-16T00:00:01");
    expect(isSameDay(beforeMidnight, afterMidnight)).toBe(false);
  });

  it("returns false for same day number in different months", () => {
    const jan15 = new Date("2024-01-15T12:00:00");
    const feb15 = new Date("2024-02-15T12:00:00");
    expect(isSameDay(jan15, feb15)).toBe(false);
  });

  it("returns false for same day/month in different years", () => {
    const year2024 = new Date("2024-01-15T12:00:00");
    const year2025 = new Date("2025-01-15T12:00:00");
    expect(isSameDay(year2024, year2025)).toBe(false);
  });

  it("handles year boundary (Dec 31 vs Jan 1)", () => {
    const dec31 = new Date("2024-12-31T23:00:00");
    const jan1 = new Date("2025-01-01T01:00:00");
    expect(isSameDay(dec31, jan1)).toBe(false);
  });

  it("returns true for same day at exact midnight", () => {
    const midnight1 = new Date("2024-01-15T00:00:00");
    const midnight2 = new Date("2024-01-15T00:00:00");
    expect(isSameDay(midnight1, midnight2)).toBe(true);
  });
});

