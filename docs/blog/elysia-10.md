---
title: Elysia 1.0 - Lament of the Fallen
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 1.0 - Lament of the Fallen

    - - meta
      - name: 'description'
        content: Introducing Sucrose, a better static code analysis engine, improved starts up time up to 14x, remove 40 routes/instance limitation, faster type inference up to ~3.8x, Eden Treaty 2, Hook type (breaking change), and inline error for strict type check.

    - - meta
      - property: 'og:description'
        content: Introducing Sucrose, a better static code analysis engine, improved starts up time up to 14x, remove 40 routes/instance limitation, faster type inference up to ~3.8x, Eden Treaty 2, Hook type (breaking change), and inline error for strict type check.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-10/lament-of-the-fallen.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-10/lament-of-the-fallen.webp

    - - script
      - src: https://platform.twitter.com/widgets.js
        async: true
        charset: utf-8
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 1.0 - Lament of the Fallen"
    src="/blog/elysia-10/lament-of-the-fallen.webp"
    alt="Dreamy Euphony landscape of floating bubble"
    author="saltyaom"
    date="16 Mar 2024"
    shadow
>

Elysia 1.0은 1.8년간의 개발 끝에 나온 첫 안정 릴리스입니다.

처음 시작할 때부터, 우리는 개발자 경험과 속도, 그리고 기계가 아닌 인간을 위한 코드 작성 방법에 초점을 맞춘 프레임워크를 기다려왔습니다.

우리는 다양한 상황에서 Elysia를 실전 테스트했고, 중소 규모 프로젝트를 시뮬레이션하고, 클라이언트에게 코드를 배포했으며, 이번이 배포할 만큼 충분히 자신감을 느낀 첫 버전입니다.

Elysia 1.0은 상당한 개선 사항과 1개의 필요한 breaking change를 포함합니다.
- [Sucrose](#sucrose) - RegEx 대신 패턴 매칭 정적 분석으로 재작성
- [향상된 시작 시간](#improved-startup-time) 최대 14배
- [~40 routes/instance TypeScript 제한 제거](#remove-40-routesinstance-limit)
- [더 빠른 타입 추론](#type-inference-improvement) 최대 ~3.8배
- [Treaty 2](#treaty-2)
- [Hook type](#hook-type-breaking-change) (breaking changes)
- [Inline error](#inline-error) 엄격한 오류 검사를 위한

---

Elysia의 릴리스 노트는 노래나 미디어의 이름을 따서 버전 이름을 붙이는 전통이 있습니다.

이 중요한 버전은 ["Lament of the Fallen"](https://youtu.be/v1sd5CzR504)의 이름을 따왔습니다.

제가 가장 좋아하는 아크와 캐릭터인 **"Raiden Mei"**가 등장하는 **"Honkai Impact 3rd"**의 애니메이션 단편으로, 그녀의 테마곡인 ["Honkai World Diva"](https://youtu.be/s_ZLfaZMpe0)가 수록되어 있습니다.

정말 좋은 게임이니 꼭 확인해보세요.

ー SaltyAom

<small>Gun Girl Z, Honkai Impact 3rd, Honkai Star Rail의 Raiden Mei로도 알려져 있습니다. 그리고 그녀의 "변형"으로 Genshin Impact의 Raiden Shogun, 그리고 아마도 Honkai Star Rail의 Acheron (Star Rail 2.1에서 언급된 bad-end 헤르셔 형태일 가능성이 있으므로)도 있습니다.</small>

::: tip
기억하세요, ElysiaJS는 자원봉사자들이 유지 관리하는 오픈소스 라이브러리이며, Mihoyo나 Hoyoverse와 관련이 없습니다. 하지만 우리는 Honkai 시리즈의 열렬한 팬입니다, 알겠죠?
:::

## Sucrose
Elysia는 다양한 벤치마크에서 입증된 우수한 성능을 위해 최적화되어 있으며, 주요 요인 중 하나는 Bun과 우리의 커스텀 JIT 정적 코드 분석 덕분입니다.

혹시 모르실 수도 있지만, Elysia에는 코드를 읽고 함수를 처리하는 최적화된 방법을 생성하는 일종의 "컴파일러"가 내장되어 있습니다.

이 프로세스는 빠르며 빌드 단계 없이 즉시 실행됩니다.
그러나 대부분 복잡한 RegEx로 작성되어 유지 관리가 어렵고 재귀가 발생하면 느려질 수 있습니다.

그래서 우리는 정적 분석 부분을 재작성하여 partial AST 기반과 패턴 매칭 간의 하이브리드 접근 방식을 사용하는 **"Sucrose"**라는 이름의 코드 주입 단계를 분리했습니다.

더 정확한 전체 AST 기반을 사용하는 대신, 런타임에서 빠르게 실행되어야 하므로 성능 향상에 필요한 규칙의 하위 집합만 구현하기로 선택했습니다.

Sucrose는 핸들러 함수의 재귀 속성을 낮은 메모리 사용량으로 정확하게 추론하는 데 뛰어나며, 추론 시간이 최대 37% 빨라지고 메모리 사용량이 크게 감소합니다.

Sucrose는 Elysia 1.0부터 RegEx 기반을 partial AST 및 패턴 매칭으로 대체하기 위해 제공됩니다.

## Improved Startup time
Sucrose와 동적 주입 단계의 분리 덕분에, 분석 시간을 AOT 대신 JIT로 지연시킬 수 있습니다.

다시 말해, "컴파일" 단계를 지연 평가할 수 있습니다.

평가 단계를 AOT에서 JIT로 오프로드하여 라우트가 처음으로 매칭될 때 실행하고 결과를 캐싱하여 서버 시작 전에 모든 라우트를 컴파일하는 대신 필요에 따라 컴파일합니다.

런타임 성능에서 단일 컴파일은 일반적으로 빠르며 0.01-0.03 ms(밀리초, 초가 아님)를 초과하지 않습니다.

중간 규모 애플리케이션과 스트레스 테스트에서 시작 시간이 약 6.5~14배 빨라진 것을 측정했습니다.

## Remove ~40 routes/instance limit
이전에는 Elysia 0.1 이후로 1 Elysia 인스턴스당 최대 ~40개의 라우트만 쌓을 수 있었습니다.

이것은 제한된 메모리를 가진 각 큐가 있는 TypeScript의 제한이며, 초과하면 TypeScript는 **"Type instantiation is excessively deep and possibly infinite"**라고 생각합니다.
```typescript
const main = new Elysia()
    .get('/1', () => '1')
    .get('/2', () => '2')
    .get('/3', () => '3')
    // 40번 반복
    .get('/42', () => '42')
    // Type instantiation is excessively deep and possibly infinite
```

해결 방법으로, 제한을 극복하고 큐를 오프로드하기 위해 인스턴스를 컨트롤러로 분리하고 타입을 다시 병합해야 했습니다.
```typescript
const controller1 = new Elysia()
    .get('/42', () => '42')
    .get('/43', () => '43')

const main = new Elysia()
    .get('/1', () => '1')
    .get('/2', () => '2')
    // 40번 반복
    .use(controller1)
```

그러나 Elysia 1.0부터는 타입 성능, 특히 Tail Call Optimization과 variances를 최적화한 지 1년 만에 이 제한을 극복했습니다.

이론적으로 TypeScript가 깨질 때까지 무제한의 라우트와 메서드를 쌓을 수 있다는 의미입니다.

<small class="opacity-50">(스포일러: 우리는 그렇게 했고 스택/큐당 JavaScript 메모리 제한 때문에 TypeScript CLI와 언어 서버가 깨지기 전에 약 558개의 라우트/인스턴스입니다)</small>

```typescript
const main = new Elysia()
    .get('/1', () => '1')
    .get('/2', () => '2')
    .get('/3', () => '42')
    // n번 반복
    .get('/550', () => '550')
```

따라서 ~40 라우트의 제한을 JavaScript 메모리 제한으로 늘렸으므로, 인스턴스당 ~558개 이상의 라우트를 쌓지 않도록 하고 필요한 경우 플러그인으로 분리하세요.

![TypeScript breaks on 558 routes](/blog/elysia-10/558-ts-limit.webp)

Elysia가 프로덕션에 준비되지 않았다고 느끼게 했던 장애물이 마침내 해결되었습니다.

## Type Inference improvement
최적화에 투입한 노력 덕분에 대부분의 Elysia 서버에서 **최대 ~82%**를 측정했습니다.

스택의 제한 제거와 향상된 타입 성능 덕분에 500개의 라우트가 쌓인 후에도 거의 즉각적인 타입 검사와 자동 완성을 기대할 수 있습니다.

<video controls>
    <source src="/blog/elysia-10/type-demo.mp4" />
</video>

**Eden Treaty의 경우 최대 13배 빠릅니다**. Eden에 타입 리맵을 오프로드하는 대신 타입을 미리 계산하여 타입 추론 성능이 향상됩니다.

전반적으로 Elysia와 Eden Treaty가 함께 작동하면 **최대 ~3.9배 빠릅니다**.

다음은 450개 라우트에 대한 Elysia + Eden Treaty 0.8과 1.0의 비교입니다.

![Type performance comparison between Elysia Eden 0.8 and 1.0, the graph shows that Elysia 0.8 took ~1500ms while Elysia 1.0 took ~400ms](/blog/elysia-10/ely-comparison.webp)

Eden Treaty와 함께 450개 라우트로 스트레스 테스트한 결과:
- Elysia 0.8은 ~1500ms 소요
- Elysia 1.0은 ~400ms 소요

그리고 스택 제한 제거와 리매핑 프로세스 덕분에 이제 단일 Eden Treaty 인스턴스에 1,000개 이상의 라우트를 쌓을 수 있습니다.

## Treaty 2
우리는 Eden Treaty에 대한 피드백을 요청했고, 여러분이 좋아하는 것과 개선할 수 있는 것에 대해 의견을 주셨습니다. 그리고 Treaty 설계의 몇 가지 결함과 개선을 위한 여러 제안을 해주셨습니다.

그래서 오늘 우리는 보다 인체공학적인 설계로의 대대적인 개편인 Eden Treaty 2를 소개합니다.

breaking change를 싫어하지만, Treaty 2는 Treaty 1의 후속작입니다.

**Treaty 2의 새로운 기능**:
- 더 인체공학적인 구문
- Unit Test를 위한 엔드투엔드 타입 안전성
- Interceptor
- "$" 접두사 및 속성 없음

우리가 가장 좋아하는 것은 Unit 테스트를 위한 엔드투엔드 타입 안전성입니다.

따라서 모의 서버를 시작하고 fetch 요청을 보내는 대신, Eden Treaty 2를 사용하여 자동 완성 및 타입 안전성과 함께 단위 테스트를 작성할 수 있습니다.
```typescript
// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia().get('/hello', () => 'hi')
const api = treaty(app)

describe('Elysia', () => {
    it('return a response', async () => {
        const { data } = await api.hello.get()

        expect(data).toBe('hi')
    })
})
```

두 가지의 차이점은 **Treaty 2가 Treaty 1의 후속작**이라는 것입니다.

Treaty 1에 breaking change를 도입하거나 Treaty 2로 강제로 업데이트할 의도는 없습니다.

현재 프로젝트에 Treaty 1을 계속 사용하고 Treaty 2로 업데이트하지 않을 수 있으며, 유지 보수 모드로 유지 관리합니다.

- Treaty 2를 사용하려면 `treaty`를 import할 수 있습니다.
- Treaty 1의 경우 `edenTreaty`를 import합니다.

새로운 Treaty의 문서는 [Treaty overview](/eden/treaty/overview.html)에서, Treaty 1의 문서는 [Treaty legacy](/eden/treaty/legacy.html)에서 찾을 수 있습니다.

## Hook type (breaking change)
우리는 breaking change를 싫어하며, 이것은 대규모로 처음으로 수행하는 것입니다.

Elysia에 대한 변경 사항을 줄이기 위해 API 설계에 많은 노력을 기울였지만, 이는 결함이 있는 설계를 수정하기 위해 필요합니다.

이전에는 `onTransform` 또는 `onBeforeHandle`과 같은 **"on"**으로 hook을 추가하면 global hook이 되었습니다.

이것은 플러그인과 같은 것을 만드는 데는 좋지만 컨트롤러와 같은 로컬 인스턴스에는 이상적이지 않습니다.

```typescript
const plugin = new Elysia()
    .onBeforeHandle(() => {
        console.log('Hi')
    })
    // log Hi
    .get('/hi', () => 'in plugin')

const app = new Elysia()
    .use(plugin)
    // will also log hi
    .get('/no-hi-please', () => 'oh no')
```

그러나 우리는 이 동작에서 발생하는 몇 가지 문제를 발견했습니다.
- 많은 개발자들이 새 인스턴스에서도 많은 중첩된 guard를 가지고 있음을 발견했습니다. Guard는 거의 부작용을 피하기 위해 새 인스턴스를 시작하는 방법으로 사용됩니다.
- global이 기본값이면 특히 경험이 없는 개발자로 구성된 팀에서 주의하지 않으면 예측할 수 없는(부작용) 동작이 발생할 수 있습니다.
- Elysia에 익숙한 많은 개발자와 익숙하지 않은 개발자에게 물어봤고, 대부분은 hook이 처음에 로컬일 것으로 예상했습니다.
- 이전 요점에 따라, 신중하게 검토하지 않으면 hook을 기본적으로 global로 만들면 우발적인 버그(부작용)가 쉽게 발생하고 디버깅 및 관찰이 어려울 수 있음을 발견했습니다.

---

이를 수정하기 위해 **"hook-type"**을 도입하여 hook이 어떻게 상속되어야 하는지 지정합니다.

Hook type은 다음과 같이 분류할 수 있습니다:
- local (기본값) - 현재 인스턴스와 자손에게만 적용
- scoped - 1개의 조상, 현재 인스턴스 및 자손에게만 적용
- global (이전 동작) - 플러그인을 적용하는 모든 인스턴스에 적용(모든 조상, 현재 및 자손)

hook의 타입을 지정하려면 hook에 `{ as: hookType }`를 추가하기만 하면 됩니다.
```typescript
const plugin = new Elysia()
    .onBeforeHandle(() => { // [!code --]
    .onBeforeHandle({ as: 'global' }, () => { // [!code ++]
        console.log('hi')
    })
    .get('/child', () => 'log hi')

const main = new Elysia()
    .use(plugin)
    .get('/parent', () => 'log hi')
```

이 API는 Elysia의 **guard 중첩 문제**를 해결하기 위해 설계되었으며, 개발자들은 부작용에 대한 두려움 때문에 루트 인스턴스에 hook을 도입하는 것을 두려워합니다.

예를 들어, 전체 인스턴스에 대한 인증 확인을 만들려면 라우트를 guard로 래핑해야 합니다.

```typescript
const plugin = new Elysia()
    .guard((app) =>
        app
            .onBeforeHandle(checkAuthSomehow)
            .get('/profile', () => 'log hi')
    )
```

그러나 hook type의 도입으로 중첩된 guard 보일러플레이트를 제거할 수 있습니다.
```typescript
const plugin = new Elysia()
    .guard((app) => // [!code --]
        app // [!code --]
            .onBeforeHandle(checkAuthSomehow)
            .get('/profile', () => 'log hi')
    ) // [!code --]
```

Hook type은 hook이 어떻게 상속되어야 하는지 지정합니다. hook type이 어떻게 작동하는지 설명하기 위해 플러그인을 만들어 봅시다.
```typescript
// ? 아래 제공된 테이블 값을 기반으로 한 값
const type = 'local'

const child = new Elysia()
    .get('/child', () => 'hello')

const current = new Elysia()
    .onBeforeHandle({ as: type }, () => {
        console.log('hi')
    })
    .use(child)
    .get('/current', () => 'hello')

const parent = new Elysia()
    .use(current)
    .get('/parent', () => 'hello')

const main = new Elysia()
    .use(parent)
    .get('/main', () => 'hello')
```

`type` 값을 변경하면 결과는 다음과 같아야 합니다:

| type       | child | current | parent | main |
| ---------- | ----- | ------- | ------ | ---- |
| 'local'    | ✅    | ✅       | ❌     | ❌   |
| 'scope'    | ✅    | ✅       | ✅     | ❌   |
| 'global'   | ✅    | ✅       | ✅     | ✅   |

Elysia 0.8에서 마이그레이션하는 경우, hook을 global로 만들려면 해당 hook이 global임을 지정해야 합니다.

```typescript
// Elysia 0.8에서
new Elysia()
    .onBeforeHandle(() => "A")
    .derive(() => {})

// Elysia 1.0으로
new Elysia()
    .onBeforeHandle({ as: 'global' }, () => "A")
    .derive({ as: 'global' }, () => {})
```

breaking change와 마이그레이션을 싫어하지만, 문제를 해결하기 위해 조만간 발생할 중요한 수정이라고 생각합니다.

대부분의 서버는 마이그레이션을 직접 적용할 필요가 없을 수 있지만 **플러그인 작성자에게 크게 의존**하거나, 마이그레이션이 필요한 경우 일반적으로 5~15분 이상 걸리지 않습니다.

완전한 마이그레이션 노트는 [Elysia#513](https://github.com/elysiajs/elysia/issues/513)을 참조하세요.

hook type의 문서는 [Lifecycle#hook-type](https://beta.elysiajs.com/essential/scope.html#hook-type)을 참조하세요.

## Inline error
Elysia 0.8부터 `error` 함수를 사용하여 Eden 추론을 위한 상태 코드와 함께 응답을 반환할 수 있습니다.

그러나 이것에는 몇 가지 결함이 있습니다.

라우트에 대한 응답 스키마를 지정하면 Elysia는 상태 코드에 대한 정확한 자동 완성을 제공할 수 없습니다.

예를 들어, 사용 가능한 상태 코드를 좁히는 것입니다.
![Using import error in Elysia](/blog/elysia-10/error-fn.webp)

Inline error는 다음과 같이 핸들러에서 분해될 수 있습니다:
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/hello', ({ error }) => {
        if(Math.random() > 0.5) return error(418, 'Nagisa')

        return 'Azusa'
    }, {
        response: t.Object({
            200: t.Literal('Azusa'),
            418: t.Literal('Nagisa')
        })
    })
```

Inline error는 스키마에서 세밀한 타입을 생성하여 타입 축소, 자동 완성 및 타입 검사를 제공하며, 전체 함수 대신 값에 빨간색 물결선을 밑줄로 표시합니다.

![Using inline error function from Elysia with an auto-completion that shows narrowed down status code](/blog/elysia-10/inline-error-fn.webp)


더 정확한 타입 안전성을 위해 import error 대신 inline error를 사용하는 것이 좋습니다.

## What does it mean for v1, and what's next
안정 릴리스에 도달한다는 것은 Elysia가 충분히 안정적이고 프로덕션에서 사용할 준비가 되었다고 믿는다는 의미입니다.

이제 하위 호환성을 유지하는 것이 우리의 목표 중 하나이며, 보안을 제외하고는 Elysia에 breaking change를 도입하지 않기 위해 노력합니다.

우리의 목표는 백엔드 개발을 쉽고 재미있고 직관적으로 만들면서 Elysia로 구축된 제품이 견고한 기반을 갖도록 하는 것입니다.

이후 우리는 생태계와 플러그인을 개선하는 데 집중할 것입니다.
중복되고 평범한 작업을 처리하는 인체공학적인 방법을 도입하고, 일부 내부 플러그인 재작성을 시작하고, 인증, JIT와 비JIT 모드 간의 동작 동기화, 그리고 **범용 런타임 지원**을 시작합니다.

Bun은 런타임, 패키지 매니저 및 제공하는 모든 도구에서 탁월하게 작동하며, Bun이 JavaScript의 미래가 될 것이라고 믿습니다.

Elysia를 더 많은 런타임에 개방하고 흥미로운 Bun 특정 기능을 제공하면(또는 최소한 구성하기 쉬운 기능, 예: [Bun Loaders API](https://bun.sh/docs/bundler/loaders)) Elysia가 Bun만 지원하도록 선택하는 것보다 더 많은 사람들이 Bun을 시도하게 될 것이라고 믿습니다.

<blockquote class="twitter-tweet">
    <p lang="en" dir="ltr">Bun이 옳았습니다. Node에서 사람들을 마이그레이션하는 가장 좋은 방법은 호환성 레이어를 갖추고 Bun에서 더 나은 DX와 성능을 제공하는 것입니다</p>
    <span>&mdash; SaltyAom (@saltyAom)</span>
    <a href="https://twitter.com/saltyAom/status/1768303850858143887?ref_src=twsrc%5Etfw">March 14, 2024</a>
</blockquote>

Elysia 코어 자체는 부분적으로 WinterCG 호환이지만, 모든 공식 플러그인이 WinterCG와 함께 작동하는 것은 아니며, Bun 특정 기능이 있는 것도 있으며, 이를 수정하고자 합니다.

예상치 못한 동작 없이 작동하는지 확인할 때까지 점진적으로 채택하고 테스트할 것이므로 범용 런타임 지원에 대한 구체적인 날짜나 버전은 아직 없습니다.

다음 런타임 지원을 기대할 수 있습니다:
- Node
- Deno
- Cloudflare Worker

우리는 또한 다음을 지원하고 싶습니다:
- Vercel Edge Function
- Netlify Function
- AWS Lambda / LLRT

또한 Server Side Rendering 또는 Edge Function을 지원하는 다음 프레임워크에서 Elysia를 지원하고 테스트합니다:
- Nextjs
- Expo
- Astro
- SvelteKit

그동안 Elysia의 활발한 기여자 중 한 명인 Bogeychan이 유지 관리하는 [Elysia Polyfills](https://github.com/bogeychan/elysia-polyfills)가 있습니다.

또한 Eden에 대한 더 자세한 내용을 설명하기 위해 [Eden documentation](/eden/overview)을 다시 작성했으며, 확인해보시기 바랍니다.

또한 문서의 여러 페이지를 개선하고 중복된 부분을 제거했습니다. 영향을 받은 페이지는 [Elysia 1.0 documentation PR](https://github.com/elysiajs/documentation/pull/282/files)에서 확인할 수 있습니다.

마지막으로 마이그레이션에 문제가 있거나 Elysia와 관련된 추가 질문이 있는 경우 Elysia Discord 서버에서 자유롭게 질문하세요.
<iframe
    class="w-full h-64"
    src="https://discord.com/widget?id=1044804142461362206&theme=dark"
    allowtransparency="true"
    frameborder="0"
    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
    loadin="lazy"
/>

## Notable Improvement

### Improvement:
- 세밀한 반응형 쿠키
- 쿠키에 대한 단일 진실 소스 사용
- websocket에 대한 macro 지원
- `mapResolve` 추가
- lifecycle 이벤트에 `{ as: 'global' | 'scoped' | 'local' }` 추가
- ephemeral type 추가
- 핸들러에 inline `error` 추가
- inline `error`에는 상태 코드를 기반으로 한 자동 완성 및 타입 검사가 있습니다
- 핸들러는 이제 상태 코드를 기반으로 `error`의 반환 타입을 확인합니다
- 타입 추론을 위한 유틸리티 `Elysia._types`
- [#495](https://github.com/elysiajs/elysia/issues/495) 실패한 파싱에 대한 사용자 친화적인 오류 제공
- 핸들러는 이제 Treaty에 대한 오류 상태의 반환 타입을 추론합니다
- `t.Date`는 이제 문자열화된 날짜를 허용합니다
- 타입 테스트 케이스 개선
- 모든 life-cycle에 대한 테스트 케이스 추가
- resolve, mapResolve, derive, mapDerive는 ephemeral type을 사용하여 정확하게 범위를 좁힙니다
- 쿼리 동적 변수 추론

### Breaking Change:
- [#513](https://github.com/elysiajs/elysia/issues/513) lifecycle은 이제 로컬 우선입니다

### Change:
- 비공개 API 속성 그룹화
- `Elysia.routes`를 `Elysia.router.history`로 이동
- 반환하기 전에 가능한 json 감지
- 알 수 없는 응답은 이제 JSON.stringify() 대신 그대로 반환됩니다
- Elysia 유효성 검사 오류를 문자열 대신 JSON으로 변경

### Bug fix:
- [#466](https://github.com/elysiajs/elysia/issues/466) Async Derive가 `aot: true`인 경우 요청 컨텍스트를 다른 요청으로 누출합니다
- [#505](https://github.com/elysiajs/elysia/issues/505) 쿼리 스키마 내부의 빈 ObjectString 누락 유효성 검사
- [#503](https://github.com/elysiajs/elysia/issues/503) Beta: decorate 및 derive를 사용할 때 정의되지 않은 클래스
- .stop을 호출할 때 onStop 콜백이 두 번 호출됨
- mapDerive는 이제 `Singleton['store']` 대신 `Singleton['derive']`로 확인됩니다
- `ValidationError`는 `content-type`을 `application/json`으로 반환하지 않습니다
- `error(status, value)` 유효성 검사는 상태당 유효성을 검사합니다
- derive/resolve는 항상 Global로 범위가 지정됩니다
- 처리되지 않은 경우 중복된 onError 호출
- [#516](https://github.com/elysiajs/elysia/issues/516) 서버 타이밍이 beforeHandle guard를 중단합니다
- cookie.remove()가 올바른 쿠키 경로를 설정하지 않습니다

## Afterword
::: tip
다음 내용에는 개인적인 감정, 불평, 푸념, 어쩌면 민망하고 비전문적인 내용이 포함되어 있을 수 있으며 소프트웨어 릴리스 노트에 작성되어서는 안 되는 내용입니다. 릴리스에 필요한 모든 내용을 이미 설명했으므로 계속 읽지 않도록 선택할 수 있습니다.
:::

2년 전, 나는 비극적인 기억이 있습니다.

그것은 쉽게 내가 가진 가장 고통스러운 기억 중 하나입니다. 우리가 가진 느슨한 계약을 이용하는 불공정한 작업을 따라가기 위해 밤낮으로 일했습니다.

6개월 이상 걸렸고, 깨어나는 순간부터 잠들 때까지(15시간) 반복해서 일해야 했습니다. **다른 일은 아무것도 하지 않고, 심지어 하루에 5분도 쉬지 않고**, 휴식할 시간도 없고, 거의 2개월 동안 코딩 외에는 아무것도 하지 않았으며, 심지어 병원 침대에서 일해야 할 정도로 쓰러진 평일조차도 쉬는 날이 없었습니다.

나는 영혼이 없었고, 삶의 목적이 없었으며, 나의 유일한 소원은 그것을 꿈으로 만드는 것이었습니다.

그 당시 느슨한 요구사항과 계약의 허점으로 인해 도입된 수많은 breaking change와 셀 수 없는 새로운 기능이 있었습니다.

그것을 추적하는 것은 거의 불가능했고, 우리는 "만족스럽지 않다"는 이유로 받아야 할 급여조차 받지 못하고 사기를 당했으며, 우리는 그것에 대해 아무것도 할 수 없었습니다.

코드 작성에 대한 두려움에서 회복하는 데 한 달이 걸렸고, 비전문적으로 트라우마 속에서 직업을 제대로 수행할 수 없었으며 번아웃을 겪었다고 매니저에게 상담했습니다.

그래서 우리는 breaking change를 매우 싫어하며, TypeScript 건전성으로 변경 사항을 쉽게 처리하도록 Elysia를 설계하고자 합니다. 비록 좋지 않더라도 우리가 가진 전부입니다.

누구도 그런 것을 경험하지 않기를 바랍니다.

우리는 그 계약에서 가졌던 모든 결함을 해결하기 위한 프레임워크를 설계했습니다.

거기서 본 기술적 결함은 나를 만족시킬 수 있는 JavaScript 기반 솔루션이 없었기 때문에 실험했습니다.

나는 미래에 이런 느슨한 계약을 피할 수 있으므로 그냥 넘어갈 수 있었고, 돈을 벌고 대부분의 자유 시간을 프레임워크를 만드는 데 보내지 않을 수 있었지만 그러지 않았습니다.

Kiana가 세상을 위해 자신을 희생할 것이라는 생각에 반대하는 Mei가 있는 [애니메이션 단편의 일부분](https://youtu.be/v1sd5CzR504?t=128)이 있으며, Mei는 다음과 같이 대답합니다:

<div class="font-mono text-gray-500 dark:text-gray-400 text-base">

\> Yet you shoulder everything alone, at the cost of your life.

\> Maybe this is for the greater good...

\> But how can I pretend this is the right thing?

\> I only know that deep down...

\> the world means nothing to me...

\> without you

</div>

이것은 세상을 위해 자신을 희생하는 사람과 사랑하는 사람을 구하기 위해 자신을 희생하는 사람 사이의 이중성을 묘사합니다.

문제를 보고 그냥 넘어가면, 우리 뒤에 오는 사람이 우리가 가진 것과 같은 문제에 걸려 넘어지지 않을 것이라는 것을 어떻게 알 수 있을까요? 누군가는 뭔가를 해야 합니다.

다른 사람들을 구하기 위해 자신을 희생하는 누군가가 있을 것이지만, 그렇다면 누가 희생된 사람을 구할까요?

**"Lament of the Fallen"**이라는 이름은 그것을 설명하며, 우리가 Elysia를 만드는 이유입니다.

<small class="opacity-50">*그것에 대한 모든 것이 내가 가장 좋아하는 것이고, 나 자신과 너무 많이 관련이 있을 수도 있음에도 불구하고.</small>

---

나쁜 기억과 비극적인 사건에서 만들어졌음에도 불구하고, Elysia가 너무나 많은 사랑으로 성장한 것을 보는 것은 특권입니다. 그리고 당신이 만든 것이 사랑받고 다른 사람들에게 잘 받아들여지는 것을 보는 것입니다.

Elysia는 오픈 소스 개발자의 작업이며 어떤 회사의 지원도 받지 않습니다.

우리는 생계를 위해 뭔가를 해야 하고 자유 시간에 Elysia를 구축합니다.

한 시점에서 나는 몇 달 동안 Elysia를 작업하기 위해 바로 일자리를 찾지 않기로 선택했습니다.

우리는 Elysia를 지속적으로 개선하는 데 시간을 보내고 싶으며, [GitHub sponsors](https://github.com/sponsors/SaltyAom)를 통해 우리가 스스로를 지원하기 위해 필요한 일을 줄이고 Elysia를 작업할 자유 시간을 더 많이 갖도록 도울 수 있습니다.

우리는 우리가 가진 문제를 해결하기 위해 뭔가를 만들고 싶어하는 제작자일 뿐입니다.

---

우리는 Elysia로 많은 것을 만들고 실험했으며, 클라이언트에게 실제 코드를 배포했고, 우리 지역 커뮤니티인 [CreatorsGarten](https://creatorsgarten.org) (지역 기술 커뮤니티, 조직 아님) 뒤에 있는 도구를 지원하기 위해 실제 프로젝트에서 Elysia를 사용했습니다.

Elysia가 프로덕션에 준비되었는지 확인하기 위해 많은 시간, 준비 및 용기가 필요했습니다. 물론 버그가 있을 것이지만, 우리는 듣고 수정할 의향이 있습니다.

새로운 것의 시작입니다.

그리고 **당신 덕분에** 가능합니다.

<!-- There are a lot of emotions, a lot of tiring days, and countless nights trying to build something good, something we love, something we dream of.

I have always been telling myself since then that, one day my effort would be recognized. One day someone would remember me. One day.

I don't know if that day is today or not, there's still a long way ahead.
But something I know is that the seed I planted has starting to bloomed.

I hope that we can see this journey together. -->

ー SaltyAom

> All the incandescent stars of heaven will die at the end of days,
>
> Your gentle soul given to damnation.
>
> "Crimson moon shines upon a town that is smeared in blood"
>
> Cried the diva given into lament.
>
> All those sweeet little dreams buried deep in memories until the very end.
>
> <br>
>
> [**If rescuing you is a sin, I'll gladly become a sinner.**](https://youtu.be/v1sd5CzR504?t=260)
</Blog>
