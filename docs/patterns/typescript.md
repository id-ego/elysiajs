---
title: TypeScript - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: TypeScript - ElysiaJS

    - - meta
      - name: 'description'
        content: TypeScript has first-class support in Elysia. Learn how to leverage TypeScript's powerful type system with Elysia's intuitive API, schema-based validation and debugging type inference performance issue.

    - - meta
      - property: 'og:description'
        content: TypeScript has first-class support in Elysia. Learn how to leverage TypeScript's powerful type system with Elysia's intuitive API, schema-based validation and debugging type inference performance issue.
---

<script setup>
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'
import Tab from '../components/fern/tab.vue'
</script>

# TypeScript

Elysia는 기본적으로 TypeScript를 최우선으로 지원합니다.

대부분의 경우, TypeScript 어노테이션을 수동으로 추가할 필요가 없습니다.

## 추론
Elysia는 제공한 스키마를 기반으로 요청과 응답의 타입을 추론합니다.

```ts twoslash
import { Elysia, t } from 'elysia'
import { z } from 'zod'

const app = new Elysia()
  	.post('/user/:id', ({ body }) => body, {
  	//                     ^?
	  	body: t.Object({
			id: t.String()
		}),
		query: z.object({
			name: z.string()
		})
   	})
```

Elysia는 TypeBox와 같은 스키마 및 [여러분이 선호하는 검증 라이브러리](/essential/validation#standard-schema)로부터 타입을 자동으로 추론할 수 있습니다:
- Zod
- Valibot
- ArkType
- Effect Schema
- Yup
- Joi

### 스키마를 타입으로 변환

Elysia가 지원하는 모든 스키마 라이브러리는 TypeScript 타입으로 변환될 수 있습니다.

<Tab
	id="quickstart"
	:names="['TypeBox', 'Zod', 'Valibot', 'ArkType']"
	:tabs="['typebox', 'zod', 'valibot', 'arktype']"
	noTitle
>

<template v-slot:typebox>

```ts twoslash
import { Elysia, t } from 'elysia'

const User = t.Object({
  	id: t.String(),
  	name: t.String()
})

type User = typeof User['static']
//    ^?
```

</template>

<template v-slot:zod>

```ts twoslash
import { z } from 'zod'

const User = z.object({
  	id: z.string(),
  	name: z.string()
})

type User = z.infer<typeof User>
//    ^?
```

</template>

<template v-slot:valibot>

```ts twoslash
import * as v from 'valibot'

const User = v.object({
  	id: v.string(),
  	name: v.string()
})

type User = v.InferOutput<typeof User>
//    ^?
```

</template>

<template v-slot:arktype>

```ts twoslash
import { type } from 'arktype'

const User = type({
  	id: 'string',
  	name: 'string'
})

type User = typeof User.infer
//    ^?
```

</template>

</Tab>

<br>
<br>

## 타입 성능

Elysia는 타입 추론 성능을 염두에 두고 설계되었습니다.

모든 릴리스 전에 로컬 벤치마크를 실행하여 타입 추론이 항상 빠르고 부드러우며, IDE에서 "타입 인스턴스화가 지나치게 깊고 무한할 수 있습니다" 오류를 발생시키지 않도록 보장합니다.

Elysia를 작성하는 대부분의 경우, 타입 성능 문제를 겪지 않을 것입니다.

그러나 문제가 발생하면 다음은 타입 추론이 느려지는 원인을 파악하는 방법입니다:

1. 프로젝트 루트로 이동하여 다음을 실행합니다
```
tsc --generateTrace trace --noEmit --incremental false
```

이렇게 하면 프로젝트 루트에 `trace` 폴더가 생성됩니다.

2. [Perfetto UI](https://ui.perfetto.dev)를 열고 `trace/trace.json` 파일을 드래그합니다

![Perfetto](/assets/perfetto.webp)

> 다음과 같은 플레임 그래프가 표시됩니다

그런 다음 평가하는 데 오래 걸리는 청크를 찾아 클릭하면 추론에 걸린 시간, 파일 및 줄 번호가 표시됩니다.

이를 통해 타입 추론의 병목 지점을 식별할 수 있습니다.

### Eden

[Eden](/eden/overview)을 사용할 때 느린 타입 추론 문제가 발생하면 Elysia의 하위 앱을 사용하여 타입 추론을 격리할 수 있습니다.

```ts [backend/src/index.ts]
import { Elysia } from 'elysia'
import { plugin1, plugin2, plugin3 } from from './plugin'

const app = new Elysia()
	.use([plugin1, plugin2, plugin3])
  	.listen(3000)

export type app = typeof app

// 하위 앱 내보내기
export type subApp = typeof plugin1 // [!code ++]
```

그리고 프론트엔드에서 전체 앱 대신 하위 앱을 가져올 수 있습니다.

```ts [frontend/src/index.ts]
import { treaty } from '@elysiajs/eden'
import type { subApp } from 'backend/src'

const api = treaty<subApp>('localhost:3000') // [!code ++]
```

이렇게 하면 전체 앱을 평가할 필요가 없으므로 타입 추론이 빨라집니다.

Eden에 대해 자세히 알아보려면 [Eden Treaty](/eden/overview)를 참조하세요.
