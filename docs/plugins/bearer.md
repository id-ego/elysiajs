---
title: Bearer Plugin - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Bearer Plugin - ElysiaJS

  - - meta
    - name: 'description'
      content: Plugin for Elysia for retrieving Bearer token as specified in RFC6750. Start by installing the plugin with "bun add @elysiajs/bearer".

  - - meta
    - name: 'og:description'
      content: Plugin for Elysia for retrieving Bearer token as specified in RFC6750. Start by installing the plugin with "bun add @elysiajs/bearer".
---

# Bearer Plugin
RFC6750에 명시된 Bearer 토큰을 검색하기 위한 [elysia](https://github.com/elysiajs/elysia) 플러그인입니다.

설치 방법:
```bash
bun add @elysiajs/bearer
```

사용 방법:
```typescript twoslash
import { Elysia } from 'elysia'
import { bearer } from '@elysiajs/bearer'

const app = new Elysia()
    .use(bearer())
    .get('/sign', ({ bearer }) => bearer, {
        beforeHandle({ bearer, set, status }) {
            if (!bearer) {
                set.headers[
                    'WWW-Authenticate'
                ] = `Bearer realm='sign', error="invalid_request"`

                return status(400, 'Unauthorized')
            }
        }
    })
    .listen(3000)
```

이 플러그인은 [RFC6750](https://www.rfc-editor.org/rfc/rfc6750#section-2)에 명시된 Bearer 토큰을 검색하는 데 사용됩니다.

이 플러그인은 서버의 인증 유효성 검증을 처리하지 않습니다. 대신, 개발자가 직접 유효성 검사 로직을 적용할 수 있도록 결정권을 남겨둡니다.
