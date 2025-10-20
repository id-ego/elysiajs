---
title: Encapsulation - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Encapsulation - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Elysia hooks are encapsulated to its own instance only. If you create a new instance, it will not share hook with other instances.

    - - meta
      - property: 'og:description'
        content: Elysia hooks are encapsulated to its own instance only. If you create a new instance, it will not share hook with other instances.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'

const profile1 = new Elysia()
	.onBeforeHandle(
		({ query: { name }, status }) => {
			if(!name)
				return status(401)
		}
	)
	.get('/profile', () => 'Hi!')

const demo1 = new Elysia()
	.use(profile1)
	.patch('/rename', () => 'Ok! XD')

const profile2 = new Elysia()
	.onBeforeHandle(
		{ as: 'global' },
		({ query: { name }, status }) => {
			if(!name)
				return status(401)
		}
	)
	.get('/profile', ({ status }) => status(401))

const demo2 = new Elysia()
	.use(profile2)
	.patch('/rename', () => 'Ok! XD')

</script>

<Editor :code="code" :testcases="testcases">

# Encapsulation

Elysia hook은 자신의 인스턴스에만 **캡슐화**됩니다.

새로운 인스턴스를 생성하면 다른 인스턴스와 hook을 공유하지 않습니다.

```ts
import { Elysia } from 'elysia'

const profile = new Elysia()
	.onBeforeHandle(
		({ query: { name }, status }) => {
			if(!name)
				return status(401)
		}
	)
	.get('/profile', () => 'Hi!')

new Elysia()
	.use(profile)
	.patch('/rename', () => 'Ok! XD')
	.listen(3000)
```

<Playground :elysia="demo1" />

> URL 바에서 경로를 **/rename**으로 변경하고 결과를 확인해 보세요

<br>

**Elysia는 명시적으로 지정하지 않는 한 lifecycle을 격리**합니다.

이는 JavaScript의 **export**와 유사하며, 모듈 외부에서 사용할 수 있도록 함수를 export해야 합니다.

lifecycle을 다른 인스턴스로 **"export"**하려면 scope를 지정해야 합니다.

### Scope

3가지 scope가 있습니다:
1. **local** (기본값) - 현재 인스턴스와 하위 항목에만 적용
2. **scoped** - 부모, 현재 인스턴스 및 하위 항목에 적용
3. **global** - 플러그인을 적용하는 모든 인스턴스에 적용 (모든 부모, 현재 및 하위 항목)

우리의 경우, 직접 부모인 `app`에 로그인 확인을 적용하고 싶으므로 **scoped** 또는 **global**을 사용할 수 있습니다.

```ts
import { Elysia } from 'elysia'

const profile = new Elysia()
	.onBeforeHandle(
		{ as: 'scoped' }, // [!code ++]
		({ cookie }) => {
			throwIfNotSignIn(cookie)
		}
	)
	.get('/profile', () => 'Hi there!')

const app = new Elysia()
	.use(profile)
	// This has sign in check
	.patch('/rename', ({ body }) => updateProfile(body))
```

<Playground :elysia="demo2" />

lifecycle을 **"scoped"**로 캐스팅하면 lifecycle을 **부모 인스턴스**로 export합니다.
**"global"**은 플러그인이 있는 **모든 인스턴스**로 lifecycle을 export합니다.

자세한 내용은 <DocLink href="/essential/plugin.html#scope-level">scope</DocLink>를 참조하세요.

## Guard
lifecycle과 마찬가지로 **schema**도 자체 인스턴스에 캡슐화됩니다.

lifecycle과 유사하게 guard scope를 지정할 수 있습니다.

```typescript
import { Elysia } from 'elysia'

const user = new Elysia()
	.guard({
		as: 'scoped', // [!code ++]
		query: t.Object({
			age: t.Number(),
			name: t.Optional(t.String())
		}),
		beforeHandle({ query: { age }, status }) {
			if(age < 18) return status(403)
		}
	})
	.get('/profile', () => 'Hi!')
	.get('/settings', () => 'Settings')
```

모든 hook이 선언 **이후**의 모든 route에 영향을 미친다는 점을 유념하는 것이 매우 중요합니다.

자세한 내용은 <DocLink href="/essential/plugin.html#scope">Scope</DocLink>를 참조하세요.

## 과제

`nameCheck`와 `ageCheck`에 대한 scope를 정의하여 앱이 작동하도록 해봅시다.

<template #answer>

다음과 같이 scope를 수정할 수 있습니다:
1. `nameCheck` scope를 **scoped**로 수정
2. `ageCheck` scope를 **global**로 수정

```typescript
import { Elysia, t } from 'elysia'

const nameCheck = new Elysia()
	.onBeforeHandle(
		{ as: 'scoped' }, // [!code ++]
		({ query: { name }, status }) => {
			if(!name) return status(401)
		}
	)

const ageCheck = new Elysia()
	.guard({
		as: 'global', // [!code ++]
		query: t.Object({
			age: t.Number(),
			name: t.Optional(t.String())
		}),
		beforeHandle({ query: { age }, status }) {
			if(age < 18) return status(403)
		}
	})

const name = new Elysia()
	.use(nameCheck)
	.patch('/rename', () => 'Ok! XD')

const profile = new Elysia()
	.use(ageCheck)
	.use(name)
	.get('/profile', () => 'Hi!')

new Elysia()
	.use(profile)
	.listen(3000)
```

</template>

</Editor>
