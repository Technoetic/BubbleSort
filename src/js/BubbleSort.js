import { ANALOGIES } from "../utils/constants.js";

export class BubbleSort {
	#originalArray;
	#steps;
	#analogyType;

	constructor(array, analogyType = "spotify") {
		this.#originalArray = [...array];
		this.#steps = [];
		this.#analogyType = analogyType;
	}

	// 전체 정렬 단계 생성 (한 번에 모두)
	sort() {
		const arr = [...this.#originalArray];
		const n = arr.length;
		this.#steps = [];
		let totalComparisons = 0;
		let totalSwaps = 0;
		const sortedIndices = [];
		const analogy = ANALOGIES[this.#analogyType];

		// 초기 상태 추가
		this.#steps.push({
			array: [...arr],
			comparing: null,
			swapped: false,
			swapIndices: null,
			sortedIndices: [...sortedIndices],
			pass: 0,
			comparison: 0,
			totalComparisons,
			totalSwaps,
			message: `${analogy.icon} 정렬을 시작합니다! 배열 크기: ${n}`,
			codeLine: 0,
			phase: "init",
		});

		for (let i = 0; i < n - 1; i++) {
			let swappedInPass = false;

			for (let j = 0; j < n - i - 1; j++) {
				totalComparisons++;

				// 비교 단계
				this.#steps.push({
					array: [...arr],
					comparing: [j, j + 1],
					swapped: false,
					swapIndices: null,
					sortedIndices: [...sortedIndices],
					pass: i + 1,
					comparison: j + 1,
					totalComparisons,
					totalSwaps,
					message: analogy.compare(arr[j], arr[j + 1]),
					codeLine: 5,
					phase: "compare",
				});

				if (arr[j] > arr[j + 1]) {
					// 교환
					[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
					totalSwaps++;
					swappedInPass = true;

					this.#steps.push({
						array: [...arr],
						comparing: [j, j + 1],
						swapped: true,
						swapIndices: [j, j + 1],
						sortedIndices: [...sortedIndices],
						pass: i + 1,
						comparison: j + 1,
						totalComparisons,
						totalSwaps,
						message: analogy.swap(arr[j + 1], arr[j]),
						codeLine: 6,
						phase: "swap",
					});
				} else {
					// 교환 없음
					this.#steps.push({
						array: [...arr],
						comparing: [j, j + 1],
						swapped: false,
						swapIndices: null,
						sortedIndices: [...sortedIndices],
						pass: i + 1,
						comparison: j + 1,
						totalComparisons,
						totalSwaps,
						message: analogy.noSwap(arr[j], arr[j + 1]),
						codeLine: 5,
						phase: "no-swap",
					});
				}
			}

			// 패스 완료 - 마지막 요소는 정렬됨
			sortedIndices.push(n - 1 - i);

			this.#steps.push({
				array: [...arr],
				comparing: null,
				swapped: false,
				swapIndices: null,
				sortedIndices: [...sortedIndices],
				pass: i + 1,
				comparison: 0,
				totalComparisons,
				totalSwaps,
				message: analogy.passEnd(i + 1),
				codeLine: 8,
				phase: "pass-end",
			});

			// Early termination
			if (!swappedInPass) {
				// 나머지 모두 정렬됨
				for (let k = 0; k < n; k++) {
					if (!sortedIndices.includes(k)) sortedIndices.push(k);
				}

				this.#steps.push({
					array: [...arr],
					comparing: null,
					swapped: false,
					swapIndices: null,
					sortedIndices: [...sortedIndices],
					pass: i + 1,
					comparison: 0,
					totalComparisons,
					totalSwaps,
					message: analogy.earlyDone(),
					codeLine: 9,
					phase: "done",
				});
				return this.#steps;
			}
		}

		// 첫 번째 요소도 정렬 완료
		if (!sortedIndices.includes(0)) sortedIndices.push(0);

		this.#steps.push({
			array: [...arr],
			comparing: null,
			swapped: false,
			swapIndices: null,
			sortedIndices: [...sortedIndices],
			pass: n - 1,
			comparison: 0,
			totalComparisons,
			totalSwaps,
			message: analogy.done(),
			codeLine: 10,
			phase: "done",
		});

		return this.#steps;
	}

	reset(newArray) {
		this.#originalArray = [...newArray];
		this.#steps = [];
	}

	setAnalogyType(type) {
		this.#analogyType = type;
	}

	get steps() {
		return this.#steps;
	}
	get totalSteps() {
		return this.#steps.length;
	}
}
