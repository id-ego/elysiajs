---
title: Eden 설치 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Eden 설치 - ElysiaJS

  - - meta
    - name: 'description'
      content: '"bun add elysia @elysiajs/eden"을 사용하여 프론트엔드에 Eden을 설치한 다음, Elysia 서버 타입을 내보내고 Eden Treaty 또는 Eden Fetch를 사용하세요.'

  - - meta
    - name: 'og:description'
      content: '"bun add elysia @elysiajs/eden"을 사용하여 프론트엔드에 Eden을 설치한 다음, Elysia 서버 타입을 내보내고 Eden Treaty 또는 Eden Fetch를 사용하세요.'
---

# Eden 설치
프론트엔드에 Eden을 설치하는 것부터 시작하세요:
```bash
bun add @elysiajs/eden
bun add -d elysia
```

::: tip
Eden은 유틸리티 타입을 추론하기 위해 Elysia가 필요합니다.

서버의 버전과 일치하는 Elysia를 설치해야 합니다.
:::

먼저 기존 Elysia 서버 타입을 내보냅니다:
```typescript
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', () => 'Hi Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            id: t.Number(),
            name: t.String()
        })
    })
    .listen(3000)

export type App = typeof app // [!code ++]
```

그런 다음 클라이언트 측에서 Elysia API를 사용합니다:
```typescript twoslash
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', 'Hi Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            id: t.Number(),
            name: t.String()
        })
    })
    .listen(3000)

export type App = typeof app // [!code ++]

// @filename: index.ts
// ---cut---
// client.ts
import { treaty } from '@elysiajs/eden'
import type { App } from './server' // [!code ++]

const client = treaty<App>('localhost:3000') // [!code ++]

// 응답: Hi Elysia
const { data: index } = await client.get()

// 응답: 1895
const { data: id } = await client.id({ id: 1895 }).get()

// 응답: { id: 1895, name: 'Skadi' }
const { data: nendoroid } = await client.mirror.post({
    id: 1895,
    name: 'Skadi'
})

// @noErrors
client.
//     ^|
```

## 주의사항
때때로 Eden이 Elysia에서 타입을 올바르게 추론하지 못할 수 있습니다. 다음은 Eden 타입 추론을 수정하는 가장 일반적인 해결 방법입니다.

### 타입 엄격 모드
**tsconfig.json**에서 엄격 모드를 활성화해야 합니다
```json
{
  "compilerOptions": {
    "strict": true // [!code ++]
  }
}
```

### 일치하지 않는 Elysia 버전
Eden은 Elysia 인스턴스를 가져오고 타입을 올바르게 추론하기 위해 Elysia 클래스에 의존합니다.

클라이언트와 서버 모두 일치하는 Elysia 버전을 가지고 있는지 확인하세요.

[`npm why`](https://docs.npmjs.com/cli/v10/commands/npm-explain) 명령으로 확인할 수 있습니다:

```bash
npm why elysia
```

출력에는 최상위 수준의 elysia 버전만 포함되어야 합니다:

```
elysia@1.1.12
node_modules/elysia
  elysia@"1.1.25" from the root project
  peer elysia@">= 1.1.0" from @elysiajs/html@1.1.0
  node_modules/@elysiajs/html
    dev @elysiajs/html@"1.1.1" from the root project
  peer elysia@">= 1.1.0" from @elysiajs/opentelemetry@1.1.2
  node_modules/@elysiajs/opentelemetry
    dev @elysiajs/opentelemetry@"1.1.7" from the root project
  peer elysia@">= 1.1.0" from @elysiajs/swagger@1.1.0
  node_modules/@elysiajs/swagger
    dev @elysiajs/swagger@"1.1.6" from the root project
  peer elysia@">= 1.1.0" from @elysiajs/eden@1.1.2
  node_modules/@elysiajs/eden
    dev @elysiajs/eden@"1.1.3" from the root project
```


### TypeScript 버전
Elysia는 가장 효율적인 방식으로 타입을 추론하기 위해 TypeScript의 최신 기능과 문법을 사용합니다. Const Generic 및 Template Literal과 같은 기능이 많이 사용됩니다.

클라이언트의 **최소 TypeScript 버전이 >= 5.0**인지 확인하세요

### 메서드 체이닝
Eden이 작동하려면 Elysia가 **메서드 체이닝**을 사용해야 합니다

Elysia의 타입 시스템은 복잡하며, 메서드는 일반적으로 인스턴스에 새로운 타입을 도입합니다.

메서드 체이닝을 사용하면 새로운 타입 참조를 저장하는 데 도움이 됩니다.

예를 들어:
```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('build', 1)
    // Store는 엄격하게 타입이 지정됩니다 // [!code ++]
    .get('/', ({ store: { build } }) => build)
    .listen(3000)
```
이렇게 하면 **state**는 새로운 **ElysiaInstance** 타입을 반환하고, **build**를 store에 도입하여 현재 것을 대체합니다.

메서드 체이닝이 없으면 Elysia는 도입될 때 새로운 타입을 저장하지 않아 타입 추론이 되지 않습니다.
```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const app = new Elysia()

app.state('build', 1)

app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

### 타입 정의
`Bun.file` 또는 유사한 API와 같은 Bun 전용 기능을 사용하고 핸들러에서 반환하는 경우, 클라이언트에도 Bun 타입 정의를 설치해야 할 수 있습니다.

```bash
bun add -d @types/bun
```

### 경로 별칭 (모노레포)
모노레포에서 경로 별칭을 사용하는 경우, 프론트엔드가 백엔드와 동일하게 경로를 해석할 수 있는지 확인하세요.

::: tip
모노레포에서 경로 별칭을 설정하는 것은 약간 까다로울 수 있습니다. 예제 템플릿 [Kozeki Template](https://github.com/SaltyAom/kozeki-template)을 포크하여 필요에 맞게 수정할 수 있습니다.
:::

예를 들어, **tsconfig.json**에서 백엔드에 대해 다음과 같은 경로 별칭이 있는 경우:
```json
{
  "compilerOptions": {
  	"baseUrl": ".",
	"paths": {
	  "@/*": ["./src/*"]
	}
  }
}
```

그리고 백엔드 코드가 다음과 같은 경우:
```typescript
import { Elysia } from 'elysia'
import { a, b } from '@/controllers'

const app = new Elysia()
	.use(a)
	.use(b)
	.listen(3000)

export type app = typeof app
```

프론트엔드 코드가 동일한 경로 별칭을 해석할 수 있는지 **확인해야** 합니다. 그렇지 않으면 타입 추론이 any로 해석됩니다.

```typescript
import { treaty } from '@elysiajs/eden'
import type { app } from '@/index'

const client = treaty<app>('localhost:3000')

// 프론트엔드와 백엔드 모두 동일한 모듈을 해석할 수 있어야 하며, `any`가 아니어야 합니다
import { a, b } from '@/controllers' // [!code ++]
```

이를 수정하려면 프론트엔드와 백엔드 모두에서 경로 별칭이 동일한 파일로 해석되도록 해야 합니다.

따라서 **tsconfig.json**의 경로 별칭을 다음과 같이 변경해야 합니다:
```json
{
  "compilerOptions": {
  	"baseUrl": ".",
	"paths": {
	  "@/*": ["../apps/backend/src/*"]
	}
  }
}
```

올바르게 구성되면 프론트엔드와 백엔드 모두에서 동일한 모듈을 해석할 수 있어야 합니다.
```typescript
// 프론트엔드와 백엔드 모두 동일한 모듈을 해석할 수 있어야 하며, `any`가 아니어야 합니다
import { a, b } from '@/controllers'
```

#### 네임스페이스
모노레포의 각 모듈에 대해 **네임스페이스** 접두사를 추가하여 발생할 수 있는 혼동과 충돌을 피하는 것이 좋습니다.

```json
{
  "compilerOptions": {
  	"baseUrl": ".",
	"paths": {
	  "@frontend/*": ["./apps/frontend/src/*"],
	  "@backend/*": ["./apps/backend/src/*"]
	}
  }
}
```

그런 다음 다음과 같이 모듈을 가져올 수 있습니다:
```typescript
// 프론트엔드와 백엔드 모두에서 작동해야 하며 `any`를 반환하지 않아야 합니다
import { a, b } from '@backend/controllers'
```

레포의 루트를 `baseUrl`로 정의하는 **단일 tsconfig.json**을 만들고, 모듈 위치에 따라 경로를 제공하고, 경로 별칭이 있는 루트 **tsconfig.json**을 상속하는 각 모듈에 대한 **tsconfig.json**을 만드는 것이 좋습니다.

이 [경로 별칭 예제 레포](https://github.com/SaltyAom/elysia-monorepo-path-alias) 또는 [Kozeki Template](https://github.com/SaltyAom/kozeki-template)에서 작동하는 예제를 찾을 수 있습니다.
