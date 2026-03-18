// 색상 상수
export const COLORS = {
	background: "#0F0F23",
	surface: "#1A1A2E",
	barDefault: "#4ECDC4",
	barComparing: "#FFD700",
	barSwapping: "#FF6B6B",
	barSorted: "#2ECC71",
	text: "#E0E0E0",
	textMuted: "#888888",
	accent: "#667EEA",
	glowCompare: "rgba(255, 215, 0, 0.4)",
	glowSwap: "rgba(255, 107, 107, 0.4)",
};

// 속도 설정 (ms per step)
export const SPEEDS = [2000, 1000, 500, 250, 100];
export const SPEED_LABELS = ["0.25x", "0.5x", "1x", "2x", "4x"];
export const DEFAULT_SPEED_INDEX = 2;

// 배열 크기
export const ARRAY_SIZE = { min: 4, max: 50, default: 10 };

// 의사코드 라인
export const PSEUDOCODE = [
	"function bubbleSort(arr):",
	"  n = arr.length",
	"  for i = 0 to n-1:",
	"    swapped = false",
	"    for j = 0 to n-i-2:",
	"      if arr[j] > arr[j+1]:",
	"        swap(arr[j], arr[j+1])",
	"        swapped = true",
	"    if not swapped:",
	"      break",
	"  return arr",
];

// 비유 메시지 (spotify, kakao, appstore 3가지 타입)
export const ANALOGIES = {
	spotify: {
		name: "Spotify 플레이리스트",
		icon: "🎵",
		compare: (a, b) =>
			`🎵 '${a}회 재생곡'과 '${b}회 재생곡'의 재생 횟수를 비교합니다`,
		swap: (a, b) => `🔄 재생 횟수가 더 많은 '${b}회 곡'이 위로 올라갑니다!`,
		noSwap: (a, b) => `✓ '${a}회 곡'이 '${b}회 곡'보다 적으니 그대로 둡니다`,
		passEnd: (pass) =>
			`✅ ${pass}번째 패스 완료! 가장 인기 있는 곡이 맨 뒤로 떠올랐습니다`,
		done: () => `🎉 플레이리스트가 재생 횟수순으로 정렬되었습니다!`,
		earlyDone: () =>
			`⚡ 이미 정렬되어 있어서 조기 종료! Spotify도 이렇게 효율을 높여요`,
	},
	kakao: {
		name: "카카오톡 채팅",
		icon: "💬",
		compare: (a, b) =>
			`💬 '${a}번 채팅방'과 '${b}번 채팅방'의 최신 메시지 시간을 비교합니다`,
		swap: (a, b) =>
			`🔄 더 최근 메시지가 있는 '${b}번 채팅방'이 위로 올라갑니다!`,
		noSwap: (a, b) => `✓ '${a}번 채팅방'이 더 오래됐으니 아래에 그대로`,
		passEnd: (pass) => `✅ ${pass}번째 확인 완료! 가장 오래된 채팅이 맨 아래로`,
		done: () => `🎉 채팅방이 최신순으로 정렬되었습니다!`,
		earlyDone: () => `⚡ 이미 최신순이라 바로 완료! 카카오톡도 이런 원리`,
	},
	appstore: {
		name: "앱스토어 차트",
		icon: "📱",
		compare: (a, b) =>
			`📱 '${a}위 앱'과 '${b}위 앱'의 다운로드 수를 비교합니다`,
		swap: (a, b) => `🔄 다운로드가 더 많은 '${b}위 앱'이 순위가 올라갑니다!`,
		noSwap: (a, b) => `✓ '${a}위 앱'이 다운로드가 적으니 현재 순위 유지`,
		passEnd: (pass) => `✅ ${pass}번째 순위 조정 완료! 인기 앱이 상위로`,
		done: () => `🎉 앱 차트가 다운로드순으로 정렬되었습니다!`,
		earlyDone: () => `⚡ 이미 인기순이라 조기 종료! 효율적인 차트 정렬`,
	},
};
