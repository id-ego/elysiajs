---
title: Testing - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Testing - ElysiaJS

    - - meta
      - name: 'description'
        content: You can use `bun:test` to create a unit test with Elysia. Elysia instance has a `handle` method that accepts `Request` and will return a `Response`, the same as creating an HTTP request.

    - - meta
      - name: 'og:description'
        content: You can use `bun:test` to create a unit test with Elysia. Elysia instance has a `handle` method that accepts `Request` and will return a `Response`, the same as creating an HTTP request.
---

# Unit Test

WinterCG를 준수하므로 Request / Response 클래스를 사용하여 Elysia 서버를 테스트할 수 있습니다.

Elysia는 Web Standard [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)를 받아 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)를 반환하여 HTTP Request를 시뮬레이션하는 **Elysia.handle** 메서드를 제공합니다.

Bun에는 `bun:test` 모듈을 통해 Jest와 유사한 API를 제공하는 내장 [test runner](https://bun.sh/docs/cli/test)가 포함되어 있어 unit test 생성을 용이하게 합니다.

프로젝트 디렉토리의 루트에 다음 내용으로 **test/index.test.ts**를 생성하세요:

```typescript
// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'

describe('Elysia', () => {
    it('returns a response', async () => {
        const app = new Elysia().get('/', () => 'hi')

        const response = await app
            .handle(new Request('http://localhost/'))
            .then((res) => res.text())

        expect(response).toBe('hi')
    })
})
```

그런 다음 **bun test**를 실행하여 테스트를 수행할 수 있습니다

```bash
bun test
```

Elysia 서버에 대한 새 요청은 완전히 유효한 URL이어야 하며 URL의 일부가 **아니어야** 합니다.

요청은 다음과 같이 URL을 제공해야 합니다:

| URL                   | Valid |
| --------------------- | ----- |
| http://localhost/user | ✅    |
| /user                 | ❌    |

Jest와 같은 다른 테스팅 라이브러리를 사용하여 Elysia unit test를 만들 수도 있습니다.

## Eden Treaty test

다음과 같이 Eden Treaty를 사용하여 Elysia 서버에 대한 end-to-end 타입 안전 테스트를 만들 수 있습니다:

```typescript twoslash
// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia().get('/hello', 'hi')

const api = treaty(app)

describe('Elysia', () => {
    it('returns a response', async () => {
        const { data, error } = await api.hello.get()

        expect(data).toBe('hi')
              // ^?
    })
})
```

설정 및 자세한 내용은 [Eden Treaty Unit Test](/eden/treaty/unit-test)를 참조하세요.
