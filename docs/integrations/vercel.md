---
title: Vercel Function과의 통합 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Vercel Function과의 통합 - ElysiaJS

    - - meta
      - name: 'description'
        content: Vercel Function은 기본적으로 Web Standard Framework를 지원하므로, 추가 설정 없이 Vercel Function에서 Elysia를 실행할 수 있습니다.

    - - meta
      - property: 'og:description'
        content: Vercel Function은 기본적으로 Web Standard Framework를 지원하므로, 추가 설정 없이 Vercel Function에서 Elysia를 실행할 수 있습니다.
---

<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSaltyAom%2Fvercel-function-elysia-demo">
	<img src="https://vercel.com/button" alt="Deploy with Vercel"/>
</a>

<br>

# Vercel Function과의 통합

Vercel Function은 기본적으로 Web Standard Framework를 지원하므로, 추가 설정 없이 Vercel Function에서 Elysia를 실행할 수 있습니다.

1. **src/index.ts** 파일을 생성합니다
2. **src/index.ts**에서 Elysia 서버를 생성하거나 기존 서버를 가져옵니다
3. Elysia 서버를 default export로 내보냅니다

```typescript
import { Elysia, t } from 'elysia'

export default new Elysia()
    .get('/', () => 'Hello Vercel Function')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })
```

4. `tsdown` 또는 유사한 도구를 사용하여 코드를 단일 파일로 번들링하는 빌드 스크립트를 추가합니다

```json
{
	"scripts": {
		"build": "tsdown src/index.ts -d api --dts"
	}
}
```

5. 모든 엔드포인트를 Elysia 서버로 리다이렉트하는 **vercel.json**을 생성합니다

```json
{
    "$schema": "https://openapi.vercel.sh/vercel.json",
    "rewrites": [
		{
			"source": "/(.*)",
			"destination": "/api"
		}
    ]
}
```

이 설정은 모든 요청을 Elysia 서버가 정의된 `/api` 경로로 리다이렉트합니다.

Elysia는 기본적으로 Web Standard Framework를 지원하므로 Vercel Function과 함께 작동하기 위한 추가 설정이 필요하지 않습니다.

## 작동하지 않는 경우
Elysia 서버를 default export로 내보냈는지, 빌드 출력이 `/api/index.js`에 위치한 단일 파일인지 확인하세요.

다른 환경에서와 마찬가지로 Elysia의 내장 기능인 유효성 검사, 에러 처리, [OpenAPI](/plugins/openapi.html) 등을 사용할 수도 있습니다.

자세한 내용은 [Vercel Function 문서](https://vercel.com/docs/functions?framework=other)를 참조하세요.
