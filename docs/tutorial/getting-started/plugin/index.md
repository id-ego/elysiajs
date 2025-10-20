---
title: Plugin - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Plugin - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Learn how to use plugins in Elysia to enhance your web applications with reusable components and features.

    - - meta
      - property: 'og:description'
        content: Learn how to use plugins in Elysia to enhance your web applications with reusable components and features.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Plugin

모든 Elysia 인스턴스는 `use` 메서드를 통해 다른 인스턴스와 플러그 앤 플레이할 수 있습니다.

```typescript
import { Elysia } from 'elysia'

const user = new Elysia()
	.get('/profile', 'User Profile')
	.get('/settings', 'User Settings')

new Elysia()
	.use(user) // [!code ++]
	.get('/', 'Home')
	.listen(3000)
```

적용되면 `user` 인스턴스의 모든 route가 `app` 인스턴스에서 사용 가능합니다.

### Plugin Config
인수를 받아 Elysia 인스턴스를 반환하는 플러그인을 만들어 더 동적인 플러그인을 만들 수도 있습니다.

```typescript
import { Elysia } from 'elysia'

const user = ({ log = false }) => new Elysia() // [!code ++]
	.onBeforeHandle(({ request }) => {
		if (log) console.log(request)
	})
	.get('/profile', 'User Profile')
	.get('/settings', 'User Settings')

new Elysia()
	.use(user({ log: true })) // [!code ++]
	.get('/', 'Home')
	.listen(3000)
```

## 과제

`user` 인스턴스를 `app` 인스턴스에 적용해 봅시다.

<template #answer>

위의 예제와 유사하게, `use` 메서드를 사용하여 `user` 인스턴스를 `app` 인스턴스에 연결할 수 있습니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/profile', 'User Profile')
	.get('/settings', 'User Settings')

const app = new Elysia()
	.use(user) // [!code ++]
	.get('/', 'Home')
	.listen(3000)
```

</template>

</Editor>
