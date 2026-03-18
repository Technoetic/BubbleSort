import { BubbleSort } from "./BubbleSort.js";
import { Visualizer } from "./Visualizer.js";
import { CodePanel } from "./CodePanel.js";
import { SPEEDS, DEFAULT_SPEED_INDEX, ARRAY_SIZE } from "../utils/constants.js";

class App {
	#bubbleSort;
	#visualizer;
	#codePanel;
	#steps;
	#currentStep;
	#isPlaying;
	#speedIndex;
	#arraySize;
	#analogyType;
	#timer;

	constructor() {
		this.#steps = [];
		this.#currentStep = 0;
		this.#isPlaying = false;
		this.#speedIndex = DEFAULT_SPEED_INDEX;
		this.#arraySize = ARRAY_SIZE.default;
		this.#analogyType = "spotify";
		this.#timer = null;

		this.#init();
	}

	#init() {
		// Canvas
		const canvas = document.getElementById("visualizer");
		this.#visualizer = new Visualizer(canvas);

		// Code panel
		const codeBody = document.getElementById("code-body");
		this.#codePanel = new CodePanel(codeBody);

		// Event listeners
		this.#setupEventListeners();

		// Initial array
		this.#generateAndSort();

		// Resize handler
		window.addEventListener("resize", () => {
			this.#visualizer.resize();
			if (this.#steps.length > 0) {
				this.#visualizer.render(this.#steps[this.#currentStep]);
			}
		});

		// Print handler (Ctrl+P → PDF 저장 시 Canvas→이미지 변환)
		let printImg = null;

		window.addEventListener("beforeprint", () => {
			// Canvas를 이미지로 변환하여 인쇄 시 비트맵 그대로 출력
			printImg = document.createElement("img");
			printImg.src = canvas.toDataURL("image/png");
			printImg.className = "print-snapshot";
			printImg.style.width = "100%";
			printImg.style.height = "auto";
			printImg.style.display = "none";
			canvas.parentElement.appendChild(printImg);
			canvas.classList.add("print-hidden");
		});

		window.addEventListener("afterprint", () => {
			if (printImg) {
				printImg.remove();
				printImg = null;
			}
			canvas.classList.remove("print-hidden");
		});
	}

	#setupEventListeners() {
		// Playback
		document
			.getElementById("btn-play")
			.addEventListener("click", () => this.#togglePlay());
		document
			.getElementById("btn-prev")
			.addEventListener("click", () => this.#stepBackward());
		document
			.getElementById("btn-next")
			.addEventListener("click", () => this.#stepForward());
		document
			.getElementById("btn-reset")
			.addEventListener("click", () => this.#reset());

		// Array generation
		document
			.getElementById("btn-random")
			.addEventListener("click", () => this.#generateAndSort());
		document
			.getElementById("btn-preset-sorted")
			.addEventListener("click", () => this.#generatePreset("sorted"));
		document
			.getElementById("btn-preset-reverse")
			.addEventListener("click", () => this.#generatePreset("reversed"));

		// Speed slider
		const speedSlider = document.getElementById("speed-slider");
		speedSlider.value = this.#speedIndex + 1;
		speedSlider.addEventListener("input", (e) => {
			this.#speedIndex = parseInt(e.target.value) - 1;
		});

		// Size slider
		const sizeSlider = document.getElementById("size-slider");
		sizeSlider.value = this.#arraySize;
		sizeSlider.addEventListener("input", (e) => {
			this.#arraySize = parseInt(e.target.value);
			document.getElementById("size-value").textContent = this.#arraySize;
			document.getElementById("stat-size").textContent = this.#arraySize;
			this.#pause();
			this.#generateAndSort();
		});

		// Analogy select
		document
			.getElementById("analogy-select")
			.addEventListener("change", (e) => {
				this.#analogyType = e.target.value;
				this.#pause();
				this.#regenerateSteps();
			});

		// Keyboard shortcuts
		document.addEventListener("keydown", (e) => {
			if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
			switch (e.key) {
				case " ":
					e.preventDefault();
					this.#togglePlay();
					break;
				case "ArrowLeft":
					e.preventDefault();
					this.#stepBackward();
					break;
				case "ArrowRight":
					e.preventDefault();
					this.#stepForward();
					break;
				case "r":
				case "R":
					e.preventDefault();
					this.#reset();
					break;
			}
		});

		// Help modal
		document.getElementById("help-btn").addEventListener("click", () => {
			document.getElementById("help-modal").hidden = false;
		});
		document.getElementById("modal-close").addEventListener("click", () => {
			document.getElementById("help-modal").hidden = true;
		});
		document.getElementById("help-modal").addEventListener("click", (e) => {
			if (e.target.id === "help-modal") {
				e.target.hidden = true;
			}
		});

		// Code panel toggle
		const codeToggle = document.getElementById("code-toggle");
		if (codeToggle) {
			codeToggle.addEventListener("click", () => {
				const body = document.getElementById("code-body");
				const expanded = codeToggle.getAttribute("aria-expanded") === "true";
				codeToggle.setAttribute("aria-expanded", !expanded);
				body.hidden = expanded;
			});
		}
	}

	#generateRandomArray() {
		const arr = [];
		for (let i = 0; i < this.#arraySize; i++) {
			arr.push(Math.floor(Math.random() * 95) + 5);
		}
		return arr;
	}

	#generatePreset(type) {
		this.#pause();
		let arr;
		if (type === "sorted") {
			arr = Array.from(
				{ length: this.#arraySize },
				(_, i) => Math.floor(((i + 1) / this.#arraySize) * 90) + 5,
			);
		} else if (type === "reversed") {
			arr = Array.from(
				{ length: this.#arraySize },
				(_, i) =>
					Math.floor(((this.#arraySize - i) / this.#arraySize) * 90) + 5,
			);
		}
		this.#bubbleSort = new BubbleSort(arr, this.#analogyType);
		this.#steps = this.#bubbleSort.sort();
		this.#currentStep = 0;
		this.#updateUI();
	}

	#generateAndSort() {
		const arr = this.#generateRandomArray();
		this.#bubbleSort = new BubbleSort(arr, this.#analogyType);
		this.#steps = this.#bubbleSort.sort();
		this.#currentStep = 0;
		this.#updateUI();
	}

	#regenerateSteps() {
		if (!this.#bubbleSort) return;
		this.#bubbleSort.setAnalogyType(this.#analogyType);
		const currentArray =
			this.#steps.length > 0
				? [...this.#steps[0].array]
				: this.#generateRandomArray();
		this.#bubbleSort.reset(currentArray);
		this.#steps = this.#bubbleSort.sort();
		this.#currentStep = 0;
		this.#updateUI();
	}

	#togglePlay() {
		if (this.#isPlaying) {
			this.#pause();
		} else {
			this.#play();
		}
	}

	#play() {
		if (this.#currentStep >= this.#steps.length - 1) {
			this.#currentStep = 0;
		}
		this.#isPlaying = true;
		this.#updatePlayButton();
		this.#tick();
	}

	#pause() {
		this.#isPlaying = false;
		if (this.#timer) {
			clearTimeout(this.#timer);
			this.#timer = null;
		}
		this.#updatePlayButton();
	}

	#tick() {
		if (!this.#isPlaying) return;
		if (this.#currentStep >= this.#steps.length - 1) {
			this.#pause();
			return;
		}
		this.#currentStep++;
		this.#updateUI();
		this.#timer = setTimeout(() => this.#tick(), SPEEDS[this.#speedIndex]);
	}

	#stepForward() {
		if (this.#currentStep < this.#steps.length - 1) {
			this.#pause();
			this.#currentStep++;
			this.#updateUI();
		}
	}

	#stepBackward() {
		if (this.#currentStep > 0) {
			this.#pause();
			this.#currentStep--;
			this.#updateUI();
		}
	}

	#reset() {
		this.#pause();
		this.#currentStep = 0;
		this.#updateUI();
	}

	#updateUI() {
		if (this.#steps.length === 0) return;
		const step = this.#steps[this.#currentStep];

		// Visualizer
		this.#visualizer.render(step);

		// Code panel
		this.#codePanel.highlight(step.codeLine);

		// Stats
		document.getElementById("stat-comparisons").textContent =
			step.totalComparisons;
		document.getElementById("stat-swaps").textContent = step.totalSwaps;
		document.getElementById("stat-pass").textContent = step.pass;
		document.getElementById("stat-size").textContent = step.array.length;

		// Step counter
		document.getElementById("step-current").textContent = this.#currentStep;
		document.getElementById("step-total").textContent = this.#steps.length - 1;

		// Message
		document.getElementById("message-text").textContent = step.message;

		// Progress on controls
		this.#updateProgress();
	}

	#updatePlayButton() {
		const playBtn = document.getElementById("btn-play");
		const iconPlay = playBtn.querySelector(".icon-play");
		const iconPause = playBtn.querySelector(".icon-pause");
		if (this.#isPlaying) {
			iconPlay.hidden = true;
			iconPause.hidden = false;
			playBtn.setAttribute("aria-label", "일시정지");
		} else {
			iconPlay.hidden = false;
			iconPause.hidden = true;
			playBtn.setAttribute("aria-label", "재생");
		}
	}

	#updateProgress() {
		const total = this.#steps.length - 1;
		const pct = total > 0 ? (this.#currentStep / total) * 100 : 0;
		const bar = document.querySelector(".progress-fill");
		if (bar) bar.style.width = pct + "%";
	}
}

// Boot
document.addEventListener("DOMContentLoaded", () => {
	new App();
});
