import { describe, expect, it } from "vitest";

describe("common utilities", () => {
    describe("capitalize", () => {
        it("capitalizes first letter of a word", async () => {
            const { capitalize } = await import("./common");
            expect(capitalize("hello")).toBe("Hello");
        });

        it("handles empty string", async () => {
            const { capitalize } = await import("./common");
            expect(capitalize("")).toBe("");
        });

        it("handles single character", async () => {
            const { capitalize } = await import("./common");
            expect(capitalize("a")).toBe("A");
        });

        it("preserves rest of string", async () => {
            const { capitalize } = await import("./common");
            expect(capitalize("hELLO")).toBe("HELLO");
        });

        it("handles multi-word strings", async () => {
            const { capitalize } = await import("./common");
            expect(capitalize("light rain")).toBe("Light rain");
        });
    });

    describe("formatTime", () => {
        it("formats timestamp to 24-hour time", async () => {
            const { formatTime } = await import("./common");
            // 2024-01-15 12:00:00 UTC
            const timestamp = 1705320000;
            const result = formatTime(timestamp);
            // Result depends on locale, but should be in HH:MM format
            expect(result).toMatch(/^\d{2}:\d{2}$/);
        });

        it("handles midnight timestamp", async () => {
            const { formatTime } = await import("./common");
            const midnight = new Date("2024-01-15T00:00:00").getTime() / 1000;
            const result = formatTime(midnight);
            expect(result).toMatch(/^\d{2}:\d{2}$/);
        });
    });
});
