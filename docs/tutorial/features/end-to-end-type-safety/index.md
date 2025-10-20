---
title: End-to-End Type Safety - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: End-to-End Type Safety - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Elysia provides an end-to-end type safety between backend and frontend without code generation similar to tRPC, using Eden.

    - - meta
      - property: 'og:description'
        content: Elysia provides an end-to-end type safety between backend and frontend without code generation similar to tRPC, using Eden.
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

# End-to-End Type Safety

Elysia는 <DocLink href="/eden/overview">Eden</DocLink>을 사용하여 tRPC와 유사하게 **코드 생성 없이** 백엔드와 프론트엔드 간의 완전한 타입 안전성을 제공합니다.

```typescript
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

// Backend
export const app = new Elysia()
	.get('/', 'Hello Elysia!')
	.listen(3000)

// Frontend
const client = treaty<typeof app>('localhost:3000')

const { data, error } = await client.get()

console.log(data) // Hello World
```

이는 Elysia 인스턴스에서 타입을 추론하고, 타입 힌트를 사용하여 클라이언트에 타입 안전성을 제공하는 방식으로 작동합니다.

자세한 내용은 <DocLink href="/eden/treaty/overview">Eden Treaty</DocLink>를 참조하세요.

## 과제

미리보기에서 <Code size="18" class="inline -translate-y-0.5" /> 아이콘을 탭하여 요청이 어떻게 로깅되는지 확인해 보세요.

</Editor>
