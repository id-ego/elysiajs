---
title: Static Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Static Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Plugin for Elysia that adds support for serving static files/folders for Elysia Server. Start by installing the plugin with "bun add @elysiajs/static".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that adds support for serving static files/folders for Elysia Server. Start by installing the plugin with "bun add @elysiajs/static".
---

# Static Plugin
이 플러그인은 Elysia 서버용 정적 파일/폴더를 제공할 수 있습니다.

설치 방법:
```bash
bun add @elysiajs/static
```

사용 방법:
```typescript twoslash
import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'

new Elysia()
    .use(staticPlugin())
    .listen(3000)
```

기본적으로 static 플러그인의 기본 폴더는 `public`이며 `/public` 접두사로 등록됩니다.

프로젝트 구조가 다음과 같다고 가정합니다:
```
| - src
  | - index.ts
| - public
  | - takodachi.png
  | - nested
    | - takodachi.png
```

사용 가능한 경로는 다음과 같습니다:
- /public/takodachi.png
- /public/nested/takodachi.png

## Config
플러그인에서 허용하는 설정은 다음과 같습니다.

### assets
@default `"public"`

정적으로 노출할 폴더 경로입니다.

### prefix
@default `"/public"`

공개 파일을 등록할 경로 접두사입니다.

### ignorePatterns
@default `[]`

정적 파일로 제공하지 않을 파일 목록입니다.

### staticLimit
@default `1024`

기본적으로 static 플러그인은 정적 이름으로 Router에 경로를 등록하며, 제한을 초과하면 메모리 사용량을 줄이기 위해 경로가 지연 방식으로 Router에 추가됩니다.
메모리와 성능을 트레이드오프합니다.

### alwaysStatic
@default `false`

true로 설정하면 `staticLimits`를 건너뛰고 정적 파일 경로가 Router에 등록됩니다.

### headers
@default `{}`

파일의 응답 헤더를 설정합니다.

### indexHTML
@default `false`

true로 설정하면 라우트나 기존 정적 파일과 일치하지 않는 요청에 대해 정적 디렉터리의 `index.html` 파일이 제공됩니다.

## Pattern
플러그인을 사용하는 일반적인 패턴을 찾을 수 있습니다.

- [Single File](#single-file)

## Single file
단일 파일만 반환하려면 static 플러그인을 사용하는 대신 `file`을 사용할 수 있습니다.
```typescript
import { Elysia, file } from 'elysia'

new Elysia()
    .get('/file', file('public/takodachi.png'))
```
