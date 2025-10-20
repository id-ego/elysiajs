---
title: Apollo GraphQL Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Apollo GraphQL Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Plugin for Elysia that adds support for using GraphQL Apollo on the Elysia server. Start by installing the plugin with "bun add graphql @elysiajs/apollo @apollo/server".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that adds support for using GraphQL Apollo on the Elysia server. Start by installing the plugin with "bun add graphql @elysiajs/apollo @apollo/server".
---

# GraphQL Apollo Plugin

GraphQL Apollo를 사용하기 위한 [elysia](https://github.com/elysiajs/elysia) 플러그인입니다.

설치 방법:

```bash
bun add graphql @elysiajs/apollo @apollo/server
```

사용 방법:

```typescript
import { Elysia } from 'elysia'
import { apollo, gql } from '@elysiajs/apollo'

const app = new Elysia()
	.use(
		apollo({
			typeDefs: gql`
				type Book {
					title: String
					author: String
				}

				type Query {
					books: [Book]
				}
			`,
			resolvers: {
				Query: {
					books: () => {
						return [
							{
								title: 'Elysia',
								author: 'saltyAom'
							}
						]
					}
				}
			}
		})
	)
	.listen(3000)
```

`/graphql`에 액세스하면 Apollo GraphQL playground가 표시됩니다.

## Context

Elysia는 Express가 사용하는 Node의 `HttpRequest` 및 `HttpResponse`와 다른 Web Standard Request와 Response를 기반으로 하기 때문에 context에서 `req, res`가 undefined입니다.

이 때문에 Elysia는 라우트 매개변수처럼 `context`로 둘 다 대체합니다.

```typescript
const app = new Elysia()
	.use(
		apollo({
			typeDefs,
			resolvers,
			context: async ({ request }) => {
				const authorization = request.headers.get('Authorization')

				return {
					authorization
				}
			}
		})
	)
	.listen(3000)
```

## Config

이 플러그인은 Apollo의 [ServerRegistration](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#options) (`ApolloServer`의 생성자 매개변수)를 확장합니다.

Elysia와 함께 Apollo Server를 구성하기 위한 확장 매개변수는 다음과 같습니다.

### path

@default `"/graphql"`

Apollo Server를 노출할 경로입니다.

### enablePlayground

@default `process.env.ENV !== 'production'`

Apollo가 Apollo Playground를 제공할지 여부를 결정합니다.
