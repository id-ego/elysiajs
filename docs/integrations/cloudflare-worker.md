---
title: Cloudflare Worker와의 통합 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Cloudflare Worker와의 통합 - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia는 Cloudflare Worker 어댑터를 사용하여 Ahead of Time 컴파일을 지원하며 Cloudflare Worker에서 실행할 수 있습니다.

  - - meta
    - name: 'og:description'
      content: Elysia는 Cloudflare Worker 어댑터를 사용하여 Ahead of Time 컴파일을 지원하며 Cloudflare Worker에서 실행할 수 있습니다.
---

# Cloudflare Worker <Badge type="warning">실험적</Badge>

Elysia는 이제 **실험적** Cloudflare Worker 어댑터를 통해 Cloudflare Worker를 지원합니다.

1. 설정 및 개발 서버를 시작하려면 [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update)가 필요합니다.

```bash
wrangler init elysia-on-cloudflare
```

2. 그런 다음 Elysia 앱에 Cloudflare 어댑터를 추가하고 앱을 내보내기 전에 `.compile()`을 호출해야 합니다.
```ts
import { Elysia } from 'elysia'
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker' // [!code ++]

export default new Elysia({
	adapter: CloudflareAdapter // [!code ++]
})
	.get('/', () => 'Hello Cloudflare Worker!')
	// Elysia를 Cloudflare Worker에서 작동시키려면 이것이 필요합니다
	.compile() // [!code ++]
```

3. wrangler 구성에서 `compatibility_date`를 최소 `2025-06-01`로 설정해야 합니다

::: code-group

```jsonc [wrangler.jsonc]
{
	"$schema": "node_modules/wrangler/config-schema.json",
 	"name": "elysia-on-cloudflare",
	"main": "src/index.ts",
	"compatibility_date": "2025-06-01" // [!code ++]
}
```

```toml [wrangler.toml]
main = "src/index.ts"
name = "elysia-on-cloudflare"
compatibility_date = "2025-06-01" # [!code ++]
```

:::

4. 이제 다음 명령으로 개발 서버를 시작할 수 있습니다:
```bash
wrangler dev
```

`http://localhost:8787`에서 개발 서버가 시작됩니다

Elysia는 Node.js 내장 모듈을 사용하지 않으므로(또는 우리가 사용하는 모듈이 Cloudflare Worker를 아직 지원하지 않음) `nodejs_compat` 플래그가 필요하지 않습니다.

## 제한 사항
Cloudflare Worker에서 Elysia를 사용할 때의 알려진 제한 사항은 다음과 같습니다:

1. `Elysia.file` 및 [Static Plugin](/plugins/static)은 [`fs` 모듈 부족](https://developers.cloudflare.com/workers/runtime-apis/nodejs/#supported-nodejs-apis)으로 인해 작동하지 않습니다
2. [OpenAPI Type Gen](/blog/openapi-type-gen)은 [`fs` 모듈 부족](https://developers.cloudflare.com/workers/runtime-apis/nodejs/#supported-nodejs-apis)으로 인해 작동하지 않습니다
3. [서버 시작 전 **Response** 정의](https://x.com/saltyAom/status/1966602691754553832)를 할 수 없으며, 그렇게 하는 플러그인을 사용할 수 없습니다
4. 값을 인라인으로 정의할 수 없습니다

```typescript
import { Elysia } from 'elysia'

new Elysia()
	// 이렇게 하면 오류가 발생합니다
    .get('/', 'Hello Elysia')
    .listen(3000)
```

## 정적 파일
[Static Plugin](/plugins/static)은 작동하지 않지만 [Cloudflare의 내장 정적 파일 서빙](https://developers.cloudflare.com/workers/static-assets/)으로 정적 파일을 제공할 수 있습니다.

wrangler 구성에 다음을 추가하세요:

::: code-group

```jsonc [wrangler.jsonc]
{
	"$schema": "node_modules/wrangler/config-schema.json",
 	"name": "elysia-on-cloudflare",
	"main": "src/index.ts",
	"compatibility_date": "2025-06-01",
	"assets": { "directory": "public" } // [!code ++]
}
```

```toml [wrangler.toml]
name = "elysia-on-cloudflare"
main = "src/index.ts"
compatibility_date = "2025-06-01"
assets = { directory = "public" } # [!code ++]
```

:::

`public` 폴더를 만들고 정적 파일을 넣으세요.

예를 들어, 다음과 같은 폴더 구조가 있는 경우:
```
│
├─ public
│  ├─ kyuukurarin.mp4
│  └─ static
│     └─ mika.webp
├─ src
│  └── index.ts
└─ wrangler.toml
```

다음 경로에서 정적 파일에 액세스할 수 있습니다:
- **http://localhost:8787/kyuukurarin.mp4**
- **http://localhost:8787/static/mika.webp**

## Binding
`cloudflare:workers`에서 env를 가져와서 Cloudflare Workers 바인딩을 사용할 수 있습니다.

```ts
import { Elysia } from 'elysia'
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker'
import { env } from 'cloudflare:workers' // [!code ++]

export default new Elysia({
	adapter: CloudflareAdapter
})
	.get('/', () => `Hello ${await env.KV.get('my-key')}`) // [!code ++]
	.compile()
```

바인딩에 대한 자세한 내용은 [Cloudflare Workers: Binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/#importing-env-as-a-global)을 참조하세요.

## AoT 컴파일
이전에는 Cloudflare Worker에서 Elysia를 사용하려면 Elysia 생성자에 `aot: false`를 전달해야 했습니다.

[Cloudflare가 이제 시작 시 Function 컴파일을 지원](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#enable-eval-during-startup)하므로 더 이상 필요하지 않습니다.

Elysia 1.4.7부터 Cloudflare Worker와 함께 Ahead of Time 컴파일을 사용할 수 있으며 `aot: false` 플래그를 삭제할 수 있습니다.

```ts
import { Elysia } from 'elysia'
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker' // [!code ++]

export default new Elysia({
	aot: false, // [!code --]
	adapter: CloudflareAdapter // [!code ++]
})
```

그렇지 않으면 Ahead of Time 컴파일을 원하지 않는 경우 여전히 `aot: false`를 사용할 수 있지만 더 나은 성능과 정확한 플러그인 캡슐화를 위해 사용하는 것을 권장합니다.
