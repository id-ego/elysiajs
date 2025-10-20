---
title: Eden Treaty Web Socket - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty Web Socket - ElysiaJS

    - - meta
      - name: 'og:description'
        content: Eden Treaty는 Elysia 서버의 객체 스타일 표현으로, 종단 간 타입 안전성과 크게 개선된 개발자 경험을 제공합니다. Eden을 사용하면 코드 생성 없이 Elysia 서버에서 API를 완전히 타입 안전하게 가져올 수 있습니다.

    - - meta
      - name: 'og:description'
        content: Eden Treaty는 Elysia 서버의 객체 스타일 표현으로, 종단 간 타입 안전성과 크게 개선된 개발자 경험을 제공합니다. Eden을 사용하면 코드 생성 없이 Elysia 서버에서 API를 완전히 타입 안전하게 가져올 수 있습니다.
---

# WebSocket
Eden Treaty는 `subscribe` 메서드를 사용하여 WebSocket을 지원합니다.

```typescript twoslash
import { Elysia, t } from "elysia";
import { treaty } from "@elysiajs/eden";

const app = new Elysia()
  .ws("/chat", {
    body: t.String(),
    response: t.String(),
    message(ws, message) {
      ws.send(message);
    },
  })
  .listen(3000);

const api = treaty<typeof app>("localhost:3000");

const chat = api.chat.subscribe();

chat.subscribe((message) => {
  console.log("got", message);
});

chat.on("open", () => {
  chat.send("hello from client");
});
```

**.subscribe**는 `get`과 `head`와 동일한 매개변수를 받습니다.

## Response
**Eden.subscribe**는 [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket)을 확장하는 **EdenWS**를 반환하여 동일한 문법을 제공합니다.

더 많은 제어가 필요한 경우, **EdenWebSocket.raw**에 액세스하여 네이티브 WebSocket API와 상호 작용할 수 있습니다.
