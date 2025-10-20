---
title: Deploy to Production - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Deploy to Production - ElysiaJS

  - - meta
    - name: 'description'
      content: This page

  - - meta
    - property: 'og:description'
      content: Elysia can be configured by passing an object to the constructor. We can configure Elysia behavior by passing an object to the constructor.
---

# Deploy to production
이 페이지는 Elysia를 프로덕션에 배포하는 방법에 대한 가이드입니다.

## Cluster mode
Elysia는 기본적으로 싱글 스레드입니다. 멀티코어 CPU를 활용하려면 Elysia를 cluster 모드로 실행할 수 있습니다.

**index.ts** 파일을 만들어 **server.ts**에서 메인 서버를 import하고 사용 가능한 CPU 코어 수에 따라 여러 worker를 fork합니다.

::: code-group

```ts [src/index.ts]
import cluster from 'node:cluster'
import os from 'node:os'
import process from 'node:process'

if (cluster.isPrimary) {
  	for (let i = 0; i < os.availableParallelism(); i++)
    	cluster.fork()
} else {
  	await import('./server')
  	console.log(`Worker ${process.pid} started`)
}
```

```ts [src/server.ts]
import { Elysia } from 'elysia'

new Elysia()
	.get('/', () => 'Hello World!')
	.listen(3000)
```

:::

이렇게 하면 Elysia가 여러 CPU 코어에서 실행됩니다.

::: tip
Bun의 Elysia는 기본적으로 SO_REUSEPORT를 사용하여 여러 인스턴스가 동일한 포트에서 수신할 수 있습니다. 이는 Linux에서만 작동합니다.
:::

## Compile to binary
메모리 사용량과 파일 크기를 크게 줄일 수 있으므로 프로덕션에 배포하기 전에 빌드 명령을 실행하는 것이 좋습니다.

다음 명령을 사용하여 Elysia를 단일 바이너리로 컴파일하는 것이 좋습니다:
```bash
bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun
	--outfile server \
	src/index.ts
```

이렇게 하면 서버를 시작하기 위해 실행할 수 있는 포터블 바이너리 `server`가 생성됩니다.

서버를 바이너리로 컴파일하면 일반적으로 개발 환경에 비해 메모리 사용량이 2-3배 크게 줄어듭니다.

이 명령은 조금 길기 때문에 분석해 보겠습니다:
1. **--compile** TypeScript를 바이너리로 컴파일
2. **--minify-whitespace** 불필요한 공백 제거
3. **--minify-syntax** 파일 크기를 줄이기 위해 JavaScript 구문 축소
4. **--target bun** Bun 런타임에 맞게 바이너리 최적화
5. **--outfile server** 바이너리를 `server`로 출력
6. **src/index.ts** 서버의 진입 파일(코드베이스)

서버를 시작하려면 바이너리를 실행하기만 하면 됩니다.
```bash
./server
```

바이너리가 컴파일되면 서버를 실행하기 위해 머신에 `Bun`이 설치되어 있을 필요가 없습니다.

배포 서버가 추가 런타임을 설치할 필요가 없어 바이너리를 포터블하게 만들기 때문에 좋습니다.

### Target
`--target` 플래그를 추가하여 대상 플랫폼에 맞게 바이너리를 최적화할 수도 있습니다.

```bash
bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun-linux-x64 \
	--outfile server \
	src/index.ts
```

사용 가능한 target 목록은 다음과 같습니다:
| Target                  | Operating System | Architecture | Modern | Baseline | Libc  |
|--------------------------|------------------|--------------|--------|----------|-------|
| bun-linux-x64           | Linux            | x64          | ✅      | ✅        | glibc |
| bun-linux-arm64         | Linux            | arm64        | ✅      | N/A      | glibc |
| bun-windows-x64         | Windows          | x64          | ✅      | ✅        | -     |
| bun-windows-arm64       | Windows          | arm64        | ❌      | ❌        | -     |
| bun-darwin-x64          | macOS            | x64          | ✅      | ✅        | -     |
| bun-darwin-arm64        | macOS            | arm64        | ✅      | N/A      | -     |
| bun-linux-x64-musl      | Linux            | x64          | ✅      | ✅        | musl  |
| bun-linux-arm64-musl    | Linux            | arm64        | ✅      | N/A      | musl  |

### Why not --minify
Bun에는 바이너리를 축소하는 `--minify` 플래그가 있습니다.

그러나 [OpenTelemetry](/plugins/opentelemetry)를 사용하는 경우 함수 이름이 단일 문자로 축소됩니다.

OpenTelemetry가 함수 이름에 의존하기 때문에 추적이 어려워집니다.

그러나 OpenTelemetry를 사용하지 않는 경우 `--minify`를 선택할 수 있습니다
```bash
bun build \
	--compile \
	--minify \
	--outfile server \
	src/index.ts
```

### Permission
일부 Linux 배포판은 바이너리를 실행할 수 없을 수 있으므로 Linux에 있는 경우 바이너리에 실행 권한을 활성화하는 것이 좋습니다:
```bash
chmod +x ./server

./server
```

### Unknown random Chinese error
서버에 바이너리를 배포하려고 시도하지만 임의의 중국어 문자 오류로 실행할 수 없는 경우.

이는 실행 중인 머신이 **AVX2를 지원하지 않는다**는 것을 의미합니다.

불행히도 Bun은 `AVX2` 하드웨어 지원이 있는 머신이 필요합니다.

우리가 알고 있는 한 해결 방법은 없습니다.

## Compile to JavaScript
바이너리로 컴파일할 수 없거나 Windows 서버에 배포하는 경우.

대신 서버를 JavaScript 파일로 번들할 수 있습니다.

```bash
bun build \
	--minify-whitespace \
	--minify-syntax \
	--outfile ./dist/index.js \
	src/index.ts
```

이렇게 하면 서버에 배포할 수 있는 단일 포터블 JavaScript 파일이 생성됩니다.
```bash
NODE_ENV=production bun ./dist/index.js
```

## Docker
Docker에서는 기본 이미지 오버헤드를 줄이기 위해 항상 바이너리로 컴파일하는 것이 좋습니다.

다음은 바이너리를 사용하는 Distroless 이미지를 사용하는 예제 이미지입니다.
```dockerfile [Dockerfile]
FROM oven/bun AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

COPY ./src ./src

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--outfile server \
	src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/server server

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3000
```

### OpenTelemetry
[OpenTelemetry](/integrations/opentelemetry)를 사용하여 프로덕션 서버를 배포하는 경우.

OpenTelemetry는 `node_modules/<library>`를 monkey-patching하는 데 의존하므로 instrumentation이 제대로 작동하려면 instrument할 라이브러리를 외부 모듈로 지정하여 번들링에서 제외해야 합니다.

예를 들어 `@opentelemetry/instrumentation-pg`를 사용하여 `pg` 라이브러리를 instrument하는 경우. 번들링에서 `pg`를 제외하고 `node_modules/pg`에서 import되도록 해야 합니다.

이것이 작동하려면 `--external pg`를 사용하여 `pg`를 외부 모듈로 지정할 수 있습니다
```bash
bun build --compile --external pg --outfile server src/index.ts
```

이것은 bun에게 `pg`를 최종 출력 파일에 번들하지 말고 런타임에 `node_modules` 디렉토리에서 import하도록 지시합니다. 따라서 프로덕션 서버에서는 `node_modules` 디렉토리도 유지해야 합니다.

프로덕션 서버에서 사용 가능해야 하는 패키지를 `package.json`의 `dependencies`로 지정하고 `bun install --production`을 사용하여 프로덕션 종속성만 설치하는 것이 좋습니다.

```json
{
	"dependencies": {
		"pg": "^8.15.6"
	},
	"devDependencies": {
		"@elysiajs/opentelemetry": "^1.2.0",
		"@opentelemetry/instrumentation-pg": "^0.52.0",
		"@types/pg": "^8.11.14",
		"elysia": "^1.2.25"
	}
}
```

그런 다음 빌드 명령을 실행한 후 프로덕션 서버에서
```bash
bun install --production
```

node_modules 디렉토리에 여전히 개발 종속성이 포함되어 있는 경우 node_modules 디렉토리를 제거하고 프로덕션 종속성을 다시 설치할 수 있습니다.

### Monorepo
Monorepo와 함께 Elysia를 사용하는 경우 종속 `packages`를 포함해야 할 수 있습니다.

Turborepo를 사용하는 경우 **apps/server/Dockerfile**과 같이 apps 디렉토리 내에 Dockerfile을 배치할 수 있습니다. 이는 Lerna 등과 같은 다른 monorepo 관리자에도 적용될 수 있습니다.

monorepo가 다음과 같은 구조로 Turborepo를 사용한다고 가정합니다:
- apps
	- server
		- **Dockerfile (여기에 Dockerfile 배치)**
- packages
	- config

그런 다음 monorepo 루트(app 루트가 아님)에서 Dockerfile을 빌드할 수 있습니다:
```bash
docker build -t elysia-mono .
```

Dockerfile은 다음과 같습니다:
```dockerfile [apps/server/Dockerfile]
FROM oven/bun:1 AS build

WORKDIR /app

# Cache packages
COPY package.json package.json
COPY bun.lock bun.lock

COPY /apps/server/package.json ./apps/server/package.json
COPY /packages/config/package.json ./packages/config/package.json

RUN bun install

COPY /apps/server ./apps/server
COPY /packages/config ./packages/config

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--outfile server \
	src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/server server

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3000
```

## Railway
[Railway](https://railway.app)는 인기 있는 배포 플랫폼 중 하나입니다.

Railway는 각 배포에 대해 노출할 **임의의 포트**를 할당하며, 이는 `PORT` 환경 변수를 통해 액세스할 수 있습니다.

Railway 포트를 준수하기 위해 `PORT` 환경 변수를 허용하도록 Elysia 서버를 수정해야 합니다.

고정 포트 대신 `process.env.PORT`를 사용하고 개발에서 fallback을 제공할 수 있습니다.
```ts
new Elysia()
	.listen(3000) // [!code --]
	.listen(process.env.PORT ?? 3000) // [!code ++]
```

이렇게 하면 Elysia가 Railway에서 제공하는 포트를 가로챌 수 있습니다.

::: tip
Elysia는 자동으로 hostname을 `0.0.0.0`으로 할당하며, 이는 Railway와 작동합니다
:::
