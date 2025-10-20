---
title: Server Timing Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Server Timing Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Plugin for Elysia for performance audit via Server Timing API. Start by installing the plugin with "bun add @elysiajs/server-timing".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia for performance audit via Server Timing API. Start by installing the plugin with "bun add @elysiajs/server-timing".
---

# Server Timing Plugin
이 플러그인은 Server Timing API를 통해 성능 병목 현상을 감사하는 기능을 추가합니다.

설치 방법:
```bash
bun add @elysiajs/server-timing
```

사용 방법:
```typescript twoslash
import { Elysia } from 'elysia'
import { serverTiming } from '@elysiajs/server-timing'

new Elysia()
    .use(serverTiming())
    .get('/', () => 'hello')
    .listen(3000)
```

Server Timing은 각 라이프사이클 함수에 대한 로그 기간, 함수 이름 및 세부 정보와 함께 'Server-Timing' 헤더를 추가합니다.

검사하려면 브라우저 개발자 도구 > Network > [Elysia 서버를 통해 만든 요청] > Timing을 여세요.

![Developer tools showing Server Timing screenshot](/assets/server-timing.webp)

이제 서버의 성능 병목 현상을 손쉽게 감사할 수 있습니다.

## Config
플러그인에서 허용하는 설정은 다음과 같습니다.

### enabled
@default `NODE_ENV !== 'production'`

Server Timing을 활성화할지 여부를 결정합니다.

### allow
@default `undefined`

server timing이 로그되어야 하는지에 대한 조건입니다.

### trace
@default `undefined`

Server Timing이 지정된 라이프사이클 이벤트를 로그하도록 허용합니다:

Trace는 다음 객체를 허용합니다:
- request: request에서 기간 캡처
- parse: parse에서 기간 캡처
- transform: transform에서 기간 캡처
- beforeHandle: beforeHandle에서 기간 캡처
- handle: handle에서 기간 캡처
- afterHandle: afterHandle에서 기간 캡처
- total: 시작부터 끝까지 전체 기간 캡처

## Pattern
플러그인을 사용하는 일반적인 패턴을 찾을 수 있습니다.

- [Allow Condition](#allow-condition)

## Allow Condition
`allow` 속성을 통해 특정 라우트에서 Server Timing을 비활성화할 수 있습니다.

```ts twoslash
import { Elysia } from 'elysia'
import { serverTiming } from '@elysiajs/server-timing'

new Elysia()
    .use(
        serverTiming({
            allow: ({ request }) => {
                return new URL(request.url).pathname !== '/no-trace'
            }
        })
    )
```
