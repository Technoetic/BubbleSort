# Step 33 - 구현

## 실행 내용

합리적인 선에서 최대한 많은 서브에이전트를 병렬로 사용하여 step030_설계_chunk*.md (레이아웃 설계)와 step031_설계_chunk*.md (전체 설계)를 구현한다.

Class 지향으로 구현한다.

## 🚨 필수: CSS 작성 시 Awwwards 조사 결과 참조

CSS를 작성하는 서브에이전트에게는 반드시 아래 지시를 포함한다:

1. `.claude/screenshots/research/awwwards-*.png` 패턴으로 Glob 검색하여 **모두** Read할 것
2. `.claude/awwwards-*.txt` 패턴으로 Glob 검색하여 **모두** Read할 것
3. 스크린샷에서 직접 디자인 패턴을 추출하여 CSS에 반영할 것

CSS 담당 서브에이전트는 스크린샷을 읽어야 하므로 **haiku를 사용하지 않는다** (sonnet 이상 사용).

그 외 서브에이전트(JS, HTML)는 haiku를 사용한다.

**구현 단계에서 절대로 plan mode를 사용하지 않는다.**

---

이 지침을 완료한 즉시 자동으로 step034.md를 읽고 수행한다. 사용자 확인을 기다리지 않는다.
