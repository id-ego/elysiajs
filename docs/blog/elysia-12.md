---
title: Elysia 1.2 - You and Me
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 1.2 - You and Me

    - - meta
      - name: 'description'
        content: Introducing Adapter for universal runtime support, Object macro with resolve, Parser with custom name, WebSocket with lifecycle, TypeBox 0.34 with recursive type, and Eden validation inference.

    - - meta
      - property: 'og:description'
        content: Introducing Adapter for universal runtime support, Object macro with resolve, Parser with custom name, WebSocket with lifecycle, TypeBox 0.34 with recursive type, and Eden validation inference.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-12/elysia-12.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-12/elysia-12.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 1.2 - You and Me"
    src="/blog/elysia-12/elysia-12.webp"
    alt="Blue-purple tint background with white text label Elysia 1.2 in the middle"
    author="saltyaom"
    date="23 Dec 2024"
    shadow
>

HoyoMix의 앨범 "At the Fingertip of the Sea"의 수록곡 [Φ²](https://youtu.be/b9IkzWO63Fg)에서 이름을 따왔으며, [**"You and Me"**](https://youtu.be/nz_Ra4G57A4)에서 사용되었습니다.

Elysia 1.2는 범용 런타임 지원 확대와 개발자 경험 개선에 초점을 맞추고 있습니다:
- [Adapter](#adapter)
- [Macro with resolve](#macro-with-resolve)
- [Parser](#parser)
- [WebSocket](#websocket)
- [Typebox 0.34](#typebox)
- [Reduced Memory usage](#reduced-memory-usage)

## Adapter
가장 많이 요청된 기능 중 하나는 더 많은 런타임을 지원하는 것입니다.

Elysia 1.2는 **adapter**를 도입하여 Elysia가 다양한 런타임에서 실행될 수 있도록 합니다.

```ts
import { node } from '@elysiajs/node'

new Elysia({ adapter: node() })
	.get('/', 'Hello Node')
	.listen(3000)
```

Elysia는 Bun에서 실행되도록 설계되었으며, 계속해서 Bun을 주요 런타임으로 하고 Bun의 기능을 우선시할 것입니다.

하지만, AWS Lambda, Supabase Function 등과 같은 서버리스 환경 등 필요에 맞는 다양한 환경에서 Elysia를 시도할 수 있는 더 많은 선택권을 제공합니다.

Elysia의 adapter 목표는 각 런타임에서 최고의 성능을 유지하면서 동일한 코드 또는 최소한의 변경으로 다양한 런타임에서 일관된 API를 제공하는 것입니다.

### Performance

성능은 Elysia의 강점 중 하나입니다. 우리는 성능에서 타협하지 않습니다.

Web Standard의 request를 Node Request/Response로 변환하는 브릿지에 의존하는 대신, Elysia는 최고의 성능을 달성하면서 필요한 경우 Web Standard 호환성을 제공하기 위해 네이티브 Node API를 직접 사용합니다.

Sucrose 정적 코드 분석을 활용함으로써, Elysia는 Hono, h3와 같은 대부분의 Web-Standard 프레임워크보다 빠르며, Fastify, Express와 같은 네이티브 Node 프레임워크보다도 빠릅니다.

![Node Benchmark](/blog/elysia-12/node-benchmark.webp)

<small>평소처럼, [Bun HTTP framework benchmark](https://github.com/saltyaom/bun-http-framework-benchmark)에서 벤치마크를 찾을 수 있습니다.</small>

Elysia는 이제 다음 런타임 adapter를 지원합니다:
- Bun
- Web Standard (WinterCG) 예: Deno, Browser
- Node <sup><small>(beta)</small></sup>

Node adapter는 아직 베타 버전이지만, Generator Stream 반환에서 WebSocket까지 예상되는 대부분의 기능을 갖추고 있습니다. 시도해 보시길 권장합니다.

다음을 시작으로 미래에 더 많은 런타임을 지원하도록 확장할 것입니다:
- Cloudflare Worker
- AWS Lambda
- uWebSocket.js

### Universal runtime API
다양한 런타임과 호환되기 위해, Elysia는 이제 엄선된 유틸리티 함수를 감싸서 다양한 런타임에서 일관된 API를 제공합니다.

예를 들어, Bun에서는 `Bun.file`을 사용하여 파일 응답을 반환할 수 있지만, 이는 Node에서 사용할 수 없습니다.

```ts
import { Elysia } from 'elysia' // [!code --]
import { Elysia, file } from 'elysia' // [!code ++]

new Elysia()
	.get('/', () => Bun.file('./public/index.html')) // [!code --]
	.get('/', () => file('./public/index.html')) // [!code ++]
```

이러한 유틸리티 함수들은 Elysia가 지원하는 런타임과 호환되도록 설계된 Bun의 유틸리티 함수의 복제본이며, 향후 확장될 것입니다.

현재 Elysia는 다음을 지원합니다:
- `file` - 파일 응답 반환
- `form` - formdata 응답 반환
- `server` - Bun의 `Server` 타입 선언 포트

## Macro with resolve
Elysia 1.2부터 macro에서 `resolve`를 사용할 수 있습니다.

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
	.macro({
		user: (enabled: true) => ({
			resolve: ({ cookie: { session } }) => ({
				user: session.value!
			})
		})
	})
	.get('/', ({ user }) => user, {
                          // ^?
		user: true
	})
```

새로운 macro 객체 구문을 사용하면, lifecycle을 가져오는 대신 반환하여 보일러플레이트를 줄일 수 있습니다.

다음은 이전 구문과 새 구문 간의 비교입니다:
```ts
// ✅ Object Macro
new Elysia()
	.macro({
		role: (role: 'admin' | 'user') => ({
			beforeHandle: ({ cookie: { session } }) => ({
				user: session.value!
			})
		})
	})

// ⚠️ Function Macro
new Elysia()
	.macro(({ onBeforeHandle }) => {
		role(role: 'admin' | 'user') {
			onBeforeHandle(({ cookie: { session } }) => ({
				user: session.value!
			})
		}
	})
```

두 구문 모두 지원되지만 새로운 객체 구문을 권장합니다. 이전 구문을 제거할 계획은 없지만 새로운 기능으로 새로운 객체 구문에 집중할 것입니다.

::: info
TypeScript 제한으로 인해, macro의 `resolve`는 새로운 객체 구문에서만 작동하며 이전 구문에서는 작동하지 않습니다.
:::

## Name Parser

Elysia 1.2는 사용자 정의 이름을 가진 parser를 도입하여 요청 본문 디코딩에 사용할 parser를 지정할 수 있습니다.

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
	.parser('custom', ({ contentType }) => {
		if(contentType === "application/kivotos")
			return 'nagisa'
	})
	.post('/', ({ body }) => body, {
		parse: 'custom'
	})
```

`parser`는 `onParse`와 유사한 API를 가지고 있지만 사용자 정의 이름을 사용하여 라우트에서 참조할 수 있습니다.

Elysia의 내장 parser를 참조하거나 순서대로 사용할 여러 parser를 제공할 수도 있습니다.

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
	.parser('custom', ({ contentType }) => {
		if(contentType === "application/kivotos")
			return 'nagisa'
	})
	.post('/', ({ body }) => body, {
		parse: ['custom', 'json']
	})
```

Parser는 순서대로 호출되며, parser가 값을 반환하지 않으면 다음 parser로 이동하여 parser 중 하나가 값을 반환할 때까지 계속됩니다.

## WebSocket
WebSocket을 다시 작성하여 더 성능이 뛰어나고 각 런타임과의 호환성을 유지하면서 최신 Bun의 WebSocket API와 API 및 동작을 일치시켰습니다.

```ts
new Elysia()
	.ws('/ws', {
		ping: (message) => message,
		pong: (message) => message
	})
```

WebSocket은 이제 HTTP 라우트와 더 일관된 API를 가지며 HTTP 라우트와 유사한 lifecycle을 가집니다.

## TypeBox 0.34
Elysia 1.2는 이제 TypeBox 0.34를 지원합니다.

이 업데이트를 통해, Elysia는 이제 TypeBox의 `t.Module`을 사용하여 참조 모델을 처리하여 순환 재귀 타입을 지원합니다.

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.model({
		a: t.Object({
			a: t.Optional(t.Ref('a'))
		})
	})
	.post('/recursive', ({ body }) => body, {
                         // ^?
		body: 'a'
	})
```

## Reduced Memory usage
우리는 교체 가능한 코드 생성 프로세스를 위해 Sucrose의 생성된 코드를 리팩터링했습니다.

더 나은 코드 중복 제거, 라우터 최적화 및 불필요한 코드 제거를 위해 리팩터링했습니다.

이를 통해 Elysia는 여러 부분에서 코드를 재사용하고 메모리 사용량의 상당 부분을 줄일 수 있습니다.

우리 프로젝트에서는 단순히 Elysia 1.2로 업그레이드함으로써 1.1에서 최대 2배의 메모리 감소를 확인했습니다.

![Memory comparison between 1.1 and 1.2](/blog/elysia-12/memory.webp)

이 메모리 최적화는 라우트 수와 라우트의 복잡성에 따라 확장됩니다. 따라서 메모리 사용량이 기하급수적으로 감소하는 것을 볼 수 있습니다.

## Notable update
다음은 Elysia 1.2에서 이루어진 주목할 만한 개선 사항입니다.

### Eden validation error
Eden은 이제 유효성 검증 모델이 제공되면 `422` 상태 코드를 자동으로 추론합니다.
```ts
import { treaty } from '@elysiajs/eden'
import type { App } from './app'

const api = treaty<App>('localhost:3000')

const { data, error } = await api.user.put({
	name: 'saltyaom'
})

if(error)
	switch(error.status) {
		case 422:
			console.log(error.summary)
			break

		default:
			console.error(error)
	}
```

### Router
라우트 등록 중복 제거를 더 최적화하도록 업데이트했습니다.

이전에는 Elysia가 라우트 중복을 방지하기 위해 가능한 모든 라우트를 확인했습니다. 이제 Elysia는 체크섬 해시 맵을 사용하여 라우트가 이미 등록되어 있는지 확인하고, 정적 라우트 등록을 위해 라우팅 및 코드 생성 프로세스 루프를 병합하여 성능을 향상시킵니다.

### Changes
- Event Listener는 이제 범위에 따라 경로 매개변수를 자동으로 추론합니다
- 'plugin'과 유사하게 타입을 'scoped'로 캐스팅하기 위해 대량 `as`에 'scoped'를 추가했습니다
- `cookie`를 1.0.1로 업데이트
- TypeBox를 0.33으로 업데이트
- `content-length`는 이제 숫자를 허용합니다
- `trace`의 `id`에 16자리 16진수를 사용합니다
- 더 나은 디버깅/오류 보고를 위해 프로덕션 빌드에서 `minify`를 비활성화합니다

## Breaking Change
Elysia 1.2로 업그레이드하기 위해 코드베이스에 필요한 변경 사항은 거의 없어야 합니다.

그러나 다음은 알아야 할 모든 변경 사항입니다.

### parse
`type`은 이제 `parse`와 병합되어 사용자 정의 및 내장 parser의 순서를 제어할 수 있습니다.

```ts
import { Elysia, form, file } from 'elysia'

new Elysia()
	.post('/', ({ body }) => body, {
		type: 'json' // [!code --]
		parse: 'json' // [!code ++]
	})
```

### formdata
1.2부터는 1레벨 깊이 객체에 파일이 있는지 자동으로 감지하는 대신 응답이 formdata인 경우 명시적으로 `form`을 반환해야 합니다.

```ts
import { Elysia, form, file } from 'elysia'

new Elysia()
	.post('/', ({ file }) => ({ // [!code --]
	.post('/', ({ file }) => form({ // [!code ++]
		a: file('./public/kyuukurarin.mp4')
	}))
```

### WebSocket
WebSocket 메서드는 이제 `WebSocket`을 반환하는 대신 각각의 값을 반환합니다.

따라서 메서드 체이닝 기능이 제거됩니다.

이는 WebSocket이 더 나은 호환성과 마이그레이션을 위해 Bun의 WebSocket API와 동일한 API를 일치시키기 위한 것입니다.

```ts
import { Elysia } from 'elysia'

new Elysia()
	.ws('/', {
		message(ws) {
			ws // [!code --]
				.send('hello') // [!code --]
				.send('world') // [!code --]

			ws.send('hello') // [!code ++]
			ws.send('world') // [!code ++]
		}
	})
```

### scoped
Elysia는 이제 `scope's scoped/global`과 혼동될 수 있으므로 `constructor scoped`를 제거했습니다

```ts
import { Elysia } from 'elysia'

new Elysia({ scoped: false }) // [!code --]

const scoped = new Elysia() // [!code ++]

const main = new Elysia() // [!code ++]
	.mount(scoped) // [!code ++]
```

### Internal breaking changes
- 라우터 내부 속성 static.http.staticHandlers 제거
- 라우터 history compile이 이제 history composed와 링크됩니다

## 맺음말

Elysia 1.2는 우리가 한동안 작업해 온 야심찬 업데이트입니다.

더 많은 개발자와 더 많은 런타임으로 Elysia의 범위를 확장하려는 도박이지만, 다른 이야기도 하고 싶습니다.

### 다시 시작해 볼까요.

안녕하세요, 어떻게 지내세요? 잘 지내고 있기를 바랍니다.

저는 여전히 이것을 하는 것을 좋아합니다. Elysia에 대한 블로그 포스트를 쓰는 것을요. 그때 이후로 꽤 시간이 지났습니다.

마지막 업데이트 이후 꽤 시간이 지났고, 긴 업데이트가 아니라는 것을 눈치채셨을 것입니다. 죄송합니다.

우리도 돌봐야 할 우리만의 삶이 있다는 것을 이해해 주시기를 바랍니다. 우리는 로봇이 아니라 인간입니다. 때로는 삶에 대해서, 때로는 일에 대해서, 때로는 가족에 대해서, 때로는 경제적으로.

### 항상 여러분과 함께 있고 싶습니다.

내가 사랑하는 일을 하며, Elysia를 계속 업데이트하고, 블로그 포스트를 계속 쓰고, 아트를 계속 만들고 싶지만, 저도 돌봐야 할 것들이 있다는 것을 알고 계실 것입니다.

저는 밥상에 음식을 올려야 하고, 경제적으로 많은 것들을 돌봐야 합니다. 저 자신도 돌봐야 합니다.

여러분이 잘 지내고 있기를, 행복하기를, 건강하기를, 안전하기를 바랍니다.

제가 여기 없더라도 Elysia로 알려진 제 일부가 여러분과 함께 있을 것입니다.

함께해 주셔서 감사합니다.

> Here I feel the touch brought by the real number solution.
>
> Ripples of two souls now have reached our double slits.
>
> Casting stripes of light and dark in the world as days and nights.
>
> You set me free under the sun.
>
> I fly your cradle dreams to the moon and back.
>
> A worm will turn into a butterfly,
>
> before one can answer "who am I".
>
> After the ice turns into water,
>
> the sea I hang upside down will be your sky.

> And we finally met again, Seele.

</Blog>
