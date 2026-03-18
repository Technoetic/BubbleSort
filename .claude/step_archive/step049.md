# Step 49 - 리팩토링 스크린샷 검증 (독립 검증 루프)

Step 045 리팩토링 완료 후, 리팩토링으로 인해 UI가 깨지지 않았는지 **작성자와 검증자를 분리하여** 검증한다.

## 핵심 원칙: 작성 에이전트 ≠ 검증 에이전트

같은 에이전트가 리팩토링하고 스스로 통과 판정하는 것을 **금지**한다. 반드시 독립된 두 에이전트를 사용한다.

**필요한 파일:**

- step030_설계_chunk*.md (레이아웃 설계)
- step031_설계_chunk*.md (전체 설계)

**이 단계에서 절대로 plan mode를 사용하지 않는다.**

**스크린샷 없이 통과 처리 금지. 반드시 Claude가 직접 스크린샷을 눈으로 확인한다.**

## 실행 순서

### 1단계: 리팩토링 후 스크린샷 촬영

Playwright로 현재 구현의 스크린샷을 뷰포트별로 촬영한다:
- 데스크톱 (1920×1080): `.claude/screenshots/refactor-verify-desktop-r1.png`
- 태블릿 (768×1024): `.claude/screenshots/refactor-verify-tablet-r1.png`
- 모바일 (390×844): `.claude/screenshots/refactor-verify-mobile-r1.png`

### 2단계: 검증 에이전트 (에이전트 B) 실행

**에이전트 B의 역할: UI 회귀 검증만 수행. 코드 수정 금지.**

에이전트 B에게 전달할 프롬프트 (N = 현재 라운드 번호):

```
너는 UI 회귀 검증자다. 코드를 수정하지 않는다. 비교 판정만 한다.

1. 설계 문서를 모두 Read한다:
   - `.claude/step031_설계_chunk*.md` (Glob 검색)

2. 리팩토링 전 스크린샷 (기준선)을 Read한다:
   - `.claude/screenshots/layout-verify-desktop-r*.png` 중 가장 최신 (Glob 검색)

3. 리팩토링 후 스크린샷을 Read한다:
   - `.claude/screenshots/refactor-verify-desktop-rN.png`
   - `.claude/screenshots/refactor-verify-tablet-rN.png`
   - `.claude/screenshots/refactor-verify-mobile-rN.png`

4. 이전 라운드 검증 결과가 있으면 모두 Read한다:
   - `.claude/step_archive/outputs/step049_검증_r*.md` (Glob 검색)

5. 리팩토링 전후를 비교하여 UI가 깨진 부분을 구체적으로 나열한다.
   각 항목마다: 어떤 요소가 어떻게 변경/손상되었는지 명시한다.

6. 디자인 자연스러움도 검토한다.

7. 결과를 `.claude/step_archive/outputs/step049_검증_rN.md`에 저장한다.
   - UI 회귀 없으면: "PASS"로 시작
   - UI 회귀 있으면: "FAIL"로 시작하고 구체적 피드백 나열
```

에이전트 B는 sonnet을 사용한다.

### 3단계: 판정 확인

- **PASS** → 다음 Step으로 이동
- **FAIL** → 4단계 (수정 에이전트 A 실행)

### 4단계: 수정 에이전트 (에이전트 A) 실행

**에이전트 A의 역할: 검증 피드백을 반영하여 코드 수정만 수행. 통과 판정 금지.**

```
너는 UI 회귀 수정자다. 통과 여부를 판정하지 않는다. 피드백을 반영만 한다.

1. 최신 검증 피드백을 Read한다:
   - `.claude/step_archive/outputs/step049_검증_rN.md`
2. 피드백에 나열된 UI 회귀를 소스 코드에서 수정한다.
3. 수정 내역을 `.claude/step_archive/outputs/step049_수정_rN.md`에 기록한다.
```

에이전트 A는 sonnet을 사용한다.

### 5단계: 재촬영 → 2단계로 돌아가기

### 반복 제한: 무한 반복 + 스마트 탈출

회차 제한 없이 PASS가 나올 때까지 반복한다.

**탈출 조건:**
1. **PASS** → 즉시 종료
2. **동일 항목 3연속 [미수정]** → 해당 항목만 스킵 처리하고 나머지 항목은 계속 반복
3. **모든 FAIL 항목이 스킵 상태** → 종료 (해결 불가 판정, 스킵 사유를 최종 보고에 기록)

## 주의사항

- 에이전트 A가 스스로 "통과"라고 판단하는 것을 금지한다
- 에이전트 B가 코드를 수정하는 것을 금지한다
- 에이전트 B의 PASS/FAIL 판정만이 루프 종료 조건이다

---

이 지침을 완료한 즉시 자동으로 step050.md를 읽고 수행한다. 사용자 확인을 기다리지 않는다.
