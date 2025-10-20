---
title: Error Handling - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Error Handling - ElysiaJS

    - - meta
      - name: 'description'
        content: 'Learn how to handle errors in ElysiaJS applications effectively. This guide covers best practices for error handling, including custom error classes and middleware integration.'

    - - meta
      - property: 'og:description'
        content: 'Learn how to handle errors in ElysiaJS applications effectively. This guide covers best practices for error handling, including custom error classes and middleware integration.'
---

<script setup>
import { Elysia, t, ValidationError, validationDetail } from 'elysia'

import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'
import Playground from '../components/nearl/playground.vue'

const demo = new Elysia()
	.onError(({ code }) => {
		if (code === 418) return 'caught'
	})
    .get('/throw', ({ error }) => {
		// This will be caught by onError
		throw error(418)
	})
	.get('/return', ({ status }) => {
		// This will NOT be caught by onError
		return status(418)
	})

const demo2 = new Elysia()
    .get('/string', () => {
        throw new ValidationError(
            'params',
            t.Object({
                id: t.Numeric({
                error: 'id must be a number'
                })
            }),
            {
                id: 'string'
            }
        )
    })
	.get('/1', () => 1)

const demo3 = new Elysia()
    .get('/string', () => {
        throw new ValidationError(
            'params',
            t.Object({
                id: t.Numeric({
                error: validationDetail('id must be a number')
                })
            }),
            {
                id: 'string'
            }
        )
    })
</script>

# 오류 처리

이 페이지는 Elysia에서 오류를 효과적으로 처리하기 위한 고급 가이드를 제공합니다.

아직 **"Life Cycle (onError)"**를 읽지 않았다면 먼저 읽는 것을 권장합니다.

<Deck>
	<Card
		title="Life Cycle (onError)"
		href="/essential/life-cycle.html#on-error-error-handling"
	>
		Elysia에서 오류를 처리하기 위한 라이프사이클.
	</Card>
</Deck>

## 사용자 정의 유효성 검사 메시지

스키마를 정의할 때 각 필드에 대한 사용자 정의 유효성 검사 메시지를 제공할 수 있습니다.

이 메시지는 유효성 검사가 실패하면 그대로 반환됩니다.

```ts
import { Elysia } from 'elysia'

new Elysia().get('/:id', ({ params: { id } }) => id, {
    params: t.Object({
        id: t.Number({
            error: 'id must be a number' // [!code ++]
        })
    })
})
```

`id` 필드에서 유효성 검사가 실패하면 응답은 `id must be a number`로 반환됩니다.

<Playground
	:elysia="demo2"
/>

### Validation Detail

`schema.error`에서 값을 반환하면 유효성 검사가 그대로 반환되지만, 때로는 필드 이름 및 예상 타입과 같은 유효성 검사 세부 정보도 반환하고 싶을 수 있습니다.

`validationDetail` 옵션을 사용하여 이를 수행할 수 있습니다.

```ts
import { Elysia, validationDetail } from 'elysia' // [!code ++]

new Elysia().get('/:id', ({ params: { id } }) => id, {
    params: t.Object({
        id: t.Number({
            error: validationDetail('id must be a number') // [!code ++]
        })
    })
})
```

이렇게 하면 필드 이름 및 예상 타입과 같은 모든 유효성 검사 세부 정보가 응답에 포함됩니다.

<Playground
	:elysia="demo3"
/>

그러나 모든 필드에 `validationDetail`을 사용할 계획이라면 수동으로 추가하는 것이 번거로울 수 있습니다.

`onError` 훅에서 처리하여 자동으로 유효성 검사 세부 정보를 추가할 수 있습니다.

```ts
new Elysia()
    .onError(({ error, code }) => {
        if (code === 'VALIDATION') return error.detail(error.message) // [!code ++]
    })
    .get('/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number({
                error: 'id must be a number'
            })
        })
    })
    .listen(3000)
```

이렇게 하면 사용자 정의 메시지가 있는 모든 유효성 검사 오류에 사용자 정의 유효성 검사 메시지가 적용됩니다.

## 프로덕션에서의 Validation Detail

기본적으로 Elysia는 `NODE_ENV`가 `production`인 경우 모든 유효성 검사 세부 정보를 생략합니다.

이는 공격자가 악용할 수 있는 필드 이름 및 예상 타입과 같은 유효성 검사 스키마에 대한 민감한 정보 누출을 방지하기 위해 수행됩니다.

Elysia는 세부 정보 없이 유효성 검사가 실패했다는 것만 반환합니다.

```json
{
    "type": "validation",
    "on": "body",
    "found": {},
    // Only shown for custom error
    "message": "x must be a number"
}
```

`message` 속성은 선택 사항이며 스키마에 사용자 정의 오류 메시지를 제공하지 않는 한 기본적으로 생략됩니다.

## 사용자 정의 오류

Elysia는 타입 레벨 및 구현 레벨 모두에서 사용자 정의 오류를 지원합니다.

기본적으로 Elysia에는 `VALIDATION`, `NOT_FOUND`와 같은 내장 오류 타입 세트가 있으며 타입을 자동으로 좁힙니다.

Elysia가 오류를 모르는 경우 오류 코드는 기본 상태 `500`을 갖는 `UNKNOWN`입니다.

그러나 다음과 같이 타입 안전성을 위해 `Elysia.error`를 사용하여 사용자 정의 오류를 추가하여 자동 완성 및 사용자 정의 상태 코드와 함께 전체 타입 안전성을 위해 오류 타입을 좁힐 수도 있습니다:

```typescript twoslash
import { Elysia } from 'elysia'

class MyError extends Error {
    constructor(public message: string) {
        super(message)
    }
}

new Elysia()
    .error({
        MyError
    })
    .onError(({ code, error }) => {
        switch (code) {
            // With auto-completion
            case 'MyError':
                // With type narrowing
                // Hover to see error is typed as `CustomError`
                return error
        }
    })
    .get('/:id', () => {
        throw new MyError('Hello Error')
    })
```

### 사용자 정의 상태 코드

사용자 정의 오류 클래스에 `status` 속성을 추가하여 사용자 정의 오류에 대한 사용자 정의 상태 코드를 제공할 수도 있습니다.

```typescript
import { Elysia } from 'elysia'

class MyError extends Error {
    status = 418

    constructor(public message: string) {
        super(message)
    }
}
```

그러면 Elysia는 오류가 발생할 때 이 상태 코드를 사용합니다.

그렇지 않으면 `onError` 훅에서 상태 코드를 수동으로 설정할 수도 있습니다.

```typescript
import { Elysia } from 'elysia'

class MyError extends Error {
	constructor(public message: string) {
		super(message)
	}
}

new Elysia()
	.error({
		MyError
	})
	.onError(({ code, error, status }) => {
		switch (code) {
			case 'MyError':
				return status(418, error.message)
		}
	})
	.get('/:id', () => {
		throw new MyError('Hello Error')
	})
```

### 사용자 정의 오류 응답
사용자 정의 오류 클래스에 사용자 정의 `toResponse` 메서드를 제공하여 오류가 발생할 때 사용자 정의 응답을 반환할 수도 있습니다.

```typescript
import { Elysia } from 'elysia'

class MyError extends Error {
	status = 418

	constructor(public message: string) {
		super(message)
	}

	toResponse() {
		return Response.json({
			error: this.message,
			code: this.status
		}, {
			status: 418
		})
	}
}
```

## throw 또는 return

Elysia의 대부분의 오류 처리는 오류를 throw하여 수행할 수 있으며 `onError`에서 처리됩니다.

그러나 `status`의 경우 반환 값 또는 오류 throw로 사용할 수 있으므로 약간 혼란스러울 수 있습니다.

특정 요구 사항에 따라 **return** 또는 **throw**일 수 있습니다.

- `status`가 **throw**되면 `onError` 미들웨어에 의해 캐치됩니다.
- `status`가 **return**되면 `onError` 미들웨어에 의해 캐치되지 **않습니다**.

다음 코드를 참조하세요:

```typescript
import { Elysia, file } from 'elysia'

new Elysia()
    .onError(({ code, error, path }) => {
        if (code === 418) return 'caught'
    })
    .get('/throw', ({ status }) => {
        // This will be caught by onError
        throw status(418)
    })
    .get('/return', ({ status }) => {
        // This will NOT be caught by onError
        return status(418)
    })
```

<Playground
    :elysia="demo"
/>
