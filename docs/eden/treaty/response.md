---
title: Eden Treaty Response - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty Response - ElysiaJS

    - - meta
      - name: 'og:description'
        content: Eden Treaty는 Elysia 서버의 객체 스타일 표현으로, 종단 간 타입 안전성과 크게 개선된 개발자 경험을 제공합니다. Eden을 사용하면 코드 생성 없이 Elysia 서버에서 API를 완전히 타입 안전하게 가져올 수 있습니다.

    - - meta
      - name: 'og:description'
        content: Eden Treaty는 Elysia 서버의 객체 스타일 표현으로, 종단 간 타입 안전성과 크게 개선된 개발자 경험을 제공합니다. Eden을 사용하면 코드 생성 없이 Elysia 서버에서 API를 완전히 타입 안전하게 가져올 수 있습니다.
---

# Response
fetch 메서드가 호출되면, Eden Treaty는 다음 속성을 포함하는 객체를 포함하는 `Promise`를 반환합니다:
- data - 응답의 반환 값 (2xx)
- error - 응답의 반환 값 (>= 3xx)
- response `Response` - Web Standard Response 클래스
- status `number` - HTTP 상태 코드
- headers `FetchRequestInit['headers']` - 응답 헤더

반환되면 응답 데이터 값이 unwrap되도록 에러 처리를 제공해야 하며, 그렇지 않으면 값이 nullable이 됩니다. Elysia는 에러를 처리하기 위한 `error()` 헬퍼 함수를 제공하며, Eden은 에러 값에 대한 타입 축소를 제공합니다.

```typescript
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .post('/user', ({ body: { name }, status }) => {
        if(name === 'Otto') return status(400)

        return name
    }, {
        body: t.Object({
            name: t.String()
        })
    })
    .listen(3000)

const api = treaty<typeof app>('localhost:3000')

const submit = async (name: string) => {
    const { data, error } = await api.user.post({
        name
    })

    // 타입: string | null
    console.log(data)

    if (error)
        switch(error.status) {
            case 400:
                // 에러 타입이 축소됩니다
                throw error.value

            default:
                throw error.value
        }

    // 에러가 처리되면 타입이 unwrap됩니다
    // 타입: string
    return data
}
```

기본적으로 Elysia는 `error`와 `response` 타입을 TypeScript에 자동으로 추론하며, Eden은 정확한 동작을 위한 자동 완성과 타입 축소를 제공합니다.

::: tip
서버가 HTTP 상태 >= 300로 응답하면 값은 항상 `null`이 되고, `error`는 반환된 값을 가집니다.

그렇지 않으면 응답이 `data`로 전달됩니다.
:::

## 스트림 응답
Eden은 스트림 응답이나 [Server-Sent Events](/essential/handler.html#server-sent-events-sse)를 `AsyncGenerator`로 해석하여 `for await` 루프를 사용하여 스트림을 소비할 수 있습니다.

::: code-group

```typescript twoslash [Stream]
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})

const { data, error } = await treaty(app).ok.get()
if (error) throw error

for await (const chunk of data)
	console.log(chunk)
               // ^?
```

```typescript twoslash [Server-Sent Events]
import { Elysia, sse } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
	.get('/ok', function* () {
		yield sse({
			event: 'message',
			data: 1
		})
		yield sse({
			event: 'message',
			data: 2
		})
		yield sse({
			event: 'end'
		})
	})

const { data, error } = await treaty(app).ok.get()
if (error) throw error

for await (const chunk of data)
	console.log(chunk)
               // ^?







//
```

:::


## 유틸리티 타입
Eden Treaty는 응답에서 `data`와 `error` 타입을 추출하기 위한 유틸리티 타입 `Treaty.Data<T>`와 `Treaty.Error<T>`를 제공합니다.

```typescript twoslash
import { Elysia, t } from 'elysia'

import { treaty, Treaty } from '@elysiajs/eden'

const app = new Elysia()
	.post('/user', ({ body: { name }, status }) => {
		if(name === 'Otto') return status(400)

		return name
	}, {
		body: t.Object({
			name: t.String()
		})
	})
	.listen(3000)

const api =
	treaty<typeof app>('localhost:3000')

type UserData = Treaty.Data<typeof api.user.post>
//     ^?


// 또는 응답을 전달할 수도 있습니다
const response = await api.user.post({
	name: 'Saltyaom'
})

type UserDataFromResponse = Treaty.Data<typeof response>
//     ^?



type UserError = Treaty.Error<typeof api.user.post>
//     ^?












//
```
