---
title: HTML Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: HTML Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Plugin for Elysia that adds shortcut support for returning HTML in the Elysia server. Start by installing the plugin with "bun add @elysiajs/html".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that adds shortcut support for returning HTML in the Elysia server. Start by installing the plugin with "bun add @elysiajs/html".
---

# HTML Plugin

[JSX](#jsx)와 HTML을 적절한 헤더 및 지원과 함께 사용할 수 있습니다.

설치 방법:

```bash
bun add @elysiajs/html
```

사용 방법:

```tsx twoslash
import React from 'react'
// ---cut---
import { Elysia } from 'elysia'
import { html, Html } from '@elysiajs/html'

new Elysia()
	.use(html())
	.get(
		'/html',
		() => `
            <html lang='en'>
                <head>
                    <title>Hello World</title>
                </head>
                <body>
                    <h1>Hello World</h1>
                </body>
            </html>`
	)
	.get('/jsx', () => (
		<html lang="en">
			<head>
				<title>Hello World</title>
			</head>
			<body>
				<h1>Hello World</h1>
			</body>
		</html>
	))
	.listen(3000)
```

이 플러그인은 자동으로 `Content-Type: text/html; charset=utf8` 헤더를 응답에 추가하고, `<!doctype html>`을 추가하며, Response 객체로 변환합니다.

## JSX

Elysia HTML은 [@kitajs/html](https://github.com/kitajs/html)을 기반으로 하여 컴파일 타임에 JSX를 문자열로 정의하여 높은 성능을 달성할 수 있습니다.

JSX를 사용해야 하는 파일의 이름을 접미사 **"x"**로 끝나도록 지정하세요:

- .js -> .jsx
- .ts -> .tsx

TypeScript 타입을 등록하려면 **tsconfig.json**에 다음을 추가하세요:

```jsonc
// tsconfig.json
{
	"compilerOptions": {
		"jsx": "react",
		"jsxFactory": "Html.createElement",
		"jsxFragmentFactory": "Html.Fragment"
	}
}
```

이제 JSX를 템플릿 엔진으로 사용할 수 있습니다:

```tsx twoslash
import React from 'react'
// ---cut---
import { Elysia } from 'elysia'
import { html, Html } from '@elysiajs/html' // [!code ++]

new Elysia()
	.use(html()) // [!code ++]
	.get('/', () => (
		<html lang="en">
			<head>
				<title>Hello World</title>
			</head>
			<body>
				<h1>Hello World</h1>
			</body>
		</html>
	))
	.listen(3000)
```

`Cannot find name 'Html'. Did you mean 'html'?` 오류가 발생하면 JSX 템플릿에 다음 import를 추가해야 합니다:

```tsx
import { Html } from '@elysiajs/html'
```

대문자로 작성하는 것이 중요합니다.

## XSS

Elysia HTML은 Kita HTML 플러그인을 사용하여 컴파일 타임에 가능한 XSS 공격을 감지합니다.

전용 `safe` 속성을 사용하여 사용자 값을 sanitize하고 XSS 취약점을 방지할 수 있습니다.

```tsx
import { Elysia, t } from 'elysia'
import { html, Html } from '@elysiajs/html'

new Elysia()
	.use(html())
	.post(
		'/',
		({ body }) => (
			<html lang="en">
				<head>
					<title>Hello World</title>
				</head>
				<body>
					<h1 safe>{body}</h1>
				</body>
			</html>
		),
		{
			body: t.String()
		}
	)
	.listen(3000)
```

그러나 대규모 앱을 구축할 때는 코드베이스에서 가능한 XSS 취약점을 감지하기 위한 타입 알림을 사용하는 것이 가장 좋습니다.

타입 안전 알림을 추가하려면 다음을 설치하세요:

```sh
bun add @kitajs/ts-html-plugin
```

그런 다음 **tsconfig.json**에 다음을 추가하세요:

```jsonc
// tsconfig.json
{
	"compilerOptions": {
		"jsx": "react",
		"jsxFactory": "Html.createElement",
		"jsxFragmentFactory": "Html.Fragment",
		"plugins": [{ "name": "@kitajs/ts-html-plugin" }]
	}
}
```

## Options

### contentType

- Type: `string`
- Default: `'text/html; charset=utf8'`

응답의 content-type입니다.

### autoDetect

- Type: `boolean`
- Default: `true`

HTML 콘텐츠를 자동으로 감지하고 content-type을 설정할지 여부입니다.

### autoDoctype

- Type: `boolean | 'full'`
- Default: `true`

`<html>`로 시작하는 응답에 `<!doctype html>`을 자동으로 추가할지 여부입니다(찾을 수 없는 경우).

`full`을 사용하면 플러그인 없이 반환된 응답에도 자동으로 doctype을 추가합니다.

```ts
// 플러그인 없이
app.get('/', () => '<html></html>')

// 플러그인과 함께
app.get('/', ({ html }) => html('<html></html>'))
```

### isHtml

- Type: `(value: string) => boolean`
- Default: `isHtml` (exported function)

문자열이 html인지 감지하는 데 사용되는 함수입니다. 기본 구현은 길이가 7보다 크고 `<`로 시작하고 `>`로 끝나는 경우입니다.

HTML을 검증할 실제 방법이 없으므로 기본 구현은 최선의 추측입니다.
