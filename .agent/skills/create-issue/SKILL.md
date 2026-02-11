---
name: create-issue
description: 깃헙 이슈를 생성합니다. 사용자가 버그 리포트, 기능 요청, 개선 사항 등을 이슈로 등록하고 싶을 때 사용합니다. "이슈 만들어줘", "버그 리포트 작성해줘", "기능 요청 이슈 올려줘" 등의 요청에 반응합니다.
---

# GitHub Issue Creator Skill

## Goal
사용자의 요청을 분석하여 적절한 유형의 GitHub Issue를 생성합니다.

## Instructions

1. **요청 분석**: 사용자의 요청을 파악하여 Issue 유형을 결정합니다.
   - 버그 리포트 (bug)
   - 기능 요청 (feature)
   - 개선 사항 (improvement)

2. **템플릿 참조**: `resources/issue_templates.md` 파일에서 해당 유형의 템플릿을 읽습니다.

3. **Issue 내용 작성**: 템플릿에 맞춰 Issue의 제목과 본문을 작성합니다.
   - 제목은 `[Bug]`, `[Feature]`, `[Improvement]` 접두사를 붙입니다.
   - 본문은 템플릿의 각 섹션을 사용자의 요청 내용으로 채웁니다.
   - 사용자가 제공하지 않은 정보는 합리적으로 추론하되, 확실하지 않은 부분은 `TODO: 추가 정보 필요`로 표시합니다.

4. **라벨 제안**: Issue 유형에 따라 적절한 라벨을 제안합니다.
   - bug → `bug`, `needs-triage`
   - feature → `enhancement`, `feature-request`
   - improvement → `improvement`, `enhancement`

5. **라벨 확인 및 생성**: 제안된 라벨이 저장소에 존재하는지 확인합니다. 존재하지 않을 경우 먼저 `gh label create` 명령어로 라벨을 생성합니다.

6. **gh CLI로 Issue 생성**: 작성된 내용으로 `gh issue create` 명령어를 실행합니다.


gh issue create --title "<제목>" --body "<본문>" --label "<라벨1>,<라벨2>"

## Constraints
- Issue 본문은 한국어로 작성합니다 (프로젝트 설정에 따라 영어도 가능).
- `gh` CLI가 설치되어 있고 인증이 완료된 상태를 전제합니다.
- 사용자에게 Issue 내용을 먼저 보여주고 승인을 받은 후 생성합니다.
