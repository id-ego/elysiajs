---
title: Cookie - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Cookie - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Learn how to manage cookies in Elysia, including setting, retrieving, and securing cookies for your web applications.

    - - meta
      - property: 'og:description'
        content: Learn how to manage cookies in Elysia, including setting, retrieving, and securing cookies for your web applications.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Cookie

컨텍스트의 <DocLink href="/patterns/cookie">cookie</DocLink>를 사용하여 쿠키와 상호작용할 수 있습니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ cookie: { visit } }) => {
		const total = +visit.value ?? 0
		visit.value++

		return `You have visited ${visit.value} times`
	})
	.listen(3000)
```

Cookie는 반응형 객체입니다. 수정되면 응답에 반영됩니다.

## Value

타입 어노테이션이 제공되면 Elysia는 해당 값으로 강제 변환을 시도합니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ cookie: { visit } }) => {
		visit.value ??= 0
		visit.value.total++

		return `You have visited ${visit.value.total} times`
	}, {
		cookie: t.Object({
			visit: t.Optional(
				t.Object({
					total: t.Number()
				})
			)
		})
	})
	.listen(3000)
```

<DocLink href="/patterns/cookie.html#cookie-schema">cookie schema</DocLink>를 사용하여 쿠키를 검증하고 파싱할 수 있습니다.

## Attribute
각 속성 이름을 통해 쿠키 속성을 가져오거나 설정할 수 있습니다.

그렇지 않으면 `.set()`을 사용하여 속성을 일괄 설정합니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ cookie: { visit } }) => {
		visit.value ??= 0
		visit.value++

		visit.httpOnly = true
		visit.path = '/'

		visit.set({
			sameSite: 'lax',
			secure: true,
			maxAge: 60 * 60 * 24 * 7
		})

		return `You have visited ${visit.value} times`
	})
	.listen(3000)
```

<DocLink href="/patterns/cookie.html#cookie-attribute">Cookie Attribute</DocLink>를 참조하세요.

## Remove

`.remove()` 메서드를 호출하여 쿠키를 제거할 수 있습니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ cookie: { visit } }) => {
		visit.remove()

		return `Cookie removed`
	})
	.listen(3000)
```

## Cookie Signature

Elysia는 다음을 통해 쿠키에 서명하여 변조를 방지할 수 있습니다:
1. Elysia 생성자에 쿠키 시크릿을 제공합니다.
2. 각 쿠키에 대한 시크릿을 제공하기 위해 `t.Cookie`를 사용합니다.

```typescript
import { Elysia } from 'elysia'

new Elysia({
	cookie: {
		secret: 'Fischl von Luftschloss Narfidort',
	}
})
	.get('/', ({ cookie: { visit } }) => {
		visit.value ??= 0
		visit.value++

		return `You have visited ${visit.value} times`
	}, {
		cookie: t.Cookie({
			visit: t.Optional(t.Number())
        }, {
            secrets: 'Fischl von Luftschloss Narfidort',
            sign: ['visit']
        })
	})
	.listen(3000)
```

여러 시크릿이 제공되면 Elysia는 첫 번째 시크릿을 사용하여 쿠키에 서명하고 나머지로 검증을 시도합니다.

<DocLink href="/patterns/cookie.html#cookie-signature">Cookie Signature</DocLink>, <DocLink href="/patterns/cookie.html#cookie-rotation">Cookie Rotation</DocLink>을 참조하세요.

## 과제
사이트를 방문한 횟수를 추적하는 간단한 카운터를 만들어 봅시다.

<template #answer>

1. `visit.value`를 수정하여 쿠키 값을 업데이트할 수 있습니다.
2. `visit.httpOnly = true`를 설정하여 **HTTP only** 속성을 설정할 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/', ({ cookie: { visit } }) => {
		visit.value ??= 0
		visit.value++

		visit.httpOnly = true

		return `You have visited ${visit.value} times`
	}, {
		cookie: t.Object({
			visit: t.Optional(
				t.Number()
			)
		})
	})
	.listen(3000)
```

</template>

</Editor>
