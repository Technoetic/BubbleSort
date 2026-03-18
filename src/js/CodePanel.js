import { PSEUDOCODE, COLORS } from "../utils/constants.js";

export class CodePanel {
	#container;
	#lines;
	#currentLine;

	constructor(containerElement) {
		this.#container = containerElement;
		this.#lines = [];
		this.#currentLine = -1;
		this.#render();
	}

	// 의사코드 렌더링
	#render() {
		this.#container.innerHTML = "";
		const pre = document.createElement("pre");
		pre.className = "code-block";

		PSEUDOCODE.forEach((line, i) => {
			const div = document.createElement("div");
			div.className = "code-line";
			div.dataset.line = i;

			const lineNum = document.createElement("span");
			lineNum.className = "line-number";
			lineNum.textContent = String(i + 1).padStart(2, " ");

			const lineContent = document.createElement("span");
			lineContent.className = "line-content";
			lineContent.textContent = line;

			div.appendChild(lineNum);
			div.appendChild(lineContent);
			pre.appendChild(div);
			this.#lines.push(div);
		});

		this.#container.appendChild(pre);
	}

	// 줄 하이라이트
	highlight(lineNumber) {
		// 이전 하이라이트 제거
		if (this.#currentLine >= 0 && this.#currentLine < this.#lines.length) {
			this.#lines[this.#currentLine].classList.remove("active");
		}

		this.#currentLine = lineNumber;

		// 새 하이라이트
		if (lineNumber >= 0 && lineNumber < this.#lines.length) {
			this.#lines[lineNumber].classList.add("active");
			// 스크롤 보이도록
			this.#lines[lineNumber].scrollIntoView({
				behavior: "smooth",
				block: "nearest",
			});
		}
	}

	reset() {
		this.#lines.forEach((line) => line.classList.remove("active"));
		this.#currentLine = -1;
	}
}
