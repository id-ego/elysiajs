---
title: Elysia 0.8 - Gate of Steiner
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Introducing Elysia 0.8 - Gate of Steiner

    - - meta
      - name: 'description'
        content: Introducing Macro API, a new way to interact with Elysia. New Lifecycle, resolve, and mapResponse to interact with Elysia even more. Static Content to compile static resource ahead of time. Default Property, Default Header and several improvement.

    - - meta
      - property: 'og:description'
        content: Introducing Macro API, a new way to interact with Elysia. New Lifecycle, resolve, and mapResponse to interact with Elysia even more. Static Content to compile static resource ahead of time. Default Property, Default Header and several improvement.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-08/gate-of-steiner.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-08/gate-of-steiner.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.8 - Gate of Steiner"
    src="/blog/elysia-08/gate-of-steiner.webp"
    alt="Satellite floating in space before the vast world"
    author="saltyaom"
    date="23 Dec 2023"
>

Steins;Gate Zero의 엔딩곡인 [**"Gate of Steiner"**](https://youtu.be/S5fnglcM5VI)의 이름을 따서 명명되었습니다.

Gate of Steiner는 흥미로운 새로운 API와 기능에 초점을 맞추지 않고 API 안정성과 견고한 기반에 초점을 맞춰 Elysia 1.0이 릴리스되면 API가 안정적이 되도록 합니다.

그러나 다음을 포함한 개선 사항과 새로운 기능을 제공합니다:
- [Macro API](#macro-api)
- [New Lifecycle: resolve, mapResponse](#new-life-cycle)
- [Error Function](#error-function)
- [Static Content](#static-content)
- [Default Property](#default-property)
- [Default Header](#default-header)
- [Performance and Notable Improvement](#performance-and-notable-improvement)

## Macro API
Macro를 사용하면 라이프사이클 이벤트 스택에 대한 완전한 제어를 노출하여 hook 및 guard할 커스텀 필드를 정의할 수 있습니다.

완전한 타입 안전성으로 커스텀 로직을 간단한 구성으로 작성할 수 있습니다.

역할 기반으로 액세스를 제한하는 인증 플러그인이 있다고 가정하면 커스텀 **role** 필드를 정의할 수 있습니다.

```typescript
import { Elysia } from 'elysia'
import { auth } from '@services/auth'

const app = new Elysia()
    .use(auth)
    .get('/', ({ user }) => user.profile, {
        role: 'admin'
    })
```

Macro는 라이프사이클 스택에 대한 완전한 액세스 권한이 있어 각 경로에 대해 기존 이벤트를 직접 추가, 수정 또는 삭제할 수 있습니다.
```typescript
const plugin = new Elysia({ name: 'plugin' }).macro(({ beforeHandle }) => {
    return {
        role(type: 'admin' | 'user') {
            beforeHandle(
                { insert: 'before' },
                async ({ cookie: { session } }) => {
                  const user = await validateSession(session.value)
                  await validateRole('admin', user)
}
            )
        }
    }
})
```

이 macro API를 통해 플러그인 유지 관리자가 Elysia를 원하는 대로 커스터마이즈할 수 있어 Elysia와 더 잘 상호 작용할 수 있는 새로운 방법을 열고, Elysia 사용자는 Elysia가 제공할 수 있는 더욱 ergonomic한 API를 즐길 수 있기를 바랍니다.

[Macro API](/patterns/macro)의 문서는 이제 **pattern** 섹션에서 사용할 수 있습니다.

차세대 커스터마이징 기능은 이제 키보드와 상상력만 있으면 됩니다.

## New Life Cycle
Elysia는 **Resolve**와 **MapResponse**를 포함하여 기존 문제와 많은 요청이 있는 API를 수정하기 위해 새로운 라이프사이클을 도입했습니다:
resolve: **derive**의 안전한 버전. **beforeHandle**과 동일한 큐에서 실행됩니다
mapResponse: 기본 값에서 Web Standard Response로 변환 함수를 제공하기 위해 **afterResponse** 직후에 실행됩니다

### Resolve
[derive](/essential/context.html#derive)의 "안전한" 버전입니다.

검증 프로세스 후 컨텍스트에 새 값을 추가하도록 설계되어 **beforeHandle**과 동일한 스택에 저장됩니다.

Resolve 구문은 [derive](/life-cycle/before-handle#derive)와 동일하며, 아래는 Authorization 플러그인에서 bearer 헤더를 검색하는 예제입니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .guard(
        {
            headers: t.Object({
                authorization: t.TemplateLiteral('Bearer ${string}')
            })
        },
        (app) =>
            app
                .resolve(({ headers: { authorization } }) => {
                    return {
                        bearer: authorization.split(' ')[1]
                    }
                })
                .get('/', ({ bearer }) => bearer)
    )
    .listen(3000)
```

### MapResponse
**"afterHandle"** 직후에 실행되며 기본 값에서 Web Standard Response로 커스텀 response 매핑을 제공하도록 설계되었습니다.

아래는 mapResponse를 사용하여 Response 압축을 제공하는 예제입니다.

```typescript
import { Elysia, mapResponse } from 'elysia'
import { gzipSync } from 'bun'

new Elysia()
    .mapResponse(({ response }) => {
        return new Response(
            gzipSync(
                typeof response === 'object'
                    ? JSON.stringify(response)
                    : response.toString()
            )
        )
    })
    .listen(3000)
```

왜 **afterHandle**을 사용하지 않고 새로운 API를 도입할까요?

**afterHandle**은 기본 값을 읽고 수정하도록 설계되었기 때문입니다. Web Standard Response를 생성하는 데 의존하는 HTML 및 Compression과 같은 플러그인을 저장합니다.

즉, 이 유형의 플러그인 후에 등록된 플러그인은 값을 읽거나 수정할 수 없어 플러그인 동작이 올바르지 않게 됩니다.

이것이 response 매핑과 기본 값 mutation을 동일한 큐에 혼합하는 대신 커스텀 response 매핑을 제공하는 데 전념하는 **afterHandle** 후에 실행되는 새로운 라이프사이클을 도입한 이유입니다.


## Error Function
**set.status**를 사용하거나 새 Response를 반환하여 status code를 설정할 수 있습니다.
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.status = 418

        return "I'm a teapot"
    })
    .listen(3000)
```

이것은 서버가 어떻게 동작해야 하는지 걱정하는 대신 클라이언트에 리터럴 값만 전달하는 우리의 목표와 일치합니다.

그러나 이것은 Eden과의 통합이 어렵다는 것이 입증되었습니다. 리터럴 값을 반환하므로 response에서 status code를 추론할 수 없어 Eden이 status code에서 response를 구별할 수 없습니다.

이로 인해 Eden은 특히 에러 처리에서 각 status에 대한 명시적인 response 타입을 선언하지 않고는 타입을 추론할 수 없어 완전한 잠재력을 사용할 수 없습니다.

**set.status**와 **new Response**에 의존하지 않고 값과 함께 status code를 직접 반환하는 더 명시적인 방법을 원하거나 핸들러 함수 외부에 선언된 유틸리티 함수에서 response를 반환하는 많은 사용자의 요청과 함께합니다.

이것이 status code와 함께 값을 클라이언트에 반환하는 **error** 함수를 도입한 이유입니다.

```typescript
import { Elysia, error } from 'elysia' // [!code ++]

new Elysia()
    .get('/', () => error(418, "I'm a teapot")) // [!code ++]
    .listen(3000)
```

Which is an equivalent to:
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.status = 418

        return "I'm a teapot"
    })
    .listen(3000)
```

차이점은 **error** 함수를 사용하면 Elysia가 status code에서 전용 response 타입으로 자동으로 구별하여 Eden이 status를 기반으로 response를 올바르게 추론하도록 돕습니다.

즉, **error**를 사용하면 각 status code에 대해 Eden이 타입을 올바르게 추론하도록 명시적인 response 스키마를 포함할 필요가 없습니다.

```typescript
import { Elysia, error, t } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.status = 418
        return "I'm a teapot"
    }, { // [!code --]
        response: { // [!code --]
            418: t.String() // [!code --]
        } // [!code --]
    }) // [!code --]
    .listen(3000)
```

올바른 타입 추론을 위해 status code와 함께 response를 반환하려면 `error` 함수를 사용하는 것을 권장하지만, 기존 서버가 작동하도록 유지하기 위해 Elysia에서 **set.status** 사용을 제거할 의도는 없습니다.

## Static Content
Static Content는 들어오는 요청에 관계없이 거의 항상 동일한 값을 반환하는 response를 나타냅니다.

서버의 이러한 유형의 리소스는 일반적으로 서버가 업데이트되지 않는 한 거의 변경되지 않는 public **File**, **video** 또는 하드코딩된 값과 같은 것입니다.

지금까지 Elysia의 대부분의 콘텐츠는 정적 콘텐츠입니다. 그러나 정적 파일을 제공하거나 템플릿 엔진을 사용하여 HTML 페이지를 제공하는 것과 같은 많은 경우가 일반적으로 정적 콘텐츠라는 것을 발견했습니다.

이것이 Elysia가 Response를 Ahead of Time으로 결정하여 정적 콘텐츠를 최적화하는 새로운 API를 도입한 이유입니다.

```typescript
new Elysia()
    .get('/', () => Bun.file('video/kyuukurarin.mp4')) // [!code --]
    .get('/', Bun.file('video/kyuukurarin.mp4')) // [!code ++]
    .listen(3000)
```

이제 핸들러가 함수가 아니라 인라인 값이라는 것을 주목하세요.

이것은 response를 ahead of time으로 컴파일하여 성능을 약 20-25% 향상시킵니다.

## Default Property
Elysia 0.8은 전용 RegEx, Deref를 포함한 많은 새로운 기능을 도입하는 [TypeBox 0.32](https://github.com/sinclairzx81/typebox/blob/index/changelog/0.32.0.md)로 업데이트하지만 가장 중요한 것은 Elysia에서 가장 많이 요청된 기능인 **default** 필드 지원입니다.

이제 Type Builder에서 default 필드를 정의하면 값이 제공되지 않은 경우 Elysia가 기본 값을 제공하며 type에서 body까지 스키마 타입을 지원합니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ query: { name } }) => name, {
        query: t.Object({
            name: t.String({
                default: 'Elysia'
            })
        })
    })
    .listen(3000)
```

이를 통해 스키마에서 직접 기본 값을 제공할 수 있으며 특히 참조 스키마를 사용할 때 유용합니다.

## Default Header
**set.headers**를 사용하여 헤더를 설정할 수 있으며, Elysia는 항상 모든 요청에 대해 기본 빈 객체를 생성합니다.

이전에는 **onRequest**를 사용하여 set.headers에 원하는 값을 추가할 수 있었지만 함수가 호출되기 때문에 항상 약간의 오버헤드가 있습니다.

객체를 변경하기 위해 함수를 쌓는 것은 CORS 또는 캐시 헤더와 같이 모든 요청에 대해 값이 항상 동일한 경우 처음에 원하는 값을 설정하는 것보다 약간 느릴 수 있습니다.

이것이 모든 새 요청에 대해 빈 객체를 생성하는 대신 기본 헤더를 즉시 설정하는 것을 지원하는 이유입니다.
```typescript
new Elysia()
    .headers({
        'X-Powered-By': 'Elysia'
    })
```

Elysia CORS 플러그인도 이 성능을 향상시키기 위해 이 새로운 API를 사용하도록 업데이트되었습니다.

## Performance and notable improvement
평소와 같이 Elysia를 더욱 최적화하여 즉시 최고의 성능을 얻을 수 있도록 방법을 찾았습니다.

### bind 제거
**.bind**가 경로 조회 속도를 약 ~5% 느리게 한다는 것을 발견했으며, 코드베이스에서 bind를 제거하면 해당 프로세스를 약간 가속화할 수 있습니다.

### Static Query Analysis
Elysia Static Code Analysis는 이제 코드에서 query 이름이 참조되는 경우 query를 추론할 수 있습니다.

이것은 일반적으로 기본적으로 15-20%의 속도 향상을 가져옵니다.

### Video Stream
Elysia는 이제 청크로 전송해야 하는 비디오와 같은 대용량 파일의 문제를 해결하기 위해 기본적으로 File 및 Blob에 **content-range** 헤더를 추가합니다.

이를 수정하기 위해 Elysia는 이제 기본적으로 **content-range** 헤더를 추가합니다.

Elysia는 status code가 206, 304, 412, 416으로 설정되어 있거나 헤더가 명시적으로 **content-range**를 제공하는 경우 **content-range**를 전송하지 않습니다.

캐시에서 **content-range** 충돌을 피하기 위해 올바른 status code를 처리하려면 [ETag plugin](https://github.com/bogeychan/elysia-etag)을 사용하는 것이 좋습니다.

이것은 **content-range** 헤더에 대한 초기 지원이며, 향후 [RPC-7233](https://datatracker.ietf.org/doc/html/rfc7233#section-4.2)을 기반으로 더 정확한 동작을 구현하기 위한 논의를 만들었습니다. [Discussion 371](https://github.com/elysiajs/elysia/discussions/371)에서 **content-range** 및 **etag generation**으로 Elysia에 대한 새로운 동작을 제안하려면 자유롭게 논의에 참여하십시오.

### Runtime Memory improvement
Elysia는 이제 새로운 전용 값을 선언하는 대신 라이프사이클 이벤트의 반환 값을 재사용합니다.

이것은 Elysia의 메모리 사용량을 약간 줄여 최대 동시 요청에 대해 약간 더 나아집니다.

### Plugins
대부분의 공식 플러그인은 이제 더 새로운 **Elysia.headers**, Static Content, **MapResponse**를 활용하고 전반적인 성능을 향상시키기 위해 정적 코드 분석을 더욱 준수하도록 코드를 수정했습니다.

이것으로 개선된 플러그인은 다음과 같습니다: Static, HTML, CORS.

### Validation Error
Elysia는 이제 텍스트 대신 JSON으로 validation 에러를 반환합니다.

현재 에러와 모든 에러 및 예상 값을 대신 표시하여 에러를 더 쉽게 식별할 수 있도록 돕습니다.

Example:
```json
{
  "type": "query",
  "at": "password",
  "message": "Required property",
  "expected": {
    "email": "eden@elysiajs.com",
    "password": ""
  },
  "found": {
    "email": "eden@elysiajs.com"
  },
  "errors": [
    {
      "type": 45,
      "schema": {
        "type": "string"
      },
      "path": "/password",
      "message": "Required property"
    },
    {
      "type": 54,
      "schema": {
        "type": "string"
      },
      "path": "/password",
      "message": "Expected string"
    }
  ]
}
```

**expect** 및 **errors** 필드는 공격자가 추가 공격을 위한 모델을 식별하지 못하도록 프로덕션 환경에서 기본적으로 제거됩니다.

## 주목할 만한 개선 사항

**개선 사항**
- lazy query reference
- 기본적으로 `Blob`에 content-range 헤더 추가
- TypeBox를 0.32로 업데이트
- `be` 및 `af`의 lifecycle response 재정의

**Breaking Change**
- `afterHandle`은 더 이상 조기 반환하지 않음

**변경 사항**
- validation response를 JSON으로 변경
- `decorator['request']`에서 derive를 `decorator['derive']`로 구별
- `derive`는 이제 onRequest에서 추론 타입을 표시하지 않음

**버그 수정**
- `PreContext`에서 `headers`, `path` 제거
- `PreContext`에서 `derive` 제거
- Elysia 타입이 커스텀 `error`를 출력하지 않음

## 마무리
첫 릴리스 이후 훌륭한 여정이었습니다.

Elysia는 일반적인 REST API 프레임워크에서 엔드투엔드 타입 안전성, OpenAPI 문서 생성을 지원하는 ergonomic 프레임워크로 발전했으며, 앞으로도 더 흥미로운 기능을 계속 도입하고 싶습니다.

<br>
Elysia로 놀라운 것을 만드는 여러분과 개발자들이 있어 행복하며, Elysia에 대한 여러분의 압도적인 지속적인 지원은 우리가 계속 나아가도록 격려합니다.

Elysia가 커뮤니티로서 더 성장하는 것을 보니 흥분됩니다:
- Swagger UI 대신 새 문서를 위한 [Scalar's Elysia theme](https://x.com/saltyAom/status/1737468941696421908?s=20).
- [pkgx](https://pkgx.dev/)가 즉시 Elysia를 지원함.
- 커뮤니티가 Elysia를 [TechEmpower](https://www.techempower.com/benchmarks/#section=data-r22&hw=ph&test=composite)에 제출하여 composite score에서 모든 프레임워크 중 32위를 차지하며 Go의 Gin 및 Echo를 능가함.

우리는 이제 여러분이 우리에게 준 친절을 되돌려주기 위해 각 런타임, 플러그인 및 통합에 대한 더 많은 지원을 제공하려고 노력하고 있으며, 더 자세하고 초보자 친화적인 문서 재작성, [Nextjs와의 통합](/integrations/nextj), [Astro](/integrations/astro) 및 앞으로 더 많은 것을 시작합니다.

그리고 0.7 릴리스 이후 이전 릴리스에 비해 문제가 적었습니다.

이제 **우리는 Elysia의 첫 번째 안정 릴리스를 준비하고 있습니다**. Elysia 1.0은 **2024년 1분기**에 여러분의 친절에 보답하기 위해 릴리스하는 것을 목표로 합니다.
Elysia는 이제 소프트 API 잠금 모드에 들어가 API 변경을 방지하고 안정 릴리스가 도착하면 breaking change가 없거나 적도록 합니다.

따라서 Elysia 앱이 0.7부터 작동하며 Elysia의 안정 릴리스를 지원하기 위한 변경이 없거나 최소한으로 작동할 것으로 예상할 수 있습니다.

Elysia에 대한 지속적인 지원에 다시 감사드리며, 안정 릴리스 날에 다시 뵙기를 희망합니다.

*이 세상의 모든 아름다운 것을 위해 계속 싸워라*.

그때까지, *El Psy Congroo*.

> A drop in the darkness 小さな命
>
> Unique and precious forever
>
> Bittersweet memories 夢幻の刹那
>
> Make this moment last, last forever
>
> We drift through the heavens 果てない想い
>
> Filled with the love from up above
>
> He guides my travels せまる刻限
>
> Shed a tear and leap to a new world

</Blog>
