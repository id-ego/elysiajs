---
title: Macro - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Macro - ElysiaJS

  - - meta
    - name: 'description'
      content: Macro allows us to define a custom field to the hook.

  - - meta
    - property: 'og:description'
      content: Macro allows us to define a custom field to the hook.
---

# Macro

<script setup>
import Tab from '../components/fern/tab.vue'
</script>

Macro는 lifecycle 이벤트, 스키마, context에 대한 제어를 가지며 완전한 타입 안전성을 갖춘 함수와 유사합니다.

정의되면 hook에서 사용할 수 있으며 속성을 추가하여 활성화할 수 있습니다.

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'plugin' })
    .macro({
        hi: (word: string) => ({
            beforeHandle() {
                console.log(word)
            }
        })
    })

const app = new Elysia()
    .use(plugin)
    .get('/', () => 'hi', {
        hi: 'Elysia' // [!code ++]
    })
```

경로에 액세스하면 결과적으로 **"Elysia"**가 로그됩니다.

## Property shorthand
Elysia 1.2.10부터 macro 객체의 각 속성은 함수 또는 객체일 수 있습니다.

속성이 객체인 경우 boolean 매개변수를 받는 함수로 변환되며, 매개변수가 true인 경우 실행됩니다.
```typescript
import { Elysia } from 'elysia'

export const auth = new Elysia()
    .macro({
    	// 이 property shorthand
    	isAuth: {
      		resolve: () => ({
      			user: 'saltyaom'
      		})
        },
        // 다음과 동일합니다
        isAuth(enabled: boolean) {
        	if(!enabled) return

        	return {
				resolve() {
					return {
						user
					}
				}
         	}
        }
    })
```

## API

**macro**는 hook과 동일한 API를 가집니다.

이전 예제에서 **string**을 받는 **hi** macro를 만들었습니다.

그런 다음 **hi**를 **"Elysia"**에 할당했고, 값은 **hi** 함수로 다시 전송된 다음 함수가 **beforeHandle** 스택에 새 이벤트를 추가했습니다.

이는 다음과 같이 **beforeHandle**에 함수를 푸시하는 것과 동일합니다:

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'hi', {
        beforeHandle() {
            console.log('Elysia')
        }
    })
```

**macro**는 로직이 새 함수를 받는 것보다 더 복잡할 때 빛을 발합니다. 예를 들어 각 라우트에 대한 권한 부여 계층을 만듭니다.

```typescript twoslash
// @filename: auth.ts
import { Elysia } from 'elysia'

export const auth = new Elysia()
    .macro({
    	isAuth: {
      		resolve() {
     			return {
         			user: 'saltyaom'
          		}
      		}
        },
        role(role: 'admin' | 'user') {
        	return {}
        }
    })

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'
import { auth } from './auth'

const app = new Elysia()
    .use(auth)
    .get('/', ({ user }) => user, {
                          // ^?
        isAuth: true,
        role: 'admin'
    })
```

Macro는 context에 새 속성을 등록할 수도 있어 context에서 직접 값에 액세스할 수 있습니다.

필드는 문자열에서 함수까지 무엇이든 받을 수 있어 커스텀 life cycle 이벤트를 만들 수 있습니다.

**macro**는 hook에 정의된 대로 위에서 아래로 순서대로 실행되어 스택이 올바른 순서로 처리되도록 합니다.

## Resolve

[**resolve**](/essential/life-cycle.html#resolve) 함수로 객체를 반환하여 context에 속성을 추가할 수 있습니다.

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
	.macro({
		user: (enabled: true) => ({
			resolve: () => ({
				user: 'Pardofelis'
			})
		})
	})
	.get('/', ({ user }) => user, {
                          // ^?
		user: true
	})
```

위 예제에서 **resolve** 함수로 객체를 반환하여 context에 새 속성 **user**를 추가합니다.

다음은 macro resolve가 유용할 수 있는 예제입니다:
- 인증을 수행하고 사용자를 context에 추가
- 추가 데이터베이스 쿼리를 실행하고 데이터를 context에 추가
- context에 새 속성 추가


### Macro extension with resolve
TypeScript 제한으로 인해 다른 macro를 확장하는 macro는 **resolve** 함수에 타입을 추론할 수 없습니다.

이 제한에 대한 해결 방법으로 named single macro를 제공합니다.

```typescript twoslash
import { Elysia, t } from 'elysia'
new Elysia()
	.macro('user', {
		resolve: () => ({
			user: 'lilith' as const
		})
	})
	.macro('user2', {
		user: true,
		resolve: ({ user }) => {
		//           ^?
		}
	})
```

## Schema
macro에 대한 커스텀 스키마를 정의하여 macro를 사용하는 라우트가 올바른 타입을 전달하는지 확인할 수 있습니다.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.macro({
		withFriends: {
			body: t.Object({
				friends: t.Tuple([t.Literal('Fouco'), t.Literal('Sartre')])
			})
		}
	})
	.post('/', ({ body }) => body.friends, {
//                                  ^?

		body: t.Object({
			name: t.Literal('Lilith')
		}),
		withFriends: true
	})
```

스키마가 있는 Macro는 자동으로 타입을 검증하고 추론하여 타입 안전성을 보장하며 기존 스키마와 공존할 수도 있습니다.

여러 macro의 여러 스키마를 쌓을 수도 있고 심지어 Standard Validator에서도 가능하며 원활하게 함께 작동합니다.

### Schema with lifecycle in the same macro
[Macro extension with resolve](#macro-extension-with-resolve)와 유사하게,

Macro 스키마는 **동일한 macro 내의 lifecycle**에 대한 타입 추론도 지원하지만 TypeScript 제한으로 인해 named single macro에서만 가능합니다.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.macro('withFriends', {
		body: t.Object({
			friends: t.Tuple([t.Literal('Fouco'), t.Literal('Sartre')])
		}),
		beforeHandle({ body: { friends } }) {
//                             ^?
		}
	})
```

동일한 macro 내에서 lifecycle 타입 추론을 사용하려면 여러 쌓인 macro 대신 named single macro를 사용하는 것이 좋습니다

> macro 스키마를 사용하여 라우트의 lifecycle 이벤트에 타입을 추론하는 것과 혼동하지 마세요. 그것은 잘 작동합니다. 이 제한은 동일한 macro 내에서 lifecycle을 사용할 때만 적용됩니다.

## Extension
Macro는 다른 macro를 확장할 수 있어 기존 것 위에 구축할 수 있습니다.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.macro({
		sartre: {
			body: t.Object({
				sartre: t.Literal('Sartre')
			})
		},
		fouco: {
			body: t.Object({
				fouco: t.Literal('Fouco')
			})
		},
		lilith: {
			fouco: true,
			sartre: true,
			body: t.Object({
				lilith: t.Literal('Lilith')
			})
		}
	})
	.post('/', ({ body }) => body, {
//                            ^?
		lilith: true
	})



// ---cut-after---
//
```

이를 통해 기존 macro를 기반으로 구축하고 더 많은 기능을 추가할 수 있습니다.

## Deduplication
Macro는 lifecycle 이벤트를 자동으로 중복 제거하여 각 lifecycle 이벤트가 한 번만 실행되도록 합니다.

기본적으로 Elysia는 속성 값을 seed로 사용하지만 커스텀 seed를 제공하여 재정의할 수 있습니다.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.macro({
		sartre: (role: string) => ({
			seed: role, // [!code ++]
			body: t.Object({
				sartre: t.Literal('Sartre')
			})
		})
	})
```


그러나 실수로 순환 종속성을 만든 경우 Elysia는 런타임과 타입 추론 모두에서 무한 루프를 방지하기 위해 16의 제한 스택을 가지고 있습니다.

라우트에 이미 OpenAPI detail이 있는 경우 detail을 함께 병합하지만 macro detail보다 라우트 detail을 선호합니다.
