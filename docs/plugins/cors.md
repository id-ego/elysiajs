---
title: CORS Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: CORS Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Plugin for Elysia that adds support for customizing Cross-Origin Resource Sharing behavior. Start by installing the plugin with "bun add @elysiajs/cors".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that adds support for customizing Cross-Origin Resource Sharing behavior. Start by installing the plugin with "bun add @elysiajs/cors".
---

# CORS Plugin

이 플러그인은 [Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 동작을 커스터마이징하는 기능을 추가합니다.

설치 방법:

```bash
bun add @elysiajs/cors
```

사용 방법:

```typescript twoslash
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

new Elysia().use(cors()).listen(3000)
```

이렇게 하면 Elysia가 모든 출처의 요청을 허용하도록 설정됩니다.

## Config

플러그인에서 허용하는 설정은 다음과 같습니다.

### origin

@default `true`

주어진 출처에서 요청 코드와 응답을 공유할 수 있는지 여부를 나타냅니다.

값은 다음 중 하나일 수 있습니다:

- **string** - [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) 헤더에 직접 할당될 출처 이름
- **boolean** - true로 설정하면 [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)이 `*`(모든 출처)로 설정됩니다
- **RegExp** - 요청의 URL과 일치하는 패턴, 일치하면 허용됩니다
- **Function** - 리소스 공유를 허용하는 커스텀 로직, `true`가 반환되면 허용됩니다
    - 다음 타입을 가져야 합니다:
    ```typescript
    cors(context: Context) => boolean | void
    ```
- **Array<string | RegExp | Function>** - 위의 모든 케이스를 순서대로 반복하며, 값 중 하나라도 `true`면 허용됩니다

---

### methods

@default `*`

교차 출처 요청에 허용되는 메서드입니다.

[Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) 헤더를 할당합니다.

값은 다음 중 하나일 수 있습니다:

- **undefined | null | ''** - 모든 메서드를 무시합니다
- **\*** - 모든 메서드를 허용합니다
- **string** - 단일 메서드 또는 쉼표로 구분된 문자열을 예상합니다
    - (예: `'GET, PUT, POST'`)
- **string[]** - 여러 HTTP 메서드를 허용합니다
    - 예: `['GET', 'PUT', 'POST']`

---

### allowedHeaders

@default `*`

들어오는 요청에 허용되는 헤더입니다.

[Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) 헤더를 할당합니다.

값은 다음 중 하나일 수 있습니다:

- **string** - 단일 헤더 또는 쉼표로 구분된 문자열을 예상합니다
    - 예: `'Content-Type, Authorization'`
- **string[]** - 여러 HTTP 헤더를 허용합니다
    - 예: `['Content-Type', 'Authorization']`

---

### exposeHeaders

@default `*`

지정된 헤더로 CORS 응답을 합니다.

[Access-Control-Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers) 헤더를 할당합니다.

값은 다음 중 하나일 수 있습니다:

- **string** - 단일 헤더 또는 쉼표로 구분된 문자열을 예상합니다
    - 예: `'Content-Type, X-Powered-By'`
- **string[]** - 여러 HTTP 헤더를 허용합니다
    - 예: `['Content-Type', 'X-Powered-By']`

---

### credentials

@default `true`

Access-Control-Allow-Credentials 응답 헤더는 요청의 credentials 모드 [Request.credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)가 `include`일 때 브라우저가 프론트엔드 JavaScript 코드에 응답을 노출할지 여부를 알려줍니다.

요청의 credentials 모드 [Request.credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)가 `include`일 때, Access-Control-Allow-Credentials 값이 true인 경우에만 브라우저가 프론트엔드 JavaScript 코드에 응답을 노출합니다.

Credentials는 쿠키, 인증 헤더 또는 TLS 클라이언트 인증서입니다.

[Access-Control-Allow-Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials) 헤더를 할당합니다.

---

### maxAge

@default `5`

[preflight 요청](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request)의 결과(즉, [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) 및 [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) 헤더에 포함된 정보)를 캐시할 수 있는 기간을 나타냅니다.

[Access-Control-Max-Age](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age) 헤더를 할당합니다.

---

### preflight

preflight 요청은 CORS 프로토콜이 이해되는지, 서버가 특정 메서드와 헤더를 사용하는 것을 인식하는지 확인하기 위해 보내는 요청입니다.

3개의 HTTP 요청 헤더와 함께 **OPTIONS** 요청으로 응답합니다:

- **Access-Control-Request-Method**
- **Access-Control-Request-Headers**
- **Origin**

이 설정은 서버가 preflight 요청에 응답할지 여부를 나타냅니다.

## Pattern

플러그인을 사용하는 일반적인 패턴을 찾을 수 있습니다.

## 최상위 도메인별 CORS 허용

```typescript twoslash
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

const app = new Elysia()
	.use(
		cors({
			origin: /.*\.saltyaom\.com$/
		})
	)
	.get('/', () => 'Hi')
	.listen(3000)
```

이렇게 하면 `saltyaom.com` 최상위 도메인의 요청을 허용합니다.
