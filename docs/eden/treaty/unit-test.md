---
title: Eden Treaty Unit Test - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty Unit Test - ElysiaJS

    - - meta
      - name: 'og:description'
        content: Eden Treaty는 Elysia 서버의 객체 스타일 표현으로, 종단 간 타입 안전성과 크게 개선된 개발자 경험을 제공합니다. Eden을 사용하면 코드 생성 없이 Elysia 서버에서 API를 완전히 타입 안전하게 가져올 수 있습니다.

    - - meta
      - name: 'og:description'
        content: Eden Treaty는 Elysia 서버의 객체 스타일 표현으로, 종단 간 타입 안전성과 크게 개선된 개발자 경험을 제공합니다. Eden을 사용하면 코드 생성 없이 Elysia 서버에서 API를 완전히 타입 안전하게 가져올 수 있습니다.
---

# Unit Test
[Eden Treaty config](/eden/treaty/config.html#urlorinstance)와 [Unit Test](/patterns/unit-test)에 따르면, Eden Treaty에 Elysia 인스턴스를 직접 전달하여 네트워크 요청을 보내지 않고 Elysia 서버와 직접 상호 작용할 수 있습니다.

이 패턴을 사용하여 종단 간 타입 안전성과 타입 수준 테스트를 한 번에 갖춘 단위 테스트를 생성할 수 있습니다.

```typescript twoslash
// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia().get('/hello', 'hi')
const api = treaty(app)

describe('Elysia', () => {
    it('returns a response', async () => {
        const { data } = await api.hello.get()

        expect(data).toBe('hi')
              // ^?

    })
})
```

## 타입 안전성 테스트
타입 안전성 테스트를 수행하려면 테스트 폴더에서 **tsc**를 실행하면 됩니다.

```bash
tsc --noEmit test/**/*.ts
```

이는 특히 마이그레이션 중에 클라이언트와 서버 모두에 대한 타입 무결성을 보장하는 데 유용합니다.
