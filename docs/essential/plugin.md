---
title: Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: 플러그인은 로직을 더 작은 부분으로 분리하는 방법으로, 서버 전반에 걸쳐 재사용 가능한 컴포넌트를 정의합니다. 플러그인은 `use`를 사용하여 등록할 수 있으며, 플러그인을 등록하면 플러그인과 현재 인스턴스 간의 타입이 결합되고, 훅과 스키마의 범위도 병합됩니다.

    - - meta
      - property: 'og:description'
        content: 플러그인은 로직을 더 작은 부분으로 분리하는 방법으로, 서버 전반에 걸쳐 재사용 가능한 컴포넌트를 정의합니다. 플러그인은 `use`를 사용하여 등록할 수 있으며, 플러그인을 등록하면 플러그인과 현재 인스턴스 간의 타입이 결합되고, 훅과 스키마의 범위도 병합됩니다.
---

<script setup>
import Playground from '../components/nearl/playground.vue'
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .decorate('plugin', 'hi')
    .get('/plugin', ({ plugin }) => plugin)

const demo1 = new Elysia()
    .get('/', ({ plugin }) => plugin)
    .use(plugin)

const plugin2 = (app) => {
    if ('counter' in app.store) return app

    return app
        .state('counter', 0)
        .get('/plugin', () => 'Hi')
}

const demo2 = new Elysia()
    .use(plugin2)
    .get('/counter', ({ store: { counter } }) => counter)

const version = (version = 1) => new Elysia()
        .get('/version', version)

const demo3 = new Elysia()
    .use(version(1))

const setup = new Elysia({ name: 'setup' })
    .decorate('a', 'a')

const plugin3 = (config) => new Elysia({
        name: 'my-plugin',
        seed: config,
    })
    .get(`${config.prefix}/hi`, () => 'Hi')

const demo4 = new Elysia()
    .use(
        plugin3({
            prefix: '/v2'
        })
    )

// child.ts
const child = new Elysia()
    .use(setup)
    .get('/', ({ a }) => a)

// index.ts
const demo5 = new Elysia()
    .use(child)

const _demo1 = new Elysia()
    .post('/student', 'Rikuhachima Aru')

const _plugin2 = new Elysia()
    .onBeforeHandle({ as: 'global' }, () => {
        return 'hi'
    })
    .get('/child', () => 'child')

const _demo2 = new Elysia()
    .use(plugin2)
    .get('/parent', () => 'parent')

const _mock2 = {
    '/child': {
        'GET': 'hi'
    },
    '/parent': {
        'GET': 'hi'
    }
}

const _plugin3 = new Elysia()
    .onBeforeHandle({ as: 'global' }, () => {
        return 'overwrite'
    })

const _demo3 = new Elysia()
    .guard(app => app
        .use(plugin3)
        .get('/inner', () => 'inner')
    )
    .get('/outer', () => 'outer')

const _mock3 = {
    '/inner': {
        'GET': 'overwrite'
    },
    '/outer': {
        'GET': 'outer'
    }
}

const profile1 = new Elysia()
	.onBeforeHandle(({ status }) => status(401))
	.get('/profile', ({ status }) => status(401))

const scope1 = new Elysia()
	.use(profile1)
	// This will NOT have sign in check
	.patch('/rename', () => 'Updated!')

const profile2 = new Elysia()
	.onBeforeHandle({ as: 'global' }, ({ status }) => status(401))
	.get('/profile', ({ status }) => status(401))

const scope2 = new Elysia()
	.use(profile2)
	// This will NOT have sign in check
	.patch('/rename', ({ status }) => status(401))
</script>

# Plugin

플러그인은 기능을 더 작은 부분으로 분리하는 패턴입니다. 웹 서버를 위한 재사용 가능한 컴포넌트를 만듭니다.

플러그인을 만들려면 별도의 인스턴스를 생성합니다.

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .decorate('plugin', 'hi')
    .get('/plugin', ({ plugin }) => plugin)

const app = new Elysia()
    .use(plugin)
    .get('/', ({ plugin }) => plugin)
               // ^?
    .listen(3000)
```

**Elysia.use**에 인스턴스를 전달하여 플러그인을 사용할 수 있습니다.

<Playground :elysia="demo1" />

플러그인은 `state`, `decorate`와 같은 플러그인 인스턴스의 모든 속성을 상속하지만 **기본적으로 [격리](#scope)되어 있어 플러그인 라이프사이클은 상속하지 않습니다**.

Elysia는 타입 추론도 자동으로 처리합니다.

## Plugin

모든 Elysia 인스턴스는 플러그인이 될 수 있습니다.

로직을 별도의 Elysia 인스턴스로 분리하여 여러 인스턴스에서 재사용할 수 있습니다.

플러그인을 만들려면 별도의 파일에 인스턴스를 정의하기만 하면 됩니다:
```typescript twoslash
// plugin.ts
import { Elysia } from 'elysia'

export const plugin = new Elysia()
    .get('/plugin', () => 'hi')
```

그런 다음 메인 파일로 인스턴스를 가져옵니다:
```typescript
import { Elysia } from 'elysia'
import { plugin } from './plugin' // [!code ++]

const app = new Elysia()
    .use(plugin) // [!code ++]
    .listen(3000)
```


## Scope

Elysia 라이프사이클 메서드는 자체 인스턴스에만 **캡슐화**됩니다.

즉, 새 인스턴스를 생성하면 다른 인스턴스와 라이프사이클 메서드를 공유하지 않습니다.

```ts
import { Elysia } from 'elysia'

const profile = new Elysia()
	.onBeforeHandle(({ cookie }) => {
		throwIfNotSignIn(cookie)
	})
	.get('/profile', () => 'Hi there!')

const app = new Elysia()
	.use(profile)
	// ⚠️ 이 경로는 로그인 체크가 없습니다
	.patch('/rename', ({ body }) => updateProfile(body))
```

<!-- Do not at 'the' before "profile" and "app" here - @Saltyaom -->
이 예제에서 `isSignIn` 체크는 `profile`에만 적용되고 `app`에는 적용되지 않습니다.

<Playground :elysia="scope1" />

> URL 바에서 경로를 **/rename**으로 변경하고 결과를 확인해보세요

<br>

**Elysia는 명시적으로 지정하지 않는 한 기본적으로 라이프사이클을 격리합니다**. 이는 JavaScript의 **export**와 유사하며, 함수를 모듈 외부에서 사용할 수 있도록 하려면 내보내기가 필요합니다.

다른 인스턴스로 라이프사이클을 **"내보내기"**하려면 범위를 지정해야 합니다.

```ts
import { Elysia } from 'elysia'

const profile = new Elysia()
	.onBeforeHandle(
		{ as: 'global' }, // [!code ++]
		({ cookie }) => {
			throwIfNotSignIn(cookie)
		}
	)
	.get('/profile', () => 'Hi there!')

const app = new Elysia()
	.use(profile)
	// 이 경로는 로그인 체크가 있습니다
	.patch('/rename', ({ body }) => updateProfile(body))
```

<Playground :elysia="scope2" />

라이프사이클을 **"global"**로 캐스팅하면 라이프사이클이 **모든 인스턴스**로 내보내집니다.

### Scope level
Elysia는 다음과 같은 3가지 수준의 범위를 가집니다:

범위 타입은 다음과 같습니다:
1. **local** (기본값) - 현재 인스턴스와 하위 인스턴스에만 적용
2. **scoped** - 부모, 현재 인스턴스 및 하위 인스턴스에 적용
3. **global** - 플러그인을 적용하는 모든 인스턴스에 적용 (모든 부모, 현재 및 하위 인스턴스)

다음 예제를 사용하여 각 범위 타입이 수행하는 작업을 검토해보겠습니다:
```typescript
import { Elysia } from 'elysia'


const child = new Elysia()
    .get('/child', 'hi')

const current = new Elysia()
	// ? 아래 표에 제공된 값 기반 값
    .onBeforeHandle({ as: 'local' }, () => { // [!code ++]
        console.log('hi')
    })
    .use(child)
    .get('/current', 'hi')

const parent = new Elysia()
    .use(current)
    .get('/parent', 'hi')

const main = new Elysia()
    .use(parent)
    .get('/main', 'hi')
```

`type` 값을 변경하면 결과는 다음과 같습니다:

| type       | child | current | parent | main |
| ---------- | ----- | ------- | ------ | ---- |
| local      | ✅    | ✅      | ❌      | ❌   |
| scoped     | ✅    | ✅      | ✅      | ❌   |
| global     | ✅    | ✅      | ✅      | ✅   |

### Descendant

기본적으로 플러그인은 **자신과 하위 인스턴스에만 훅을 적용**합니다.

훅이 플러그인에 등록된 경우, 플러그인을 상속하는 인스턴스는 훅과 스키마를 상속하지 **않습니다**.

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .onBeforeHandle(() => {
        console.log('hi')
    })
    .get('/child', 'log hi')

const main = new Elysia()
    .use(plugin)
    .get('/parent', 'not log hi')
```

훅을 전역으로 적용하려면 훅을 global로 지정해야 합니다.
```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .onBeforeHandle(() => {
        return 'hi'
    })
    .get('/child', 'child')
    .as('scoped')

const main = new Elysia()
    .use(plugin)
    .get('/parent', 'parent')
```

<Playground :elysia="_demo2" :mock="_mock2" />

## Config

플러그인을 더 유용하게 만들려면 구성을 통한 사용자 정의를 허용하는 것이 좋습니다.

플러그인의 동작을 변경할 수 있는 매개변수를 받는 함수를 만들어 재사용성을 높일 수 있습니다.

```typescript
import { Elysia } from 'elysia'

const version = (version = 1) => new Elysia()
        .get('/version', version)

const app = new Elysia()
    .use(version(1))
    .listen(3000)
```

### Functional callback

함수 콜백 대신 새 플러그인 인스턴스를 정의하는 것이 좋습니다.

함수 콜백을 사용하면 메인 인스턴스의 기존 속성에 액세스할 수 있습니다. 예를 들어 특정 경로나 스토어가 존재하는지 확인할 수 있지만 캡슐화와 범위를 올바르게 처리하기 어렵습니다.

함수 콜백을 정의하려면 Elysia를 매개변수로 받는 함수를 만듭니다.

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = (app: Elysia) => app
    .state('counter', 0)
    .get('/plugin', () => 'Hi')

const app = new Elysia()
    .use(plugin)
    .get('/counter', ({ store: { counter } }) => counter)
    .listen(3000)
```

<Playground :elysia="demo2" />

`Elysia.use`에 전달되면 함수 콜백은 일반 플러그인처럼 동작하지만 속성이 메인 인스턴스에 직접 할당됩니다.

::: tip
함수 콜백과 인스턴스 생성 간의 성능 차이에 대해 걱정할 필요가 없습니다.

Elysia는 밀리초 만에 10,000개의 인스턴스를 만들 수 있으며, 새 Elysia 인스턴스는 함수 콜백보다 타입 추론 성능이 더 우수합니다.
:::

## Plugin Deduplication

기본적으로 Elysia는 모든 플러그인을 등록하고 타입 정의를 처리합니다.

일부 플러그인은 타입 추론을 제공하기 위해 여러 번 사용되어 초기 값이나 경로의 중복 설정을 초래할 수 있습니다.

Elysia는 **name**과 **선택적 seeds**를 사용하여 인스턴스를 구별하여 Elysia가 인스턴스 중복을 식별하는 데 도움을 줍니다:

```typescript
import { Elysia } from 'elysia'

const plugin = <T extends string>(config: { prefix: T }) =>
    new Elysia({
        name: 'my-plugin', // [!code ++]
        seed: config, // [!code ++]
    })
    .get(`${config.prefix}/hi`, () => 'Hi')

const app = new Elysia()
    .use(
        plugin({
            prefix: '/v2'
        })
    )
    .listen(3000)
```

<Playground :elysia="demo4" />

Elysia는 **name**과 **seed**를 사용하여 체크섬을 생성하여 인스턴스가 이전에 등록되었는지 식별합니다. 등록되었다면 Elysia는 플러그인 등록을 건너뜁니다.

seed가 제공되지 않으면 Elysia는 **name**만 사용하여 인스턴스를 구별합니다. 즉, 여러 번 등록하더라도 플러그인은 한 번만 등록됩니다.

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'plugin' })

const app = new Elysia()
    .use(plugin)
    .use(plugin)
    .use(plugin)
    .use(plugin)
    .listen(3000)
```

이를 통해 Elysia는 플러그인을 반복적으로 처리하는 대신 등록된 플러그인을 재사용하여 성능을 향상시킬 수 있습니다.

::: tip
Seed는 문자열부터 복잡한 객체나 클래스까지 무엇이든 될 수 있습니다.

제공된 값이 클래스인 경우, Elysia는 `.toString` 메서드를 사용하여 체크섬을 생성합니다.
:::

### Service Locator
state/decorators가 있는 플러그인을 인스턴스에 적용하면 인스턴스가 타입 안전성을 얻습니다.

그러나 플러그인을 다른 인스턴스에 적용하지 않으면 타입을 추론할 수 없습니다.

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const child = new Elysia()
    // ❌ 'a'가 누락됨
    .get('/', ({ a }) => a)

const main = new Elysia()
    .decorate('a', 'a')
    .use(child)
```

Elysia는 이를 해결하기 위해 **Service Locator** 패턴을 도입했습니다.

Elysia는 플러그인 체크섬을 조회하고 값을 가져오거나 새 값을 등록합니다. 플러그인에서 타입을 추론합니다.

따라서 Elysia가 서비스를 찾아 타입 안전성을 추가할 수 있도록 플러그인 참조를 제공해야 합니다.

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const setup = new Elysia({ name: 'setup' })
    .decorate('a', 'a')

// 'setup' 없이는 타입이 누락됩니다
const error = new Elysia()
    .get('/', ({ a }) => a)

// `setup`이 있으면 타입이 추론됩니다
const child = new Elysia()
    .use(setup) // [!code ++]
    .get('/', ({ a }) => a)
    //           ^?

const main = new Elysia()
    .use(child)
```

<Playground :elysia="demo5" />

## Guard

Guard를 사용하면 여러 경로에 훅과 스키마를 한 번에 적용할 수 있습니다.

```typescript twoslash
const signUp = <T>(a: T) => a
const signIn = <T>(a: T) => a
const isUserExists = <T>(a: T) => a
// ---cut---
import { Elysia, t } from 'elysia'

new Elysia()
    .guard(
        { // [!code ++]
            body: t.Object({ // [!code ++]
                username: t.String(), // [!code ++]
                password: t.String() // [!code ++]
            }) // [!code ++]
        }, // [!code ++]
        (app) => // [!code ++]
            app
                .post('/sign-up', ({ body }) => signUp(body))
                .post('/sign-in', ({ body }) => signIn(body), {
                                                     // ^?
                    beforeHandle: isUserExists
                })
    )
    .get('/', 'hi')
    .listen(3000)
```

이 코드는 스키마를 하나씩 인라인으로 지정하는 대신 '/sign-in'과 '/sign-up' 모두에 `body` 유효성 검사를 적용하지만 '/'에는 적용하지 않습니다.

경로 유효성 검사를 다음과 같이 요약할 수 있습니다:
| Path | Has validation |
| ------- | ------------- |
| /sign-up | ✅ |
| /sign-in | ✅ |
| / | ❌ |

Guard는 인라인 훅과 동일한 매개변수를 받습니다. 유일한 차이점은 범위 내의 여러 경로에 훅을 적용할 수 있다는 것입니다.

즉, 위의 코드는 다음과 같이 번역됩니다:

```typescript twoslash
const signUp = <T>(a: T) => a
const signIn = <T>(a: T) => a
const isUserExists = (a: any) => a
// ---cut---
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/sign-up', ({ body }) => signUp(body), {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .post('/sign-in', ({ body }) => body, {
        beforeHandle: isUserExists,
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .get('/', () => 'hi')
    .listen(3000)
```

### Grouped Guard

접두사가 있는 그룹을 사용하려면 그룹에 3개의 매개변수를 제공할 수 있습니다.

1. Prefix - 경로 접두사
2. Guard - 스키마
3. Scope - Elysia 앱 콜백

guard와 동일한 API를 두 번째 매개변수에 적용하여 group과 guard를 중첩하지 않습니다.

다음 예제를 고려하세요:
```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .group('/v1', (app) =>
        app.guard(
            {
                body: t.Literal('Rikuhachima Aru')
            },
            (app) => app.post('/student', ({ body }) => body)
                                            // ^?
        )
    )
    .listen(3000)
```


중첩된 그룹 가드에서 group의 두 번째 매개변수에 guard 범위를 제공하여 group과 guard를 병합할 수 있습니다:
```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .group(
        '/v1',
        (app) => app.guard( // [!code --]
        {
            body: t.Literal('Rikuhachima Aru')
        },
        (app) => app.post('/student', ({ body }) => body)
        ) // [!code --]
    )
    .listen(3000)
```

결과는 다음 구문이 됩니다:
```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .group(
        '/v1',
        {
            body: t.Literal('Rikuhachima Aru')
        },
        (app) => app.post('/student', ({ body }) => body)
                                       // ^?
    )
    .listen(3000)
```

<Playground :elysia="_demo1" />

## Scope cast <Badge type="warning">Advanced Concept</Badge>
부모에 훅을 적용하려면 다음 중 하나를 사용할 수 있습니다:
1. [inline as](#inline-as) 단일 훅에만 적용
2. [guard as](#guard-as) guard의 모든 훅에 적용
3. [instance as](#instance-as) 인스턴스의 모든 훅에 적용

### Inline
모든 이벤트 리스너는 훅의 범위를 지정하는 `as` 매개변수를 받습니다.

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .derive({ as: 'scoped' }, () => { // [!code ++]
        return { hi: 'ok' }
    })
    .get('/child', ({ hi }) => hi)

const main = new Elysia()
    .use(plugin)
    // ✅ Hi를 이제 사용할 수 있습니다
    .get('/parent', ({ hi }) => hi)
```

그러나 이 방법은 단일 훅에만 적용되며 여러 훅에는 적합하지 않을 수 있습니다.

### Guard as
모든 이벤트 리스너는 훅의 범위를 지정하는 `as` 매개변수를 받습니다.

```typescript
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.guard({
		as: 'scoped', // [!code ++]
		response: t.String(),
		beforeHandle() {
			console.log('ok')
		}
	})
    .get('/child', 'ok')

const main = new Elysia()
    .use(plugin)
    .get('/parent', 'hello')
```

Guard를 사용하면 범위를 지정하면서 `schema`와 `hook`을 여러 경로에 한 번에 적용할 수 있습니다.

그러나 `derive`와 `resolve` 메서드는 지원하지 않습니다.

### Instance as
`as`는 현재 인스턴스의 모든 훅과 스키마 범위를 읽고 수정합니다.

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .derive(() => {
        return { hi: 'ok' }
    })
    .get('/child', ({ hi }) => hi)
    .as('scoped') // [!code ++]

const main = new Elysia()
    .use(plugin)
    // ✅ Hi를 이제 사용할 수 있습니다
    .get('/parent', ({ hi }) => hi)
```

때때로 플러그인을 부모 인스턴스에도 다시 적용하고 싶지만 `scoped` 메커니즘에 의해 제한되어 1개의 부모에만 제한됩니다.

부모 인스턴스에 적용하려면 **범위를 부모 인스턴스로 끌어올려야** 하며, `as`가 이를 수행하는 완벽한 방법입니다.

즉, `local` 범위가 있고 부모 인스턴스에 적용하려면 `as('scoped')`를 사용하여 끌어올릴 수 있습니다.
```typescript twoslash
// @errors: 2304 2345
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.guard({
		response: t.String()
	})
	.onBeforeHandle(() => { console.log('called') })
	.get('/ok', () => 'ok')
	.get('/not-ok', () => 1)
	.as('scoped') // [!code ++]

const instance = new Elysia()
	.use(plugin)
	.get('/no-ok-parent', () => 2)
	.as('scoped') // [!code ++]

const parent = new Elysia()
	.use(instance)
	// `scoped`가 부모로 끌어올려져서 이제 오류가 발생합니다
	.get('/ok', () => 3)
```

## Lazy Load
모듈은 기본적으로 즉시 로드됩니다.

Elysia는 서버가 시작되기 전에 모든 모듈이 등록되었는지 확인합니다.

그러나 일부 모듈은 계산 집약적이거나 차단될 수 있어 서버 시작이 느려질 수 있습니다.

이를 해결하기 위해 Elysia는 서버 시작을 차단하지 않는 비동기 플러그인을 제공할 수 있습니다.

### Deferred Module
지연 모듈은 서버가 시작된 후 등록할 수 있는 비동기 플러그인입니다.

```typescript
// plugin.ts
import { Elysia, file } from 'elysia'
import { loadAllFiles } from './files'

export const loadStatic = async (app: Elysia) => {
    const files = await loadAllFiles()

    files.forEach((asset) => app
        .get(asset, file(file))
    )

    return app
}
```

그리고 메인 파일에서:
```typescript
import { Elysia } from 'elysia'
import { loadStatic } from './plugin'

const app = new Elysia()
    .use(loadStatic)
```

### Lazy Load Module
비동기 플러그인과 마찬가지로 지연 로드 모듈은 서버가 시작된 후 등록됩니다.

지연 로드 모듈은 동기 또는 비동기 함수일 수 있으며, `import`로 모듈을 사용하는 한 모듈은 지연 로드됩니다.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .use(import('./plugin'))
```

모듈이 계산 집약적이거나 차단될 때 모듈 지연 로딩을 사용하는 것이 좋습니다.

서버가 시작되기 전에 모듈 등록을 보장하려면 지연 모듈에서 `await`를 사용할 수 있습니다.

### Testing
테스트 환경에서는 `await app.modules`를 사용하여 지연 및 지연 로딩 모듈을 기다릴 수 있습니다.

```typescript
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'

describe('Modules', () => {
    it('inline async', async () => {
        const app = new Elysia()
              .use(async (app) =>
                  app.get('/async', () => 'async')
              )

        await app.modules

        const res = await app
            .handle(new Request('http://localhost/async'))
            .then((r) => r.text())

        expect(res).toBe('async')
    })
})
```
