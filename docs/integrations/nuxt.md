---
title: Nuxt와의 통합 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Nuxt와의 통합 - ElysiaJS

    - - meta
      - name: 'description'
        content: 커뮤니티 플러그인 'nuxt-elysia'를 사용하여 Nuxt API 라우트에서 Elysia를 실행하고 Eden Treaty가 자동으로 설정됩니다.

    - - meta
      - property: 'og:description'
        content: 커뮤니티 플러그인 'nuxt-elysia'를 사용하여 Nuxt API 라우트에서 Elysia를 실행하고 Eden Treaty가 자동으로 설정됩니다.
---

# Nuxt와의 통합

Nuxt용 커뮤니티 플러그인인 [nuxt-elysia](https://github.com/tkesgar/nuxt-elysia)를 사용하여 Nuxt API 라우트에서 Elysia를 Eden Treaty와 함께 설정할 수 있습니다.

1. 다음 명령으로 플러그인을 설치합니다:

```bash
bun add elysia @elysiajs/eden
bun add -d nuxt-elysia
```

2. Nuxt 구성에 `nuxt-elysia`를 추가합니다:

```ts
export default defineNuxtConfig({
    modules: [ // [!code ++]
        'nuxt-elysia' // [!code ++]
    ] // [!code ++]
})
```

3. 프로젝트 루트에 `api.ts`를 생성합니다:

```typescript [api.ts]
export default () => new Elysia() // [!code ++]
  .get('/hello', () => ({ message: 'Hello world!' })) // [!code ++]
```

4. Nuxt 앱에서 Eden Treaty를 사용합니다:

```vue
<template>
    <div>
        <p>{{ data.message }}</p>
    </div>
</template>
<script setup lang="ts">
const { $api } = useNuxtApp()

const { data } = await useAsyncData(async () => {
    const { data, error } = await $api.hello.get()

    if (error)
        throw new Error('Failed to call API')

    return data
})
</script>
```

이렇게 하면 Nuxt API 라우트에서 Elysia가 자동으로 실행되도록 설정됩니다.

## Prefix

기본적으로 Elysia는 **/_api**에 마운트되지만 `nuxt-elysia` 구성으로 사용자 정의할 수 있습니다.
```ts
export default defineNuxtConfig({
	nuxtElysia: {
		path: '/api' // [!code ++]
	}
})
```

이렇게 하면 Elysia가 **/_api** 대신 **/api**에 마운트됩니다.

자세한 구성은 [nuxt-elysia](https://github.com/tkesgar/nuxt-elysia)를 참조하세요.
