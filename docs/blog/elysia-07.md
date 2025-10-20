---
title: Elysia 0.7 - Stellar Stellar
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Introducing Elysia 0.7 - Stellar Stellar

    - - meta
      - name: 'description'
        content: Introducing up to 13x faster type inference. Declarative telemetry with trace. Reactive cookie model, and cookie validation. TypeBox 0.31 and custom decoder support. Rewritten Web Socket. Definitions remapping and custom affix. Leading more solid foundation for Elysia for a brighter future.

    - - meta
      - property: 'og:description'
        content: Introducing up to 13x faster type inference. Declarative telemetry with trace. Reactive cookie model, and cookie validation. TypeBox 0.31 and custom decoder support. Rewritten Web Socket. Definitions remapping and custom affix. Leading more solid foundation for Elysia for a brighter future.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-07/stellar-stellar.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-07/stellar-stellar.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.7 - Stellar Stellar"
    src="/blog/elysia-07/stellar-stellar.webp"
    alt="Landscape of wild and mountain in the night full of star"
    author="saltyaom"
    date="20 Sep 2023"
>

우리의 포기하지 않는 정신, 우리가 사랑하는 Virtual YouTuber, ~~Suicopath~~ Hoshimachi Suisei와 그녀의 첫 앨범「Still Still Stellar」의 빛나는 목소리인 「[Stellar Stellar](https://youtu.be/AAsRtnbDs-0)」의 이름을 따서 명명되었습니다.

한때 잊혀졌던 그녀는 정말로 어둠 속에서 빛나는 별입니다.

**Stellar Stellar**은 Elysia가 기반을 다지고 복잡성을 쉽게 처리할 수 있도록 돕는 많은 흥미로운 새로운 업데이트를 제공합니다:
- 완전히 재작성된 타입, 최대 13배 빠른 타입 추론.
- 선언적 텔레메트리 및 더 나은 성능 감사를 위한 "Trace".
- Cookie 처리를 단순화하는 Reactive Cookie 모델과 cookie 유효성 검사.
- 커스텀 디코더를 지원하는 TypeBox 0.31.
- 더 나은 지원을 위해 재작성된 Web Socket.
- 이름 충돌 방지를 위한 Definitions remapping과 선언적 affix.
- 텍스트 기반 status

## 재작성된 타입

개발자 경험에 대한 Elysia의 핵심 기능입니다.

타입은 Elysia의 가장 중요한 측면 중 하나입니다. 통합 타입, 비즈니스 로직 동기화, 타이핑, 문서화 및 프론트엔드와 같은 많은 놀라운 작업을 수행할 수 있게 해주기 때문입니다.

우리는 여러분이 Elysia로 뛰어난 경험을 할 수 있기를 바라며, 비즈니스 로직 부분에 집중하고 통합 타입으로 타입 추론 및 백엔드와 타입을 동기화하는 Eden connector 등 나머지는 Elysia가 처리하도록 합니다.

이를 달성하기 위해 모든 타입을 동기화하기 위한 통합 타입 시스템을 만드는 데 노력을 기울였지만, 기능이 커짐에 따라 1년 전에 가졌던 TypeScript 경험 부족으로 인해 타입 추론이 충분히 빠르지 않을 수 있다는 것을 발견했습니다.

복잡한 타입 시스템 처리, 다양한 최적화 및 [Mobius](https://github.com/saltyaom/mobius)와 같은 많은 프로젝트를 진행하면서 얻은 경험을 바탕으로 우리는 타입 시스템을 다시 한 번 가속화하기 위해 도전했으며, 이것은 Elysia의 두 번째 타입 재작성이 되었습니다.

우리는 모든 Elysia 타입을 처음부터 삭제하고 다시 작성하여 Elysia 타입을 훨씬 더 빠르게 만들었습니다.

다음은 간단한 `Elysia.get` 코드에서 0.6과 0.7 간의 비교입니다:

<figure class="flex flex-row w-full max-w-full">
    <img alt="Elysia 0.6" style="width: 50%; background: transparent; box-shadow: unset;" class="object-contain" src="/blog/elysia-07/type-0-6.webp" />
    <img alt="Elysia 0.7" style="width: 50%; background: transparent; box-shadow: unset;" class="object-contain" src="/blog/elysia-07/type-0-7.webp" />
</figure>

새로운 경험과 const generic과 같은 새로운 TypeScript 기능을 통해 많은 코드를 단순화하여 타입에서 코드베이스를 천 줄 이상 줄일 수 있었습니다.

이를 통해 타입 시스템을 더욱 빠르고 안정적으로 개선할 수 있었습니다.

![Comparison between Elysia 0.6 and 0.7 on complex project with our 300 routes, and 3,500 lines of type declaration](/blog/elysia-07/inference-comparison.webp)

Perfetto와 TypeScript CLI를 사용하여 대규모의 복잡한 앱에서 trace를 생성하면 최대 13배의 추론 속도를 측정할 수 있습니다.

그리고 0.6에서 타입 추론을 깨뜨릴지 궁금할 수 있지만, 대부분의 경우 타입에 대한 breaking change가 없는지 확인하기 위해 타입 레벨에서 unit test를 수행합니다.

우리는 이 개선 사항이 더 빠른 자동 완성 및 IDE의 로드 시간이 거의 즉각적으로 단축되어 개발이 그 어느 때보다 더 빠르고 유창하게 이루어지는 데 도움이 되기를 바랍니다.

## Trace

성능은 Elysia의 또 다른 중요한 측면입니다.

우리는 벤치마킹 목적으로 빠르기를 원하는 것이 아니라, 벤치마킹뿐만 아니라 실제 시나리오에서 실제로 빠른 서버를 갖기를 원합니다.

앱 속도를 늦출 수 있는 많은 요인이 있으며 하나를 식별하기 어렵기 때문에 **"Trace"**를 도입했습니다.

**Trace**를 사용하면 라이프사이클 이벤트를 활용하고 앱의 성능 병목 현상을 식별할 수 있습니다.

![Example of usage of Trace](/blog/elysia-07/trace.webp)

이 예제 코드를 사용하면 모든 **beforeHandle** 이벤트를 활용하고 Server-Timing API를 설정하기 전에 실행 시간을 하나씩 추출하여 성능 병목 현상을 검사할 수 있습니다.

그리고 이것은 `beforeHandle`에만 국한되지 않으며, `handler` 자체도 trace할 수 있습니다. 네이밍 규칙은 여러분이 이미 익숙한 라이프사이클 이벤트의 이름을 따릅니다.

이 API를 사용하면 Elysia 서버의 성능 병목 현상을 쉽게 감사하고 선택한 보고 도구와 통합할 수 있습니다.

기본적으로 Trace는 AoT 컴파일 및 Dynamic Code injection을 사용하여 조건부로 보고하고 실제로 사용하는 것도 자동으로 수행하므로 성능에 전혀 영향을 미치지 않습니다.

## Reactive Cookie
우리는 cookie 플러그인을 Elysia 코어에 병합했습니다.

Trace와 마찬가지로 Reactive Cookie는 AoT 컴파일 및 Dynamic Code injection을 사용하여 cookie 사용 코드를 조건부로 주입하므로 사용하지 않는 경우 성능에 영향을 미치지 않습니다.

Reactive Cookie는 ergonomic API로 cookie를 처리하기 위해 signal과 같은 더 현대적인 접근 방식을 취합니다.

![Example of usage of Reactive Cookie](/blog/elysia-07/cookie.webp)

`getCookie`, `setCookie`가 없으며 모든 것이 cookie 객체일 뿐입니다.

cookie를 사용하려면 다음과 같이 이름을 추출하여 값을 get/set하면 됩니다:
```typescript
app.get('/', ({ cookie: { name } }) => {
    // Get
    name.value

    // Set
    name.value = "New Value"
})
```

그러면 cookie가 자동으로 헤더 및 cookie jar와 값을 동기화하여 `cookie` 객체가 cookie 처리를 위한 단일 소스가 됩니다.

Cookie Jar는 reactive입니다. 즉, cookie에 대한 새 값을 설정하지 않으면 `Set-Cookie` 헤더가 전송되지 않아 동일한 cookie 값을 유지하고 성능 병목 현상을 줄입니다.

### Cookie Schema
cookie를 Elysia의 코어에 병합하면서 cookie 값을 검증하기 위한 새로운 **Cookie Schema**를 도입합니다.

이것은 cookie 세션을 엄격하게 검증하거나 cookie 처리를 위한 엄격한 타입 또는 타입 추론을 원할 때 유용합니다.

```typescript
app.get('/', ({ cookie: { name } }) => {
    // Set
    name.value = {
        id: 617,
        name: 'Summoning 101'
    }
}, {
    cookie: t.Cookie({
        value: t.Object({
            id: t.Numeric(),
            name: t.String()
        })
    })
})
```

Elysia는 자동으로 cookie 값을 인코딩 및 디코딩하므로 디코딩된 JWT 값과 같은 JSON을 cookie에 저장하거나 값이 숫자 문자열인지 확인하려는 경우 쉽게 수행할 수 있습니다.

### Cookie Signature
마지막으로 Cookie Schema와 `t.Cookie` 타입의 도입으로 sign/verify cookie signature를 자동으로 처리하기 위한 통합 타입을 만들 수 있습니다.

Cookie signature는 cookie의 값에 추가되는 암호화 해시로, secret key와 cookie의 내용을 사용하여 생성되어 cookie에 signature를 추가하여 보안을 강화합니다.

이를 통해 cookie 값이 악의적인 행위자에 의해 수정되지 않도록 하여 cookie 데이터의 진위성과 무결성을 확인하는 데 도움이 됩니다.

Elysia에서 cookie signature를 처리하려면 `secret` 및 `sign` 속성을 제공하기만 하면 됩니다:
```typescript
new Elysia({
    cookie: {
        secret: 'Fischl von Luftschloss Narfidort'
    }
})
    .get('/', ({ cookie: { profile } }) => {
        profile.value = {
            id: 617,
            name: 'Summoning 101'
        }
    }, {
        cookie: t.Cookie({
            profile: t.Object({
                id: t.Numeric(),
                name: t.String()
            })
        }, {
            sign: ['profile']
        })
    })
```

cookie secret 및 `sign` 속성을 제공하여 signature 검증이 필요한 cookie를 나타냅니다.

그러면 Elysia는 자동으로 cookie 값을 sign 및 unsign하여 **sign** / **unsign** 함수를 수동으로 사용할 필요가 없습니다.

Elysia는 Cookie의 secret rotation을 자동으로 처리하므로 새 cookie secret으로 마이그레이션해야 하는 경우 secret을 추가하기만 하면 Elysia가 첫 번째 값을 사용하여 새 cookie에 서명하고 일치하는 경우 나머지 secret으로 cookie를 unsign하려고 시도합니다.
```typescript
new Elysia({
    cookie: {
        secrets: ['Vengeance will be mine', 'Fischl von Luftschloss Narfidort']
    }
})
```

Reactive Cookie API는 선언적이고 직관적이며, 제공하는 ergonomic에 대한 마법 같은 무언가가 있으며, 여러분이 시도해 보기를 정말 기대합니다.

## TypeBox 0.31
0.7 릴리스와 함께 TypeBox 0.31로 업데이트하여 Elysia에 더 많은 기능을 제공합니다.

이것은 Elysia에서 TypeBox의 `Decode`에 대한 기본 지원과 같은 흥미로운 새 기능을 제공합니다.

이전에는 `Numeric`과 같은 커스텀 타입이 숫자 문자열을 숫자로 변환하기 위해 동적 코드 주입이 필요했지만 TypeBox의 decode를 사용하면 타입의 값을 자동으로 인코딩 및 디코딩하는 커스텀 함수를 정의할 수 있습니다.

이를 통해 타입을 다음과 같이 단순화할 수 있습니다:
```typescript
Numeric: (property?: NumericOptions<number>) =>
    Type.Transform(Type.Union([Type.String(), Type.Number(property)]))
        .Decode((value) => {
            const number = +value
            if (isNaN(number)) return value

            return number
        })
        .Encode((value) => value) as any as TNumber,
```

광범위한 체크 및 코드 주입에 의존하는 대신 TypeBox의 `Decode` 함수로 단순화됩니다.

우리는 더 쉬운 코드 유지 관리를 위해 Dynamic Code Injection이 필요한 모든 타입을 `Transform`을 사용하도록 다시 작성했습니다.

그뿐만 아니라 `t.Transform`을 사용하면 이제 수동으로 Encode 및 Decode하는 커스텀 함수로 커스텀 타입을 정의할 수 있어 그 어느 때보다 더 표현력 있는 코드를 작성할 수 있습니다.

`t.Transform`의 도입으로 여러분이 무엇을 가져올지 기대됩니다.

### New Type
**Transform**의 도입으로 요청의 Object 값을 자동으로 디코딩하기 위해 `t.ObjectString`과 같은 새로운 타입을 추가했습니다.

이것은 파일 업로드를 처리하기 위해 **multipart/formdata**를 사용해야 하지만 object를 지원하지 않을 때 유용합니다. 이제 `t.ObjectString()`을 사용하여 필드가 문자열화된 JSON임을 Elysia에 알려주면 Elysia가 자동으로 디코딩할 수 있습니다.
```typescript
new Elysia({
    cookie: {
        secret: 'Fischl von Luftschloss Narfidort'
    }
})
    .post('/', ({ body: { data: { name } } }) => name, {
        body: t.Object({
            image: t.File(),
            data: t.ObjectString({
                name: t.String()
            })
        })
    })
```

이것이 **multipart**로 JSON이 필요한 경우를 단순화하기를 바랍니다.

## 재작성된 Web Socket
완전히 재작성된 타입 외에도 Web Socket도 완전히 재작성했습니다.

이전에는 Web Socket에 3가지 주요 문제가 있음을 발견했습니다:
1. Schema가 엄격하게 검증되지 않음
2. 느린 타입 추론
3. 모든 플러그인에서 `.use(ws())`가 필요함

이 새로운 업데이트를 통해 위의 모든 문제를 해결하고 Web Socket의 성능을 향상시켰습니다.

1. 이제 Elysia의 Web Socket이 엄격하게 검증되고 타입이 자동으로 동기화됩니다.
2. 모든 플러그인에서 WebSocket을 사용하기 위한 `.use(ws())`의 필요성을 제거했습니다.

그리고 이미 빠른 Web Socket에 성능 향상을 제공합니다.

이전에는 Elysia Web Socket이 데이터와 컨텍스트를 통합하기 위해 들어오는 모든 요청에 대한 라우팅을 처리해야 했지만 새 모델에서는 Web Socket이 이제 라우터에 의존하지 않고 경로에 대한 데이터를 추론할 수 있습니다.

성능을 Bun 네이티브 Web Socket 성능에 가깝게 만듭니다.

Elysia Web Socket에 대한 test case를 제공하여 자신 있게 Web Socket을 다시 작성할 수 있도록 도와준 [Bogeychan](https://github.com/bogeychan)에게 감사드립니다.

## Definitions Remap
[Bogeychan](https://github.com/bogeychan)이 [#83](https://github.com/elysiajs/elysia/issues/83)에서 제안했습니다.

요약하면, Elysia는 원하는 값으로 데코레이트하고 요청하고 저장할 수 있지만 일부 플러그인은 우리가 가진 값과 중복 이름을 가질 수 있으며 때로는 플러그인에 이름 충돌이 있지만 속성 이름을 전혀 변경할 수 없습니다.

### Remapping
이름에서 알 수 있듯이 이를 통해 기존 `state`, `decorate`, `model`, `derive`를 이름 충돌을 방지하거나 속성 이름을 변경하기 위해 원하는 것으로 다시 매핑할 수 있습니다.

첫 번째 매개변수로 함수를 제공하면 콜백이 현재 값을 수락하여 원하는 값으로 다시 매핑할 수 있습니다.
```typescript
new Elysia()
    .state({
        a: "a",
        b: "b"
    })
    // Exclude b state
    .state(({ b, ...rest }) => rest)
```

이것은 중복 이름이 있는 플러그인을 다루어야 할 때 유용하며 플러그인의 이름을 다시 매핑할 수 있습니다:
```typescript
new Elysia()
    .use(
        plugin
            .decorate(({ logger, ...rest }) => ({
                pluginLogger: logger,
                ...rest
            }))
    )
```

Remap 함수는 `state`, `decorate`, `model`, `derive`와 함께 사용하여 올바른 속성 이름을 정의하고 이름 충돌을 방지하는 데 도움이 됩니다.

### Affix
더 부드러운 경험을 제공하기 위해 일부 플러그인은 하나씩 다시 매핑하기에 부담스러운 많은 속성 값을 가질 수 있습니다.

**prefix**와 **suffix**로 구성된 **Affix** 함수를 사용하면 인스턴스의 모든 속성을 다시 매핑하여 플러그인의 이름 충돌을 방지할 수 있습니다.

```typescript
const setup = new Elysia({ name: 'setup' })
    .decorate({
        argon: 'a',
        boron: 'b',
        carbon: 'c'
    })

const app = new Elysia()
    .use(
        setup
            .prefix('decorator', 'setup')
    )
    .get('/', ({ setupCarbon }) => setupCarbon)
```

플러그인의 속성을 쉽게 일괄 다시 매핑하여 플러그인의 이름 충돌을 방지할 수 있습니다.

기본적으로 **affix**는 런타임 및 타입 레벨 코드를 자동으로 처리하여 네이밍 규칙으로 속성을 camelCase로 다시 매핑합니다.

일부 조건에서는 플러그인의 `all` 속성을 다시 매핑할 수도 있습니다:
```typescript
const app = new Elysia()
    .use(
        setup
            .prefix('all', 'setup')
    )
    .get('/', ({ setupCarbon }) => setupCarbon)
```

remapping과 affix가 여러 복잡한 플러그인을 쉽게 처리할 수 있는 강력한 API를 제공하기를 바랍니다.

## True Encapsulation Scope
Elysia 0.7의 도입으로 Elysia는 이제 scoped 인스턴스를 다른 인스턴스로 취급하여 인스턴스를 진정으로 캡슐화할 수 있습니다.

새로운 scope 모델은 이전에는 불가능했던 메인 인스턴스에서 해결되는 `onRequest`와 같은 이벤트도 방지할 수 있습니다.

```typescript
const plugin = new Elysia({ scoped: true, prefix: '/hello' })
    .onRequest(() => {
        console.log('In Scoped')
    })
    .get('/', () => 'hello')

const app = new Elysia()
    .use(plugin)
    // 'In Scoped'는 로그되지 않습니다
    .get('/', () => 'Hello World')
```

또한 scoped는 이제 이전에 언급한 타입 재작성 없이는 불가능했던 런타임 및 타입 레벨 모두에서 진정으로 scoped됩니다.

이것은 유지 관리자 측면에서 흥미롭습니다. 이전에는 인스턴스의 범위를 진정으로 캡슐화하는 것이 거의 불가능했지만 `mount` 및 WinterCG 준수를 사용하여 마침내 `state`, `decorate`와 같은 메인 인스턴스 속성과 소프트 링크를 제공하면서 플러그인의 인스턴스를 진정으로 캡슐화할 수 있게 되었습니다.

## 텍스트 기반 status
기억해야 할 표준 HTTP status code가 64개 이상 있으며, 때로는 우리도 사용하려는 status를 잊어버린다는 것을 인정합니다.

이것이 자동 완성으로 텍스트 기반 형식의 64개 HTTP Status code를 제공하는 이유입니다.

![Example of using text-base status code](/blog/elysia-07/teapot.webp)

그러면 텍스트가 예상대로 자동으로 status code로 해석됩니다.

입력할 때 NeoVim 또는 VSCode와 관계없이 TypeScript의 내장 기능이므로 IDE에 대한 텍스트 팝업에 대한 자동 완성이 자동으로 표시되어야 합니다.

![Text-base status code showing auto-completion](/blog/elysia-07/teapot-autocompletion.webp)

이것은 올바른 status code를 검색하기 위해 IDE와 MDN 간에 전환하지 않고 서버를 개발하는 데 도움이 되는 작은 ergonomic 기능입니다.

## 주목할 만한 개선 사항
개선 사항:
- `onRequest`를 이제 async로 사용할 수 있음
- `onError`에 `Context` 추가
- lifecycle hook이 이제 배열 함수를 허용함
- 정적 코드 분석이 이제 rest 매개변수를 지원함
- 메모리 사용량을 줄이기 위해 동적 라우터를 정적 라우터에 인라인하는 대신 단일 파이프라인으로 분해
- `t.File` 및 `t.Files`를 `Blob` 대신 `File`로 설정
- class 인스턴스 병합 건너뛰기
- `UnknownContextPassToFunction` 처리
- [#157](https://github.com/elysiajs/elysia/pull/179) WebSocket - @bogeychan이 unit test를 추가하고 예제 및 api를 수정함
- [#179](https://github.com/elysiajs/elysia/pull/179) @arthurfiorette가 bun test를 실행하기 위해 github action 추가

Breaking Change:
- `ws` 플러그인 제거, 코어로 마이그레이션
- `addError`를 `error`로 이름 변경

변경 사항:
- 정적 맵에 인라인하는 대신 단일 findDynamicRoute 사용
- `mergician` 제거
- TypeScript 문제로 인해 배열 경로 제거
- TypeBox.Transform을 사용하도록 Type.ElysiaMeta 재작성

버그 수정:
- 기본적으로 response를 엄격하게 검증
- headers / query / params에서 `t.Numeric`이 작동하지 않음
- `t.Optional(t.Object({ [name]: t.Numeric }))`이 에러를 발생시킴
- `Numeric`을 변환하기 전에 null 체크 추가
- 인스턴스 플러그인에 store 상속
- class 중복 처리
- [#187](https://github.com/elysiajs/elysia/pull/187) @bogeychan이 InternalServerError 메시지를 "NOT_FOUND" 대신 "INTERNAL_SERVER_ERROR"로 수정
- [#167](https://github.com/elysiajs/elysia/pull/167) after handle에서 aot와 함께 mapEarlyResponse

## 마무리
최신 릴리스 이후 GitHub에서 2,000개 이상의 star를 얻었습니다!

되돌아보면 당시 상상했던 것보다 훨씬 더 많이 발전했습니다.

TypeScript와 개발자 경험의 경계를 넓히는 것은 우리가 진정으로 심오하다고 느끼는 일을 하고 있는 지점까지 이르렀습니다.

릴리스할 때마다 우리는 오래전에 그린 미래에 한 걸음 더 가까워지고 있습니다.

놀라운 개발자 경험으로 원하는 것을 자유롭게 만들 수 있는 미래입니다.

TypeScript와 Bun의 사랑스러운 커뮤니티에서 사랑받게 되어 정말 감사합니다.

다음과 같은 놀라운 개발자와 함께 Elysia가 살아나는 것을 보니 흥분됩니다:
- [놀라운 BETH Stack을 가진 Ethan Niser](https://youtu.be/aDYYn9R-JyE?si=hgvGgbywu_-jsmhR)
- [Fireship](https://youtu.be/dWqNgzZwVJQ?si=AeCmcMsTZtNwmhm2)에 언급됨
- [Lucia Auth](https://github.com/pilcrowOnPaper/lucia)에 대한 공식 통합 보유

그리고 다음 프로젝트에 Elysia를 선택한 훨씬 더 많은 개발자들이 있습니다.

우리의 목표는 간단합니다. 여러분이 꿈을 추구할 수 있고 모두가 행복하게 살 수 있는 영원한 낙원을 가져오는 것입니다.

Elysia에 대한 여러분의 사랑과 압도적인 지원에 감사드리며, 언젠가 우리의 꿈을 추구하는 미래를 현실로 그릴 수 있기를 바랍니다.

**모든 아름다움이 축복받기를**

> Stretch out that hand as if to reach someone
>
> I'm just like you, nothing special
>
> That's right, I'll sing the song of the night
>
> Stellar Stellar
>
> In the middle of the world, the universe
>
> The music won't ever, ever stop tonight
>
> That's right, I'd always longed to be
>
> Not Cinderella, forever waiting
>
> But the prince that came to for her
>
> Cause I'm a star, that's why
>
> Stellar Stellar

</Blog>
