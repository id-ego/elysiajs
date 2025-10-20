---
title: OpenAPI - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: OpenAPI - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia has first-class support and follows OpenAPI schema by default. Allowing any Elysia server to generate an API documentation page and serve as documentation automatically by using just 1 line of the Elysia OpenAPI plugin.

    - - meta
      - property: 'og:description'
        content: Elysia has first-class support and follows OpenAPI schema by default. Allowing any Elysia server to generate an API documentation page and serve as documentation automatically by using just 1 line of the Elysia OpenAPI plugin.
---

<script setup>
import Tab from '../components/fern/tab.vue'
</script>

# OpenAPI

Elysia는 기본적으로 OpenAPI 스키마를 따르고 일급 지원을 제공합니다.

Elysia는 OpenAPI 플러그인을 사용하여 자동으로 API 문서 페이지를 생성할 수 있습니다.

Swagger 페이지를 생성하려면 플러그인을 설치하세요:

```bash
bun add @elysiajs/openapi
```

그리고 플러그인을 서버에 등록하세요:

```typescript
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi' // [!code ++]

new Elysia()
	.use(openapi()) // [!code ++]
```

기본적으로 Elysia는 OpenAPI V3 스키마와 [Scalar UI](http://scalar.com)를 사용합니다.

OpenAPI 플러그인 구성에 대해서는 [OpenAPI 플러그인 페이지](/plugins/openapi)를 참조하세요.

## 타입에서 OpenAPI 생성

> 이는 선택 사항이지만 훨씬 더 나은 문서 경험을 위해 강력히 권장합니다.

기본적으로 Elysia는 런타임 스키마를 사용하여 OpenAPI 문서를 생성합니다.

그러나 다음과 같이 OpenAPI 플러그인의 생성기를 사용하여 타입에서 OpenAPI 문서를 생성할 수도 있습니다:

1. Elysia 루트 파일을 지정하고(지정하지 않으면 Elysia는 `src/index.ts`를 사용합니다), 인스턴스를 내보냅니다

2. 생성기를 가져오고 타입 생성기에 **프로젝트 루트에서 파일 경로**를 제공합니다
```ts
import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi' // [!code ++]

export const app = new Elysia() // [!code ++]
    .use(
        openapi({
            references: fromTypes() // [!code ++]
        })
    )
    .get('/', { test: 'hello' as const })
    .post('/json', ({ body, status }) => body, {
        body: t.Object({
            hello: t.String()
        })
    })
    .listen(3000)
```

Elysia는 내보낸 인스턴스의 타입을 읽어 OpenAPI 문서를 생성하려고 시도합니다.

이는 런타임 스키마와 공존하며 런타임 스키마가 타입 정의보다 우선합니다.

### 프로덕션
프로덕션 환경에서는 Elysia를 [Bun으로 단일 실행 파일로 컴파일](/patterns/deploy.html)하거나 [단일 JavaScript 파일로 번들링](https://elysiajs.com/patterns/deploy.html#compile-to-javascript)할 가능성이 높습니다.

생성기에 타입 선언을 제공하려면 선언 파일(**.d.ts**)을 미리 생성하는 것이 좋습니다.

```ts
import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'

const app = new Elysia()
    .use(
        openapi({
            references: fromTypes(
            	process.env.NODE_ENV === 'production' // [!code ++]
             		? 'dist/index.d.ts' // [!code ++]
               		: 'src/index.ts' // [!code ++]
            )
        })
    )
```

<details>

<summary>타입 생성에 문제가 있나요?</summary>

### 주의사항: 루트 경로
프로젝트의 루트를 추측하는 것은 신뢰할 수 없으므로, 특히 모노레포를 사용할 때 생성기가 올바르게 실행되도록 프로젝트 루트 경로를 제공하는 것이 좋습니다.

```ts
import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'

export const app = new Elysia()
    .use(
        openapi({
            references: fromTypes('src/index.ts', {
            	projectRoot: path.join('..', import.meta.dir) // [!code ++]
            })
        })
    )
    .get('/', { test: 'hello' as const })
    .post('/json', ({ body, status }) => body, {
        body: t.Object({
            hello: t.String()
        })
    })
    .listen(3000)
```

### 사용자 정의 tsconfig.json
`tsconfig.json` 파일이 여러 개 있는 경우 타입 생성에 사용할 올바른 `tsconfig.json` 파일을 지정해야 합니다.

```ts
import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'

export const app = new Elysia()
    .use(
        openapi({
            references: fromTypes('src/index.ts', {
            	// This is reference from root of the project
            	tsconfigPath: 'tsconfig.dts.json' // [!code ++]
            })
        })
    )
    .get('/', { test: 'hello' as const })
    .post('/json', ({ body, status }) => body, {
        body: t.Object({
            hello: t.String()
        })
    })
    .listen(3000)
```

</details>

## OpenAPI와 Standard Schema
Elysia는 각 스키마의 네이티브 메서드를 사용하여 OpenAPI 스키마로 변환하려고 시도합니다.

그러나 스키마가 네이티브 메서드를 제공하지 않는 경우 다음과 같이 `mapJsonSchema`를 제공하여 OpenAPI에 대한 사용자 정의 스키마를 제공할 수 있습니다:

<Tab
	id="schema-openapi"
	noTitle
	:names="['Zod', 'Valibot', 'Effect']"
	:tabs="['zod', 'valibot', 'effect']"
>

<template v-slot:zod>

### Zod OpenAPI
Zod는 스키마에 `toJSONSchema` 메서드가 없으므로 Zod 스키마를 OpenAPI 스키마로 변환하기 위한 사용자 정의 매퍼를 제공해야 합니다.

::: code-group

```typescript [Zod 4]
import openapi from '@elysiajs/openapi'
import * as z from 'zod'

openapi({
	mapJsonSchema: {
		zod: z.toJSONSchema
	}
})
```

```typescript [Zod 3]
import openapi from '@elysiajs/openapi'
import { zodToJsonSchema } from 'zod-to-json-schema'

openapi({
	mapJsonSchema: {
		zod: zodToJsonSchema
	}
})
```

:::

</template>

<template v-slot:valibot>

### Valibot OpenAPI
Valibot은 Valibot 스키마를 JSON Schema로 변환하기 위해 별도의 패키지(`@valibot/to-json-schema`)를 사용합니다.

```typescript
import openapi from '@elysiajs/openapi'
import { toJsonSchema } from '@valibot/to-json-schema'

openapi({
	mapJsonSchema: {
		valibot: toJsonSchema
	}
})
```

</template>

<template v-slot:effect>

### Effect OpenAPI
Effect는 스키마에 `toJSONSchema` 메서드가 없으므로 Effect 스키마를 OpenAPI 스키마로 변환하기 위한 사용자 정의 매퍼를 제공해야 합니다.

```typescript
import openapi from '@elysiajs/openapi'
import { JSONSchema } from 'effect'

openapi({
 	mapJsonSchema: {
   		effect: JSONSchema.make
 	}
})
```

</template>

</Tab>

## 라우트 설명

스키마 타입을 제공하여 라우트 정보를 추가할 수 있습니다.

그러나 때로는 타입만 정의해도 라우트가 무엇을 하는지 명확하지 않을 수 있습니다. [detail](/plugins/openapi#detail) 필드를 사용하여 라우트를 명시적으로 설명할 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
	.use(openapi())
	.post(
		'/sign-in',
		({ body }) => body, {
    		body: t.Object(
      		{
	            username: t.String(),
	            password: t.String({
	                minLength: 8,
	                description: 'User password (at least 8 characters)' // [!code ++]
	            })
	        },
	        { // [!code ++]
	            description: 'Expected a username and password' // [!code ++]
	        } // [!code ++]
	    ),
	    detail: { // [!code ++]
	        summary: 'Sign in the user', // [!code ++]
	        tags: ['authentication'] // [!code ++]
	    } // [!code ++]
	})
```

detail 필드는 기본적으로 자동 완성 및 타입 안전성을 갖춘 OpenAPI V3 정의를 따릅니다.

그런 다음 detail은 OpenAPI 라우트에 설명을 넣기 위해 OpenAPI에 전달됩니다.

## 응답 헤더
`withHeader`로 스키마를 래핑하여 응답 헤더를 추가할 수 있습니다:

```typescript
import { Elysia, t } from 'elysia'
import { openapi, withHeader } from '@elysiajs/openapi' // [!code ++]

new Elysia()
	.use(openapi())
	.get(
		'/thing',
		({ body, set }) => {
			set.headers['x-powered-by'] = 'Elysia'

			return body
		},
		{
		    response: withHeader( // [!code ++]
				t.Literal('Hi'), // [!code ++]
				{ // [!code ++]
					'x-powered-by': t.Literal('Elysia') // [!code ++]
				} // [!code ++]
			) // [!code ++]
		}
	)
```

`withHeader`는 주석 전용이며 실제 응답 헤더를 강제하거나 검증하지 않습니다. 헤더를 수동으로 설정해야 합니다.

### 라우트 숨기기

`detail.hide`를 `true`로 설정하여 Swagger 페이지에서 라우트를 숨길 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
	.use(openapi())
	.post(
		'/sign-in',
		({ body }) => body,
		{
		    body: t.Object(
		        {
		            username: t.String(),
		            password: t.String()
		        },
		        {
		            description: 'Expected a username and password'
		        }
		    ),
		    detail: { // [!code ++]
		        hide: true // [!code ++]
		    } // [!code ++]
		}
	)
```

## 태그

Elysia는 Swagger의 태그 시스템을 사용하여 엔드포인트를 그룹으로 분리할 수 있습니다.

먼저 swagger 구성 객체에서 사용 가능한 태그를 정의하세요.

```typescript
new Elysia().use(
    openapi({
        documentation: {
            tags: [
                { name: 'App', description: 'General endpoints' },
                { name: 'Auth', description: 'Authentication endpoints' }
            ]
        }
    })
)
```

그런 다음 엔드포인트 구성 섹션의 details 속성을 사용하여 해당 엔드포인트를 그룹에 할당합니다.

```typescript
new Elysia()
    .get('/', () => 'Hello Elysia', {
        detail: {
            tags: ['App']
        }
    })
    .group('/auth', (app) =>
        app.post(
            '/sign-up',
            ({ body }) =>
                db.user.create({
                    data: body,
                    select: {
                        id: true,
                        username: true
                    }
                }),
            {
                detail: {
                    tags: ['Auth']
                }
            }
        )
    )
```

다음과 같은 swagger 페이지가 생성됩니다.
<img width="1446" alt="image" src="/assets/swagger-demo.webp">

### 태그 그룹

Elysia는 전체 인스턴스 또는 라우트 그룹을 특정 태그에 추가하기 위해 태그를 허용할 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'

new Elysia({
    tags: ['user']
})
    .get('/user', 'user')
    .get('/admin', 'admin')
```

## 모델

[참조 모델](/essential/validation.html#reference-model)을 사용하면 Elysia가 스키마 생성을 자동으로 처리합니다.

모델을 전용 섹션으로 분리하고 참조로 연결합니다.

```typescript
new Elysia()
    .model({
        User: t.Object({
            id: t.Number(),
            username: t.String()
        })
    })
    .get('/user', () => ({ id: 1, username: 'saltyaom' }), {
        response: {
            200: 'User'
        },
        detail: {
            tags: ['User']
        }
    })
```

## Guard

또는 Elysia는 전체 인스턴스 또는 라우트 그룹을 특정 guard에 추가하기 위해 guard를 허용할 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .guard({
        detail: {
            description: 'Require user to be logged in'
        }
    })
    .get('/user', 'user')
    .get('/admin', 'admin')
```

## OpenAPI 엔드포인트 변경

플러그인 구성에서 [path](#path)를 설정하여 OpenAPI 엔드포인트를 변경할 수 있습니다.

```typescript twoslash
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
    .use(
        openapi({
            path: '/v2/openapi'
        })
    )
    .listen(3000)
```

## OpenAPI 정보 사용자 정의

플러그인 구성에서 [documentation.info](#documentationinfo)를 설정하여 OpenAPI 정보를 사용자 정의할 수 있습니다.

```typescript twoslash
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
    .use(
        openapi({
            documentation: {
                info: {
                    title: 'Elysia Documentation',
                    version: '1.0.0'
                }
            }
        })
    )
    .listen(3000)
```

이는 다음에 유용할 수 있습니다:

- 제목 추가
- API 버전 설정
- API가 무엇에 관한 것인지 설명하는 설명 추가
- 사용 가능한 태그, 각 태그의 의미 설명

## 보안 구성

API 엔드포인트를 보호하려면 Swagger 구성에서 보안 스키마를 정의할 수 있습니다. 아래 예제는 Bearer Authentication(JWT)을 사용하여 엔드포인트를 보호하는 방법을 보여줍니다:

```typescript
new Elysia().use(
    openapi({
        documentation: {
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            }
        }
    })
)

export const addressController = new Elysia({
    prefix: '/address',
    detail: {
        tags: ['Address'],
        security: [
            {
                bearerAuth: []
            }
        ]
    }
})
```

이렇게 하면 `/address` 접두사 아래의 모든 엔드포인트에 액세스하려면 유효한 JWT 토큰이 필요합니다.
