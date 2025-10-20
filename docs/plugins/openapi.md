---
title: OpenAPI Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: OpenAPI Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Plugin for Elysia that adds support for generating Swagger API documentation for Elysia Server. Start by installing the plugin with "bun add @elysiajs/swagger".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that adds support for generating Swagger API documentation for Elysia Server. Start by installing the plugin with "bun add @elysiajs/swagger".
---

# OpenAPI Plugin

API 문서 페이지를 자동 생성하는 [elysia](https://github.com/elysiajs/elysia) 플러그인입니다.

설치 방법:

```bash
bun add @elysiajs/openapi
```

사용 방법:

```typescript twoslash
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
    .use(openapi())
    .get('/', () => 'hello')
    .post('/hello', () => 'OpenAPI')
    .listen(3000)
```

`/openapi`에 액세스하면 Elysia 서버에서 생성된 엔드포인트 문서가 있는 Scalar UI가 표시됩니다. `/openapi/json`에서 원시 OpenAPI 스펙에도 액세스할 수 있습니다.

::: tip
이 페이지는 플러그인 설정 참조입니다.

OpenAPI의 일반적인 패턴이나 고급 사용법을 찾고 있다면 [Patterns: OpenAPI](/patterns/openapi)를 확인하세요.
:::

## Detail

`detail`은 [OpenAPI Operation Object](https://spec.openapis.org/oas/v3.0.3.html#operation-object)를 확장합니다.

detail 필드는 API 문서를 위한 라우트에 대한 정보를 설명하는 데 사용할 수 있는 객체입니다.

다음 필드를 포함할 수 있습니다:

## detail.hide

`detail.hide`를 `true`로 설정하여 Swagger 페이지에서 라우트를 숨길 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia().use(openapi()).post('/sign-in', ({ body }) => body, {
    body: t.Object(
        {
            username: t.String(),
            password: t.String()
        },
        {
            description: 'Expected a username and password'
        }
    ),
    detail: {
        // [!code ++]
        hide: true // [!code ++]
    } // [!code ++]
})
```

### detail.deprecated

이 작업을 더 이상 사용하지 않는 것으로 선언합니다. 소비자는 선언된 작업의 사용을 자제해야 합니다. 기본값은 `false`입니다.

### detail.description

작업 동작에 대한 자세한 설명입니다.

### detail.summary

작업이 수행하는 작업에 대한 짧은 요약입니다.

## Config

플러그인에서 허용하는 설정은 다음과 같습니다.

## enabled

@default true
플러그인 활성화/비활성화

## documentation

OpenAPI 문서 정보

@see https://spec.openapis.org/oas/v3.0.3.html

## exclude

문서에서 경로 또는 메서드를 제외하기 위한 설정

## exclude.methods

문서에서 제외할 메서드 목록

## exclude.paths

문서에서 제외할 경로 목록

## exclude.staticFile

@default true

문서에서 정적 파일 라우트 제외

## exclude.tags

문서에서 제외할 태그 목록

## mapJsonSchema
Standard 스키마에서 OpenAPI 스키마로의 커스텀 매핑 함수

### Example
```typescript
import { openapi } from '@elysiajs/openapi'
import { toJsonSchema } from '@valibot/to-json-schema'

openapi({
	mapJsonSchema: {
	  	valibot: toJsonSchema
  	}
})
```

## path

@default '/openapi'

OpenAPI 문서 프론트엔드를 노출할 엔드포인트

## provider

@default 'scalar'

다음 중 OpenAPI 문서 프론트엔드:

- [Scalar](https://github.com/scalar/scalar)
- [SwaggerUI](https://github.com/swagger-api/swagger-ui)
- null: 프론트엔드 비활성화

## references

각 엔드포인트에 대한 추가 OpenAPI 참조

## scalar

Scalar 설정, [Scalar config](https://github.com/scalar/scalar/blob/main/documentation/configuration.md) 참조

## specPath

@default '/${path}/json'

JSON 형식의 OpenAPI 사양을 노출할 엔드포인트

## swagger

Swagger 설정, [Swagger config](https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/) 참조

플러그인을 사용하는 일반적인 패턴을 찾을 수 있습니다.
