---
title: 치트 시트 (Elysia by example) - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: 치트 시트 (Elysia by example) - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia의 치트 시트 요약 및 "Elysia by example" 작동 방식

  - - meta
    - property: 'og:description'
      content: Elysia의 치트 시트 요약 및 "Elysia by example" 작동 방식
---

# 치트 시트
일반적인 Elysia 패턴에 대한 빠른 개요입니다

## Hello World
간단한 hello world

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'Hello World')
    .listen(3000)
```

## 사용자 정의 HTTP 메서드
사용자 정의 HTTP 메서드/동사를 사용하여 라우트 정의

[Route](/essential/route.html#custom-method) 참조

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/hi', () => 'Hi')
    .post('/hi', () => 'From Post')
    .put('/hi', () => 'From Put')
    .route('M-SEARCH', '/hi', () => 'Custom Method')
    .listen(3000)
```

## 경로 매개변수
동적 경로 매개변수 사용

[Path](/essential/route.html#path-type) 참조

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/rest/*', () => 'Rest')
    .listen(3000)
```

## JSON 반환
Elysia는 응답을 자동으로 JSON으로 변환

[Handler](/essential/handler.html) 참조

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/json', () => {
        return {
            hello: 'Elysia'
        }
    })
    .listen(3000)
```

## 파일 반환
파일은 formdata 응답으로 반환할 수 있습니다

응답은 1레벨 깊이의 객체여야 합니다

```typescript
import { Elysia, file } from 'elysia'

new Elysia()
    .get('/json', () => {
        return {
            hello: 'Elysia',
            image: file('public/cat.jpg')
        }
    })
    .listen(3000)
```

## 헤더와 상태
사용자 정의 헤더 및 상태 코드 설정

[Handler](/essential/handler.html) 참조

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set, status }) => {
        set.headers['x-powered-by'] = 'Elysia'

        return status(418, "I'm a teapot")
    })
    .listen(3000)
```

## 그룹
하위 라우트의 접두사를 한 번 정의

[Group](/essential/route.html#group) 참조

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get("/", () => "Hi")
    .group("/auth", app => {
        return app
            .get("/", () => "Hi")
            .post("/sign-in", ({ body }) => body)
            .put("/sign-up", ({ body }) => body)
    })
    .listen(3000)
```

## 스키마
라우트의 데이터 타입 강제

[Validation](/essential/validation) 참조

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/mirror', ({ body: { username } }) => username, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .listen(3000)
```

## 파일 업로드
[Validation#file](/essential/validation#file) 참조

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.post('/body', ({ body }) => body, {
                    // ^?




		body: t.Object({
			file: t.File({ format: 'image/*' }),
			multipleFiles: t.Files()
		})
	})
	.listen(3000)
```

## 라이프사이클 훅
순서대로 Elysia 이벤트 가로채기

[Lifecycle](/essential/life-cycle.html) 참조

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .onRequest(() => {
        console.log('On request')
    })
    .on('beforeHandle', () => {
        console.log('Before handle')
    })
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        }),
        afterHandle: () => {
            console.log("After handle")
        }
    })
    .listen(3000)
```

## 가드
하위 라우트의 데이터 타입 강제

[Scope](/essential/plugin.html#scope) 참조

```typescript twoslash
// @errors: 2345
import { Elysia, t } from 'elysia'

new Elysia()
    .guard({
        response: t.String()
    }, (app) => app
        .get('/', () => 'Hi')
        // 유효하지 않음: 오류 발생, TypeScript가 오류 보고
        .get('/invalid', () => 1)
    )
    .listen(3000)
```

## 사용자 정의 컨텍스트
라우트 컨텍스트에 사용자 정의 변수 추가

[Context](/essential/handler.html#context) 참조

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .state('version', 1)
    .decorate('getDate', () => Date.now())
    .get('/version', ({
        getDate,
        store: { version }
    }) => `${version} ${getDate()}`)
    .listen(3000)
```

## 리다이렉트
응답 리다이렉트

[Handler](/essential/handler.html#redirect) 참조

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'hi')
    .get('/redirect', ({ redirect }) => {
        return redirect('/')
    })
    .listen(3000)
```

## 플러그인
별도의 인스턴스 생성

[Plugin](/essential/plugin) 참조

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .state('plugin-version', 1)
    .get('/hi', () => 'hi')

new Elysia()
    .use(plugin)
    .get('/version', ({ store }) => store['plugin-version'])
    .listen(3000)
```

## Web Socket
Web Socket을 사용하여 실시간 연결 생성

[Web Socket](/patterns/websocket) 참조

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .ws('/ping', {
        message(ws, message) {
            ws.send('hello ' + message)
        }
    })
    .listen(3000)
```

## OpenAPI 문서
Scalar(또는 선택적으로 Swagger)을 사용하여 대화형 문서 생성

[openapi](/plugins/openapi.html) 참조

```typescript
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'

const app = new Elysia()
    .use(openapi())
    .listen(3000)

console.log(`View documentation at "${app.server!.url}openapi" in your browser`);
```

## 단위 테스트
Elysia 앱의 단위 테스트 작성

[Unit Test](/patterns/unit-test) 참조

```typescript
// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'

describe('Elysia', () => {
    it('return a response', async () => {
        const app = new Elysia().get('/', () => 'hi')

        const response = await app
            .handle(new Request('http://localhost/'))
            .then((res) => res.text())

        expect(response).toBe('hi')
    })
})
```

## 사용자 정의 body parser
body 파싱을 위한 사용자 정의 로직 생성

[Parse](/essential/life-cycle.html#parse) 참조

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onParse(({ request, contentType }) => {
        if (contentType === 'application/custom-type')
            return request.text()
    })
```

## GraphQL
GraphQL Yoga 또는 Apollo를 사용하여 사용자 정의 GraphQL 서버 생성

[GraphQL Yoga](/plugins/graphql-yoga) 참조

```typescript
import { Elysia } from 'elysia'
import { yoga } from '@elysiajs/graphql-yoga'

const app = new Elysia()
    .use(
        yoga({
            typeDefs: /* GraphQL */`
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
