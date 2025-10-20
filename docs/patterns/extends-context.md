---
title: Extends Context - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Extends Context - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia provides a minimal Context by default, allowing us to extend Context for our specific need using state, decorate, derive, and resolve.

    - - meta
      - property: 'og:description'
        content: Elysia provides a minimal Context by default, allowing us to extend Context for our specific need using state, decorate, derive, and resolve.
---

<script setup>
import Playground from '../components/nearl/playground.vue'
import Tab from '../components/fern/tab.vue'
import { Elysia } from 'elysia'

const handler1 = new Elysia()
    .get('/', ({ path }) => path)

const handler2 = new Elysia()
    .get('/', ({ status }) => status(418, "Kirifuji Nagisa"))

const demo1 = new Elysia()
    .state('version', 1)
    .get('/a', ({ store: { version } }) => version)
    .get('/b', ({ store }) => store)
    .get('/c', () => 'still ok')

const demo2 = new Elysia()
    // @ts-expect-error
    .get('/error', ({ store }) => store.counter)
    .state('version', 1)
    .get('/', ({ store: { version } }) => version)

const demo3 = new Elysia()
    .derive(({ headers }) => {
        const auth = headers['authorization']

        return {
            bearer: auth?.startsWith('Bearer ') ? auth.slice(7) : null
        }
    })
    .get('/', ({ bearer }) => bearer ?? '12345')

const demo4 = new Elysia()
    .state('counter', 0)
    .state('version', 1)
    .state(({ version, ...store }) => ({
        ...store,
        elysiaVersion: 1
    }))
    // ✅ Create from state remap
    .get('/elysia-version', ({ store }) => store.elysiaVersion)
    // ❌ Excluded from state remap
    .get('/version', ({ store }) => store.version)

const setup = new Elysia({ name: 'setup' })
    .decorate({
        argon: 'a',
        boron: 'b',
        carbon: 'c'
    })

const demo5 = new Elysia()
    .use(
        setup
            .prefix('decorator', 'setup')
    )
    .get('/', ({ setupCarbon }) => setupCarbon)

const demo6 = new Elysia()
    .state('counter', 0)
    // ✅ Using reference, value is shared
    .get('/', ({ store }) => store.counter++)
    // ❌ Creating a new variable on primitive value, the link is lost
    .get('/error', ({ store: { counter } }) => counter)
</script>

# Context 확장 <Badge type="warning">고급 개념</Badge>

Elysia는 기본적으로 최소한의 Context를 제공하며, state, decorate, derive, resolve를 사용하여 특정 요구 사항에 맞게 Context를 확장할 수 있습니다.

Elysia는 다음과 같은 다양한 사용 사례를 위해 Context를 확장할 수 있습니다:
- 사용자 ID를 변수로 추출
- 공통 패턴 리포지토리 주입
- 데이터베이스 연결 추가

다음 API를 사용하여 Context를 사용자 정의하여 Elysia의 컨텍스트를 확장할 수 있습니다:

-   [state](#state) - 전역 변경 가능한 상태
-   [decorate](#decorate) - **Context**에 할당된 추가 속성
-   [derive](#derive) / [resolve](#resolve) - 기존 속성에서 새로운 값 생성

### Context를 확장해야 하는 경우
다음과 같은 경우에만 Context를 확장해야 합니다:
- 속성이 전역 변경 가능한 상태이고 [state](#state)를 사용하여 여러 라우트에서 공유되는 경우
- 속성이 [decorate](#decorate)를 사용하여 요청 또는 응답과 연결된 경우
- 속성이 [derive](#derive) / [resolve](#resolve)를 사용하여 기존 속성에서 파생된 경우

그렇지 않으면 Context를 확장하는 것보다 값이나 함수를 별도로 정의하는 것이 좋습니다.

::: tip
요청 및 응답과 관련된 속성 또는 자주 사용되는 함수를 관심사 분리를 위해 Context에 할당하는 것이 좋습니다.
:::

## State

**State**는 Elysia 앱 전체에서 공유되는 전역 변경 가능한 객체 또는 상태입니다.

**state**가 호출되면 **호출 시점에 한 번** **store** 속성에 값이 추가되고 핸들러에서 사용할 수 있습니다.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('version', 1)
    .get('/a', ({ store: { version } }) => version)
                // ^?
    .get('/b', ({ store }) => store)
    .get('/c', () => 'still ok')
    .listen(3000)
```

<Playground :elysia="demo1" />

### 사용 시기
- 여러 라우트에서 원시 변경 가능한 값을 공유해야 하는 경우
- 내부 상태를 변경하는 비원시 또는 `wrapper` 값이나 클래스를 사용하려면 [decorate](#decorate)를 사용하세요.

### 핵심 사항
- **store**는 전체 Elysia 앱에 대한 단일 진실 소스 전역 변경 가능한 객체의 표현입니다.
- **state**는 나중에 변경될 수 있는 **store**에 초기 값을 할당하는 함수입니다.
- 핸들러에서 사용하기 전에 값을 할당해야 합니다.
```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

new Elysia()
    // ❌ TypeError: counter doesn't exist in store
    .get('/error', ({ store }) => store.counter)
    .state('counter', 0)
    // ✅ Because we assigned a counter before, we can now access it
    .get('/', ({ store }) => store.counter)
```

<Playground :elysia="demo2" />

::: tip
할당하기 전에 state 값을 사용할 수 없습니다.

Elysia는 명시적인 타입이나 추가 TypeScript 제네릭 없이 자동으로 state 값을 store에 등록합니다.
:::

### 참조와 값 <Badge type="warning">주의사항</Badge>

상태를 변경하려면 실제 값을 사용하는 것보다 **참조**를 사용하여 변경하는 것이 좋습니다.

JavaScript에서 속성에 액세스할 때 객체 속성에서 원시 값을 새 값으로 정의하면 참조가 손실되고 값이 새로운 별도의 값으로 처리됩니다.

예를 들어:

```typescript
const store = {
    counter: 0
}

store.counter++
console.log(store.counter) // ✅ 1
```

**store.counter**를 사용하여 속성에 액세스하고 변경할 수 있습니다.

그러나 counter를 새 값으로 정의하면

```typescript
const store = {
    counter: 0
}

let counter = store.counter

counter++
console.log(store.counter) // ❌ 0
console.log(counter) // ✅ 1
```

원시 값이 새 변수로 재정의되면 참조 **"링크"**가 손실되어 예상치 못한 동작이 발생합니다.

이는 전역 변경 가능한 객체이므로 `store`에도 적용될 수 있습니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .state('counter', 0)
    // ✅ Using reference, value is shared
    .get('/', ({ store }) => store.counter++)
    // ❌ Creating a new variable on primitive value, the link is lost
    .get('/error', ({ store: { counter } }) => counter)
```

<Playground :elysia="demo6" />

## Decorate

**decorate**는 **호출 시점에** 추가 속성을 **Context**에 직접 할당합니다.

```typescript twoslash
import { Elysia } from 'elysia'

class Logger {
    log(value: string) {
        console.log(value)
    }
}

new Elysia()
    .decorate('logger', new Logger())
    // ✅ defined from the previous line
    .get('/', ({ logger }) => {
        logger.log('hi')

        return 'hi'
    })
```

### 사용 시기
- 상수 또는 읽기 전용 값 객체를 **Context**에 추가
- 내부 변경 가능한 상태를 포함할 수 있는 비원시 값 또는 클래스
- 모든 핸들러에 추가 함수, 싱글톤 또는 불변 속성 추가

### 핵심 사항
- **state**와 달리 decorated 값은 **변경되어서는 안 됩니다**. 가능하더라도
- 핸들러에서 사용하기 전에 값을 할당해야 합니다.

## Derive

###### ⚠️ Derive는 타입 무결성을 처리하지 않으므로 대신 [resolve](#resolve)를 사용하는 것이 좋습니다.

**Context**의 기존 속성에서 값을 가져와 새 속성을 할당합니다.

Derive는 요청이 발생할 때 **transform 라이프사이클**에서 할당되어 기존 속성에서 새 속성을 "파생"<small>(생성)</small>할 수 있습니다.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .derive(({ headers }) => {
        const auth = headers['authorization']

        return {
            bearer: auth?.startsWith('Bearer ') ? auth.slice(7) : null
        }
    })
    .get('/', ({ bearer }) => bearer)
```

<Playground :elysia="demo3" />

**derive**는 새 요청이 시작되면 할당되므로 **store** 및 **decorate**가 할 수 없는 **headers**, **query**, **body**와 같은 요청 속성에 액세스할 수 있습니다.

### 사용 시기
- 유효성 검사 또는 타입 검사 없이 **Context**의 기존 속성에서 새 속성 생성
- 유효성 검사 없이 **headers**, **query**, **body**와 같은 요청 속성에 액세스해야 하는 경우

### 핵심 사항
- **state** 및 **decorate**와 달리 **호출 시점**에 할당하는 대신 **derive**는 새 요청이 시작되면 할당됩니다.
- **derive는 transform에서 또는 유효성 검사가 발생하기 전에 호출됩니다**. Elysia는 요청 속성의 타입을 안전하게 확인할 수 없어 **unknown**으로 표시됩니다. 타입이 지정된 요청 속성에서 새 값을 할당하려면 [resolve](#resolve)를 사용하는 것이 좋습니다.

## Resolve
[derive](#derive)와 유사하지만 타입 무결성을 보장합니다.

Resolve는 컨텍스트에 새 속성을 할당할 수 있습니다.

Resolve는 **beforeHandle** 라이프사이클 또는 **유효성 검사 후**에 호출되어 요청 속성을 안전하게 **resolve**할 수 있습니다.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.guard({
		headers: t.Object({
			bearer: t.String({
				pattern: '^Bearer .+$'
			})
		})
	})
	.resolve(({ headers }) => {
		return {
			bearer: headers.bearer.slice(7)
		}
	})
	.get('/', ({ bearer }) => bearer)
```

### 사용 시기
- 타입 무결성(타입 검사)이 있는 **Context**의 기존 속성에서 새 속성 생성
- 유효성 검사와 함께 **headers**, **query**, **body**와 같은 요청 속성에 액세스해야 하는 경우

### 핵심 사항
- **resolve는 beforeHandle에서 또는 유효성 검사 후에 호출됩니다**. Elysia는 요청 속성의 타입을 안전하게 확인할 수 있어 **타입이 지정됩니다**.

### resolve/derive에서의 오류
resolve 및 derive는 **transform** 및 **beforeHandle** 라이프사이클을 기반으로 하므로 resolve 및 derive에서 오류를 반환할 수 있습니다. **derive**에서 오류가 반환되면 Elysia는 조기 종료하고 오류를 응답으로 반환합니다.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .derive(({ headers, status }) => {
        const auth = headers['authorization']

        if(!auth) return status(400)

        return {
            bearer: auth?.startsWith('Bearer ') ? auth.slice(7) : null
        }
    })
    .get('/', ({ bearer }) => bearer)
```

## 패턴 <Badge type="info">고급 개념</Badge>

**state**, **decorate**는 Context에 속성을 할당하기 위해 다음과 같은 유사한 API 패턴을 제공합니다:

-   key-value
-   object
-   remap

**derive**는 기존 값에 의존하므로 **remap**과만 사용할 수 있습니다.

### key-value

**state** 및 **decorate**를 사용하여 key-value 패턴을 사용하여 값을 할당할 수 있습니다.

```typescript
import { Elysia } from 'elysia'

class Logger {
    log(value: string) {
        console.log(value)
    }
}

new Elysia()
    .state('counter', 0)
    .decorate('logger', new Logger())
```

이 패턴은 단일 속성을 설정할 때 가독성이 뛰어납니다.

### Object

여러 속성을 할당하는 것은 단일 할당을 위해 객체에 포함하는 것이 좋습니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .decorate({
        logger: new Logger(),
        trace: new Trace(),
        telemetry: new Telemetry()
    })
```

객체는 여러 값을 설정하기 위한 덜 반복적인 API를 제공합니다.

### Remap

Remap은 함수 재할당입니다.

속성 이름을 바꾸거나 제거하는 것과 같이 기존 값에서 새 값을 만들 수 있습니다.

함수를 제공하고 값을 재할당하기 위해 완전히 새로운 객체를 반환합니다.

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

new Elysia()
    .state('counter', 0)
    .state('version', 1)
    .state(({ version, ...store }) => ({
        ...store,
        elysiaVersion: 1
    }))
    // ✅ Create from state remap
    .get('/elysia-version', ({ store }) => store.elysiaVersion)
    // ❌ Excluded from state remap
    .get('/version', ({ store }) => store.version)
```

<Playground :elysia="demo4" />

기존 값에서 새 초기 값을 만들려면 state remap을 사용하는 것이 좋습니다.

그러나 Elysia는 remap이 초기 값만 할당하므로 이 접근 방식에서 반응성을 제공하지 않는다는 점에 유의해야 합니다.

::: tip
remap을 사용하면 Elysia는 반환된 객체를 새 속성으로 취급하여 객체에서 누락된 속성을 제거합니다.
:::

## Affix <Badge type="info">고급 개념</Badge>

더 나은 경험을 제공하기 위해 일부 플러그인에는 하나씩 remap하기에 부담스러울 수 있는 많은 속성 값이 있을 수 있습니다.

**prefix** 및 **suffix**로 구성된 **Affix** 함수를 사용하면 인스턴스의 모든 속성을 remap할 수 있습니다.

```ts twoslash
import { Elysia } from 'elysia'

const setup = new Elysia({ name: 'setup' })
    .decorate({
        argon: 'a',
        boron: 'b',
        carbon: 'c'
    })

const app = new Elysia()
    .use(setup)
    .prefix('decorator', 'setup')
    .get('/', ({ setupCarbon, ...rest }) => setupCarbon)
```

<Playground :elysia="demo5" />

플러그인의 속성을 손쉽게 대량으로 remap하여 플러그인의 이름 충돌을 방지할 수 있습니다.

기본적으로 **affix**는 명명 규칙으로 camelCase로 속성을 remap하여 런타임 및 타입 레벨 코드를 자동으로 처리합니다.

일부 조건에서는 플러그인의 `all` 속성을 remap할 수도 있습니다:

```ts twoslash
import { Elysia } from 'elysia'

const setup = new Elysia({ name: 'setup' })
    .decorate({
        argon: 'a',
        boron: 'b',
        carbon: 'c'
    })

const app = new Elysia()
    .use(setup)
    .prefix('all', 'setup') // [!code ++]
    .get('/', ({ setupCarbon, ...rest }) => setupCarbon)
```

<!--## TypeScript
Elysia automatically type context base on various of factors like store, decorators, schema.

It's recommended to leave Elysia to type context instead of manually define one.

However, Elysia also offers some utility type to help you define a handler type.
- [InferContext](#infercontext)
- [InferHandle](#inferhandler)

### InferContext
Infer context is a utility type to help you define a context type based on Elysia instance.

```typescript twoslash
import { Elysia, type InferContext } from 'elysia'

const setup = new Elysia()
	.state('a', 'a')
	.decorate('b', 'b')

type Context = InferContext<typeof setup>

const handler = ({ store }: Context) => store.a
```

### InferHandler
Infer handler is a utility type to help you define a handler type based on Elysia instance, path, and schema.

```typescript twoslash
import { Elysia, type InferHandler } from 'elysia'

const setup = new Elysia()
	.state('a', 'a')
	.decorate('b', 'b')

type Handler = InferHandler<
	// Elysia instance to based on
	typeof setup,
	// path
	'/path',
	// schema
	{
		body: string
		response: {
			200: string
		}
	}
>

const handler: Handler = ({ body }) => body

const app = new Elysia()
	.get('/', handler)
```

Unlike `InferContext`, `InferHandler` requires a path and schema to define a handler type and can safely ensure type safety of a return type.-->
