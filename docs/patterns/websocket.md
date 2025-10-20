---
title: WebSocket - ElysiaJS
head:
    - - meta
      - property: 'title'
        content: WebSocket - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia's WebSocket implementation. Start by declaring WebSocket route with "ws". WebSocket is a realtime protocol for communication between your client and server.

    - - meta
      - name: 'og:description'
        content: Elysia's WebSocket implementation. Start by declaring WebSocket route with "ws". WebSocket is a realtime protocol for communication between your client and server.
---

# WebSocket

WebSocket은 클라이언트와 서버 간 통신을 위한 실시간 프로토콜입니다.

클라이언트가 웹사이트에 반복적으로 정보를 요청하고 매번 응답을 기다리는 HTTP와 달리, WebSocket은 클라이언트와 서버가 메시지를 직접 주고받을 수 있는 직접적인 회선을 설정하여 각 메시지마다 다시 시작할 필요 없이 대화를 더 빠르고 부드럽게 만듭니다.

 SocketIO는 WebSocket의 인기 있는 라이브러리이지만 유일한 것은 아닙니다. Elysia는 Bun이 동일한 API로 내부적으로 사용하는 [uWebSocket](https://github.com/uNetworking/uWebSockets)을 사용합니다.

WebSocket을 사용하려면 간단히 `Elysia.ws()`를 호출하세요:

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .ws('/ws', {
        message(ws, message) {
            ws.send(message)
        }
    })
    .listen(3000)
```

## WebSocket message validation:

일반 라우트와 마찬가지로 WebSocket도 요청을 엄격하게 입력하고 검증하기 위해 **schema** 객체를 받습니다.

```typescript
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .ws('/ws', {
        // 들어오는 메시지 검증
        body: t.Object({
            message: t.String()
        }),
        query: t.Object({
            id: t.String()
        }),
        message(ws, { message }) {
            // `ws.data`에서 스키마 가져오기
            const { id } = ws.data.query
            ws.send({
                id,
                message,
                time: Date.now()
            })
        }
    })
    .listen(3000)
```

WebSocket 스키마는 다음을 검증할 수 있습니다:

-   **message** - 들어오는 메시지.
-   **query** - Query string 또는 URL 매개변수.
-   **params** - Path 매개변수.
-   **header** - 요청의 헤더.
-   **cookie** - 요청의 cookie
-   **response** - 핸들러에서 반환된 값

기본적으로 Elysia는 들어오는 문자열화된 JSON 메시지를 검증을 위해 Object로 파싱합니다.

## Configuration

Elysia 생성자를 설정하여 Web Socket 값을 설정할 수 있습니다.

```ts
import { Elysia } from 'elysia'

new Elysia({
    websocket: {
        idleTimeout: 30
    }
})
```

Elysia의 WebSocket 구현은 Bun의 WebSocket 구성을 확장하므로 자세한 내용은 [Bun's WebSocket documentation](https://bun.sh/docs/api/websockets)을 참조하세요.

다음은 [Bun WebSocket](https://bun.sh/docs/api/websockets#create-a-websocket-server)의 간략한 구성입니다

### perMessageDeflate

@default `false`

지원하는 클라이언트에 대해 압축을 활성화합니다.

기본적으로 압축은 비활성화되어 있습니다.

### maxPayloadLength

메시지의 최대 크기입니다.

### idleTimeout

@default `120`

연결이 이 시간(초) 동안 메시지를 받지 않으면 닫힙니다.

### backpressureLimit

@default `16777216` (16MB)

단일 연결에 대해 버퍼링할 수 있는 최대 바이트 수입니다.

### closeOnBackpressureLimit

@default `false`

backpressure 제한에 도달하면 연결을 닫습니다.

## Methods

다음은 WebSocket 라우트에서 사용할 수 있는 새 메서드입니다

## ws

websocket 핸들러를 생성합니다

Example:

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .ws('/ws', {
        message(ws, message) {
            ws.send(message)
        }
    })
    .listen(3000)
```

Type:

```typescript
.ws(endpoint: path, options: Partial<WebSocketHandler<Context>>): this
```

* **endpoint** - websocket 핸들러로 노출할 경로
* **options** - WebSocket 핸들러 동작 사용자 정의

## WebSocketHandler

WebSocketHandler는 [config](#configuration)에서 config를 확장합니다.

다음은 `ws`에서 허용하는 config입니다.

## open

새 websocket 연결에 대한 Callback 함수입니다.

Type:

```typescript
open(ws: ServerWebSocket<{
    // 각 연결에 대한 uid
    id: string
    data: Context
}>): this
```

## message

들어오는 websocket 메시지에 대한 Callback 함수입니다.

Type:

```typescript
message(
    ws: ServerWebSocket<{
        // 각 연결에 대한 uid
        id: string
        data: Context
    }>,
    message: Message
): this
```

`Message` 타입은 `schema.message`를 기반으로 합니다. 기본값은 `string`입니다.

## close

websocket 연결을 닫기 위한 Callback 함수입니다.

Type:

```typescript
close(ws: ServerWebSocket<{
    // 각 연결에 대한 uid
    id: string
    data: Context
}>): this
```

## drain

서버가 더 많은 데이터를 받을 준비가 되었을 때의 Callback 함수입니다.

Type:

```typescript
drain(
    ws: ServerWebSocket<{
        // 각 연결에 대한 uid
        id: string
        data: Context
    }>,
    code: number,
    reason: string
): this
```

## parse

HTTP 연결을 WebSocket으로 업그레이드하기 전에 요청을 파싱하는 `Parse` middleware입니다.

## beforeHandle

HTTP 연결을 WebSocket으로 업그레이드하기 전에 실행되는 `Before Handle` middleware입니다.

검증에 이상적인 장소입니다.

## transform

검증 전에 실행되는 `Transform` middleware입니다.

## transformMessage

`transform`과 유사하지만 WebSocket 메시지 검증 전에 실행됩니다

## header

연결을 WebSocket으로 업그레이드하기 전에 추가할 추가 헤더입니다.
