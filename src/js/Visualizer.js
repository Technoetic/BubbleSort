import { COLORS } from "../utils/constants.js";

export class Visualizer {
	#canvas;
	#ctx;
	#bars; // { x, targetX, y, width, height, value }[]
	#animating;
	#animationId;

	constructor(canvasElement) {
		this.#canvas = canvasElement;
		this.#ctx = canvasElement.getContext("2d");
		this.#bars = [];
		this.#animating = false;
		this.#animationId = null;
		this.resize();
	}

	// 캔버스 리사이즈
	resize() {
		const container = this.#canvas.parentElement;
		const dpr = window.devicePixelRatio || 1;
		this.#canvas.width = container.clientWidth * dpr;
		this.#canvas.height = container.clientHeight * dpr;
		this.#canvas.style.width = container.clientWidth + "px";
		this.#canvas.style.height = container.clientHeight + "px";
		this.#ctx.setTransform(1, 0, 0, 1, 0, 0); // scale 리셋
		this.#ctx.scale(dpr, dpr);
	}

	// 막대 위치 계산
	#calculateBars(array) {
		const w = this.#canvas.clientWidth;
		const h = this.#canvas.clientHeight;
		const padding = 24;
		const maxVal = Math.max(...array);
		const barGap = 2;
		const barWidth = Math.min(
			60,
			Math.max(
				4,
				(w - padding * 2 - barGap * (array.length - 1)) / array.length,
			),
		);
		const totalWidth = array.length * barWidth + (array.length - 1) * barGap;
		const startX = (w - totalWidth) / 2;
		const topPadding = padding + 40; // 상단 여백 + 값 라벨 공간
		const bottomPadding = 0; // 바닥에 붙임
		const maxHeight = h - topPadding - bottomPadding;

		this.#bars = array.map((val, i) => ({
			x: startX + i * (barWidth + barGap),
			targetX: startX + i * (barWidth + barGap),
			width: barWidth,
			height: (val / maxVal) * maxHeight,
			value: val,
			y: h - bottomPadding - (val / maxVal) * maxHeight,
		}));
	}

	// 단계 렌더링
	render(step) {
		this.#calculateBars(step.array);
		this.#draw(step);
	}

	// 전체 그리기
	#draw(step) {
		const ctx = this.#ctx;
		const w = this.#canvas.clientWidth;
		const h = this.#canvas.clientHeight;

		// 배경 클리어
		ctx.clearRect(0, 0, w, h);

		// 막대 그리기
		this.#bars.forEach((bar, i) => {
			let color = COLORS.barDefault;
			let glowColor = null;

			if (step.sortedIndices && step.sortedIndices.includes(i)) {
				color = COLORS.barSorted;
			}
			if (step.comparing && step.comparing.includes(i)) {
				if (
					step.phase === "swap" &&
					step.swapIndices &&
					step.swapIndices.includes(i)
				) {
					color = COLORS.barSwapping;
					glowColor = COLORS.glowSwap;
				} else {
					color = COLORS.barComparing;
					glowColor = COLORS.glowCompare;
				}
			}

			// 글로우 효과
			if (glowColor) {
				ctx.save();
				ctx.shadowColor = glowColor;
				ctx.shadowBlur = 15;
				ctx.shadowOffsetX = 0;
				ctx.shadowOffsetY = 0;
			}

			// 막대 그리기 (둥근 모서리)
			ctx.fillStyle = color;
			ctx.beginPath();
			const radius = Math.min(4, bar.width / 2);
			ctx.roundRect(bar.x, bar.y, bar.width, bar.height, [
				radius,
				radius,
				0,
				0,
			]);
			ctx.fill();

			if (glowColor) {
				ctx.restore();
			}

			// 값 라벨 (배열 크기 20 이하일 때)
			if (this.#bars.length <= 20) {
				ctx.fillStyle = COLORS.text;
				ctx.font = `${Math.min(14, bar.width - 2)}px "JetBrains Mono", monospace`;
				ctx.textAlign = "center";
				ctx.fillText(bar.value, bar.x + bar.width / 2, bar.y - 8);
			}
		});
	}

	// 교환 애니메이션 (Promise 기반)
	animateSwap(step, duration = 300) {
		return new Promise((resolve) => {
			if (!step.swapIndices) {
				resolve();
				return;
			}
			const [i, j] = step.swapIndices;
			this.#calculateBars(step.array);

			// 교환 전 위치에서 시작
			const barI = { ...this.#bars[i] };
			const barJ = { ...this.#bars[j] };
			// 교환 후 이므로 실제로는 이미 교환된 상태
			// i의 bar는 j의 위치로, j의 bar는 i의 위치로 이동해야 하는 것처럼 보이게
			// 하지만 array는 이미 교환된 상태이므로 그냥 렌더링하면 됨

			const startTime = performance.now();

			const animate = (currentTime) => {
				const elapsed = currentTime - startTime;
				const progress = Math.min(elapsed / duration, 1);
				const eased = 1 - (1 - progress) ** 3; // easeOutCubic

				this.#draw(step); // 현재 상태 렌더링

				if (progress < 1) {
					this.#animationId = requestAnimationFrame(animate);
				} else {
					resolve();
				}
			};

			this.#animationId = requestAnimationFrame(animate);
		});
	}

	clear() {
		const w = this.#canvas.clientWidth;
		const h = this.#canvas.clientHeight;
		this.#ctx.clearRect(0, 0, w, h);
	}

	cancelAnimation() {
		if (this.#animationId) {
			cancelAnimationFrame(this.#animationId);
			this.#animationId = null;
		}
	}
}
