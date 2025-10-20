---
title: Unit Test - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Unit Test - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Elysia provides a Elysia.fetch function to easily test your application.

    - - meta
      - property: 'og:description'
        content: Elysia provides a Elysia.fetch function to easily test your application.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import { Code } from 'lucide-vue-next'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Unit Test

Elysia는 애플리케이션을 쉽게 테스트할 수 있는 **Elysia.fetch** 함수를 제공합니다.

**Elysia.fetch**는 Web Standard Request를 받아서 <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" target="_blank">브라우저의 fetch API</a>와 유사하게 Response를 반환합니다.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', 'Hello World')

app.fetch(new Request('http://localhost/'))
	.then((res) => res.text())
	.then(console.log)
```

이는 **실제 요청**처럼 실행됩니다 (시뮬레이션이 아닙니다).

### Test
이를 통해 서버를 실행하지 않고도 애플리케이션을 쉽게 테스트할 수 있습니다.

::: code-group

```typescript [Bun Test]
import { describe, it, expect } from 'bun:test'

import { Elysia } from 'elysia'

describe('Elysia', () => {
	it('should return Hello World', async () => {
		const app = new Elysia().get('/', 'Hello World')

		const text = await app.fetch(new Request('http://localhost/'))
			.then(res => res.text())

		expect(text).toBe('Hello World')
	})
})
```

```typescript [Vitest]
import { describe, it, expect } from 'vitest'

import { Elysia } from 'elysia'

describe('Elysia', () => {
	it('should return Hello World', async () => {
		const app = new Elysia().get('/', 'Hello World')

		const text = await app.fetch(new Request('http://localhost/'))
			.then(res => res.text())

		expect(text).toBe('Hello World')
	})
})
```

```typescript [Jest]
import { describe, it, test } from '@jest/globals'

import { Elysia } from 'elysia'

describe('Elysia', () => {
	test('should return Hello World', async () => {
		const app = new Elysia().get('/', 'Hello World')

		const text = await app.fetch(new Request('http://localhost/'))
			.then(res => res.text())

		expect(text).toBe('Hello World')
	})
})
```

:::

자세한 내용은 <DocLink href="/patterns/unit-test.html">Unit Test</DocLink>를 참조하세요.

## 과제

미리보기에서 <Code size="18" class="inline -translate-y-0.5" /> 아이콘을 탭하여 요청이 어떻게 로깅되는지 확인해 보세요.

</Editor>
