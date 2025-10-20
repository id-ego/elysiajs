---
title: Fullstack Dev Server - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Fullstack Dev Server - ElysiaJS

    - - meta
      - name: 'description'
        content: Bun Fullstack Dev Server allows us to develop frontend and backend in a single project without any bundler. Learn how to use Elysia with Bun Fullstack Dev Server with HMR, and Tailwind support.

    - - meta
      - property: 'og:description'
        content: Bun Fullstack Dev Server allows us to develop frontend and backend in a single project without any bundler. Learn how to use Elysia with Bun Fullstack Dev Server with HMR, and Tailwind support.
---

# Elysia with Bun Fullstack Dev Server

Bun 1.3은 HMR 지원과 함께 [Fullstack Dev Server](https://bun.com/docs/bundler/fullstack)를 도입합니다.

이를 통해 Vite나 Webpack과 같은 bundler 없이 React를 직접 사용할 수 있습니다.

<video mute controls style="aspect-ratio: 3736/1630;">
  <source src="/assets/bun-fullstack.mp4" type="video/mp4" />
  Something went wrong trying to load video
</video>

[이 예제](https://github.com/saltyaom/elysia-fullstack-example)를 사용하여 빠르게 시도해 볼 수 있습니다.

그렇지 않으면 수동으로 설치하세요:

1. Elysia Static plugin 설치
```ts
import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'

new Elysia()
	.use(staticPlugin())
	.listen(3000)
```

2. **public/index.html**과 **index.tsx** 생성

::: code-group

```html [public/index.html]
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Elysia React App</title>

		<meta name="viewport" content="width=device-width, initial-scale=1.0">
	</head>
	<body>
		<div id="root"></div>
		<script type="module" src="./index.tsx"></script>
	</body>
</html>
```

```tsx [public/index.tsx]
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function App() {
	const [count, setCount] = useState(0)
	const increase = () => setCount((c) => c + 1)

	return (
		<main>
			<h2>{count}</h2>
			<button onClick={increase}>
				Increase
			</button>
		</main>
	)
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
```

:::

3. `http://localhost:3000/public`으로 이동하여 결과를 확인하세요.

이렇게 하면 bundler 없이 단일 프로젝트에서 프론트엔드와 백엔드를 개발할 수 있습니다.

Fullstack Dev Server가 HMR, [Tailwind](#tailwind), Tanstack Query, [Eden Treaty](/eden/overview) 및 path alias와 함께 작동하는 것을 확인했습니다.

## Custom prefix path

`staticPlugin`에 `prefix` 옵션을 전달하여 기본 `/public` prefix를 변경할 수 있습니다.

```ts
import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'

new Elysia()
  	.use(
  		staticPlugin({
  			prefix: '/' // [!code ++]
   		})
   )
  .listen(3000)
```

이렇게 하면 `/public` 대신 `/`에서 정적 파일을 제공합니다.

자세한 설정 옵션은 [static plugin](/plugins/static)을 참조하세요.

## Tailwind CSS
Bun Fullstack Dev Server와 함께 Tailwind CSS를 사용할 수도 있습니다.

1. 종속성 설치

```bash
bun add tailwindcss@4
bun add -d bun-plugin-tailwind
```

2. 다음 내용으로 `bunfig.toml` 생성:

```toml
[serve.static]
plugins = ["bun-plugin-tailwind"]
```

3. Tailwind directive가 있는 CSS 파일 생성

::: code-group

```css [public/global.css]
@tailwind base;
```

:::

4. HTML 또는 JavaScript/TypeScript 파일에 Tailwind 추가

::: code-group

```html [public/index.html]
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Elysia React App</title>

		<meta name="viewport" content="width=device-width, initial-scale=1.0">
  		<link rel="stylesheet" href="tailwindcss"> <!-- [!code ++] -->
	</head>
	<body>
		<div id="root"></div>
		<script type="module" src="./index.tsx"></script>
	</body>
</html>
```

```tsx [public/index.tsx]
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

import './global.css' // [!code ++]

function App() {
	const [count, setCount] = useState(0)
	const increase = () => setCount((c) => c + 1)

	return (
		<main>
			<h2>{count}</h2>
			<button onClick={increase}>
				Increase
			</button>
		</main>
	)
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
```

:::

## Path Alias

Bun Fullstack Dev Server에서 path alias를 사용할 수도 있습니다.

1. `tsconfig.json`에 `paths` 추가

```json
{
  "compilerOptions": {
	"baseUrl": ".", // [!code +=]
	"paths": { // [!code +=]
	  "@public/*": ["public/*"] // [!code +=]
	} // [!code +=]
  }
}
```

2. 코드에서 alias 사용

```tsx
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

import '@public/global.css' // [!code ++]

function App() {
	const [count, setCount] = useState(0)
	const increase = () => setCount((c) => c + 1)

	return (
		<main>
			<h2>{count}</h2>
			<button onClick={increase}>
				Increase
			</button>
		</main>
	)
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
```

이것은 추가 구성 없이 즉시 작동합니다.

## Build for Production

일반 Elysia 서버처럼 fullstack 서버를 빌드할 수 있습니다.

```bash
bun build --compile --target bun --outfile server src/index.ts
```

이렇게 하면 단일 실행 파일 **server**가 생성됩니다.

**server** 실행 파일을 실행할 때 개발 환경과 유사하게 **public** 폴더를 포함해야 합니다.

자세한 내용은 [Deploy to Production](/patterns/deploy)을 참조하세요.
