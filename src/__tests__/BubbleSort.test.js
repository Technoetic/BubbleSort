import { describe, it, expect } from "vitest";
import { BubbleSort } from "../js/BubbleSort.js";

describe("BubbleSort", () => {
	describe("constructor", () => {
		it("should create instance with array", () => {
			const bs = new BubbleSort([5, 3, 8, 1]);
			expect(bs.totalSteps).toBe(0);
		});
	});

	describe("sort", () => {
		it("should generate steps for unsorted array", () => {
			const bs = new BubbleSort([5, 3, 8, 1]);
			const steps = bs.sort();
			expect(steps.length).toBeGreaterThan(0);
			expect(bs.totalSteps).toBe(steps.length);
		});

		it("should sort array correctly", () => {
			const bs = new BubbleSort([5, 3, 8, 1, 4]);
			const steps = bs.sort();
			const lastStep = steps[steps.length - 1];
			expect(lastStep.array).toEqual([1, 3, 4, 5, 8]);
		});

		it("should handle already sorted array with early termination", () => {
			const bs = new BubbleSort([1, 2, 3, 4, 5]);
			const steps = bs.sort();
			const lastStep = steps[steps.length - 1];
			expect(lastStep.phase).toBe("done");
			expect(lastStep.array).toEqual([1, 2, 3, 4, 5]);
		});

		it("should handle reversed array (worst case)", () => {
			const bs = new BubbleSort([5, 4, 3, 2, 1]);
			const steps = bs.sort();
			const lastStep = steps[steps.length - 1];
			expect(lastStep.array).toEqual([1, 2, 3, 4, 5]);
		});

		it("should handle single element array", () => {
			const bs = new BubbleSort([42]);
			const steps = bs.sort();
			const lastStep = steps[steps.length - 1];
			expect(lastStep.array).toEqual([42]);
		});

		it("should handle two element array", () => {
			const bs = new BubbleSort([2, 1]);
			const steps = bs.sort();
			const lastStep = steps[steps.length - 1];
			expect(lastStep.array).toEqual([1, 2]);
		});

		it("should handle array with duplicates", () => {
			const bs = new BubbleSort([3, 1, 3, 2, 1]);
			const steps = bs.sort();
			const lastStep = steps[steps.length - 1];
			expect(lastStep.array).toEqual([1, 1, 2, 3, 3]);
		});

		it("each step should have required fields", () => {
			const bs = new BubbleSort([3, 1, 2]);
			const steps = bs.sort();

			steps.forEach((step) => {
				expect(step.array).toBeDefined();
				expect(Array.isArray(step.array)).toBe(true);
				expect(typeof step.totalComparisons).toBe("number");
				expect(typeof step.totalSwaps).toBe("number");
				expect(typeof step.message).toBe("string");
				expect(typeof step.codeLine).toBe("number");
				expect(typeof step.phase).toBe("string");
				expect(Array.isArray(step.sortedIndices)).toBe(true);
			});
		});

		it("should track comparisons and swaps correctly", () => {
			const bs = new BubbleSort([3, 1]);
			const steps = bs.sort();
			const compareStep = steps.find((s) => s.phase === "compare");
			expect(compareStep).toBeDefined();
			expect(compareStep.totalComparisons).toBeGreaterThan(0);
		});

		it("should mark sorted indices after each pass", () => {
			const bs = new BubbleSort([3, 1, 2]);
			const steps = bs.sort();
			const passEndSteps = steps.filter((s) => s.phase === "pass-end");
			if (passEndSteps.length > 0) {
				expect(passEndSteps[0].sortedIndices.length).toBeGreaterThan(0);
			}
		});
	});

	describe("setAnalogyType", () => {
		it("should change analogy type", () => {
			const bs = new BubbleSort([3, 1, 2], "spotify");
			bs.setAnalogyType("kakao");
			bs.reset([3, 1, 2]);
			const steps = bs.sort();
			const msg = steps.find((s) => s.phase === "compare")?.message || "";
			expect(msg).toContain("💬");
		});
	});

	describe("reset", () => {
		it("should reset with new array", () => {
			const bs = new BubbleSort([5, 3]);
			bs.sort();
			expect(bs.totalSteps).toBeGreaterThan(0);
			bs.reset([1, 2, 3]);
			expect(bs.totalSteps).toBe(0);
		});
	});
});
