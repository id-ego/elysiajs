---
title: Handler - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Handler - ElysiaJS

    - - meta
      - name: 'description'
        content: A handler is a function that responds to the request for each route. Accepting request information and returning a response to the client. Handler can be registered through Elysia.get / Elysia.post

    - - meta
      - property: 'og:description'
        content: A handler is a function that responds to the request for each route. Accepting request information and returning a response to the client. Handler can be registered through Elysia.get / Elysia.post
---

<script setup>
import Playground from '../components/nearl/playground.vue'
import Tab from '../components/fern/tab.vue'
import { Elysia } from 'elysia'

const handler1 = new Elysia()
    .get('/', ({ path }) => path)

const handler2 = new Elysia()
    .get('/', ({ status }) => status(418, "Kirifuji Nagisa"))
</script>

# Handler

**Handler**는 HTTP 요청을 받아들이고 응답을 반환하는 함수입니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    // 함수 `() => 'hello world'`가 handler입니다
    .get('/', () => 'hello world')
    .listen(3000)
```

Handler는 리터럴 값이 될 수 있으며 인라인으로 작성할 수 있습니다.

```typescript
import { Elysia, file } from 'elysia'

new Elysia()
    .get('/', 'Hello Elysia')
    .get('/video', file('kyuukurarin.mp4'))
    .listen(3000)
```

**인라인 값**을 사용하면 항상 같은 값을 반환하므로 파일과 같은 정적 리소스의 성능을 최적화하는 데 유용합니다.

이를 통해 Elysia는 응답을 미리 컴파일하여 성능을 최적화할 수 있습니다.

::: tip
인라인 값을 제공하는 것은 캐시가 아닙니다.

정적 리소스 값, 헤더 및 상태는 lifecycle을 사용하여 동적으로 변경할 수 있습니다.
:::

## Context

**Context**는 각 요청마다 고유한 요청 정보를 포함하며, `store` <small>(전역 변경 가능 상태)</small>를 제외하고는 공유되지 않습니다.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/', (context) => context.path)
            // ^ 이것이 context입니다
```

**Context**는 route handler에서만 가져올 수 있습니다. 다음으로 구성됩니다:

#### Property
-   [**body**](/essential/validation.html#body) - [HTTP 메시지](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages), 폼 또는 파일 업로드
-   [**query**](/essential/validation.html#query) - [Query String](https://en.wikipedia.org/wiki/Query_string), JavaScript Object로 검색 쿼리를 위한 추가 매개변수를 포함합니다 (Query는 '?' 물음표 기호부터 시작하는 pathname 이후의 값에서 추출됩니다)
-   [**params**](/essential/validation.html#params) - JavaScript object로 파싱된 Elysia의 경로 매개변수
-   [**headers**](/essential/validation.html#headers) - [HTTP Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers), User-Agent, Content-Type, Cache Hint와 같은 요청에 대한 추가 정보
-   [**cookie**](#cookie) - Cookie와 상호작용하기 위한 전역 변경 가능 signal store (get/set 포함)
-   [**store**](#state) - Elysia 인스턴스를 위한 전역 변경 가능 store

#### Utility Function
-   [**redirect**](#redirect) - 응답을 리디렉션하는 함수
-   [**status**](#status) - 사용자 지정 상태 코드를 반환하는 함수
-   [**set**](#set) - Response에 적용할 속성:
    -   [**headers**](#set.headers) - Response 헤더

#### Additional Property
-   [**request**](#request) - [Web Standard Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
-   [**server**](#server-bun-only) - Bun 서버 인스턴스
-   **path** - 요청의 Pathname

## status
타입 narrowing과 함께 사용자 정의 상태 코드를 반환하는 함수입니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ status }) => status(418, "Kirifuji Nagisa"))
    .listen(3000)
```

<Playground :elysia="handler2" />

**status**를 throw하는 대신 반환하는 **never-throw** 접근 방식을 사용하는 것이 권장됩니다. 이유는 다음과 같습니다:
- TypeScript가 반환 값이 response schema에 올바르게 타입되어 있는지 확인할 수 있습니다
- 상태 코드에 따른 타입 narrowing을 위한 자동 완성
- End-to-end 타입 안정성([Eden](/eden/overview))을 사용한 오류 처리를 위한 타입 narrowing

## Set

**set**은 `Context.set`을 통해 접근할 수 있는 응답을 형성하는 변경 가능한 속성입니다.

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ set, status }) => {
		set.headers = { 'X-Teapot': 'true' }

		return status(418, 'I am a teapot')
	})
	.listen(3000)
```

### set.headers
Object로 표현되는 응답 헤더를 추가하거나 삭제할 수 있습니다.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.headers['x-powered-by'] = 'Elysia'

        return 'a mimir'
    })
    .listen(3000)
```

::: tip
Elysia는 대소문자 일관성을 위해 소문자 자동 완성을 제공합니다. 예를 들어 `Set-Cookie` 대신 `set-cookie`를 사용하세요.
:::

<details>

<summary>
redirect <Badge type="warning">Legacy</Badge>
</summary>

요청을 다른 리소스로 리디렉션합니다.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ redirect }) => {
        return redirect('https://youtu.be/whpVWVWBW4U?&t=8')
    })
    .get('/custom-status', ({ redirect }) => {
        // 사용자 정의 상태로 리디렉션할 수도 있습니다
        return redirect('https://youtu.be/whpVWVWBW4U?&t=8', 302)
    })
    .listen(3000)
```

redirect를 사용할 때 반환 값은 필요하지 않으며 무시됩니다. 응답은 다른 리소스에서 가져오기 때문입니다.

</details>

<details>

<summary>
	set.status <Badge type="warning">Legacy</Badge>
</summary>

제공되지 않은 경우 기본 상태 코드를 설정합니다.

특정 상태 코드만 반환해야 하는 플러그인에서 사용자가 사용자 정의 값을 반환할 수 있도록 하는 경우 권장됩니다. 예를 들어 HTTP 201/206 또는 403/405 등입니다.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .onBeforeHandle(({ set }) => {
        set.status = 418

        return 'Kirifuji Nagisa'
    })
    .get('/', () => 'hi')
    .listen(3000)
```

`status` 함수와 달리 `set.status`는 반환 값 타입을 추론할 수 없으므로 반환 값이 response schema에 올바르게 타입되어 있는지 확인할 수 없습니다.

::: tip
HTTP Status는 응답 유형을 나타냅니다. route handler가 오류 없이 성공적으로 실행되면 Elysia는 상태 코드 200을 반환합니다.
:::

상태 코드의 일반 이름을 사용하여 숫자 대신 상태 코드를 설정할 수도 있습니다.

```typescript twoslash
// @errors 2322
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.status
          // ^?

        return 'Kirifuji Nagisa'
    })
    .listen(3000)
```

</details>

## Cookie
Elysia는 Cookie와 상호작용하기 위한 변경 가능한 signal을 제공합니다.

get/set이 없으며, cookie 이름을 추출하고 그 값을 직접 가져오거나 업데이트할 수 있습니다.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/set', ({ cookie: { name } }) => {
		// Get
        name.value

        // Set
        name.value = "New Value"
	})
```

자세한 내용은 [Patterns: Cookie](/essentials/cookie)를 참조하세요.

## Redirect
요청을 다른 리소스로 리디렉션합니다.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ redirect }) => {
		return redirect('https://youtu.be/whpVWVWBW4U?&t=8')
	})
	.get('/custom-status', ({ redirect }) => {
		// 사용자 정의 상태로 리디렉션할 수도 있습니다
		return redirect('https://youtu.be/whpVWVWBW4U?&t=8', 302)
	})
	.listen(3000)
```

redirect를 사용할 때 반환 값은 필요하지 않으며 무시됩니다. 응답은 다른 리소스에서 가져오기 때문입니다.

## Formdata
handler에서 직접 `form` 유틸리티를 반환하여 `FormData`를 반환할 수 있습니다.

```typescript
import { Elysia, form, file } from 'elysia'

new Elysia()
	.get('/', () => form({
		name: 'Tea Party',
		images: [file('nagi.web'), file('mika.webp')]
	}))
	.listen(3000)
```

이 패턴은 파일이나 multipart form data를 반환해야 하는 경우에 유용합니다.

### Return a file
또는 `form` 없이 `file`을 직접 반환하여 단일 파일을 반환할 수 있습니다.

```typescript
import { Elysia, file } from 'elysia'

new Elysia()
	.get('/', file('nagi.web'))
	.listen(3000)
```

## Stream
`yield` 키워드와 함께 generator 함수를 사용하여 즉시 응답 스트리밍을 반환합니다.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})
```

이 예제에서 `yield` 키워드를 사용하여 응답을 스트리밍할 수 있습니다.

## Server Sent Events (SSE)
Elysia는 `sse` 유틸리티 함수를 제공하여 [Server Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)를 지원합니다.

```typescript twoslash
import { Elysia, sse } from 'elysia'

new Elysia()
	.get('/sse', function* () {
		yield sse('hello world')
		yield sse({
			event: 'message',
			data: {
				message: 'This is a message',
				timestamp: new Date().toISOString()
			},
		})
	})
```

값이 `sse`로 래핑되면 Elysia는 자동으로 응답 헤더를 `text/event-stream`으로 설정하고 데이터를 SSE 이벤트로 포맷합니다.

### Headers in Server-Sent Event

헤더는 첫 번째 청크가 yield되기 전에만 설정할 수 있습니다.

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* ({ set }) {
		// 이것은 헤더를 설정합니다
		set.headers['x-name'] = 'Elysia'
		yield 1
		yield 2

		// 이것은 아무것도 하지 않습니다
		set.headers['x-id'] = '1'
		yield 3
	})
```

첫 번째 청크가 yield되면 Elysia는 헤더를 클라이언트에 보내므로 첫 번째 청크가 yield된 후 헤더를 변경해도 아무 일도 일어나지 않습니다.

### Conditional Stream
yield 없이 응답이 반환되면 Elysia는 자동으로 스트림을 일반 응답으로 변환합니다.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* () {
		if (Math.random() > 0.5) return 'ok'

		yield 1
		yield 2
		yield 3
	})
```

이를 통해 필요에 따라 조건부로 응답을 스트리밍하거나 일반 응답을 반환할 수 있습니다.

### Automatic cancellation
응답 스트리밍이 완료되기 전에 사용자가 요청을 취소하면 Elysia는 자동으로 generator 함수를 중지합니다.

### Eden
[Eden](/eden/overview)은 스트림 응답을 `AsyncGenerator`로 해석하여 `for await` 루프를 사용하여 스트림을 소비할 수 있게 합니다.

```typescript twoslash
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})

const { data, error } = await treaty(app).ok.get()
if (error) throw error

for await (const chunk of data)
	console.log(chunk)
```

## Request
Elysia는 Node, Bun, Deno, Cloudflare Worker, Vercel Edge Function 등 여러 런타임 간에 공유되는 [Web Standard Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) 위에 구축되었습니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/user-agent', ({ request }) => {
		return request.headers.get('user-agent')
	})
	.listen(3000)
```

필요한 경우 low-level 요청 정보에 액세스할 수 있습니다.

## Server <Badge type="warning">Bun only</Badge>
Server 인스턴스는 Bun 서버 인스턴스로, 포트 번호나 요청 IP와 같은 서버 정보에 액세스할 수 있습니다.

Server는 `listen`으로 HTTP 서버가 실행 중일 때만 사용할 수 있습니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/port', ({ server }) => {
		return server?.port
	})
	.listen(3000)
```

### Request IP <Badge type="warning">Bun only</Badge>
`server.requestIP` 메서드를 사용하여 요청 IP를 가져올 수 있습니다

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/ip', ({ server, request }) => {
		return server?.requestIP(request)
	})
	.listen(3000)
```

## Extends context <Badge type="warning">Advance concept</Badge>

Elysia는 기본적으로 최소한의 Context를 제공하여 state, decorate, derive, resolve를 사용하여 특정 요구 사항에 맞게 Context를 확장할 수 있습니다.

Context를 확장하는 방법에 대한 자세한 내용은 [Extends Context](/patterns/extends-context)를 참조하세요.
