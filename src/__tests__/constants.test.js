import { describe, it, expect } from "vitest";
import {
	COLORS,
	SPEEDS,
	SPEED_LABELS,
	DEFAULT_SPEED_INDEX,
	ARRAY_SIZE,
	PSEUDOCODE,
	ANALOGIES,
} from "../utils/constants.js";

describe("COLORS", () => {
	it("should have all required color keys", () => {
		expect(COLORS.background).toBeDefined();
		expect(COLORS.barDefault).toBeDefined();
		expect(COLORS.barComparing).toBeDefined();
		expect(COLORS.barSwapping).toBeDefined();
		expect(COLORS.barSorted).toBeDefined();
		expect(COLORS.text).toBeDefined();
	});

	it("should have valid hex color format", () => {
		expect(COLORS.background).toMatch(/^#[0-9A-Fa-f]{6}$/);
		expect(COLORS.barDefault).toMatch(/^#[0-9A-Fa-f]{6}$/);
	});
});

describe("SPEEDS", () => {
	it("should have 5 speed levels", () => {
		expect(SPEEDS).toHaveLength(5);
	});

	it("should be in descending order (slower to faster)", () => {
		for (let i = 0; i < SPEEDS.length - 1; i++) {
			expect(SPEEDS[i]).toBeGreaterThan(SPEEDS[i + 1]);
		}
	});

	it("should match SPEED_LABELS length", () => {
		expect(SPEED_LABELS).toHaveLength(SPEEDS.length);
	});
});

describe("DEFAULT_SPEED_INDEX", () => {
	it("should be valid index", () => {
		expect(DEFAULT_SPEED_INDEX).toBeGreaterThanOrEqual(0);
		expect(DEFAULT_SPEED_INDEX).toBeLessThan(SPEEDS.length);
	});
});

describe("ARRAY_SIZE", () => {
	it("should have min, max, default", () => {
		expect(ARRAY_SIZE.min).toBeDefined();
		expect(ARRAY_SIZE.max).toBeDefined();
		expect(ARRAY_SIZE.default).toBeDefined();
	});

	it("should have valid range", () => {
		expect(ARRAY_SIZE.min).toBeLessThan(ARRAY_SIZE.max);
		expect(ARRAY_SIZE.default).toBeGreaterThanOrEqual(ARRAY_SIZE.min);
		expect(ARRAY_SIZE.default).toBeLessThanOrEqual(ARRAY_SIZE.max);
	});
});

describe("PSEUDOCODE", () => {
	it("should be non-empty array of strings", () => {
		expect(PSEUDOCODE.length).toBeGreaterThan(0);
		PSEUDOCODE.forEach((line) => expect(typeof line).toBe("string"));
	});
});

describe("ANALOGIES", () => {
	it("should have spotify, kakao, appstore types", () => {
		expect(ANALOGIES.spotify).toBeDefined();
		expect(ANALOGIES.kakao).toBeDefined();
		expect(ANALOGIES.appstore).toBeDefined();
	});

	it("each analogy should have required message functions", () => {
		for (const key of ["spotify", "kakao", "appstore"]) {
			const analogy = ANALOGIES[key];
			expect(analogy.name).toBeDefined();
			expect(analogy.icon).toBeDefined();
			expect(typeof analogy.compare).toBe("function");
			expect(typeof analogy.swap).toBe("function");
			expect(typeof analogy.noSwap).toBe("function");
			expect(typeof analogy.passEnd).toBe("function");
			expect(typeof analogy.done).toBe("function");
			expect(typeof analogy.earlyDone).toBe("function");
		}
	});

	it("compare should return string with values", () => {
		const msg = ANALOGIES.spotify.compare(10, 20);
		expect(typeof msg).toBe("string");
		expect(msg).toContain("10");
		expect(msg).toContain("20");
	});
});
