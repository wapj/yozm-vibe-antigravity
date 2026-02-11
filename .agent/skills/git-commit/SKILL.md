---
name: git-commit
description: Git 커밋 메시지를 커밋 컨벤션 규격에 맞게 포맷팅합니다. 사용자가 변경사항을 커밋하거나 커밋 메시지를 작성할 때 사용합니다. "커밋해줘", "변경사항 커밋", "커밋 메시지 작성" 등의 요청에 반응합니다.
---

# Git Commit Convention Skill
## Goal
변경사항을 분석하여 커밋 컨벤션 규격에 맞는 커밋 메시지를 작성하고 커밋합니다.
## Format
`<type>[optional scope]: <subject>`

`<description>`

## Allowed Types
- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 변경만 있는 경우
- **style**: 코드의 의미에 영향을 주지 않는 변경 (공백, 포맷팅 등)
- **refactor**: 버그 수정도 아니고 기능 추가도 아닌 코드 변경
- **perf**: 성능을 개선하는 코드 변경
- **test**: 테스트 추가 또는 기존 테스트 수정
- **chore**: 빌드 프로세스 또는 보조 도구 변경

## Instructions
1. **Check Status**: `git status`를 실행하여 현재 상태를 확인합니다.
2. **Stage Changes**:
   - 스테이징된 변경사항이 없으면, 사용자에게 `git add -A`를 실행할지 제안하고 `run_command`로 실행합니다.
   - 부분적인 커밋이 필요한 경우 해당 파일만 `git add` 합니다.
3. **Analyze Changes**: `git diff --staged`를 실행하여 커밋할 내용을 분석합니다.
4. **Formulate Message**:
   - **Subject**: 첫 줄은 `<type>(<scope>): <subject>` 형식으로 **한국어**로 작성합니다. 50자를 넘지 않도록 간결하게 요약합니다.
   - **Description**: 한 줄을 띄우고 변경사항에 대한 상세 설명을 **한국어**로 작성합니다. 무엇을, 왜 변경했는지 설명합니다.
5. **Execute**:
   - **CRITICAL**: 반드시 `run_command` 도구를 사용하여 `git commit -m "제목" -m "상세설명"` 형식을 사용합니다.
   - 텍스트로 커밋 메시지를 제안하고 사용자가 복사해서 붙여넣게 하지 마십시오.
   - `run_command` 자체가 승인 요청이므로, 별도로 "커밋하시겠습니까?"라고 묻지 말고 명령을 제안하십시오.

## Examples
변경사항: 로그인 컴포넌트에 Google 로그인 기능 추가
→ `feat(auth): 구글 로그인 기능 추가`
  `사용자가 구글 계정으로 로그인할 수 있도록 버튼과 핸들러를 구현했습니다.`

변경사항: README에 설치 방법 추가
→ `docs: README에 설치 가이드 추가`
  `프로젝트 초기 설정을 위한 npm install 및 환경 변수 설정 방법을 문서화했습니다.`

변경사항: API 응답의 날짜 형식 버그 수정
→ `fix(api): 응답 데이터 날짜 포맷 수정`
  `ISO 8601 형식이 잘못 적용되던 문제를 수정하여 YYYY-MM-DD 형식을 따르도록 변경했습니다.`

## Constraints
- 커밋 메시지는 **반드시 한국어**로 작성합니다.
- Subject(제목)는 명령문 형태로 작성합니다 (예: "수정했음" -> "수정").
- 여러 종류의 변경이 섞여 있으면, 가장 중요한 변경을 기준으로 type을 결정합니다.
- 커밋 전에 반드시 사용자의 승인을 받습니다.