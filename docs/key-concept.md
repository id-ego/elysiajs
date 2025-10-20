---
title: 핵심 개념 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 핵심 개념 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia는 간단한 라이브러리이지만, 효과적으로 사용하기 위해 이해해야 할 몇 가지 핵심 개념이 있습니다. 이 페이지는 ElysiaJS의 핵심 개념을 안내합니다.

    - - meta
      - property: 'og:description'
        content: Elysia는 간단한 라이브러리이지만, 효과적으로 사용하기 위해 이해해야 할 몇 가지 핵심 개념이 있습니다. 이 페이지는 ElysiaJS의 핵심 개념을 안내합니다.
---

<script setup>
import { Elysia } from 'elysia'
import Playground from './components/nearl/playground.vue'

const profile1 = new Elysia()
	.onBeforeHandle(({ status }) => status(401))
	.get('/profile', ({ status }) => status(401))

const demo1 = new Elysia()
	.use(profile1)
	// This will NOT have sign in check
	.patch('/rename', () => 'Updated!')

const profile2 = new Elysia()
	.onBeforeHandle({ as: 'global' }, ({ status }) => status(401))
	.get('/profile', ({ status }) => status(401))

const demo2 = new Elysia()
	.use(profile2)
	// This will NOT have sign in check
	.patch('/rename', ({ status }) => status(401))
</script>

# 핵심 개념 <Badge type="danger" text="필독" />

Elysia에는 사용하기 전에 이해해야 할 매우 중요한 개념들이 있습니다.

이 페이지는 시작하기 전에 알아야 할 대부분의 개념을 다룹니다.

## 캡슐화 <Badge type="danger" text="필독" />
Elysia 라이프사이클 메서드는 **자체 인스턴스에만 캡슐화**됩니다.

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
	// ⚠️ 로그인 확인이 적용되지 않습니다
	.patch('/rename', ({ body }) => updateProfile(body))
```

<!-- Do not at 'the' before "profile" and "app" here - @Saltyaom -->
이 예제에서 `isSignIn` 확인은 `profile`에만 적용되고 `app`에는 적용되지 않습니다.

<Playground :elysia="demo1" />

> URL 바의 경로를 **/rename**으로 변경하고 결과를 확인해보세요

<br>

**Elysia는 명시적으로 지정하지 않는 한 기본적으로 라이프사이클을 격리합니다**. 이는 모듈 외부에서 사용할 수 있도록 함수를 내보내야 하는 JavaScript의 **export**와 유사합니다.

라이프사이클을 다른 인스턴스로 **"내보내기"**하려면 범위를 지정해야 합니다.

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
	// 이제 로그인 확인이 적용됩니다
	.patch('/rename', ({ body }) => updateProfile(body))
```

<Playground :elysia="demo2" />

라이프사이클을 **"global"**로 캐스팅하면 **모든 인스턴스**로 라이프사이클이 내보내집니다.

자세한 내용은 [scope](/essential/plugin.html#scope-level)를 참조하세요.

<!--## Everything is a component

Every Elysia instance is a component.

A component is a plugin that could plug into other instances.

It could be a router, a store, a service, or anything else.

```ts twoslash
import { Elysia } from 'elysia'

const store = new Elysia()
	.state({ visitor: 0 })

const router = new Elysia()
	.use(store)
	.get('/increase', ({ store }) => store.visitor++)

const app = new Elysia()
	.use(router)
	.get('/', ({ store }) => store)
	.listen(3000)
```

This forces you to break down your application into small pieces, making it easy for you to add or remove features.

Learn more about this in [plugin](/essential/plugin.html).-->

## 메서드 체이닝 <Badge type="warning" text="중요" />
Elysia 코드는 **항상** 메서드 체이닝을 사용해야 합니다.

이는 **타입 안전성을 보장하기 위해 중요합니다**.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('build', 1)
    // Store는 엄격하게 타입이 지정됩니다 // [!code ++]
    .get('/', ({ store: { build } }) => build)
                        // ^?
    .listen(3000)
```

위 코드에서 **state**는 타입이 지정된 `build` 속성이 추가된 새로운 **ElysiaInstance** 타입을 반환합니다.

### 메서드 체이닝을 사용하지 않는 경우
Elysia의 타입 시스템은 복잡하므로 Elysia의 모든 메서드는 새로운 타입 참조를 반환합니다.

메서드 체이닝을 사용하지 않으면 Elysia는 이러한 새로운 타입을 저장하지 않아 타입 추론이 되지 않습니다.

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const app = new Elysia()

app.state('build', 1)

app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

정확한 타입 추론을 제공하기 위해 <u>**항상 메서드 체이닝을 사용**</u>하는 것을 권장합니다.

## 의존성 <Badge type="danger" text="필독" />
각 플러그인은 다른 인스턴스에 적용될 때마다 **매번** 재실행됩니다.

플러그인이 여러 번 적용되면 불필요한 중복이 발생할 수 있습니다.

**라이프사이클**이나 **라우트**와 같은 일부 메서드는 한 번만 호출되어야 한다는 것이 중요합니다.

이를 방지하기 위해 Elysia는 **고유 식별자**를 사용하여 라이프사이클 중복을 제거할 수 있습니다.

```ts twoslash
import { Elysia } from 'elysia'

// `name`은 고유 식별자입니다
const ip = new Elysia({ name: 'ip' }) // [!code ++]
	.derive(
		{ as: 'global' },
		({ server, request }) => ({
			ip: server?.requestIP(request)
		})
	)
	.get('/ip', ({ ip }) => ip)

const router1 = new Elysia()
	.use(ip)
	.get('/ip-1', ({ ip }) => ip)

const router2 = new Elysia()
	.use(ip)
	.get('/ip-2', ({ ip }) => ip)

const server = new Elysia()
	.use(router1)
	.use(router2)
```

인스턴스에 `name` 속성을 추가하면 고유 식별자가 되어 여러 번 호출되는 것을 방지합니다.

자세한 내용은 [plugin deduplication](/essential/plugin.html#plugin-deduplication)을 참조하세요.

### Service Locator <Badge type="warning" text="중요" />
인스턴스에 플러그인을 적용하면 해당 인스턴스가 타입 안전성을 얻습니다.

그러나 플러그인을 다른 인스턴스에 적용하지 않으면 타입을 추론할 수 없습니다.

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const child = new Elysia()
    // ❌ 'a'가 누락되었습니다
    .get('/', ({ a }) => a)

const main = new Elysia()
    .decorate('a', 'a')
    .use(child)
```

Elysia는 이를 해결하기 위해 **Service Locator** 패턴을 도입했습니다.

단순히 Elysia가 서비스를 찾아 타입 안전성을 추가할 수 있도록 플러그인 참조를 제공하면 됩니다.

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const setup = new Elysia({ name: 'setup' })
    .decorate('a', 'a')

// 'setup' 없이는 타입이 누락됩니다
const error = new Elysia()
    .get('/', ({ a }) => a)

// `setup`을 사용하면 타입이 추론됩니다
const child = new Elysia()
    .use(setup) // [!code ++]
    .get('/', ({ a }) => a)
    //           ^?



// ---cut-after---
console.log()
```

이것은 실제로 코드를 실행하기 위해 가져오지 않고 타입만 가져오는 TypeScript의 **type import**와 동일합니다.

언급했듯이 Elysia는 이미 중복 제거를 처리하므로 성능 페널티나 라이프사이클 중복이 없습니다.

## 코드 순서 <Badge type="warning" text="중요" />

Elysia의 라이프사이클 코드 순서는 매우 중요합니다.

이벤트는 등록된 **이후의** 라우트에만 적용되기 때문입니다.

플러그인 이전에 onError를 배치하면 플러그인은 onError 이벤트를 상속받지 않습니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
 	.onBeforeHandle(() => {
        console.log('1')
    })
	.get('/', () => 'hi')
    .onBeforeHandle(() => {
        console.log('2')
    })
    .listen(3000)
```

콘솔은 다음과 같이 로그를 출력해야 합니다:

```bash
1
```

이벤트가 라우트 이후에 등록되었기 때문에 라우트에 적용되지 않아 **2**가 로그되지 않습니다.

자세한 내용은 [order of code](/essential/life-cycle.html#order-of-code)를 참조하세요.

## 타입 추론
Elysia에는 인스턴스에서 타입을 추론할 수 있는 복잡한 타입 시스템이 있습니다.

```ts twoslash
import { Elysia, t } from 'elysia'

const app = new Elysia()
	.post('/', ({ body }) => body, {
                // ^?




		body: t.Object({
			name: t.String()
		})
	})
```

정확한 타입 추론을 제공하려면 **항상 인라인 함수를 사용**해야 합니다.

MVC의 컨트롤러 패턴과 같이 별도의 함수를 적용해야 하는 경우, 불필요한 타입 추론을 방지하기 위해 다음과 같이 인라인 함수에서 속성을 구조 분해하는 것이 좋습니다:

```ts twoslash
import { Elysia, t } from 'elysia'

abstract class Controller {
	static greet({ name }: { name: string }) {
		return 'hello ' + name
	}
}

const app = new Elysia()
	.post('/', ({ body }) => Controller.greet(body), {
		body: t.Object({
			name: t.String()
		})
	})
```

[Best practice: MVC Controller](/essential/best-practice.html#controller)를 참조하세요.

### TypeScript
다음과 같이 `static` 속성에 접근하여 모든 Elysia/TypeBox 타입의 타입 정의를 가져올 수 있습니다:

```ts twoslash
import { t } from 'elysia'

const MyType = t.Object({
	hello: t.Literal('Elysia')
})

type MyType = typeof MyType.static
//    ^?
````

<br>
<br>
<br>

이를 통해 Elysia는 자동으로 타입을 추론하고 제공할 수 있어 중복 스키마 선언의 필요성을 줄입니다.

단일 Elysia/TypeBox 스키마는 다음 용도로 사용할 수 있습니다:
- 런타임 유효성 검사
- 데이터 강제 변환
- TypeScript 타입
- OpenAPI 스키마

이를 통해 스키마를 **단일 진실 공급원**으로 만들 수 있습니다.
