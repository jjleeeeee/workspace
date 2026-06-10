# Box-Sizing Audit Pattern

## Trigger

`width` 또는 `height` + `padding` 조합이 있는 요소의 box-sizing을 수정하거나 새로 추가할 때.

## Lesson

`box-sizing: border-box` 없이 `width: 40px; padding: 8px`을 쓰면 실제 렌더 크기는
40 + 8 + 8 = **56px**이 된다. 한 요소를 고칠 때 같은 파일의 다른 요소들도
같은 문제를 갖고 있을 가능성이 높다.

TopNavigation 사례에서 `trailing-item`에 `box-sizing: border-box`를 추가했지만
`leading`, `leading-icon`을 빠뜨려 사용자 지적이 3회 반복됐다.

## Apply

1. 한 요소에 `box-sizing: border-box`를 추가하기 전후에 아래 grep을 실행:
   ```
   grep -n "padding" <ComponentName>.css | grep -v "padding: 0\|padding-inline\|padding-left\|padding-right\|padding-top\|padding-bottom"
   ```
2. 결과 목록에서 `width` 또는 `height`가 함께 있는 클래스를 찾는다.
3. 해당 클래스에 `box-sizing: border-box`가 있는지 확인 후 일괄 추가.
4. 공유 룰(여러 클래스 쉼표 묶음)에 추가하면 하위 오버라이드까지 전파되는지 확인.

## Source Cases

- `retrospectives/retrospective_top-navigation-layout-fix_2026-05-09.md`
