---
title: Migrate from Express - ElysiaJS
prev:
  text: 'Quick Start'
  link: '/quick-start'
next:
  text: 'Tutorial'
  link: '/tutorial'
head:
    - - meta
      - property: 'og:title'
        content: Migrate from Express - ElysiaJS

    - - meta
      - name: 'description'
        content: This guide is for Express users who want to see the differences from Express including syntax, and how to migrate your application from Express to Elysia by example.

    - - meta
      - property: 'og:description'
        content: This guide is for Express users who want to see the differences from Express including syntax, and how to migrate your application from Express to Elysia by example.
---

<script setup>
import Compare from '../components/fern/compare.vue'
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'

import Benchmark from '../components/fern/benchmark-express.vue'
</script>

# Express에서 Elysia로

이 가이드는 Express 사용자를 위해 구문을 포함한 Express와의 차이점을 보여주고 예제를 통해 Express에서 Elysia로 애플리케이션을 마이그레이션하는 방법을 설명합니다.

**Express**는 Node.js를 위한 인기 있는 웹 프레임워크로, 웹 애플리케이션과 API를 구축하는 데 널리 사용됩니다. 단순성과 유연성으로 잘 알려져 있습니다.

**Elysia**는 Bun, Node.js 및 Web Standard API를 지원하는 런타임을 위한 인체공학적 웹 프레임워크입니다. 인체공학적이고 개발자 친화적으로 설계되었으며 **견고한 타입 안정성**과 성능에 중점을 둡니다.

## 성능
Elysia는 네이티브 Bun 구현과 정적 코드 분석 덕분에 Express보다 상당한 성능 향상을 보입니다.

<Benchmark />

## 라우팅

Express와 Elysia는 유사한 라우팅 구문을 가지고 있으며, 라우트를 정의하기 위해 `app.get()` 및 `app.post()` 메서드를 사용하고 유사한 경로 매개변수 구문을 사용합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.post('/id/:id', (req, res) => {
    res.status(201).send(req.params.id)
})

app.listen(3000)
```

:::
</template>

<template v-slot:left-content>

> Express는 요청과 응답 객체로 `req`와 `res`를 사용합니다

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', 'Hello World')
    .post(
    	'/id/:id',
     	({ status, params: { id } }) => {
      		return status(201, id)
      	}
    )
    .listen(3000)
```

:::
</template>

<template v-slot:right-content>

> Elysia는 단일 `context`를 사용하고 응답을 직접 반환합니다

</template>

</Compare>

스타일 가이드에 약간의 차이가 있으며, Elysia는 메서드 체이닝과 객체 구조 분해 사용을 권장합니다.

Elysia는 컨텍스트를 사용할 필요가 없는 경우 응답에 대한 인라인 값도 지원합니다.

## 핸들러

두 프레임워크 모두 `headers`, `query`, `params`, `body`와 같은 입력 매개변수에 액세스하기 위한 유사한 속성을 가지고 있습니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'

const app = express()

app.use(express.json())

app.post('/user', (req, res) => {
    const limit = req.query.limit
    const name = req.body.name
    const auth = req.headers.authorization

    res.json({ limit, name, auth })
})
```

:::
</template>

<template v-slot:left-content>

> Express는 JSON 본문을 파싱하기 위해 `express.json()` 미들웨어가 필요합니다

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia()
	.post('/user', (ctx) => {
	    const limit = ctx.query.limit
	    const name = ctx.body.name
	    const auth = ctx.headers.authorization

	    return { limit, name, auth }
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 기본적으로 JSON, URL 인코딩 데이터 및 formdata를 파싱합니다

</template>

</Compare>

## 서브라우터

Express는 서브 라우터를 선언하기 위해 전용 `express.Router()`를 사용하는 반면, Elysia는 모든 인스턴스를 플러그 앤 플레이 가능한 컴포넌트로 취급합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'

const subRouter = express.Router()

subRouter.get('/user', (req, res) => {
	res.send('Hello User')
})

const app = express()

app.use('/api', subRouter)
```

:::
</template>

<template v-slot:left-content>

> Express는 서브 라우터를 생성하기 위해 `express.Router()`를 사용합니다

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia({ prefix: '/api' })
	.get('/user', 'Hello User')

const app = new Elysia()
	.use(subRouter)
```

:::
</template>

<template v-slot:right-content>

> Elysia는 모든 인스턴스를 컴포넌트로 취급합니다

</template>

</Compare>

## 유효성 검사
Elysia는 TypeBox를 사용한 요청 유효성 검사를 위한 견고한 타입 안정성을 갖춘 내장 지원을 제공하며, Zod, Valibot, ArkType, Effect Schema 등과 같은 좋아하는 라이브러리를 사용할 수 있도록 Standard Schema를 즉시 지원합니다. Express는 내장 유효성 검사를 제공하지 않으며 각 유효성 검사 라이브러리에 따라 수동 타입 선언이 필요합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'
import { z } from 'zod'

const app = express()

app.use(express.json())

const paramSchema = z.object({
	id: z.coerce.number()
})

const bodySchema = z.object({
	name: z.string()
})

app.patch('/user/:id', (req, res) => {
	const params = paramSchema.safeParse(req.params)
	if (!params.success)
		return res.status(422).json(result.error)

	const body = bodySchema.safeParse(req.body)
	if (!body.success)
		return res.status(422).json(result.error)

	res.json({
		params: params.id.data,
		body: body.data
	})
})
```

:::
</template>

<template v-slot:left-content>

> Express는 요청 본문을 검증하기 위해 `zod`나 `joi`와 같은 외부 유효성 검사 라이브러리가 필요합니다

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia TypeBox]
import { Elysia, t } from 'elysia'

const app = new Elysia()
	.patch('/user/:id', ({ params, body }) => ({
//                           ^?
		params,
		body
//   ^?
	}),



	{
		params: t.Object({
			id: t.Number()
		}),
		body: t.Object({
			name: t.String()
		})
	})
```

```ts twoslash [Elysia Zod]
import { Elysia } from 'elysia'
import { z } from 'zod'

const app = new Elysia()
	.patch('/user/:id', ({ params, body }) => ({
		params,
		body
	}),
	{
		params: z.object({
			id: z.number()
		}),
		body: z.object({
			name: z.string()
		})
	})
```

```ts twoslash [Elysia Valibot]
import { Elysia } from 'elysia'
import * as v from 'valibot'

const app = new Elysia()
	.patch('/user/:id', ({ params, body }) => ({
		params,
		body
	}),
	{
		params: v.object({
			id: v.number()
		}),
		body: v.object({
			name: v.string()
		})
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 유효성 검사를 위해 TypeBox를 사용하고 자동으로 타입을 강제 변환합니다. Zod, Valibot과 같은 다양한 유효성 검사 라이브러리도 동일한 구문으로 지원합니다.

</template>

</Compare>

## 파일 업로드
Express는 파일 업로드를 처리하기 위해 외부 라이브러리 `multer`를 사용하는 반면, Elysia는 선언적 API를 사용하여 파일 및 formdata, 미디어 타입 유효성 검사를 위한 내장 지원을 제공합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'
import multer from 'multer'
import { fileTypeFromFile } from 'file-type'
import path from 'path'

const app = express()
const upload = multer({ dest: 'uploads/' })

app.post('/upload', upload.single('image'), async (req, res) => {
	const file = req.file

	if (!file)
		return res
			.status(422)
			.send('No file uploaded')

	const type = await fileTypeFromFile(file.path)
	if (!type || !type.mime.startsWith('image/'))
		return res
			.status(422)
			.send('File is not a valid image')

	const filePath = path.resolve(file.path)
	res.sendFile(filePath)
})
```

:::
</template>

<template v-slot:left-content>

> Express는 JSON 본문을 파싱하기 위해 `express.json()` 미들웨어가 필요합니다

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia, t } from 'elysia'

const app = new Elysia()
	.post('/upload', ({ body }) => body.file, {
		body: t.Object({
			file: t.File({
				type: 'image'
			})
		})
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 파일 및 미디어 타입 유효성 검사를 선언적으로 처리합니다

</template>

</Compare>

**multer**는 미디어 타입을 검증하지 않으므로 **file-type**이나 유사한 라이브러리를 사용하여 미디어 타입을 수동으로 검증해야 합니다.

Elysia는 파일 업로드를 검증하고 **file-type**을 사용하여 자동으로 미디어 타입을 검증합니다.

## 미들웨어

Express 미들웨어는 단일 큐 기반 순서를 사용하는 반면, Elysia는 **이벤트 기반** 라이프사이클을 사용하여 더 세밀한 제어를 제공합니다.

Elysia의 Life Cycle 이벤트는 다음과 같이 설명할 수 있습니다.
![Elysia Life Cycle Graph](/assets/lifecycle-chart.svg)
> 이미지를 클릭하여 확대하세요

Express가 요청 파이프라인에 대해 단일 흐름을 가지는 반면, Elysia는 요청 파이프라인의 각 이벤트를 가로챌 수 있습니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'

const app = express()

// Global middleware
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`)
	next()
})

app.get(
	'/protected',
	// Route-specific middleware
	(req, res, next) => {
	  	const token = req.headers.authorization

	  	if (!token)
	   		return res.status(401).send('Unauthorized')

	  	next()
	},
	(req, res) => {
  		res.send('Protected route')
	}
)
```

:::
</template>

<template v-slot:left-content>

> Express는 순서대로 실행되는 미들웨어를 위해 단일 큐 기반 순서를 사용합니다

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia()
	// Global middleware
	.onRequest(({ method, path }) => {
		console.log(`${method} ${path}`)
	})
	// Route-specific middleware
	.get('/protected', () => 'protected', {
		beforeHandle({ status, headers }) {
  			if (!headers.authorizaton)
     			return status(401)
		}
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 요청 파이프라인의 각 지점에 대한 특정 이벤트 인터셉터를 사용합니다

</template>

</Compare>

Express는 다음 미들웨어를 호출하는 `next` 함수를 가지는 반면, Elysia는 이를 가지지 않습니다.

## 견고한 타입 안정성
Elysia는 견고한 타입 안정성을 위해 설계되었습니다.

예를 들어, [derive](/essential/life-cycle.html#derive) 및 [resolve](/essential/life-cycle.html#resolve)를 사용하여 **타입 안전한** 방식으로 컨텍스트를 사용자 정의할 수 있지만 Express는 그렇지 않습니다.

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [Express]
// @errors: 2339
import express from 'express'
import type { Request, Response } from 'express'

const app = express()

const getVersion = (req: Request, res: Response, next: Function) => {
	// @ts-ignore
    req.version = 2

	next()
}

app.get('/version', getVersion, (req, res) => {
	res.send(req.version)
	//            ^?
})

const authenticate = (req: Request, res: Response, next: Function) => {
  	const token = req.headers.authorization

  	if (!token)
   		return res.status(401).send('Unauthorized')

	// @ts-ignore
    req.token = token.split(' ')[1]

	next()
}

app.get('/token', getVersion, authenticate, (req, res) => {
	req.version
	//  ^?

  	res.send(req.token)
   //            ^?
})
```

:::
</template>

<template v-slot:left-content>

> Express는 순서대로 실행되는 미들웨어를 위해 단일 큐 기반 순서를 사용합니다

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia()
	.decorate('version', 2)
	.get('/version', ({ version }) => version)
	.resolve(({ status, headers: { authorization } }) => {
		if(!authorization?.startsWith('Bearer '))
			return status(401)

		return {
			token: authorization.split(' ')[1]
		}
	})
	.get('/token', ({ token, version }) => {
		version
		//  ^?


		return token
		//       ^?
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 요청 파이프라인의 각 지점에 대한 특정 이벤트 인터셉터를 사용합니다

</template>

</Compare>

Express는 `Request` 인터페이스를 확장하기 위해 `declare module`을 사용할 수 있지만, 이는 전역적으로 사용 가능하며 견고한 타입 안정성을 가지지 않으며 모든 요청 핸들러에서 속성을 사용할 수 있다고 보장하지 않습니다.

```ts
declare module 'express' {
  	interface Request {
    	version: number
  		token: string
  	}
}
```
> 위의 Express 예제가 작동하려면 이것이 필요하며, 견고한 타입 안정성을 제공하지 않습니다

## 미들웨어 매개변수
Express는 재사용 가능한 경로별 미들웨어를 정의하기 위해 플러그인을 반환하는 함수를 사용하는 반면, Elysia는 사용자 정의 훅을 정의하기 위해 [macro](/patterns/macro)를 사용합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [Express]
const findUser = (authorization?: string) => {
	return {
		name: 'Jane Doe',
		role: 'admin' as const
	}
}
// ---cut---
// @errors: 2339
import express from 'express'
import type { Request, Response } from 'express'

const app = express()

const role = (role: 'user' | 'admin') =>
	(req: Request, res: Response, next: Function) => {
	  	const user = findUser(req.headers.authorization)

	  	if (user.role !== role)
	   		return res.status(401).send('Unauthorized')

		// @ts-ignore
	    req.user = user

		next()
	}

app.get('/token', role('admin'), (req, res) => {
  	res.send(req.user)
   //            ^?
})
```

:::
</template>

<template v-slot:left-content>

> Express는 미들웨어의 사용자 정의 인수를 수락하기 위해 함수 콜백을 사용합니다

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
const findUser = (authorization?: string) => {
	return {
		name: 'Jane Doe',
		role: 'admin' as const
	}
}
// ---cut---
import { Elysia } from 'elysia'

const app = new Elysia()
	.macro({
		role: (role: 'user' | 'admin') => ({
			resolve({ status, headers: { authorization } }) {
				const user = findUser(authorization)

				if(user.role !== role)
					return status(401)

				return {
					user
				}
			}
		})
	})
	.get('/token', ({ user }) => user, {
	//                 ^?
		role: 'admin'
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 사용자 정의 미들웨어에 사용자 정의 인수를 전달하기 위해 매크로를 사용합니다

</template>

</Compare>

## 오류 처리

Express는 모든 경로에 대해 단일 오류 핸들러를 사용하는 반면, Elysia는 오류 처리에 대해 더 세밀한 제어를 제공합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts
import express from 'express'

const app = express()

class CustomError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'CustomError'
	}
}

// global error handler
app.use((error, req, res, next) => {
	if(error instanceof CustomError) {
		res.status(500).json({
			message: 'Something went wrong!',
			error
		})
	}
})

// route-specific error handler
app.get('/error', (req, res) => {
	throw new CustomError('oh uh')
})
```

:::
</template>

<template v-slot:left-content>

> Express는 오류를 처리하기 위해 미들웨어를 사용하며, 모든 경로에 대한 단일 오류 핸들러를 사용합니다

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
import { Elysia } from 'elysia'

class CustomError extends Error {
	// Optional: custom HTTP status code
	status = 500

	constructor(message: string) {
		super(message)
		this.name = 'CustomError'
	}

	// Optional: what should be sent to the client
	toResponse() {
		return {
			message: "If you're seeing this, our dev forgot to handle this error",
			error: this
		}
	}
}

const app = new Elysia()
	// Optional: register custom error class
	.error({
		CUSTOM: CustomError,
	})
	// Global error handler
	.onError(({ error, code }) => {
		if(code === 'CUSTOM')
		// ^?




			return {
				message: 'Something went wrong!',
				error
			}
	})
	.get('/error', () => {
		throw new CustomError('oh uh')
	}, {
		// Optional: route specific error handler
		error({ error }) {
			return {
				message: 'Only for this route!',
				error
			}
		}
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 오류 처리 및 스코핑 메커니즘에 대해 더 세밀한 제어를 제공합니다

</template>

</Compare>

Express는 미들웨어를 사용한 오류 처리를 제공하는 반면, Elysia는 다음을 제공합니다:

1. 전역 및 경로별 오류 핸들러
2. HTTP 상태 매핑을 위한 단축키 및 오류를 응답에 매핑하기 위한 `toResponse`
3. 각 오류에 대한 사용자 정의 오류 코드 제공

오류 코드는 로깅 및 디버깅에 유용하며, 동일한 클래스를 확장하는 서로 다른 오류 유형을 구별하는 데 중요합니다.

Elysia는 타입 안정성을 갖춘 이 모든 것을 제공하는 반면 Express는 그렇지 않습니다.

## 캡슐화

Express 미들웨어는 전역적으로 등록되는 반면, Elysia는 명시적 스코핑 메커니즘과 코드 순서를 통해 플러그인의 부작용을 제어할 수 있습니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'

const app = express()

app.get('/', (req, res) => {
	res.send('Hello World')
})

const subRouter = express.Router()

subRouter.use((req, res, next) => {
	const token = req.headers.authorization

	if (!token)
		return res.status(401).send('Unauthorized')

	next()
})

app.use(subRouter)

// has side-effect from subRouter
app.get('/side-effect', (req, res) => {
	res.send('hi')
})

```

:::
</template>

<template v-slot:left-content>

> Express는 미들웨어의 부작용을 처리하지 않으며, 부작용을 분리하기 위해 접두사가 필요합니다

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia()
	.onBeforeHandle(({ status, headers: { authorization } }) => {
		if(!authorization?.startsWith('Bearer '))
			return status(401)
   	})

const app = new Elysia()
    .get('/', 'Hello World')
    .use(subRouter)
    // doesn't have side-effect from subRouter
    .get('/side-effect', () => 'hi')
```

:::
</template>

<template v-slot:right-content>

> Elysia는 플러그인의 부작용을 캡슐화합니다

</template>

</Compare>

기본적으로 Elysia는 라이프사이클 이벤트와 컨텍스트를 사용된 인스턴스에 캡슐화하여 명시적으로 명시되지 않는 한 플러그인의 부작용이 상위 인스턴스에 영향을 미치지 않도록 합니다.

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia()
	.onBeforeHandle(({ status, headers: { authorization } }) => {
		if(!authorization?.startsWith('Bearer '))
			return status(401)
   	})
	// Scoped to parent instance but not beyond
	.as('scoped') // [!code ++]

const app = new Elysia()
    .get('/', 'Hello World')
    .use(subRouter)
    // [!code ++]
    // now have side-effect from subRouter
    .get('/side-effect', () => 'hi')
```

Elysia는 3가지 유형의 스코핑 메커니즘을 제공합니다:
1. **local** - 현재 인스턴스에만 적용, 부작용 없음 (기본값)
2. **scoped** - 상위 인스턴스에는 부작용이 있지만 그 이상은 아님
3. **global** - 모든 인스턴스에 영향

Express는 접두사를 추가하여 미들웨어 부작용의 범위를 지정할 수 있지만 이는 진정한 캡슐화가 아닙니다. 부작용은 여전히 존재하지만 해당 접두사로 시작하는 모든 경로에 분리되어 개발자가 어떤 접두사에 부작용이 있는지 기억해야 하는 정신적 부담을 추가합니다.

다음을 수행할 수 있습니다:

1. 부작용이 있는 단일 인스턴스가 있는 경우에만 코드 순서를 이동합니다.
2. 접두사를 추가하지만 부작용은 여전히 존재합니다. 다른 인스턴스가 동일한 접두사를 가지는 경우 부작용이 있습니다.

Express가 진정한 캡슐화를 제공하지 않으므로 디버그하기에 악몽 같은 시나리오로 이어질 수 있습니다.

## 쿠키
Express는 쿠키를 파싱하기 위해 외부 라이브러리 `cookie-parser`를 사용하는 반면, Elysia는 쿠키를 처리하기 위한 신호 기반 접근 방식을 사용하는 내장 지원을 제공합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cookieParser('secret'))

app.get('/', function (req, res) {
	req.cookies.name
	req.signedCookies.name

	res.cookie('name', 'value', {
		signed: true,
		maxAge: 1000 * 60 * 60 * 24
	})
})
```

:::
</template>

<template v-slot:left-content>

> Express는 쿠키를 파싱하기 위해 `cookie-parser`를 사용합니다

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia({
	cookie: {
		secret: 'secret'
	}
})
	.get('/', ({ cookie: { name } }) => {
		// signature verification is handle automatically
		name.value

		// cookie signature is signed automatically
		name.value = 'value'
		name.maxAge = 1000 * 60 * 60 * 24
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 쿠키를 처리하기 위해 신호 기반 접근 방식을 사용합니다

</template>

</Compare>


## OpenAPI
Express는 OpenAPI, 유효성 검사 및 타입 안정성을 위한 별도의 구성이 필요한 반면, Elysia는 스키마를 **단일 진실 공급원**으로 사용하여 OpenAPI에 대한 내장 지원을 제공합니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'

import swaggerUi from 'swagger-ui-express'

const app = express()
app.use(express.json())

app.post('/users', (req, res) => {
	// TODO: validate request body
	res.status(201).json(req.body)
})

const swaggerSpec = {
	openapi: '3.0.0',
	info: {
		title: 'My API',
		version: '1.0.0'
	},
	paths: {
		'/users': {
			post: {
				summary: 'Create user',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: {
										type: 'string',
										description: 'First name only'
									},
									age: { type: 'integer' }
								},
								required: ['name', 'age']
							}
						}
					}
				},
				responses: {
					'201': {
						description: 'User created'
					}
				}
			}
		}
	}
}

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
```

:::
</template>

<template v-slot:left-content>

> Express는 OpenAPI, 유효성 검사 및 타입 안정성을 위한 별도의 구성이 필요합니다

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi' // [!code ++]

const app = new Elysia()
	.use(openapi()) // [!code ++]
	.model({
		user: t.Array(
			t.Object({
				name: t.String(),
				age: t.Number()
			})
		)
	})
	.post('/users', ({ body }) => body, {
	//                  ^?
		body: 'user',
		response: {
			201: 'user'
		},
		detail: {
			summary: 'Create user'
		}
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 스키마를 단일 진실 공급원으로 사용합니다

</template>

</Compare>

Elysia는 제공한 스키마를 기반으로 OpenAPI 사양을 생성하고, 스키마를 기반으로 요청과 응답의 유효성을 검사하며, 자동으로 타입을 추론합니다.

Elysia는 `model`에 등록된 스키마를 OpenAPI 사양에 추가하여 Swagger 또는 Scalar UI의 전용 섹션에서 모델을 참조할 수 있도록 합니다.

## 테스팅

Express는 애플리케이션을 테스트하기 위해 단일 `supertest` 라이브러리를 사용하는 반면, Elysia는 Web Standard API를 기반으로 구축되어 모든 테스팅 라이브러리와 함께 사용할 수 있습니다.

<Compare>

<template v-slot:left>

::: code-group

```ts [Express]
import express from 'express'
import request from 'supertest'
import { describe, it, expect } from 'vitest'

const app = express()

app.get('/', (req, res) => {
	res.send('Hello World')
})

describe('GET /', () => {
	it('should return Hello World', async () => {
		const res = await request(app).get('/')

		expect(res.status).toBe(200)
		expect(res.text).toBe('Hello World')
	})
})
```

:::
</template>

<template v-slot:left-content>

> Express는 애플리케이션을 테스트하기 위해 `supertest` 라이브러리를 사용합니다

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'
import { describe, it, expect } from 'vitest'

const app = new Elysia()
	.get('/', 'Hello World')

describe('GET /', () => {
	it('should return Hello World', async () => {
		const res = await app.handle(
			new Request('http://localhost')
		)

		expect(res.status).toBe(200)
		expect(await res.text()).toBe('Hello World')
	})
})
```

:::
</template>

<template v-slot:right-content>

> Elysia는 요청과 응답을 처리하기 위해 Web Standard API를 사용합니다

</template>

</Compare>

또는, Elysia는 자동 완성 및 완전한 타입 안정성을 갖춘 테스트를 위해 End-to-end 타입 안정성을 위한 [Eden](/eden/overview)이라는 헬퍼 라이브러리도 제공합니다.

```ts twoslash [Elysia]
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'
import { describe, expect, it } from 'bun:test'

const app = new Elysia().get('/hello', 'Hello World')
const api = treaty(app)

describe('GET /', () => {
	it('should return Hello World', async () => {
		const { data, error, status } = await api.hello.get()

		expect(status).toBe(200)
		expect(data).toBe('Hello World')
		//      ^?
	})
})
```

## End-to-end 타입 안정성
Elysia는 코드 생성 없이 [Eden](/eden/overview)을 사용하여 **end-to-end 타입 안정성**에 대한 내장 지원을 제공하는 반면, Express는 이를 제공하지 않습니다.

::: code-group

```ts twoslash [Elysia]
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
	.post('/mirror', ({ body }) => body, {
		body: t.Object({
			message: t.String()
		})
	})

const api = treaty(app)

const { data, error } = await api.mirror.post({
	message: 'Hello World'
})

if(error)
	throw error
	//     ^?














console.log(data)
//          ^?



// ---cut-after---
console.log('ok')
```

:::

end-to-end 타입 안정성이 중요한 경우 Elysia가 올바른 선택입니다.

---

Elysia는 성능, 타입 안정성 및 단순성에 중점을 둔 더 인체공학적이고 개발자 친화적인 경험을 제공하는 반면, Express는 Node.js를 위한 인기 있는 웹 프레임워크이지만 성능과 단순성 측면에서 몇 가지 제한 사항이 있습니다.

사용하기 쉽고 훌륭한 개발자 경험을 제공하며 Web Standard API를 기반으로 구축된 프레임워크를 찾고 있다면 Elysia가 올바른 선택입니다.

또는 다른 프레임워크에서 오는 경우 다음을 확인할 수 있습니다:

<Deck>
    <Card title="From Fastify" href="/migrate/from-fastify">
  		Fastify와 Elysia 간의 비교
    </Card>
	<Card title="From Hono" href="/migrate/from-hono">
		tRPC와 Elysia 간의 비교
	</Card>
	<Card title="From tRPC" href="/migrate/from-trpc">
  		tRPC와 Elysia 간의 비교
    </Card>
</Deck>
