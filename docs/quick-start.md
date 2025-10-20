---
title: Quick Start - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Quick Start - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia is a library built for Bun and the only prerequisite. To start, bootstrap a new project with "bun create elysia hi-elysia" and start the development server with "bun dev". This is all you need to do a quick start or get started with ElysiaJS.

    - - meta
      - property: 'og:description'
        content: Elysia is a library built for Bun and the only prerequisite. To start, bootstrap a new project with "bun create elysia hi-elysia" and start the development server with "bun dev". This is all you need to do a quick start or get started with ElysiaJS.
---

<script setup>
import Card from './components/nearl/card.vue'
import Deck from './components/nearl/card-deck.vue'
import Tab from './components/fern/tab.vue'
</script>

# Quick Start

Elysia는 여러 런타임을 지원하지만 Bun에 최적화된 TypeScript 백엔드 프레임워크입니다.

그러나 Node.js와 같은 다른 런타임에서도 Elysia를 사용할 수 있습니다.

<Tab
	id="quickstart"
	:names="['Bun', 'Node.js', 'Web Standard']"
	:tabs="['bun', 'node', 'web-standard']"
>

<template v-slot:bun>

Elysia는 Node.js를 대체하는 것을 목표로 하는 JavaScript 런타임인 Bun에 최적화되어 있습니다.

아래 명령어로 Bun을 설치할 수 있습니다:

::: code-group

```bash [MacOS/Linux]
curl -fsSL https://bun.sh/install | bash
```

```bash [Windows]
powershell -c "irm bun.sh/install.ps1 | iex"
```

:::

<Tab
	id="quickstart"
	:names="['Auto Installation', 'Manual Installation']"
	:tabs="['auto', 'manual']"
>

<template v-slot:auto>

`bun create elysia`를 사용하여 새 Elysia 서버를 시작하는 것을 권장합니다. 모든 것이 자동으로 설정됩니다.

```bash
bun create elysia app
```

완료되면 디렉토리에 `app`이라는 이름의 폴더가 표시됩니다.

```bash
cd app
```

다음 명령어로 개발 서버를 시작합니다:

```bash
bun dev
```

[localhost:3000](http://localhost:3000)로 이동하면 "Hello Elysia"라는 인사말이 표시됩니다.

::: tip
Elysia는 파일 변경 시 서버를 자동으로 다시 로드하는 `dev` 명령어를 제공합니다.
:::

</template>

<template v-slot:manual>

새 Elysia 앱을 수동으로 생성하려면 Elysia를 패키지로 설치하세요:

```typescript
bun add elysia
bun add -d @types/bun
```

이렇게 하면 Elysia와 Bun 타입 정의가 설치됩니다.

새 파일 `src/index.ts`를 생성하고 다음 코드를 추가하세요:

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', () => 'Hello Elysia')
	.listen(3000)

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

`package.json` 파일을 열고 다음 스크립트를 추가하세요:

```json
{
   	"scripts": {
  		"dev": "bun --watch src/index.ts",
  		"build": "bun build src/index.ts --target bun --outdir ./dist",
  		"start": "NODE_ENV=production bun dist/index.js",
  		"test": "bun test"
   	}
}
```

이 스크립트들은 애플리케이션 개발의 다양한 단계를 나타냅니다:

- **dev** - 코드 변경 시 자동 리로드와 함께 개발 모드에서 Elysia를 시작합니다.
- **build** - 프로덕션 사용을 위해 애플리케이션을 빌드합니다.
- **start** - Elysia 프로덕션 서버를 시작합니다.

TypeScript를 사용하는 경우 `tsconfig.json`을 생성하고 `compilerOptions.strict`를 `true`로 설정하세요:

```json
{
   	"compilerOptions": {
  		"strict": true
   	}
}
```

</template>
</Tab>

</template>

<template v-slot:node>

Node.js는 서버 측 애플리케이션을 위한 JavaScript 런타임으로, Elysia가 지원하는 JavaScript의 가장 인기 있는 런타임입니다.

아래 명령어로 Node.js를 설치할 수 있습니다:

::: code-group

```bash [MacOS]
brew install node
```

```bash [Windows]
choco install nodejs
```

```bash [apt (Linux)]
sudo apt install nodejs
```

```bash [pacman (Arch)]
pacman -S nodejs npm
```

:::

## 설정

Node.js 프로젝트에는 TypeScript를 사용하는 것을 권장합니다.

<Tab
	id="language"
	:names="['TypeScript', 'JavaScript']"
	:tabs="['ts', 'js']"
>

<template v-slot:ts>

TypeScript로 새 Elysia 앱을 생성하려면 `tsx`와 함께 Elysia를 설치하는 것을 권장합니다:

::: code-group

```bash [bun]
bun add elysia @elysiajs/node && \
bun add -d tsx @types/node typescript
```

```bash [pnpm]
pnpm add elysia @elysiajs/node && \
pnpm add -D tsx @types/node typescript
```

```bash [npm]
npm install elysia @elysiajs/node && \
npm install --save-dev tsx @types/node typescript
```

```bash [yarn]
yarn add elysia @elysiajs/node && \
yarn add -D tsx @types/node typescript
```

:::

이렇게 하면 Elysia, TypeScript, 그리고 `tsx`가 설치됩니다.

`tsx`는 핫 리로드 및 최신 개발 환경에서 기대하는 여러 기능과 함께 TypeScript를 JavaScript로 변환하는 CLI입니다.

새 파일 `src/index.ts`를 생성하고 다음 코드를 추가하세요:

```typescript
import { Elysia } from 'elysia'
import { node } from '@elysiajs/node'

const app = new Elysia({ adapter: node() })
	.get('/', () => 'Hello Elysia')
	.listen(3000, ({ hostname, port }) => {
		console.log(
			`🦊 Elysia is running at ${hostname}:${port}`
		)
	})
```

`package.json` 파일을 열고 다음 스크립트를 추가하세요:

```json
{
   	"scripts": {
  		"dev": "tsx watch src/index.ts",
    	"build": "tsc src/index.ts --outDir dist",
  		"start": "NODE_ENV=production node dist/index.js"
   	}
}
```

이 스크립트들은 애플리케이션 개발의 다양한 단계를 나타냅니다:

- **dev** - 코드 변경 시 자동 리로드와 함께 개발 모드에서 Elysia를 시작합니다.
- **build** - 프로덕션 사용을 위해 애플리케이션을 빌드합니다.
- **start** - Elysia 프로덕션 서버를 시작합니다.

`tsconfig.json`을 생성해야 합니다

```bash
npx tsc --init
```

`tsconfig.json`을 업데이트하여 `compilerOptions.strict`를 `true`로 설정하는 것을 잊지 마세요:
```json
{
   	"compilerOptions": {
  		"strict": true
   	}
}
```

</template>

<template v-slot:js>

::: warning
TypeScript 없이 Elysia를 사용하면 자동 완성, 고급 타입 검사 및 엔드투엔드 타입 안전성과 같은 Elysia의 핵심 기능인 일부 기능을 놓칠 수 있습니다.
:::

JavaScript로 새 Elysia 앱을 생성하려면 먼저 Elysia를 설치하세요:

::: code-group

```bash [pnpm]
bun add elysia @elysiajs/node
```

```bash [pnpm]
pnpm add elysia @elysiajs/node
```

```bash [npm]
npm install elysia @elysiajs/node
```

```bash [yarn]
yarn add elysia @elysiajs/node
```

:::

이렇게 하면 Elysia, TypeScript, 그리고 `tsx`가 설치됩니다.

`tsx`는 핫 리로드 및 최신 개발 환경에서 기대하는 여러 기능과 함께 TypeScript를 JavaScript로 변환하는 CLI입니다.

새 파일 `src/index.ts`를 생성하고 다음 코드를 추가하세요:

```javascript
import { Elysia } from 'elysia'
import { node } from '@elysiajs/node'

const app = new Elysia({ adapter: node() })
	.get('/', () => 'Hello Elysia')
	.listen(3000, ({ hostname, port }) => {
		console.log(
			`🦊 Elysia is running at ${hostname}:${port}`
		)
	})
```

`package.json` 파일을 열고 다음 스크립트를 추가하세요:

```json
{
	"type", "module",
   	"scripts": {
  		"dev": "node src/index.ts",
  		"start": "NODE_ENV=production node src/index.js"
   	}
}
```

이 스크립트들은 애플리케이션 개발의 다양한 단계를 나타냅니다:

- **dev** - 코드 변경 시 자동 리로드와 함께 개발 모드에서 Elysia를 시작합니다.
- **start** - Elysia 프로덕션 서버를 시작합니다.

`tsconfig.json`을 생성해야 합니다

```bash
npx tsc --init
```

`tsconfig.json`을 업데이트하여 `compilerOptions.strict`를 `true`로 설정하는 것을 잊지 마세요:
```json
{
   	"compilerOptions": {
  		"strict": true
   	}
}
```

</template>

</Tab>

</template>

<template v-slot:web-standard>

Elysia는 WinterCG를 준수하는 라이브러리입니다. 즉, 프레임워크나 런타임이 Web Standard Request/Response를 지원하면 Elysia를 실행할 수 있습니다.

먼저, 아래 명령어로 Elysia를 설치하세요:

::: code-group

```bash [bun]
bun install elysia
```

```bash [pnpm]
pnpm install elysia
```

```bash [npm]
npm install elysia
```

```bash [yarn]
yarn add elysia
```

:::

다음으로, Web Standard Request/Response를 지원하는 런타임을 선택하세요.

몇 가지 권장 사항이 있습니다:

<Deck>
    <Card title="Next.js" href="/integrations/nextjs">
   		Next.js API 라우트로서의 Elysia.
    </Card>
    <Card title="Expo" href="/integrations/expo">
   		Expo App Router API로서의 Elysia.
    </Card>
	<Card title="Astro" href="/integrations/astro">
		Astro API 라우트로서의 Elysia.
	</Card>
	<Card title="Nuxt" href="/integrations/nuxt">
   		Nuxt API 라우트로서의 Elysia.
    </Card>
	<Card title="SvelteKit" href="/integrations/sveltekit">
		SvelteKit API 라우트로서의 Elysia.
	</Card>
</Deck>

### 목록에 없나요?
커스텀 런타임을 사용하는 경우 `app.fetch`에 접근하여 요청과 응답을 수동으로 처리할 수 있습니다.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', () => 'Hello Elysia')
	.listen(3000)

export default app.fetch

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

</template>

</Tab>
