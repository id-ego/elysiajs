---
title: Eden Treaty Config - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty Config - ElysiaJS

    - - meta
      - name: 'og:description'
        content: Eden Treaty는 Elysia 서버의 객체 스타일 표현으로, 종단 간 타입 안전성과 크게 개선된 개발자 경험을 제공합니다. Eden을 사용하면 코드 생성 없이 Elysia 서버에서 API를 완전히 타입 안전하게 가져올 수 있습니다.

    - - meta
      - name: 'og:description'
        content: Eden Treaty는 Elysia 서버의 객체 스타일 표현으로, 종단 간 타입 안전성과 크게 개선된 개발자 경험을 제공합니다. Eden을 사용하면 코드 생성 없이 Elysia 서버에서 API를 완전히 타입 안전하게 가져올 수 있습니다.
---

# Config
Eden Treaty는 2개의 매개변수를 받습니다:
- **urlOrInstance** - URL 엔드포인트 또는 Elysia 인스턴스
- **options** (선택 사항) - fetch 동작 커스터마이징

## urlOrInstance
URL 엔드포인트를 문자열로 받거나 리터럴 Elysia 인스턴스를 받습니다.

Eden은 타입에 따라 다음과 같이 동작을 변경합니다:

### URL 엔드포인트 (문자열)
URL 엔드포인트가 전달되면, Eden Treaty는 `fetch` 또는 `config.fetcher`를 사용하여 Elysia 인스턴스에 네트워크 요청을 생성합니다.

```typescript
import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const api = treaty<App>('localhost:3000')
```

URL 엔드포인트에 프로토콜을 지정할 수도 있고 지정하지 않을 수도 있습니다.

Elysia는 다음과 같이 엔드포인트를 자동으로 추가합니다:
1. 프로토콜이 지정되면 URL을 직접 사용
2. URL이 localhost이고 ENV가 production이 아니면 http 사용
3. 그렇지 않으면 https 사용

이는 **ws://** 또는 **wss://**를 결정하는 Web Socket에도 적용됩니다.

---

### Elysia 인스턴스
Elysia 인스턴스가 전달되면, Eden Treaty는 `Request` 클래스를 생성하고 네트워크 요청을 생성하지 않고 직접 `Elysia.handle`에 전달합니다.

이를 통해 요청 오버헤드 없이 또는 서버를 시작할 필요 없이 Elysia 서버와 직접 상호 작용할 수 있습니다.

```typescript
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .get('/hi', 'Hi Elysia')
    .listen(3000)

const api = treaty(app)
```

인스턴스가 전달되면, Eden Treaty가 매개변수에서 직접 타입을 추론할 수 있으므로 제네릭을 전달할 필요가 없습니다.

이 패턴은 단위 테스트를 수행하거나 타입 안전한 리버스 프록시 서버 또는 마이크로서비스를 생성하는 데 권장됩니다.

## Options
fetch 동작을 커스터마이징하기 위한 Eden Treaty의 2번째 선택적 매개변수로, 다음 매개변수를 받습니다:
- [fetch](#fetch) - fetch 초기화에 기본 매개변수 추가 (RequestInit)
- [headers](#headers) - 기본 헤더 정의
- [fetcher](#fetcher) - 커스텀 fetch 함수 예: Axios, unfetch
- [onRequest](#onrequest) - 실행 전에 fetch 요청 가로채기 및 수정
- [onResponse](#onresponse) - fetch의 응답 가로채기 및 수정

## Fetch
fetch의 2번째 매개변수에 추가되는 기본 매개변수로 **Fetch.RequestInit** 타입을 확장합니다.

```typescript
export type App = typeof app // [!code ++]
import { treaty } from '@elysiajs/eden'
// ---cut---
treaty<App>('localhost:3000', {
    fetch: {
        credentials: 'include'
    }
})
```

fetch에 전달되는 모든 매개변수는 fetcher에 전달되며, 다음과 같습니다:
```typescript
fetch('http://localhost:3000', {
    credentials: 'include'
})
```

## Headers
fetch에 추가 기본 헤더를 제공하며, `options.fetch.headers`의 단축형입니다.

```typescript
treaty<App>('localhost:3000', {
    headers: {
        'X-Custom': 'Griseo'
    }
})
```

fetch에 전달되는 모든 매개변수는 fetcher에 전달되며, 다음과 같습니다:
```typescript twoslash
fetch('localhost:3000', {
    headers: {
        'X-Custom': 'Griseo'
    }
})
```

headers는 다음을 매개변수로 받을 수 있습니다:
- Object
- Function

### Headers Object
객체가 전달되면 fetch에 직접 전달됩니다

```typescript
treaty<App>('localhost:3000', {
    headers: {
        'X-Custom': 'Griseo'
    }
})
```

### Function
조건에 따라 커스텀 헤더를 반환하도록 헤더를 함수로 지정할 수 있습니다

```typescript
treaty<App>('localhost:3000', {
    headers(path, options) {
        if(path.startsWith('user'))
            return {
                authorization: 'Bearer 12345'
            }
    }
})
```

객체를 반환하여 fetch 헤더에 값을 추가할 수 있습니다.

headers 함수는 2개의 매개변수를 받습니다:
- path `string` - 매개변수로 전송될 경로
  - 참고: 호스트명은 **제외**됩니다 예: (/user/griseo)
- options `RequestInit`: fetch의 2번째 매개변수를 통해 전달되는 매개변수

### Array
여러 조건이 필요한 경우 headers 함수를 배열로 정의할 수 있습니다.

```typescript
treaty<App>('localhost:3000', {
    headers: [
      (path, options) => {
        if(path.startsWith('user'))
            return {
                authorization: 'Bearer 12345'
            }
        }
    ]
})
```

Eden Treaty는 값이 이미 반환되었더라도 **모든 함수를 실행**합니다.

## Headers 우선순위
중복되는 경우 Eden Treaty는 다음과 같이 헤더의 순서를 우선시합니다:
1. 인라인 메서드 - 메서드 함수에 직접 전달
2. headers - `config.headers`에 전달
  - `config.headers`가 배열이면 나중에 오는 매개변수가 우선됨
3. fetch - `config.fetch.headers`에 전달

예를 들어, 다음 예제의 경우:
```typescript
const api = treaty<App>('localhost:3000', {
    headers: {
        authorization: 'Bearer Aponia'
    }
})

api.profile.get({
    headers: {
        authorization: 'Bearer Griseo'
    }
})
```

결과는 다음과 같습니다:
```typescript
fetch('http://localhost:3000', {
    headers: {
        authorization: 'Bearer Griseo'
    }
})
```

인라인 함수가 헤더를 지정하지 않으면 결과는 "**Bearer Aponia**"가 됩니다.

## Fetcher
환경의 기본 fetch 대신 커스텀 fetcher 함수를 제공합니다.

```typescript
treaty<App>('localhost:3000', {
    fetcher(url, options) {
        return fetch(url, options)
    }
})
```

fetch 대신 Axios, unfetch와 같은 다른 클라이언트를 사용하려는 경우 fetch를 교체하는 것이 좋습니다.

## OnRequest
실행 전에 fetch 요청을 가로채고 수정합니다.

객체를 반환하여 **RequestInit**에 값을 추가할 수 있습니다.

```typescript
treaty<App>('localhost:3000', {
    onRequest(path, options) {
        if(path.startsWith('user'))
            return {
                headers: {
                    authorization: 'Bearer 12345'
                }
            }
    }
})
```

값이 반환되면 Eden Treaty는 반환된 값과 `value.headers`에 대해 **얕은 병합**을 수행합니다.

**onRequest**는 2개의 매개변수를 받습니다:
- path `string` - 매개변수로 전송될 경로
  - 참고: 호스트명은 **제외**됩니다 예: (/user/griseo)
- options `RequestInit`: fetch의 2번째 매개변수를 통해 전달되는 매개변수

### Array
여러 조건이 필요한 경우 onRequest 함수를 배열로 정의할 수 있습니다.

```typescript
treaty<App>('localhost:3000', {
    onRequest: [
      (path, options) => {
        if(path.startsWith('user'))
            return {
                headers: {
                    authorization: 'Bearer 12345'
                }
            }
        }
    ]
})
```

Eden Treaty는 값이 이미 반환되었더라도 **모든 함수를 실행**합니다.

## onResponse
fetch의 응답을 가로채고 수정하거나 새 값을 반환합니다.

```typescript
treaty<App>('localhost:3000', {
    onResponse(response) {
        if(response.ok)
            return response.json()
    }
})
```

**onRequest**는 1개의 매개변수를 받습니다:
- response `Response` - `fetch`에서 일반적으로 반환되는 Web Standard Response

### Array
여러 조건이 필요한 경우 onResponse 함수를 배열로 정의할 수 있습니다.

```typescript
treaty<App>('localhost:3000', {
    onResponse: [
        (response) => {
            if(response.ok)
                return response.json()
        }
    ]
})
```
[headers](#headers)와 [onRequest](#onrequest)와 달리, Eden Treaty는 반환된 값을 찾거나 에러가 발생할 때까지 함수를 반복하며, 반환된 값은 새 응답으로 사용됩니다.
