---
title: Eden Treaty Parameters - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty Parameters - ElysiaJS

    - - meta
      - name: 'og:description'
        content: Eden Treaty는 Elysia 서버의 객체 스타일 표현으로, 종단 간 타입 안전성과 크게 개선된 개발자 경험을 제공합니다. Eden을 사용하면 코드 생성 없이 Elysia 서버에서 API를 완전히 타입 안전하게 가져올 수 있습니다.

    - - meta
      - name: 'og:description'
        content: Eden Treaty는 Elysia 서버의 객체 스타일 표현으로, 종단 간 타입 안전성과 크게 개선된 개발자 경험을 제공합니다. Eden을 사용하면 코드 생성 없이 Elysia 서버에서 API를 완전히 타입 안전하게 가져올 수 있습니다.
---

# Parameters

결국 서버에 페이로드를 전송해야 합니다.

이를 처리하기 위해 Eden Treaty의 메서드는 서버에 데이터를 전송하기 위해 2개의 매개변수를 받습니다.

두 매개변수 모두 타입 안전하며 TypeScript에서 자동으로 안내됩니다:

1. body
2. 추가 매개변수
    - query
    - headers
    - fetch

```typescript
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .post('/user', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })
    .listen(3000)

const api = treaty<typeof app>('localhost:3000')

// ✅ 작동합니다
api.user.post({
    name: 'Elysia'
})

// ✅ 이것도 작동합니다
api.user.post({
    name: 'Elysia'
}, {
    // 스키마에 지정되지 않았으므로 선택 사항입니다
    headers: {
        authorization: 'Bearer 12345'
    },
    query: {
        id: 2
    }
})
```

메서드가 body를 받지 않는 경우 body는 생략되고 단일 매개변수만 남습니다.

메서드가 **"GET"** 또는 **"HEAD"**인 경우:

1. 추가 매개변수
    -   query
    -   headers
    -   fetch

```typescript
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .get('/hello', () => 'hi')
    .listen(3000)

const api = treaty<typeof app>('localhost:3000')

// ✅ 작동합니다
api.hello.get({
    // 스키마에 지정되지 않았으므로 선택 사항입니다
    headers: {
        hello: 'world'
    }
})
```

## 빈 body
body가 선택 사항이거나 필요하지 않지만 query 또는 headers가 필요한 경우, body를 `null` 또는 `undefined`로 전달할 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .post('/user', () => 'hi', {
        query: t.Object({
            name: t.String()
        })
    })
    .listen(3000)

const api = treaty<typeof app>('localhost:3000')

api.user.post(null, {
    query: {
        name: 'Ely'
    }
})
```

## Fetch 매개변수

Eden Treaty는 fetch 래퍼이며, `$fetch`에 전달하여 Eden에 유효한 [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) 매개변수를 추가할 수 있습니다:

```typescript
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .get('/hello', () => 'hi')
    .listen(3000)

const api = treaty<typeof app>('localhost:3000')

const controller = new AbortController()

const cancelRequest = setTimeout(() => {
    controller.abort()
}, 5000)

await api.hello.get({
    fetch: {
        signal: controller.signal
    }
})

clearTimeout(cancelRequest)
```

## 파일 업로드
다음 중 하나를 전달하여 파일을 첨부할 수 있습니다:
- **File**
- **File[]**
- **FileList**
- **Blob**

파일을 첨부하면 **content-type**이 **multipart/form-data**가 됩니다

다음과 같은 서버가 있다고 가정합니다:
```typescript
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .post('/image', ({ body: { image, title } }) => title, {
        body: t.Object({
            title: t.String(),
            image: t.Files()
        })
    })
    .listen(3000)

export const api = treaty<typeof app>('localhost:3000')

const images = document.getElementById('images') as HTMLInputElement

const { data } = await api.image.post({
    title: "Misono Mika",
    image: images.files!,
})
```
