---
title: AI SDK와의 통합 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: AI SDK와의 통합 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia는 응답 스트리밍을 쉽게 지원하여 Vercel AI SDK와 원활하게 통합할 수 있습니다.

    - - meta
      - property: 'og:description'
        content: Elysia는 응답 스트리밍을 쉽게 지원하여 Vercel AI SDK와 원활하게 통합할 수 있습니다.
---

# AI SDK와의 통합

Elysia는 응답 스트리밍을 쉽게 지원하여 [Vercel AI SDK](https://vercel.com/docs/ai)와 원활하게 통합할 수 있습니다.

## 응답 스트리밍

Elysia는 `ReadableStream`과 `Response`의 연속 스트리밍을 지원하여 AI SDK에서 직접 스트림을 반환할 수 있습니다.

```ts
import { Elysia } from 'elysia'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

new Elysia().get('/', () => {
    const stream = streamText({
        model: openai('gpt-5'),
        system: 'You are Yae Miko from Genshin Impact',
        prompt: 'Hi! How are you doing?'
    })

    // ReadableStream을 그냥 반환하면 됩니다
    return stream.textStream // [!code ++]

    // UI Message Stream도 지원됩니다
    return stream.toUIMessageStream() // [!code ++]
})
```

Elysia는 스트림을 자동으로 처리하여 다양한 방식으로 사용할 수 있습니다.

## Server Sent Event

Elysia는 `ReadableStream`을 `sse` 함수로 감싸기만 하면 스트리밍 응답을 위한 Server Sent Event도 지원합니다.

```ts
import { Elysia, sse } from 'elysia' // [!code ++]
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

new Elysia().get('/', () => {
    const stream = streamText({
        model: openai('gpt-5'),
        system: 'You are Yae Miko from Genshin Impact',
        prompt: 'Hi! How are you doing?'
    })

    // 각 청크가 Server Sent Event로 전송됩니다
    return sse(stream.textStream) // [!code ++]

    // UI Message Stream도 지원됩니다
    return sse(stream.toUIMessageStream()) // [!code ++]
})
```

## Response로 반환

[Eden](/eden/overview)에서 추가 사용을 위한 스트림의 타입 안전성이 필요하지 않다면, 스트림을 응답으로 직접 반환할 수 있습니다.

```ts
import { Elysia } from 'elysia'
import { ai } from 'ai'
import { openai } from '@ai-sdk/openai'

new Elysia().get('/', () => {
    const stream = streamText({
        model: openai('gpt-5'),
        system: 'You are Yae Miko from Genshin Impact',
        prompt: 'Hi! How are you doing?'
    })

    return stream.toTextStreamResponse() // [!code ++]

    // UI Message Stream Response는 SSE를 사용합니다
    return stream.toUIMessageStreamResponse() // [!code ++]
})
```

## 수동 스트리밍

스트리밍을 더 세밀하게 제어하려면 제너레이터 함수를 사용하여 청크를 수동으로 yield할 수 있습니다.

```ts
import { Elysia, sse } from 'elysia'
import { ai } from 'ai'
import { openai } from '@ai-sdk/openai'

new Elysia().get('/', async function* () {
    const stream = streamText({
        model: openai('gpt-5'),
        system: 'You are Yae Miko from Genshin Impact',
        prompt: 'Hi! How are you doing?'
    })

    for await (const data of stream.textStream) // [!code ++]
        yield sse({ // [!code ++]
            data, // [!code ++]
            event: 'message' // [!code ++]
        }) // [!code ++]

    yield sse({
        event: 'done'
    })
})
```

## Fetch

AI SDK가 사용 중인 모델을 지원하지 않는 경우에도 `fetch` 함수를 사용하여 AI SDK에 요청하고 응답을 직접 스트리밍할 수 있습니다.

```ts
import { Elysia, fetch } from 'elysia'

new Elysia().get('/', () => {
    return fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-5',
            stream: true,
            messages: [
                {
                    role: 'system',
                    content: 'You are Yae Miko from Genshin Impact'
                },
                { role: 'user', content: 'Hi! How are you doing?' }
            ]
        })
    })
})
```

Elysia는 스트리밍 지원과 함께 fetch 응답을 자동으로 프록시합니다.

---

자세한 정보는 [AI SDK 문서](https://ai-sdk.dev/docs/introduction)를 참조하세요.
