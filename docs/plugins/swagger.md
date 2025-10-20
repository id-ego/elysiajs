---
title: Swagger Plugin - ElysiaJS
search: false
head:
    - - meta
      - property: 'og:title'
        content: Swagger Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Plugin for Elysia that adds support for generating Swagger API documentation for Elysia Server. Start by installing the plugin with "bun add @elysiajs/swagger".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that adds support for generating Swagger API documentation for Elysia Server. Start by installing the plugin with "bun add @elysiajs/swagger".
---

::: warning
Swagger 플러그인은 더 이상 사용되지 않으며 유지 관리되지 않습니다. 대신 [OpenAPI plugin](/plugins/openapi)을 사용하세요.
:::

# Swagger Plugin

이 플러그인은 Elysia 서버용 Swagger 엔드포인트를 생성합니다.

설치 방법:

```bash
bun add @elysiajs/swagger
```

사용 방법:

```typescript
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(swagger())
    .get('/', () => 'hi')
    .post('/hello', () => 'world')
    .listen(3000)
```

`/swagger`에 액세스하면 Elysia 서버에서 생성된 엔드포인트 문서가 있는 Scalar UI가 표시됩니다. `/swagger/json`에서 원시 OpenAPI 스펙에도 액세스할 수 있습니다.

## Config

플러그인에서 허용하는 설정은 다음과 같습니다.

### provider

@default `scalar`

문서용 UI Provider입니다. 기본적으로 Scalar로 설정됩니다.

### scalar

Scalar을 커스터마이징하기 위한 설정입니다.

[Scalar config](https://github.com/scalar/scalar/blob/main/documentation/configuration.md)를 참조하세요.

### swagger

Swagger를 커스터마이징하기 위한 설정입니다.

[Swagger specification](https://swagger.io/specification/v2/)를 참조하세요.

### excludeStaticFile

@default `true`

Swagger가 정적 파일을 제외할지 여부를 결정합니다.

### path

@default `/swagger`

Swagger를 노출할 엔드포인트입니다.

### exclude

Swagger 문서에서 제외할 경로입니다.

값은 다음 중 하나일 수 있습니다:

-   **string**
-   **RegExp**
-   **Array<string | RegExp>**

## Pattern

플러그인을 사용하는 일반적인 패턴을 찾을 수 있습니다.

## Swagger 엔드포인트 변경

플러그인 설정에서 [path](#path)를 설정하여 swagger 엔드포인트를 변경할 수 있습니다.

```typescript
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(
        swagger({
            path: '/v2/swagger'
        })
    )
    .listen(3000)
```

## Swagger 정보 커스터마이징

```typescript
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(
        swagger({
            documentation: {
                info: {
                    title: 'Elysia Documentation',
                    version: '1.0.0'
                }
            }
        })
    )
    .listen(3000)
```

## 태그 사용

Elysia는 Swagger의 태그 시스템을 사용하여 엔드포인트를 그룹으로 분리할 수 있습니다.

먼저 swagger 설정 객체에서 사용 가능한 태그를 정의합니다.

```typescript
app.use(
    swagger({
        documentation: {
            tags: [
                { name: 'App', description: 'General endpoints' },
                { name: 'Auth', description: 'Authentication endpoints' }
            ]
        }
    })
)
```

그런 다음 엔드포인트 설정 섹션의 details 속성을 사용하여 해당 엔드포인트를 그룹에 할당합니다.

```typescript
app.get('/', () => 'Hello Elysia', {
    detail: {
        tags: ['App']
    }
})

app.group('/auth', (app) =>
    app.post(
        '/sign-up',
        async ({ body }) =>
            db.user.create({
                data: body,
                select: {
                    id: true,
                    username: true
                }
            }),
        {
            detail: {
                tags: ['Auth']
            }
        }
    )
)
```

다음과 같은 swagger 페이지가 생성됩니다.
<img width="1446" alt="image" src="/assets/swagger-demo.webp">

## 보안 설정

API 엔드포인트를 보호하려면 Swagger 설정에서 보안 스키마를 정의할 수 있습니다. 아래 예제는 Bearer Authentication (JWT)을 사용하여 엔드포인트를 보호하는 방법을 보여줍니다:

```typescript
app.use(
    swagger({
        documentation: {
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            }
        }
    })
)

export const addressController = new Elysia({
    prefix: '/address',
    detail: {
        tags: ['Address'],
        security: [
            {
                bearerAuth: []
            }
        ]
    }
})
```

이 설정은 `/address` 접두사 아래의 모든 엔드포인트가 액세스하려면 유효한 JWT 토큰이 필요하도록 보장합니다.
