---
title: Better Auth - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Better Auth - ElysiaJS

    - - meta
      - name: 'description'
        content: '@better-auth/cli를 사용하여 인증 스키마를 생성하고 데이터베이스를 마이그레이션할 수 있습니다.'

    - - meta
      - name: 'og:description'
        content: '@better-auth/cli를 사용하여 인증 스키마를 생성하고 데이터베이스를 마이그레이션할 수 있습니다.'
---

# Better Auth

Better Auth는 TypeScript를 위한 프레임워크 독립적인 인증(및 권한 부여) 프레임워크입니다.

즉시 사용 가능한 포괄적인 기능 세트를 제공하며 고급 기능 추가를 간소화하는 플러그인 생태계를 포함합니다.

이 페이지를 읽기 전에 [Better Auth 기본 설정](https://www.better-auth.com/docs/installation)을 먼저 살펴보는 것을 권장합니다.

기본 설정은 다음과 같습니다:

```ts [auth.ts]
import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

export const auth = betterAuth({
    database: new Pool()
})
```

## Handler

Better Auth 인스턴스를 설정한 후 [mount](/patterns/mount.html)를 통해 Elysia에 마운트할 수 있습니다.

핸들러를 Elysia 엔드포인트에 마운트해야 합니다.

```ts [index.ts]
import { Elysia } from 'elysia'
import { auth } from './auth'

const app = new Elysia()
	.mount(auth.handler) // [!code ++]
	.listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

그러면 `http://localhost:3000/api/auth`로 Better Auth에 액세스할 수 있습니다.

### 사용자 정의 엔드포인트

[mount](/patterns/mount.html)를 사용할 때는 접두사 경로를 설정하는 것을 권장합니다.

```ts [index.ts]
import { Elysia } from 'elysia'

const app = new Elysia()
	.mount('/auth', auth.handler) // [!code ++]
	.listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

그러면 `http://localhost:3000/auth/api/auth`로 Better Auth에 액세스할 수 있습니다.

하지만 URL이 중복되어 보이므로 Better Auth 인스턴스에서 `/api/auth` 접두사를 다른 것으로 사용자 정의할 수 있습니다.

```ts
import { betterAuth } from 'better-auth'
import { openAPI } from 'better-auth/plugins'
import { passkey } from 'better-auth/plugins/passkey'

import { Pool } from 'pg'

export const auth = betterAuth({
    basePath: '/api' // [!code ++]
})
```

그러면 `http://localhost:3000/auth/api`로 Better Auth에 액세스할 수 있습니다.

안타깝게도 Better Auth 인스턴스의 `basePath`를 비워두거나 `/`로 설정할 수는 없습니다.

## OpenAPI

Better Auth는 `better-auth/plugins`를 통해 `openapi`를 지원합니다.

그러나 [@elysiajs/openapi](/plugins/openapi)를 사용하는 경우 Better Auth 인스턴스에서 문서를 추출할 수 있습니다.

다음 코드로 추출할 수 있습니다:

```ts
import { openAPI } from 'better-auth/plugins'

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema())

export const OpenAPI = {
    getPaths: (prefix = '/auth/api') =>
        getSchema().then(({ paths }) => {
            const reference: typeof paths = Object.create(null)

            for (const path of Object.keys(paths)) {
                const key = prefix + path
                reference[key] = paths[path]

                for (const method of Object.keys(paths[path])) {
                    const operation = (reference[key] as any)[method]

                    operation.tags = ['Better Auth']
                }
            }

            return reference
        }) as Promise<any>,
    components: getSchema().then(({ components }) => components) as Promise<any>
} as const
```

그런 다음 `@elysiajs/openapi`를 사용하는 Elysia 인스턴스에서:

```ts
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'

import { OpenAPI } from './auth'

const app = new Elysia().use(
    openapi({
        documentation: {
            components: await OpenAPI.components,
            paths: await OpenAPI.getPaths()
        }
    })
)
```

## CORS

cors를 구성하려면 `@elysiajs/cors`의 `cors` 플러그인을 사용할 수 있습니다.

```ts
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

import { auth } from './auth'

const app = new Elysia()
    .use(
        cors({
            origin: 'http://localhost:3001',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization']
        })
    )
    .mount(auth.handler)
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

## Macro

[macro](https://elysiajs.com/patterns/macro.html#macro)를 [resolve](https://elysiajs.com/essential/handler.html#resolve)와 함께 사용하여 뷰에 전달하기 전에 세션 및 사용자 정보를 제공할 수 있습니다.

```ts
import { Elysia } from 'elysia'
import { auth } from './auth'

// 사용자 미들웨어 (사용자와 세션을 계산하고 라우트에 전달)
const betterAuth = new Elysia({ name: 'better-auth' })
    .mount(auth.handler)
    .macro({
        auth: {
            async resolve({ status, request: { headers } }) {
                const session = await auth.api.getSession({
                    headers
                })

                if (!session) return status(401)

                return {
                    user: session.user,
                    session: session.session
                }
            }
        }
    })

const app = new Elysia()
    .use(betterAuth)
    .get('/user', ({ user }) => user, {
        auth: true
    })
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

이렇게 하면 모든 라우트에서 `user` 및 `session` 객체에 액세스할 수 있습니다.
