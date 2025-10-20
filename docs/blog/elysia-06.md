---
title: Elysia 0.6 - This Game
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Introducing Elysia 0.6 - This Game

    - - meta
      - name: 'description'
        content: Introducing re-imagined plugin model, dynamic mode, better developer experience with declarative custom error, customizable loose and strict path mapping, TypeBox 0.30 and WinterCG framework interlop. Pushing the boundary of what is possible once again.

    - - meta
      - property: 'og:description'
        content: Introducing re-imagined plugin model, dynamic mode, better developer experience with declarative custom error, customizable loose and strict path mapping, TypeBox 0.30 and WinterCG framework interlop. Pushing the boundary of what is possible once again.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-06/this-game.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-06/this-game.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.6 - This Game"
    src="/blog/elysia-06/this-game.webp"
    alt="Crystal Knight Piece"
    author="saltyaom"
    date="6 Aug 2023"
>

전설적인 애니메이션 **"노 게임 노 라이프"**의 오프닝곡이자 Konomi Suzuki가 작곡한 「[This Game](https://youtu.be/kJ04dMmimn8)」의 이름을 따서 명명되었습니다.

This Game은 재구상된 플러그인 모델, 동적 모드, 선언적 커스텀 에러를 통한 개발자 경험 향상, 'onResponse'를 통한 더 많은 메트릭 수집, 커스터마이징 가능한 느슨하고 엄격한 경로 매핑, TypeBox 0.30 및 WinterCG 프레임워크 상호 운용을 통해 중규모 프로젝트에서 대규모 앱으로의 경계를 넓힙니다.

###### (우리는 여전히 노 게임 노 라이프 시즌 2를 기다리고 있습니다)

## 새로운 플러그인 모델
This Game은 플러그인 등록을 위한 새로운 구문을 도입하고 내부적으로 새로운 플러그인 모델을 제시합니다.

이전에는 다음과 같이 Elysia 인스턴스에 대한 콜백 함수를 정의하여 플러그인을 등록할 수 있었습니다:
```ts
const plugin = (app: Elysia) => app.get('/', () => 'hello')
```

새로운 플러그인을 사용하면 이제 Elysia 인스턴스를 플러그인으로 변환할 수 있습니다:
```ts
const plugin = new Elysia()
    .get('/', () => 'hello')
```

이를 통해 모든 Elysia 인스턴스와 기존 인스턴스도 애플리케이션 전체에서 사용할 수 있으며, 가능한 추가 콜백과 탭 간격을 제거합니다.

이는 중첩된 그룹과 작업할 때 개발자 경험을 크게 향상시킵니다
```ts
// < 0.6
const group = (app: Elysia) => app
    .group('/v1', (app) => app
        .get('/hello', () => 'Hello World')
    )

// >= 0.6
const group = new Elysia({ prefix: '/v1' })
    .get('/hello', () => 'Hello World')
```

Plugin Checksum과 향후 가능한 새로운 기능을 활용할 수 있으므로 새로운 Elysia 플러그인 인스턴스 모델을 사용하는 것을 권장합니다.

그러나 다음과 같은 경우에는 함수 모델이 유용하므로 콜백 함수 메소드를 **deprecated하지 않습니다**:
- 인라인 함수
- 메인 인스턴스의 정보가 필요한 플러그인 (예: OpenAPI 스키마 접근)

이 새로운 플러그인 모델을 통해 코드베이스를 훨씬 더 쉽게 유지 관리할 수 있기를 바랍니다.

## Plugin Checksum
기본적으로 Elysia 플러그인은 플러그인을 등록하기 위해 함수 콜백을 사용합니다.

즉, 타입 선언을 위해 플러그인을 등록하면 타입 지원만 제공하기 위해 자체적으로 중복되어 프로덕션에서 사용되는 플러그인이 중복됩니다.

이것이 타입 선언을 위해 등록된 플러그인의 중복을 제거하기 위해 Plugin Checksum이 도입된 이유입니다.

Plugin Checksum을 사용하려면 새로운 플러그인 모델을 사용하고 `name` 속성을 제공하여 Elysia가 플러그인이 중복되는 것을 방지하도록 해야 합니다
```ts
const plugin = new Elysia({
    name: 'plugin'
})
```

이를 통해 Elysia는 플러그인을 식별하고 이름을 기반으로 중복 제거할 수 있습니다.

중복된 이름은 한 번만 등록되지만 플러그인이 중복 제거되더라도 등록 후 타입 안전성이 제공됩니다.

플러그인에 구성이 필요한 경우 구성을 **seed** 속성에 제공하여 플러그인 중복 제거를 위한 체크섬을 생성할 수 있습니다.

```ts
const plugin = (config) = new Elysia({
    name: 'plugin',
    seed: config
})
```

이름과 시드는 등록 중복 제거를 위한 체크섬을 생성하는 데 사용되며, 이는 더 나은 성능 향상으로 이어집니다.

이 업데이트는 또한 Elysia가 플러그인이 로컬 및 전역 이벤트인지 확실하지 않을 때 플러그인의 라이프사이클이 실수로 인라인 라이프사이클이 되는 중복 제거를 수정했습니다.

항상 그렇듯이, "Hello World"보다 큰 앱의 성능 향상을 의미합니다.

## Mount와 WinterCG 준수
WinterCG는 Cloudflare, Deno, Vercel Edge Runtime, Netlify Function 등에서 지원하는 웹 상호 운용 가능한 런타임을 위한 표준입니다.

WinterCG는 웹 서버가 런타임 간에 상호 운용 가능하게 실행되도록 하는 표준으로, Fetch, Request 및 Response와 같은 Web Standard 정의를 사용합니다.

이를 통해 Elysia는 Bun에 최적화되어 있지만 가능한 경우 다른 런타임도 공개적으로 지원하므로 부분적으로 WinterCG 준수를 따릅니다.

이를 통해 이론적으로 WinterCG를 준수하는 모든 프레임워크와 코드가 함께 실행될 수 있으며, [Hono](https://honojs.dev)가 **.mount** 메소드를 도입하여 [하나의 코드베이스에서 여러 프레임워크를 함께 실행](https://twitter.com/honojs/status/1684839623355490304)하는 것을 증명했습니다. Remix, Elysia, Itty Router 및 Hono 자체를 간단한 함수로 실행할 수 있습니다.

이를 통해 우리는 WinterCG 준수 프레임워크나 코드를 실행하기 위해 `.mount` 메소드를 도입하여 Elysia에 대해 동일한 로직을 구현했습니다.

`.mount`를 사용하려면 [단순히 `fetch` 함수를 전달](https://twitter.com/saltyAom/status/1684786233594290176)하면 됩니다:
```ts
const app = new Elysia()
    .get('/', () => 'Hello from Elysia')
    .mount('/hono', hono.fetch)
```

**fetch** 함수는 다음과 같이 정의된 Web Standard Request를 받아들이고 Web Standard Response를 반환하는 함수입니다:
```ts
// Web Standard Request-like object
// Web Standard Response
type fetch = (request: RequestLike) => Response
```

기본적으로 이 선언은 다음에서 사용됩니다:
- Bun
- Deno
- Vercel Edge Runtime
- Cloudflare Worker
- Netlify Edge Function
- Remix Function Handler

즉, 위의 모든 코드를 단일 서버에서 Elysia와 상호 운용하거나 모든 기존 함수를 하나의 배포에서 재사용할 수 있으며, 여러 서버를 처리하기 위해 Reverse Proxy를 설정할 필요가 없습니다.

프레임워크가 **.mount** 함수도 지원하는 경우 이를 지원하는 프레임워크를 무한히 깊게 중첩할 수 있습니다.
```ts
const elysia = new Elysia()
    .get('/Hello from Elysia inside Hono inside Elysia')

const hono = new Hono()
    .get('/', (c) => c.text('Hello from Hono!'))
    .mount('/elysia', elysia.fetch)

const main = new Elysia()
    .get('/', () => 'Hello from Elysia')
    .mount('/hono', hono.fetch)
    .listen(3000)
```

서버에서 여러 기존 Elysia 프로젝트를 재사용할 수도 있습니다.

```ts
import A from 'project-a/elysia'
import B from 'project-b/elysia'
import C from 'project-c/elysia'

new Elysia()
    .mount(A)
    .mount(B)
    .mount(C)
```

mount에 전달된 인스턴스가 Elysia 인스턴스인 경우 자동으로 `use`로 해석되어 기본적으로 타입 안전성과 Eden에 대한 지원을 제공합니다.

이것은 상호 운용 가능한 프레임워크와 런타임의 가능성을 현실로 만들었습니다.

## 향상된 시작 시간
시작 시간은 Elysia가 놀랍도록 뛰어난 서버리스 환경에서 중요한 메트릭이지만, 우리는 이를 더욱 발전시켰습니다.

기본적으로 Elysia는 모든 경로에 대해 OpenAPI 스키마를 자동으로 생성하고 사용하지 않는 경우에도 내부적으로 저장합니다.

이 버전에서 Elysia는 컴파일을 연기하고 `@elysiajs/swagger`로 이동하여 Elysia 시작 시간이 더욱 빨라졌습니다.

그리고 다양한 마이크로 최적화와 새로운 플러그인 모델로 가능해진 시작 시간은 이제 최대 35% 빨라졌습니다.

## 동적 모드
Elysia는 성능의 경계를 넓히기 위해 정적 코드 분석 및 Ahead of Time 컴파일을 도입합니다.

정적 코드 분석을 통해 Elysia는 코드를 읽은 다음 가장 최적화된 버전의 코드를 생성할 수 있으므로 Elysia가 성능을 한계까지 밀어붙일 수 있습니다.

Elysia가 WinterCG를 준수하더라도 Cloudflare worker와 같은 환경은 함수 구성을 지원하지 않습니다.

즉, Ahead of Time 컴파일이 불가능하므로 AoT 대신 JIT 컴파일을 사용하는 동적 모드를 만들어 Elysia가 Cloudflare Worker에서도 실행될 수 있도록 했습니다.

동적 모드를 활성화하려면 `aot`를 false로 설정하십시오.
```ts
new Elysia({
    aot: false
})
```

동적 모드는 Cloudflare worker에서 기본적으로 활성화됩니다.

#### 동적 모드를 활성화하면 문자열을 자동으로 숫자로 파싱하는 `t.Numeric`과 같은 동적 주입 코드와 같은 일부 기능이 비활성화됩니다.

Ahead of Time 컴파일은 시작 시간을 대가로 코드를 읽고 감지하고 최적화하여 추가 성능 향상을 얻을 수 있는 반면, 동적 모드는 JIT 컴파일을 사용하여 시작 시간을 최대 6배까지 더 빠르게 할 수 있습니다.

그러나 Elysia의 시작 시간은 기본적으로 충분히 빠르다는 점에 유의해야 합니다.

Elysia는 단 78ms 만에 10,000개의 경로를 등록할 수 있으며 이는 평균 0.0079 ms/경로를 의미합니다

그렇긴 하지만, 우리는 여러분이 직접 결정할 수 있는 선택권을 남겨두고 있습니다.

## 선언적 커스텀 에러
이 업데이트는 커스텀 에러 처리를 위한 타입 지원 추가를 지원합니다.

```ts
class CustomError extends Error {
    constructor(public message: string) {
        super(message)
    }
}

new Elysia()
    .addError({
        MyError: CustomError
    })
    .onError(({ code, error }) => {
        switch(code) {
            // 자동 완성과 함께
            case 'MyError':
                // 타입 축소와 함께
                // Error는 CustomError로 타입이 지정됩니다
                return error
        }
    })
```

이를 통해 커스텀 타입을 처리하고 에러 코드에 대한 자동 완성으로 올바른 타입을 좁히고 완전한 타입 안전성을 선언적으로 처리할 수 있습니다.

이것은 특히 타입과 관련하여 개발자 경험에 초점을 맞춘 우리의 주요 철학 중 하나를 충족합니다.

Elysia 타입 시스템은 복잡하지만 사용자가 커스텀 타입을 작성하거나 커스텀 제네릭을 전달할 필요가 없도록 하여 모든 코드가 JavaScript처럼 보이도록 노력했습니다.

그냥 작동하며 모든 코드는 JavaScript처럼 보입니다.

## TypeBox 0.30
TypeBox는 **Elysia.t**로 알려진 Elysia의 엄격한 타입 시스템을 구동하는 핵심 라이브러리입니다.

이 업데이트에서 TypeBox를 0.28에서 0.30으로 업데이트하여 엄격하게 타입이 지정된 언어에 가까운 더욱 세밀한 타입 시스템을 만들었습니다.

이러한 업데이트는 새로운 기능과 많은 흥미로운 변경 사항을 도입합니다. 예를 들어 **Iterator** 타입, 패키지 크기 감소, TypeScript 코드 생성이 있습니다.

그리고 다음과 같은 유틸리티 타입 지원:
- `t.Awaited`
- `t.Uppercase`
- `t.Capitlized`

## 엄격한 경로
느슨한 경로 처리에 대한 많은 요청을 받았습니다.

기본적으로 Elysia는 경로를 엄격하게 처리합니다. 즉, 선택적 `/`가 있거나 없는 경로를 지원해야 하는 경우 해결되지 않으며 경로명을 두 번 복제해야 합니다.

```ts
new Elysia()
    .group('/v1', (app) => app
        // /v1 처리
        .get('', handle)
        // /v1/ 처리
        .get('/', handle)
    )
```

이로 인해 많은 사람들이 `/v1/`도 `/v1`을 해결해야 한다고 요청했습니다.

이 업데이트를 통해 기본적으로 느슨한 경로 매칭에 대한 지원을 추가하여 이 기능을 자동으로 선택할 수 있습니다.
```ts
new Elysia()
    .group('/v1', (app) => app
        // /v1과 /v1/ 처리
        .get('/', handle)
    )
```

loosePath 매핑을 비활성화하려면 `strictPath`를 true로 설정하여 이전 동작을 사용할 수 있습니다:
```ts
new Elysia({
    strictPath: false
})
```

이것이 경로 매칭과 예상되는 동작에 관한 모든 질문을 해결하기를 바랍니다.

## onResponse
이 업데이트는 `onResponse`라는 새로운 라이프사이클 훅을 도입합니다.

이것은 [elysia#67](https://github.com/elysiajs/elysia/issues/67)에서 제안된 제안입니다.

이전에 Elysia 라이프사이클은 이 다이어그램에 설명된 대로 작동했습니다.
![Elysia life-cycle diagram](/blog/elysia-06/lifecycle-05.webp)

메트릭, 데이터 수집 또는 로깅 목적으로 `onAfterHandle`을 사용하여 메트릭을 수집하는 함수를 실행할 수 있지만, 이 라이프사이클은 핸들러가 라우팅 에러이든 제공된 커스텀 에러이든 에러가 발생하면 실행되지 않습니다.

이것이 모든 Response 케이스를 처리하기 위해 `onResponse`를 도입한 이유입니다.

`onRequest`와 `onResponse`를 함께 사용하여 성능 또는 필요한 로깅의 메트릭을 측정할 수 있습니다.

인용
> 그러나 onAfterHandle 함수는 성공적인 응답에서만 실행됩니다. 예를 들어 경로를 찾을 수 없거나 body가 유효하지 않거나 에러가 발생하면 실행되지 않습니다. 성공 및 비성공 요청을 모두 어떻게 수신할 수 있습니까? 이것이 onResponse를 제안한 이유입니다.
>
> 그림을 기반으로 다음을 제안합니다:
> ![Elysia life-cycle diagram with onResponse hook](/blog/elysia-06/lifecycle-06.webp)

---

### 주목할 만한 개선 사항:
- 커스텀 에러 메시지를 추가하기 위해 Elysia 타입 시스템에 에러 필드 추가
- 동적 모드로 Cloudflare worker 지원 (및 ENV)
- AfterHandle이 이제 값을 자동으로 매핑합니다
- Bun 환경을 대상으로 bun build를 사용하여 전체 성능을 5-10% 향상
- 플러그인 등록 사용 시 인라인 라이프사이클 중복 제거
- `prefix` 설정 지원
- 재귀 경로 타이핑
- 타입 체킹 속도 약간 향상
- 무한 타입을 유발하는 재귀 스키마 충돌

### 변경 사항:
- **registerSchemaPath**를 @elysiajs/swagger로 이동
- [Internal] 컨텍스트에 qi (queryIndex) 추가

### Breaking Change:
- [Internal] Elysia Symbol 제거
- [Internal] `getSchemaValidator`, `getResponseSchemaValidator`를 named parameters로 리팩토링
- [Internal] `registerSchemaPath`를 `@elysiajs/swagger`로 이동

## 마무리
우리는 1년 마일스톤을 막 지나쳤으며 Elysia와 Bun이 지난 한 해 동안 얼마나 개선되었는지 정말 기쁩니다!

Bun으로 JavaScript의 성능 경계를 넓히고 Elysia로 개발자 경험을 향상시키면서, 우리는 여러분 및 우리 커뮤니티와 계속 연락을 유지하게 되어 매우 기쁩니다.

모든 업데이트는 Elysia를 더욱 안정적으로 만들고 성능과 기능의 하락 없이 점진적으로 더 나은 개발자 경험을 제공합니다.

우리는 오픈 소스 개발자 커뮤니티가 다음과 같은 프로젝트로 Elysia를 생생하게 만드는 것을 보게 되어 기쁩니다.
- [Elysia Vite Plugin SSR](https://github.com/timnghg/elysia-vite-plugin-ssr) Vite Server Side Rendering을 Elysia를 서버로 사용하여 사용할 수 있습니다.
- [Elysia Connect](https://github.com/timnghg/elysia-connect) Connect의 플러그인을 Elysia와 호환되도록 만들었습니다

그리고 다음 큰 프로젝트에 Elysia를 선택한 더 많은 개발자들이 있습니다.

우리의 약속으로, 우리는 최근 [Mobius](https://github.com/saltyaom/mobius)를 소개했습니다. TypeScript template literal 타입을 전적으로 사용하여 코드 생성에 의존하지 않고 GraphQL을 TypeScript 타입으로 파싱하는 오픈 소스 TypeScript 라이브러리로, 코드 생성에 의존하지 않고 엔드투엔드 타입 안전성을 달성한 최초의 프레임워크입니다.

우리는 Elysia에 대한 여러분의 압도적인 지속적인 지원에 매우 감사하며, 다음 릴리스에서 여러분과 함께 경계를 넓히는 것을 보기를 희망합니다.

> As this whole new world cheers my name
>
> I will never leave it to fate
>
> and when I see a chance, I will pave the way
>
> I calls checkmate
>
> This is the time to breakthrough
>
> So I will rewrite the story and finally change all the rule
>
> We are maverick
>
> We won't give in, until we win this game
>
> Though I don't know what tomorrow holds
>
> I'll make a bet any play my cards to win this game
>
> Unlike the rest, I'll do my best, and I won't ever lose
>
> To give up this chance would be a deadly since, so let's bet it all
>
> I put all my fate in used let **the game begin**

</Blog>
