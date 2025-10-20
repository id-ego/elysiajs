---
title: Mount - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Mount - ElysiaJS

  - - meta
    - name: 'description'
      content: Applying WinterCG interoperable code to run with Elysia or vice-versa.

  - - meta
    - property: 'og:description'
      content: Applying WinterCG interoperable code to run with Elysia or vice-versa.
---

# Mount
[WinterTC](https://wintertc.org/)는 Cloudflare, Deno, Vercel 등의 배후에서 HTTP Server를 구축하기 위한 표준입니다.

[Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)와 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)를 사용하여 런타임 간에 웹 서버를 상호 운용 가능하게 실행할 수 있습니다.

Elysia는 WinterTC를 준수합니다. Bun에서 실행되도록 최적화되었지만 가능한 경우 다른 런타임도 지원합니다.

이를 통해 WinterCG를 준수하는 모든 프레임워크나 코드를 함께 실행할 수 있어 Elysia, Hono, Remix, Itty Router와 같은 프레임워크가 간단한 함수에서 함께 실행될 수 있습니다.

## Mount
**.mount**를 사용하려면 [`fetch` 함수를 전달하기만 하면 됩니다](https://twitter.com/saltyAom/status/1684786233594290176):
```ts
import { Elysia } from 'elysia'
import { Hono } from 'hono'

const hono = new Hono()
	.get('/', (c) => c.text('Hello from Hono!'))

const app = new Elysia()
    .get('/', () => 'Hello from Elysia')
    .mount('/hono', hono.fetch)
```

`Request`와 `Response`를 사용하는 모든 프레임워크는 다음과 같이 Elysia와 상호 운용할 수 있습니다
- Hono
- Nitro
- H3
- [Nextjs API Route](/integrations/nextjs)
- [Nuxt API Route](/integrations/nuxt)
- [SvelteKit API Route](/integrations/sveltekit)

그리고 이들은 다음과 같은 여러 런타임에서 사용할 수 있습니다:
- Bun
- Deno
- Vercel Edge Runtime
- Cloudflare Worker
- Netlify Edge Function

프레임워크가 **.mount** 함수를 지원하는 경우 다른 프레임워크 내부에 Elysia를 마운트할 수도 있습니다:
```ts
import { Elysia } from 'elysia'
import { Hono } from 'hono'

const elysia = new Elysia()
    .get('/', () => 'Hello from Elysia inside Hono inside Elysia')

const hono = new Hono()
    .get('/', (c) => c.text('Hello from Hono!'))
    .mount('/elysia', elysia.fetch)

const main = new Elysia()
    .get('/', () => 'Hello from Elysia')
    .mount('/hono', hono.fetch)
    .listen(3000)
```

## Reusing Elysia
또한 서버에서 여러 기존 Elysia 프로젝트를 재사용할 수 있습니다.

```ts
import { Elysia } from 'elysia'

import A from 'project-a/elysia'
import B from 'project-b/elysia'
import C from 'project-c/elysia'

new Elysia()
    .mount(A)
    .mount(B)
    .mount(C)
```

`mount`에 전달된 인스턴스가 Elysia 인스턴스인 경우 자동으로 `use`로 해결되어 기본적으로 타입 안전성과 Eden 지원을 제공합니다.

이것은 상호 운용 가능한 프레임워크와 런타임의 가능성을 현실로 만듭니다.
