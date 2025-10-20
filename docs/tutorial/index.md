---
title: Introduction - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Introduction - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Elysia offers an interactive tutorial experience to learn Elysia with IDE, playground, and more. Get started with Elysia now!

    - - meta
      - property: 'og:description'
        content: Elysia offers an interactive tutorial experience to learn Elysia with IDE, playground, and more. Get started with Elysia now!
---

<script setup lang="ts">
import Editor from '../components/xiao/playground/playground.vue'

import { Bookmark } from 'lucide-vue-next'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Elysia에 오신 것을 환영합니다

여기 오신 것을 환영합니다! 이 플레이그라운드는 Elysia를 대화형으로 시작하는 데 도움이 됩니다.

전통적인 백엔드 프레임워크와 달리 **Elysia는 브라우저에서도 실행될 수 있습니다**! 모든 기능을 지원하지는 않지만 학습과 실험에 완벽한 환경입니다.

왼쪽 사이드바의 <Bookmark class="inline" :size="18" stroke-width="2" />를 클릭하여 API 문서를 확인할 수 있습니다.

## Elysia란 무엇인가

Elysia는 사람을 위한 인체공학적 프레임워크입니다.

진지하게 말하자면, Elysia는 개발자 경험과 성능에 중점을 둔 백엔드 TypeScript 프레임워크입니다.

Elysia가 다른 프레임워크와 다른 점은:

1. Golang에 필적하는 뛰어난 성능.
2. **타입 건전성**을 갖춘 놀라운 TypeScript 지원.
3. 처음부터 OpenAPI를 중심으로 구축됨.
4. tRPC와 같은 엔드투엔드 타입 안전성 제공.
5. Web Standard 사용으로 Cloudflare Workers, Deno, Bun, Node.js 등 어디서나 코드 실행 가능.
6. 물론, **사람을 최우선으로** 설계됨.

Elysia에는 몇 가지 중요한 개념이 있지만, 한 번 익숙해지면 많은 사람들이 매우 즐겁고 직관적으로 작업할 수 있다고 생각합니다.

## 이 플레이그라운드 사용 방법

플레이그라운드는 3개의 섹션으로 나뉩니다:
1. 왼쪽의 문서와 과제 (지금 읽고 있는 부분).
2. 오른쪽 상단의 코드 에디터
3. 오른쪽 하단의 미리보기, 출력 및 콘솔

## 과제

첫 번째 과제로, 서버가 `"Hello World!"` 대신 `"Hello Elysia!"`로 응답하도록 코드를 수정해 봅시다.

환경에 익숙해지기 위해 코드 에디터와 미리보기 섹션을 둘러보세요.

<template #answer>

`.get` 메서드 내부의 내용을 `'Hello World!'`에서 `'Hello Elysia!'`로 변경하여 응답을 변경할 수 있습니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', 'Hello World!') // [!code --]
	.get('/', 'Hello Elysia!') // [!code ++]
	.listen(3000)
```

이렇게 하면 Elysia가 `/`에 접근할 때 `"Hello Elysia!"`로 응답하게 됩니다.

</template>

</Editor>
