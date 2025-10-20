---
title: Eden Test - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Eden 단위 테스트 - ElysiaJS

  - - meta
    - name: 'description'
      content: Eden을 사용하면 종단 간 타입 안전성과 자동 완성을 제공하는 단위 테스트를 수행하고, 마이그레이션에서 타입 안전성을 추적할 수 있습니다

  - - meta
    - property: 'og:description'
      content: Eden을 사용하면 종단 간 타입 안전성과 자동 완성을 제공하는 단위 테스트를 수행하고, 마이그레이션에서 타입 안전성을 추적할 수 있습니다
---

# Eden Test
Eden을 사용하면 종단 간 타입 안전성과 자동 완성을 갖춘 통합 테스트를 생성할 수 있습니다.

## 설정
[Bun test](https://bun.sh/guides/test/watch-mode)를 사용하여 테스트를 생성할 수 있습니다.

프로젝트 디렉토리의 루트에 **test/index.test.ts**를 생성하고 다음을 작성합니다:

```typescript
// test/index.test.ts
import { describe, expect, it } from 'bun:test'

import { edenTreaty } from '@elysiajs/eden'

const app = new Elysia()
    .get('/', () => 'hi')
    .listen(3000)

const api = edenTreaty<typeof app>('http://localhost:3000')

describe('Elysia', () => {
    it('return a response', async () => {
        const { data } = await api.get()

        expect(data).toBe('hi')
    })
})
```

그런 다음 **bun test**를 실행하여 테스트를 수행할 수 있습니다

```bash
bun test
```

이를 통해 수동 fetch 대신 프로그래밍 방식으로 통합 테스트를 수행하면서 자동으로 타입 검사를 지원할 수 있습니다.
