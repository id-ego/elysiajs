---
title: Elysia 0.5 - Radiant
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 0.5 소개 - Radiant

    - - meta
      - name: 'description'
        content: Static Code Analysis, 새로운 라우터 Memoirist, TypeBox 0.28, Numeric 타입, 인라인 스키마, state/decorate/model/group 재작업, 타입 안정성 소개.

    - - meta
      - property: 'og:description'
        content: Static Code Analysis, 새로운 라우터 Memoirist, TypeBox 0.28, Numeric 타입, 인라인 스키마, state/decorate 재작업, 타입 안정성 소개.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-05/radiant.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-05/radiant.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.5 - Radiant"
    src="/blog/elysia-05/radiant.webp"
    alt="Radiant"
    author="saltyaom"
    date="15 May 2023"
>

Arknights의 오리지널 음악인 Monster Sirent Records가 작곡한 「[Radiant](https://youtu.be/QhUjD--UUV4)」에서 이름을 따왔습니다.

Radiant는 더 많은 안정성 개선, 특히 타입과 동적 경로로 성능의 경계를 넓힙니다.

## Static Code Analysis
Elysia 0.4가 Ahead of Time 컴파일을 도입하면서 Elysia는 함수 호출을 최적화하고 이전에 가졌던 많은 오버헤드를 제거할 수 있습니다.

오늘 우리는 Ahead of Time 컴파일을 Static Code Analysis로 더욱 확장하여 가장 빠른 Bun 웹 프레임워크가 되도록 합니다.

Static Code Analysis를 통해 Elysia는 함수, 핸들러, 라이프사이클 및 스키마를 읽은 다음 fetch 핸들러를 조정하고 핸들러를 미리 컴파일하며 사용되지 않는 코드를 제거하고 가능한 곳에서 최적화하려고 시도합니다.

예를 들어 Object의 body 타입과 함께 `schema`를 사용하는 경우 Elysia는 이 경로가 JSON 우선이라고 예상하고 Content-Type 헤더를 사용한 동적 검사에 의존하는 대신 body를 JSON으로 구문 분석합니다:

```ts
app.post('/sign-in', ({ body }) => signIn(body), {
    schema: {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    }
})
```

이를 통해 body 구문 분석의 성능을 거의 2.5배 향상시킬 수 있습니다.

Static Code Analysis를 통해 비싼 속성을 사용할지 여부에 대한 베팅에 의존하는 대신.

Elysia는 코드를 읽고 사용할 항목을 감지하여 필요에 맞게 미리 조정할 수 있습니다.

즉, `query` 또는 `body`와 같은 비싼 속성을 사용하지 않으면 Elysia는 성능을 향상시키기 위해 구문 분석을 완전히 건너뜁니다.

```ts
// Body는 사용되지 않으므로 body 구문 분석을 건너뜁니다
app.post('/id/:id', ({ params: { id } }) => id, {
    schema: {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    }
})
```

Static Code Analysis 및 Ahead of Time 컴파일을 통해 Elysia가 코드를 매우 잘 읽고 성능을 자동으로 최대화하도록 조정한다는 것을 확신할 수 있습니다.

Static Code Analysis를 통해 우리가 상상했던 것 이상으로 Elysia 성능을 향상시킬 수 있습니다. 주목할 만한 언급은 다음과 같습니다:
- 전체 개선 약 15%
- 정적 라우터 약 33% 빠름
- 빈 쿼리 구문 분석 약 50% 빠름
- 엄격한 타입 body 구문 분석 약 100% 빠름
- 빈 body 구문 분석 약 150% 빠름

이러한 개선으로 Elysia 0.5.0-beta.0과 Stricjs 2.0.4를 비교하여 성능 측면에서 **Stricjs**를 능가할 수 있습니다.

우리는 이 주제를 더 자세히 설명하고 Static Code Analysis를 통해 성능을 향상시킨 방법을 설명하는 연구 논문을 향후 게시할 예정입니다.

## New Router, "Memoirist"

0.2부터 우리는 자체 Router인 "Raikiri"를 구축해 왔습니다.

Raikiri는 목적을 달성했으며, 사용자 정의 Radix Tree 구현을 사용하여 빠르게 작동하도록 처음부터 구축되었습니다.

그러나 진행하면서 Raikiri가 Radix Tree의 복잡한 재조정에서 잘 작동하지 않는다는 것을 발견했으며, 이로 인해 개발자가 많은 버그, 특히 일반적으로 경로를 다시 정렬하여 해결되는 동적 경로에 대해 보고했습니다.

우리는 이해하고 Raikiri의 Radix Tree 재조정 알고리즘의 많은 영역을 패치했지만 알고리즘이 복잡하고 라우터를 패치할수록 더 비싸지고 더 이상 목적에 맞지 않습니다.

그래서 새로운 라우터인 "Memoirist"를 소개합니다.

Memoirist는 Medley Router의 알고리즘을 기반으로 동적 경로를 빠르게 처리하는 안정적인 Radix Tree 라우터이며, 정적 측면에서는 Ahead of Time 컴파일을 활용합니다.

이번 릴리스에서는 안정성 개선과 Raikiri보다 더 빠른 경로 매핑을 위해 Raikiri에서 Memoirist로 마이그레이션할 것입니다.

우리는 Raikiri에서 발생한 모든 문제가 Memoirist로 해결되기를 바라며 시도해 보시기 바랍니다.

## TypeBox 0.28

TypeBox는 **Elysia.t**로 알려진 Elysia의 엄격한 타입 시스템을 지원하는 핵심 라이브러리입니다.

이번 업데이트에서 우리는 TypeBox를 0.26에서 0.28로 업데이트하여 엄격한 타입 언어에 가까운 훨씬 더 세밀한 타입 시스템을 만듭니다.

우리는 **Constant Generic**과 같은 TypeScript의 새 버전으로 새로운 TypeBox 기능과 일치하도록 Elysia 타입 시스템을 개선하기 위해 Typebox를 업데이트합니다.

```ts
new Elysia()
    .decorate('version', 'Elysia Radiant')
    .model(
        'name',
        Type.TemplateLiteral([
            Type.Literal('Elysia '),
            Type.Union([
                Type.Literal('The Blessing'),
                Type.Literal('Radiant')
            ])
        ])
    )
    // 템플릿 리터럴에 대한 엄격한 검사
    .get('/', ({ version }) => version)
```

이를 통해 템플릿 리터럴 또는 문자열/숫자 패턴을 엄격하게 확인하여 런타임과 개발 프로세스 모두에서 한 번에 검증할 수 있습니다.

### Ahead of Time & Type System

그리고 Ahead of Time 컴파일을 통해 Elysia는 스키마 정의 타입과 일치하도록 자체 조정하여 오버헤드를 줄일 수 있습니다.

그래서 우리는 새로운 타입인 **URLEncoded**를 도입했습니다.

이전에 언급했듯이 Elysia는 이제 스키마를 활용하여 Ahead of Time으로 자체 최적화할 수 있으며, body 구문 분석은 Elysia에서 더 비싼 영역 중 하나이므로 URLEncoded와 같은 body 구문 분석을 위한 전용 타입을 도입합니다.

기본적으로 Elysia는 body의 스키마 타입을 기반으로 다음과 같이 body를 구문 분석합니다:
- t.URLEncoded -> `application/x-www-form-urlencoded`
- t.Object -> `application/json`
- t.File -> `multipart/form-data`
- 나머지 -> `text/plain`

그러나 다음과 같이 `type`을 사용하여 특정 메서드로 body를 구문 분석하도록 Elysia에 명시적으로 지시할 수 있습니다:
```ts
app.post('/', ({ body }) => body, {
    type: 'json'
})
```

`type`은 다음 중 하나일 수 있습니다:
```ts
type ContentType = |
    // 'text/plain'의 약어
    | 'text'
    // 'application/json'의 약어
    | 'json'
    // 'multipart/form-data'의 약어
    | 'formdata'
    // 'application/x-www-form-urlencoded'의 약어\
    | 'urlencoded'
    | 'text/plain'
    | 'application/json'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded'
```

개념에서 [explicit body](/life-cycle/parse.html#explicit-body) 페이지에서 자세한 내용을 확인할 수 있습니다.

### Numeric Type
우리는 Elysia를 사용하는 개발자가 발견한 중복 작업 중 하나가 숫자 문자열을 구문 분석하는 것이라는 것을 발견했습니다.

그래서 새로운 **Numeric** 타입을 도입합니다.

이전에 Elysia 0.4에서는 숫자 문자열을 구문 분석하려면 `transform`을 사용하여 문자열을 수동으로 구문 분석해야 했습니다.
```ts
app.get('/id/:id', ({ params: { id } }) => id, {
    schema: {
        params: t.Object({
            id: t.Number()
        })
    },
    transform({ params }) {
        const id = +params.id

        if(!Number.isNaN(id))
            params.id = id
    }
})
```

우리는 이 단계가 중복되고 보일러플레이트가 가득하다는 것을 발견했으며, 이 문제를 해결하고 선언적 방식으로 해결하고 싶었습니다.

Static Code Analysis 덕분에 Numeric 타입을 사용하면 숫자 문자열을 정의하고 자동으로 숫자로 구문 분석할 수 있습니다.

검증되면 숫자 타입은 런타임과 타입 수준 모두에서 자동으로 숫자로 구문 분석되어 우리의 요구에 맞습니다.

```ts
app.get('/id/:id', ({ params: { id } }) => id, {
    params: t.Object({
        id: t.Numeric()
    })
})
```

스키마 타이핑을 지원하는 모든 속성에서 숫자 타입을 사용할 수 있습니다:
- params
- query
- headers
- body
- response

서버에서 이 새로운 Numeric 타입이 유용하기를 바랍니다.

개념에서 [numeric type](/validation/elysia-type.html#numeric) 페이지에서 자세한 내용을 확인할 수 있습니다.

TypeBox 0.28을 통해 Elysia 타입 시스템을 더욱 완성하고 있으며 여러분의 측면에서 어떻게 작동하는지 기대됩니다.

## Inline Schema
이미 우리의 예제가 타입을 생성하기 위해 `schema.type`을 더 이상 사용하지 않는다는 것을 알아챘을 것입니다. 왜냐하면 우리는 스키마를 이동하고 대신 hook 문에 인라인하는 **중대한 변경**을 하고 있기 때문입니다.

```ts
// ? From
app.get('/id/:id', ({ params: { id } }) => id, {
    schema: {
        params: t.Object({
            id: t.Number()
        })
    },
})

// ? To
app.get('/id/:id', ({ params: { id } }) => id, {
    params: t.Object({
        id: t.Number()
    })
})
```

특히 Elysia의 가장 중요한 부분 중 하나에 대한 중대한 변경을 할 때 많이 생각합니다.

많은 실험과 실제 사용을 기반으로 우리는 커뮤니티에 투표를 통해 이 새로운 변경을 제안하려고 시도했으며 약 60%의 Elysia 개발자가 인라인 스키마로 마이그레이션하는 것에 만족한다는 것을 발견했습니다.

그러나 우리는 또한 나머지 커뮤니티의 의견을 듣고 이 결정에 반대하는 주장을 해결하려고 합니다:

### Clear separation
이전 구문을 사용하면 `Elysia.t`를 사용하여 생성하는 부분이 스키마라는 것을 Elysia에 명시적으로 알려야 합니다.

라이프사이클과 스키마 사이의 명확한 분리를 만드는 것이 더 명확하고 가독성이 좋습니다.

그러나 집중적인 테스트에서 대부분의 사람들이 새 구문을 읽는 데 어려움이 없으며 라이프사이클 후크와 스키마 타입을 분리하는 것을 발견했으며, 코드를 검토할 때 `t.Type` 및 함수와 다른 구문 강조가 있어 명시적 스키마만큼 명확하지는 않지만 사람들이 새 구문에 매우 빠르게 익숙해질 수 있습니다. 특히 Elysia에 익숙한 경우입니다.

### Auto completion
사람들이 우려하는 다른 영역 중 하나는 자동 완성을 읽는 것입니다.

스키마와 라이프사이클 후크를 병합하면 자동 완성에 약 10개의 속성이 제안되며, 많은 입증된 일반 사용자 경험 연구에 따르면 사용자가 선택할 수 있는 옵션이 너무 많으면 좌절할 수 있으며 학습 곡선이 가파를 수 있습니다.

그러나 Elysia의 스키마 속성 이름은 개발자가 Elysia 타입에 익숙해지면 이 문제를 극복하기에 상당히 예측 가능하다는 것을 발견했습니다.

예를 들어 헤더에 액세스하려면 Context에서 `headers`에 액세스할 수 있으며 `headers`를 입력하려면 후크에서 헤더를 입력할 수 있으며 둘 다 예측 가능성을 위해 동일한 이름을 공유합니다.

이를 통해 Elysia는 학습 곡선이 조금 더 있을 수 있지만 더 나은 개발자 경험을 위해 기꺼이 감수할 수 있는 절충안입니다.

## "headers" fields
이전에는 `request.headers.get`에 액세스하여 헤더 필드를 가져올 수 있었으며 기본적으로 헤더를 제공하지 않는 이유가 궁금할 수 있습니다.

```ts
app.post('/headers', ({ request: { headers } }) => {
    return headers.get('content-type')
})
```

헤더 구문 분석에는 자체 오버헤드가 있으며 많은 개발자가 헤더에 자주 액세스하지 않는다는 것을 발견했기 때문에 헤더를 구현하지 않기로 결정했습니다.

그러나 Static Code Analysis로 바뀌었으며 Elysia는 헤더를 사용할 의도가 있는지 코드를 읽은 다음 코드를 기반으로 동적으로 헤더를 구문 분석할 수 있습니다.

Static Code Analysis를 통해 오버헤드 없이 더 많은 새로운 기능을 제공할 수 있습니다.

```ts
app.post('/headers', ({ headers }) => headers['content-type'])
```

구문 분석된 헤더는 헤더 이름의 소문자 키가 있는 일반 객체로 사용할 수 있습니다.

## State, Decorate, Model rework
Elysia의 주요 기능 중 하나는 필요에 맞게 Elysia를 사용자 정의할 수 있다는 것입니다.

우리는 `state`, `decorate` 및 `setModel`을 재검토했으며 API가 일관되지 않으며 개선될 수 있음을 보았습니다.

우리는 많은 사람들이 여러 값을 설정할 때 `state` 및 `decorate`를 반복적으로 사용하고 있으며 `setModel`과 마찬가지로 한 번에 모두 설정하려고 한다는 것을 발견했으며 `setModel`의 통합 API 사양을 `state` 및 `decorate`와 동일한 방식으로 사용하여 더 예측 가능하게 만들고 싶었습니다.

그래서 `setModel`을 `model`로 이름을 변경하고 함수 오버로딩을 사용하여 `state`, `decorate` 및 `model`에 대한 단일 및 여러 값 설정 지원을 추가했습니다.

```ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
	// ? 레이블을 사용하여 모델 설정
	.model('string', t.String())
	.model({
		number: t.Number()
	})
	.state('visitor', 1)
	// ? 객체를 사용하여 모델 설정
	.state({
		multiple: 'value',
		are: 'now supported!'
	})
	.decorate('visitor', 1)
	// ? 객체를 사용하여 모델 설정
	.decorate({
		name: 'world',
		number: 2
	})
```

그리고 **Constant Generic**으로 엄격한 타입을 개선하기 위해 TypeScript 5.0의 최소 지원을 높였습니다.

`state`, `decorate` 및 `model`은 이제 런타임과 타입 수준 모두에서 타입을 엄격하게 검증하기 위해 리터럴 타입 및 템플릿 문자열을 지원합니다.

```ts
	// ? state, decorate는 이제 리터럴을 지원합니다
app.get('/', ({ body }) => number, {
		body: t.Literal(1),
		response: t.Literal(2)
	})
```

### Group and Guard
많은 개발자가 종종 `group`을 `guard`와 함께 사용한다는 것을 발견했으며 중첩하는 것이 나중에 중복되고 보일러플레이트가 가득할 수 있습니다.

Elysia 0.5부터 선택적 두 번째 매개변수로 `.group`에 대한 guard 범위를 추가합니다.

```ts
// ✅ 이전에는 group 내부에 guard를 중첩해야 했습니다
app.group('/v1', (app) =>
    app.guard(
        {
            body: t.Literal()
        },
        (app) => app.get('/student', () => 'Rikuhachima Aru')
    )
)

// ✅ 새로운 방식, 이전 구문과 호환됩니다
app.group(
    '/v1', {
        body: t.Literal('Rikuhachima Aru')
    },
    app => app.get('/student', () => 'Rikuhachima Aru')
)

// ✅ 함수 오버로드와 호환됩니다
app.group('/v1', app => app.get('/student', () => 'Rikuhachima Aru'))
```

이러한 재검토된 API가 더 유용하고 사용 사례에 더 적합하기를 바랍니다.

## Type Stability
Elysia Type System은 복잡합니다.

우리는 타입 수준에서 변수를 선언하고, 이름으로 타입을 참조하고, 여러 Elysia 인스턴스를 적용하고, 타입 수준에서 클로저와 같은 것도 지원할 수 있으며, 이는 Eden과 함께 최고의 개발자 경험을 제공하기 위해 정말 복잡합니다.

그러나 때때로 Elysia 버전을 업데이트할 때 타입이 의도한 대로 작동하지 않습니다. 왜냐하면 모든 릴리스 전에 수동으로 확인해야 하며 인적 오류가 발생할 수 있기 때문입니다.

Elysia 0.5에서는 향후 가능한 버그를 방지하기 위해 타입 수준에서 테스트하기 위한 단위 테스트를 추가합니다. 이러한 테스트는 모든 릴리스 전에 실행되며 오류가 발생하면 패키지 게시를 방지하여 타입 문제를 수정하도록 강제합니다.

즉, 이제 모든 릴리스에 대한 타입 무결성을 확인하기 위해 우리를 신뢰할 수 있으며 타입 참조와 관련하여 버그가 줄어들 것이라고 확신할 수 있습니다.

---

### Notable Improvement:
- Add CommonJS support for running Elysia with Node adapter
- Remove manual fragment mapping to speed up path extraction
- Inline validator in `composeHandler` to improve performance
- Use one time context assignment
- Add support for lazy context injection via Static Code Analysis
- Ensure response non nullability
- Add unioned body validator check
- Set default object handler to inherits
- Using `constructor.name` mapping instead of `instanceof` to improve speed
- Add dedicated error constructor to improve performance
- Conditional literal fn for checking onRequest iteration
- improve WebSocket type

Breaking Change:
- Rename `innerHandle` to `fetch`
    - to migrate: rename `.innerHandle` to `fetch`
- Rename `.setModel` to `.model`
    - to migrate: rename `setModel` to `model`
- Remove `hook.schema` to `hook`
    - to migrate: remove schema and curly brace `schema.type`:
    ```ts
    // from
    app.post('/', ({ body }) => body, {
        schema: {
            body: t.Object({
                username: t.String()
            })
        }
    })

    // to
    app.post('/', ({ body }) => body, {
        body: t.Object({
            username: t.String()
        })
    })
    ```
- remove `mapPathnameRegex` (internal)

## Afterward
Bun으로 JavaScript의 성능 경계를 밀어붙이는 것은 우리가 정말 흥분하는 일입니다!

모든 릴리스마다 새로운 기능이 있어도 Elysia는 계속 빨라지고 있으며 향상된 신뢰성과 안정성을 통해 Elysia가 차세대 TypeScript 프레임워크의 선택 중 하나가 되기를 바랍니다.

많은 재능 있는 오픈 소스 개발자들이 [Bogeychan의 Elysia Node](https://github.com/bogeychan/elysia-polyfills) 및 Deno 어댑터, Rayriffy의 Elysia rate limit와 같은 뛰어난 작업으로 Elysia를 실현하는 것을 보게 되어 기쁘며 미래에 여러분의 작품도 보기를 바랍니다!

Elysia에 대한 지속적인 지원에 감사드리며 다음 릴리스에서 뵙기를 바랍니다.

> 사람들을 실망시키지 않을 거야, 높이 올릴 거야
>
> 우리는 매일 더 크게 외치고 있어, 그래, 우리는 증폭되고 있어
>
> 빛으로 멋지게
>
> 넌 내 편이 되고 싶을 거야
>
> 그래, 넌 알잖아 **전속력으로**

</Blog>
