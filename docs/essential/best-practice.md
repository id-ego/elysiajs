---
title: Best Practice - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Best Practice - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia는 패턴에 구애받지 않는 프레임워크로, 어떤 코딩 패턴을 사용할지는 여러분과 팀에게 맡깁니다. 하지만 많은 분들이 Elysia에서 MVC 패턴(Model-View-Controller)을 사용하고 있으며, 분리와 타입 처리에 어려움을 겪는 것을 발견했습니다. 이 페이지는 MVC 패턴과 함께 Elysia를 사용하는 가이드입니다.

    - - meta
      - property: 'og:description'
        content: Elysia는 패턴에 구애받지 않는 프레임워크로, 어떤 코딩 패턴을 사용할지는 여러분과 팀에게 맡깁니다. 하지만 많은 분들이 Elysia에서 MVC 패턴(Model-View-Controller)을 사용하고 있으며, 분리와 타입 처리에 어려움을 겪는 것을 발견했습니다. 이 페이지는 MVC 패턴과 함께 Elysia를 사용하는 가이드입니다.
---

# Best Practice

Elysia는 패턴에 구애받지 않는 프레임워크로, 어떤 코딩 패턴을 사용할지는 여러분과 팀에게 맡깁니다.

하지만 Elysia와 함께 [(Model-View-Controller)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) MVC 패턴을 적용하려 할 때 여러 가지 우려 사항이 있으며, 분리와 타입 처리가 어렵다는 것을 발견했습니다.

이 페이지는 MVC 패턴과 결합된 Elysia 구조 모범 사례를 따르는 방법에 대한 가이드이지만, 선호하는 모든 코딩 패턴에 적용할 수 있습니다.

## 폴더 구조

Elysia는 폴더 구조에 대한 의견이 없으므로 코드를 직접 구성하는 방법을 **결정**할 수 있습니다.

하지만 **특정 구조를 염두에 두지 않았다면**, 각 기능이 controller, service, model을 포함하는 자체 폴더를 가진 기능 기반 폴더 구조를 권장합니다.

```
| src
  | modules
	| auth
	  | index.ts (Elysia controller)
	  | service.ts (service)
	  | model.ts (model)
	| user
	  | index.ts (Elysia controller)
	  | service.ts (service)
	  | model.ts (model)
  | utils
	| a
	  | index.ts
	| b
	  | index.ts
```

이 구조를 사용하면 코드를 쉽게 찾고 관리할 수 있으며 관련 코드를 함께 유지할 수 있습니다.

다음은 코드를 기능 기반 폴더 구조로 배포하는 방법의 예제 코드입니다:

::: code-group

```typescript [auth/index.ts]
// Controller는 라우팅, 요청 검증과 같은 HTTP 관련 처리를 담당합니다
import { Elysia } from 'elysia'

import { Auth } from './service'
import { AuthModel } from './model'

export const auth = new Elysia({ prefix: '/auth' })
	.get(
		'/sign-in',
		async ({ body, cookie: { session } }) => {
			const response = await Auth.signIn(body)

			// 세션 쿠키 설정
			session.value = response.token

			return response
		}, {
			body: AuthModel.signInBody,
			response: {
				200: AuthModel.signInResponse,
				400: AuthModel.signInInvalid
			}
		}
	)
```

```typescript [auth/service.ts]
// Service는 Elysia controller에서 분리된 비즈니스 로직을 처리합니다
import { status } from 'elysia'

import type { AuthModel } from './model'

// 클래스가 속성을 저장할 필요가 없다면,
// `abstract class`를 사용하여 클래스 할당을 피할 수 있습니다
export abstract class Auth {
	static async signIn({ username, password }: AuthModel.signInBody) {
		const user = await sql`
			SELECT password
			FROM users
			WHERE username = ${username}
			LIMIT 1`

		if (await Bun.password.verify(password, user.password))
			// HTTP 에러를 직접 throw할 수 있습니다
			throw status(
				400,
				'Invalid username or password' satisfies AuthModel.signInInvalid
			)

		return {
			username,
			token: await generateAndSaveTokenToDB(user.id)
		}
	}
}
```

```typescript [auth/model.ts]
// Model은 요청과 응답에 대한 데이터 구조와 검증을 정의합니다
import { t } from 'elysia'

export namespace AuthModel {
	// Elysia 검증을 위한 DTO 정의
	export const signInBody = t.Object({
		username: t.String(),
		password: t.String(),
	})

	// TypeScript 타입으로 정의
	export type signInBody = typeof signInBody.static

	// 다른 모델도 반복
	export const signInResponse = t.Object({
		username: t.String(),
		token: t.String(),
	})

	export type signInResponse = typeof signInResponse.static

	export const signInInvalid = t.Literal('Invalid username or password')
	export type signInInvalid = typeof signInInvalid.static
}
```

:::

각 파일은 다음과 같은 자체 책임을 가지고 있습니다:
- **Controller**: HTTP 라우팅, 요청 검증 및 cookie를 처리합니다.
- **Service**: 가능한 경우 Elysia controller에서 분리된 비즈니스 로직을 처리합니다.
- **Model**: 요청과 응답에 대한 데이터 구조와 검증을 정의합니다.

필요에 맞게 이 구조를 자유롭게 조정하고 선호하는 코딩 패턴을 사용하세요.

## Controller
> 1 Elysia instance = 1 controller

Elysia는 타입 무결성을 보장하기 위해 많은 노력을 기울입니다. 전체 `Context` 타입을 controller에 전달하면 다음과 같은 문제가 발생할 수 있습니다:

1. Elysia 타입은 복잡하며 plugin과 여러 단계의 체이닝에 크게 의존합니다.
2. 타입 지정이 어렵고, Elysia 타입은 특히 decorator와 store에서 언제든지 변경될 수 있습니다.
3. 타입 캐스팅은 타입 무결성 손실이나 타입과 런타임 코드 간의 일관성을 보장할 수 없게 만들 수 있습니다.
4. 이로 인해 [Sucrose](/blog/elysia-10#sucrose) *(Elysia의 "일종의" 컴파일러)*가 코드를 정적으로 분석하기 더 어려워집니다

### ❌ 하지 말 것: 별도의 controller 생성
별도의 controller를 생성하지 말고, 대신 Elysia 자체를 controller로 사용하세요:
```typescript
import { Elysia, t, type Context } from 'elysia'

abstract class Controller {
    static root(context: Context) {
        return Service.doStuff(context.stuff)
    }
}

// ❌ 하지 마세요
new Elysia()
    .get('/', Controller.hi)
```

전체 `Controller.method`를 Elysia에 전달하는 것은 2개의 controller가 데이터를 주고받는 것과 같습니다. 이는 프레임워크 설계와 MVC 패턴 자체에 어긋납니다.

### ✅ 할 것: Elysia를 controller로 사용
대신 Elysia 인스턴스 자체를 controller로 취급하세요.
```typescript
import { Elysia } from 'elysia'
import { Service } from './service'

new Elysia()
    .get('/', ({ stuff }) => {
        Service.doStuff(stuff)
    })
```

그렇지 않으면 정말로 controller를 분리하고 싶다면, HTTP 요청과 전혀 연결되지 않은 controller 클래스를 만들 수 있습니다.

```typescript
import { Elysia } from 'elysia'

abstract class Controller {
	static doStuff(stuff: string) {
		return Service.doStuff(stuff)
	}
}

new Elysia()
	.get('/', ({ stuff }) => Controller.doStuff(stuff))
```

### Testing
`handle`을 사용하여 함수(및 해당 lifecycle)를 직접 호출하여 controller를 테스트할 수 있습니다

```typescript
import { Elysia } from 'elysia'
import { Service } from './service'

import { describe, it, expect } from 'bun:test'

const app = new Elysia()
    .get('/', ({ stuff }) => {
        Service.doStuff(stuff)

        return 'ok'
    })

describe('Controller', () => {
	it('should work', async () => {
		const response = await app
			.handle(new Request('http://localhost/'))
			.then((x) => x.text())

		expect(response).toBe('ok')
	})
})
```

테스트에 대한 자세한 내용은 [Unit Test](/patterns/unit-test.html)에서 확인할 수 있습니다.

## Service
Service는 모듈/controller(우리의 경우 Elysia 인스턴스)에서 사용할 비즈니스 로직으로 분리된 유틸리티/헬퍼 함수 세트입니다.

controller에서 분리할 수 있는 모든 기술 로직은 **Service** 내에 있을 수 있습니다.

Elysia에는 2가지 유형의 service가 있습니다:
1. 요청 독립적 service
2. 요청 의존적 service

### ✅ 할 것: 요청 독립적 service 추상화

service 클래스/함수를 Elysia에서 추상화하는 것을 권장합니다.

service 또는 함수가 HTTP 요청과 연결되어 있지 않거나 `Context`에 액세스하지 않는 경우 static 클래스 또는 함수로 구현하는 것이 좋습니다.

```typescript
import { Elysia, t } from 'elysia'

abstract class Service {
    static fibo(number: number): number {
        if(number < 2)
            return number

        return Service.fibo(number - 1) + Service.fibo(number - 2)
    }
}

new Elysia()
    .get('/fibo', ({ body }) => {
        return Service.fibo(body)
    }, {
        body: t.Numeric()
    })
```

service가 속성을 저장할 필요가 없다면 클래스 인스턴스 할당을 피하기 위해 `abstract class`와 `static`을 사용할 수 있습니다.

### ✅ 할 것: 요청 의존적 service를 Elysia 인스턴스로

**service가 요청 의존적 service**이거나 HTTP 요청을 처리해야 하는 경우, 타입 무결성과 추론을 보장하기 위해 Elysia 인스턴스로 추상화하는 것을 권장합니다:

```typescript
import { Elysia } from 'elysia'

// ✅ 하세요
const AuthService = new Elysia({ name: 'Auth.Service' })
    .macro({
        isSignIn: {
            resolve({ cookie, status }) {
                if (!cookie.session.value) return status(401)

                return {
                	session: cookie.session.value,
                }
            }
        }
    })

const UserController = new Elysia()
    .use(AuthService)
    .get('/profile', ({ Auth: { user } }) => user, {
    	isSignIn: true
    })
```

::: tip
Elysia는 기본적으로 [plugin deduplication](/essential/plugin.html#plugin-deduplication)을 처리하므로, **"name"** 속성을 지정하면 싱글톤이 되므로 성능에 대해 걱정할 필요가 없습니다.
:::

### ✅ 할 것: 요청 의존적 속성만 장식

`requestIP`, `requestTime` 또는 `session`과 같은 요청 의존적 속성만 `decorate`하는 것이 좋습니다.

decorator를 과도하게 사용하면 코드가 Elysia에 묶여서 테스트와 재사용이 더 어려워질 수 있습니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.decorate('requestIP', ({ request }) => request.headers.get('x-forwarded-for') || request.ip)
	.decorate('requestTime', () => Date.now())
	.decorate('session', ({ cookie }) => cookie.session.value)
	.get('/', ({ requestIP, requestTime, session }) => {
		return { requestIP, requestTime, session }
	})
```

### ❌ 하지 말 것: service에 전체 `Context` 전달
**Context는 매우 동적인 타입**이며 Elysia 인스턴스에서 추론할 수 있습니다.

전체 `Context`를 service에 전달하지 말고 객체 구조 분해를 사용하여 필요한 것을 추출하고 service에 전달하세요.
```typescript
import type { Context } from 'elysia'

class AuthService {
	constructor() {}

	// ❌ 이렇게 하지 마세요
	isSignIn({ status, cookie: { session } }: Context) {
		if (session.value)
			return status(401)
	}
}
```

Elysia 타입은 복잡하며 plugin과 여러 단계의 체이닝에 크게 의존하므로 매우 동적이어서 수동으로 타입을 지정하기 어려울 수 있습니다.

### ⚠️ Elysia 인스턴스에서 Context 추론

**절대적으로 필요한** 경우, Elysia 인스턴스 자체에서 `Context` 타입을 추론할 수 있습니다:
```typescript
import { Elysia, type InferContext } from 'elysia'

const setup = new Elysia()
	.state('a', 'a')
	.decorate('b', 'b')

class AuthService {
	constructor() {}

	// ✅ 하세요
	isSignIn({ status, cookie: { session } }: InferContext<typeof setup>) {
		if (session.value)
			return status(401)
	}
}
```

하지만 가능하면 이를 피하고 [Elysia를 service로](#✅-할-것-요청-의존적-service를-elysia-인스턴스로) 사용하는 것을 권장합니다.

[InferContext](/essential/handler#infercontext)에 대한 자세한 내용은 [Essential: Handler](/essential/handler)에서 확인할 수 있습니다.

## Model
Model 또는 [DTO (Data Transfer Object)](https://en.wikipedia.org/wiki/Data_transfer_object)는 [Elysia.t (Validation)](/essential/validation.html#elysia-type)로 처리됩니다.

Elysia는 코드에서 타입을 추론하고 런타임에 검증할 수 있는 내장 검증 시스템을 가지고 있습니다.

### ❌ 하지 말 것: 클래스 인스턴스를 model로 선언

클래스 인스턴스를 model로 선언하지 마세요:
```typescript
// ❌ 하지 마세요
class CustomBody {
	username: string
	password: string

	constructor(username: string, password: string) {
		this.username = username
		this.password = password
	}
}

// ❌ 하지 마세요
interface ICustomBody {
	username: string
	password: string
}
```

### ✅ 할 것: Elysia의 검증 시스템 사용

클래스나 인터페이스를 선언하는 대신 Elysia의 검증 시스템을 사용하여 model을 정의하세요:
```typescript twoslash
// ✅ 하세요
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

// 선택사항: model의 타입을 가져오려는 경우
// 이미 Elysia에서 추론되므로 일반적으로 타입을 사용하지 않는 경우
type CustomBody = typeof customBody.static
    // ^?



export { customBody }
```

`typeof`를 model의 `.static` 속성과 함께 사용하여 model의 타입을 가져올 수 있습니다.

그런 다음 `CustomBody` 타입을 사용하여 요청 본문의 타입을 추론할 수 있습니다.

```typescript twoslash
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})
// ---cut---
// ✅ 하세요
new Elysia()
	.post('/login', ({ body }) => {
	                 // ^?
		return body
	}, {
		body: customBody
	})
```

### ❌ 하지 말 것: model과 별도로 타입 선언
model과 별도로 타입을 선언하지 말고, 대신 `typeof`를 `.static` 속성과 함께 사용하여 model의 타입을 가져오세요.

```typescript
// ❌ 하지 마세요
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

type CustomBody = {
	username: string
	password: string
}

// ✅ 하세요
const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

type CustomBody = typeof customBody.static
```

### Group
여러 model을 단일 객체로 그룹화하여 더 잘 정리할 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'

export const AuthModel = {
	sign: t.Object({
		username: t.String(),
		password: t.String()
	})
}

const models = AuthModel.models
```

### Model 주입
선택사항이지만 MVC 패턴을 엄격하게 따르는 경우 service와 같이 model을 controller에 주입하고 싶을 수 있습니다. [Elysia reference model](/essential/validation#reference-model)을 사용하는 것을 권장합니다

Elysia의 model reference 사용
```typescript twoslash
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

const AuthModel = new Elysia()
    .model({
        'auth.sign': customBody
    })

const models = AuthModel.models

const UserController = new Elysia({ prefix: '/auth' })
    .use(AuthModel)
    .post('/sign-in', async ({ body, cookie: { session } }) => {
                             // ^?

        return true
    }, {
        body: 'auth.sign'
    })
```

이 접근 방식은 여러 가지 이점을 제공합니다:
1. model에 이름을 지정하고 자동 완성을 제공할 수 있습니다.
2. 나중에 사용하기 위해 스키마를 수정하거나 [remap](/essential/handler.html#remap)을 수행할 수 있습니다.
3. OpenAPI 호환 클라이언트(예: OpenAPI)에서 "models"로 표시됩니다.
4. 등록 중에 model 타입이 캐시되므로 TypeScript 추론 속도가 향상됩니다.

## Plugin 재사용

타입 추론을 제공하기 위해 plugin을 여러 번 재사용해도 괜찮습니다.

Elysia는 기본적으로 plugin 중복 제거를 자동으로 처리하며 성능 영향은 무시할 수 있습니다.

고유한 plugin을 만들려면 Elysia 인스턴스에 **name** 또는 선택적 **seed**를 제공할 수 있습니다.

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'my-plugin' })
	.decorate("type", "plugin")

const app = new Elysia()
    .use(plugin)
    .use(plugin)
    .use(plugin)
    .use(plugin)
    .listen(3000)
```

이를 통해 Elysia는 plugin을 계속해서 처리하는 대신 등록된 plugin을 재사용하여 성능을 향상시킬 수 있습니다.
