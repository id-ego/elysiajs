---
title: Mount - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Mount - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Elysia provides a Elysia.mount to interlop between backend frameworks that is built on Web Standard like Hono, H3, etc.

    - - meta
      - property: 'og:description'
        content: Elysia provides a Elysia.mount to interlop between backend frameworks that is built on Web Standard like Hono, H3, etc.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Mount

Elysia는 Hono, H3 등과 같이 Web Standard로 구축된 백엔드 프레임워크 간의 상호 운용을 위한 <DocLink href="/patterns/mount">Elysia.mount</DocLink>를 제공합니다.

```typescript
import { Elysia, t } from 'elysia'
import { Hono } from 'hono'

const hono = new Hono()
	.get('/', (c) => c.text('Hello from Hono')

new Elysia()
	.get('/', 'Hello from Elysia')
	.mount('/hono', hono.fetch)
	.listen(3000)
```

이를 통해 애플리케이션을 점진적으로 Elysia로 마이그레이션하거나 단일 애플리케이션에서 여러 프레임워크를 사용할 수 있습니다.

## 과제

미리보기를 사용하여 **GET '/openapi'**를 호출하고 API 문서가 어떻게 보이는지 확인해 보세요.

이 API 문서는 여러분의 코드에서 반영됩니다.

코드를 수정하고 문서가 어떻게 변경되는지 확인해 보세요!

</Editor>
