---
title: GraphQL Yoga Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: GraphQL Yoga Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Plugin for Elysia that adds support for using GraphQL Yoga on the Elysia server. Start by installing the plugin with "bun add graphql graphql-yoga @elysiajs/graphql-yoga".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that adds support for using GraphQL Yoga on the Elysia server. Start by installing the plugin with "bun add graphql graphql-yoga @elysiajs/graphql-yoga".
---

# GraphQL Yoga Plugin

이 플러그인은 GraphQL yoga를 Elysia와 통합합니다.

설치 방법:

```bash
bun add @elysiajs/graphql-yoga
```

사용 방법:

```typescript
import { Elysia } from 'elysia'
import { yoga } from '@elysiajs/graphql-yoga'

const app = new Elysia()
	.use(
		yoga({
			typeDefs: /* GraphQL */ `
				type Query {
					hi: String
				}
			`,
			resolvers: {
				Query: {
					hi: () => 'Hello from Elysia'
				}
			}
		})
	)
	.listen(3000)
```

브라우저에서 `/graphql`에 액세스(GET 요청)하면 GraphQL이 활성화된 Elysia 서버용 GraphiQL 인스턴스가 표시됩니다.

선택사항: 커스텀 버전의 선택적 피어 종속성도 설치할 수 있습니다:

```bash
bun add graphql graphql-yoga
```

## Resolver

Elysia는 [Mobius](https://github.com/saltyaom/mobius)를 사용하여 **typeDefs** 필드에서 타입을 자동으로 추론하므로 **resolver** 타입을 입력할 때 완전한 타입 안전성과 자동 완성을 얻을 수 있습니다.

## Context

**context**를 추가하여 resolver 함수에 커스텀 context를 추가할 수 있습니다.

```ts
import { Elysia } from 'elysia'
import { yoga } from '@elysiajs/graphql-yoga'

const app = new Elysia()
	.use(
		yoga({
			typeDefs: /* GraphQL */ `
				type Query {
					hi: String
				}
			`,
			context: {
				name: 'Mobius'
			},
			// 어떤 이유로 이것이 존재하지 않으면
			// context가 함수인 경우 context 타입을 추론하지 않습니다
			useContext(_) {},
			resolvers: {
				Query: {
					hi: async (parent, args, context) => context.name
				}
			}
		})
	)
	.listen(3000)
```

## Config

이 플러그인은 [GraphQL Yoga의 createYoga 옵션을 확장하며, GraphQL Yoga 문서를 참조하세요](https://the-guild.dev/graphql/yoga-server/docs). `schema` 설정을 루트로 인라인합니다.

플러그인에서 허용하는 설정은 다음과 같습니다.

### path

@default `/graphql`

GraphQL 핸들러를 노출할 엔드포인트입니다.
