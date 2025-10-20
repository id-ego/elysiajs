---
title: TypeBox (Elysia.t) - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: TypeBox (Elysia.t) - ElysiaJS

    - - meta
      - name: 'description'
        content: Schemas are strictly typed definitions, used to infer TypeScript's type and data validation of an incoming request and outgoing response. Elysia's schema validation is based on Sinclair's TypeBox, a TypeScript library for data validation.

    - - meta
      - property: 'og:description'
        content: Schemas are strictly typed definitions, used to infer TypeScript's type and data validation of an incoming request and outgoing response. Elysia's schema validation is based on Sinclair's TypeBox, a TypeScript library for data validation.
---

<script setup>
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'
</script>

# TypeBox (Elysia.t)

다음은 `Elysia.t`를 사용하여 유효성 검사 타입을 작성하기 위한 일반적인 패턴입니다.

<Deck>
    <Card title="Primitive Type" href="#primitive-type">
    	일반적인 TypeBox API
    </Card>
    <Card title="Elysia Type" href="#elysia-type">
   		Elysia와 HTTP를 위한 전용 타입
    </Card>
    <Card title="Elysia Behavior" href="#elysia-behavior">
  		TypeBox와 다른 Elysia.t 동작
    </Card>
</Deck>

## Primitive Type

TypeBox API는 TypeScript 타입을 중심으로 설계되었으며 유사합니다.

**String**, **Number**, **Boolean** 및 **Object**와 같은 익숙한 이름과 동작이 TypeScript 대응물과 교차하며, **Intersect**, **KeyOf**, **Tuple**과 같은 고급 기능도 다양성을 위해 제공됩니다.

TypeScript에 익숙하다면 TypeBox 스키마를 생성하는 것은 TypeScript 타입을 작성하는 것과 동일하게 동작하지만, 런타임에 실제 타입 유효성 검사를 제공합니다.

첫 번째 스키마를 생성하려면 Elysia에서 **Elysia.t**를 가져오고 가장 기본적인 타입으로 시작하세요:

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.post('/', ({ body }) => `Hello ${body}`, {
		body: t.String()
	})
	.listen(3000)
```

이 코드는 Elysia에게 들어오는 HTTP body를 유효성 검사하여 body가 문자열인지 확인하도록 지시합니다. 문자열인 경우 요청 파이프라인과 핸들러를 통해 흐를 수 있습니다.

모양이 일치하지 않으면 [Error Life Cycle](/essential/life-cycle.html#on-error)로 오류를 throw합니다.

![Elysia Life Cycle](/assets/lifecycle-chart.svg)

### Basic Type

TypeBox는 TypeScript 타입과 동일한 동작을 가진 기본 원시 타입을 제공합니다.

다음 표는 가장 일반적인 기본 타입을 나열합니다:

<table class="md-table">
<tbody>
<tr>
<td>TypeBox</td>
<td>TypeScript</td>
</tr>

<tr>
<td>

```typescript
t.String()
```

</td>
<td>

```typescript
string
```

</td>
</tr>

<tr>
<td>

```typescript
t.Number()
```

</td>
<td>

```typescript
number
```

</td>
</tr>

<tr>
<td>

```typescript
t.Boolean()
```

</td>
<td>

```typescript
boolean
```

</td>
</tr>

<tr>
<td>

```typescript
t.Array(
    t.Number()
)
```

</td>
<td>

```typescript
number[]
```

</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number()
})
```

</td>
<td>

```typescript
{
    x: number
}
```

</td>
</tr>

<tr>
<td>

```typescript
t.Null()
```

</td>
<td>

```typescript
null
```

</td>
</tr>

<tr>
<td>

```typescript
t.Literal(42)
```

</td>
<td>

```typescript
42
```

</td>
</tr>
</tbody>
</table>

Elysia는 TypeBox의 모든 타입을 확장하여 대부분의 API를 TypeBox에서 참조하여 Elysia에서 사용할 수 있습니다.

TypeBox가 지원하는 추가 타입은 [TypeBox의 Type](https://github.com/sinclairzx81/typebox#json-types)을 참조하세요.

### Attribute

TypeBox는 JSON Schema 7 사양을 기반으로 더 포괄적인 동작을 위해 인수를 허용할 수 있습니다.

<table class="md-table">
<tbody>
<tr>
<td>TypeBox</td>
<td>TypeScript</td>
</tr>

<tr>
<td>

```typescript
t.String({
    format: 'email'
})
```

</td>
<td>

```typescript
saltyaom@elysiajs.com
```

</td>
</tr>

<tr>
<td>

```typescript
t.Number({
    minimum: 10,
    maximum: 100
})
```

</td>
<td>

```typescript
10
```

</td>
</tr>

<tr>
<td>

```typescript
t.Array(
    t.Number(),
    {
        /**
         * Minimum number of items
         */
        minItems: 1,
        /**
         * Maximum number of items
         */
        maxItems: 5
    }
)
```

</td>
<td>

```typescript
[1, 2, 3, 4, 5]
```

</td>
</tr>

<tr>
<td>

```typescript
t.Object(
    {
        x: t.Number()
    },
    {
        /**
         * @default false
         * Accept additional properties
         * that not specified in schema
         * but still match the type
         */
        additionalProperties: true
    }
)
```

</td>
<td>

```typescript
x: 100
y: 200
```

</td>
</tr>
</tbody>
</table>

각 속성에 대한 자세한 설명은 [JSON Schema 7 specification](https://json-schema.org/draft/2020-12/json-schema-validation)을 참조하세요.

## Honorable Mentions

다음은 스키마를 생성할 때 유용하게 사용되는 일반적인 패턴입니다.

### Union

`t.Object`의 필드가 여러 타입을 가질 수 있도록 허용합니다.

<table class="md-table">
<tbody>
<tr>
<td>TypeBox</td>
<td>TypeScript</td>
<td>Value</td>
</tr>

<tr>
<td>

```typescript
t.Union([
    t.String(),
    t.Number()
])
```

</td>
<td>

```typescript
string | number
```

</td>

<td>

```
Hello
123
```

</td>
</tr>
</tbody>
</table>

### Optional

`t.Object`의 필드를 undefined 또는 optional로 허용합니다.

<table class="md-table">
<tbody>
<tr>
<td>TypeBox</td>
<td>TypeScript</td>
<td>Value</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number(),
    y: t.Optional(t.Number())
})
```

</td>
<td>

```typescript
{
    x: number,
    y?: number
}
```

</td>

<td>

```typescript
{
    x: 123
}
```

</td>
</tr>
</tbody>
</table>

### Partial

`t.Object`의 모든 필드를 optional로 허용합니다.

<table class="md-table">
<tbody>
<tr>
<td>TypeBox</td>
<td>TypeScript</td>
<td>Value</td>
</tr>

<tr>
<td>

```typescript
t.Partial(
    t.Object({
        x: t.Number(),
        y: t.Number()
    })
)
```

</td>
<td>

```typescript
{
    x?: number,
    y?: number
}
```

</td>

<td>

```typescript
{
    y: 123
}
```

</td>
</tr>
</tbody>
</table>

## Elysia Type

`Elysia.t`는 서버 사용을 위해 사전 구성된 TypeBox를 기반으로 하며, 서버 측 유효성 검사에서 일반적으로 발견되는 추가 타입을 제공합니다.

Elysia 타입의 모든 소스 코드는 `elysia/type-system`에서 찾을 수 있습니다.

다음은 Elysia가 제공하는 타입입니다:

<Deck>
	<Card title="UnionEnum" href="#unionenum">
		`UnionEnum`은 값이 지정된 값 중 하나가 되도록 허용합니다.
    </Card>
    <Card title="File" href="#file">
        단일 파일. <strong>파일 업로드</strong> 유효성 검사에 유용합니다
    </Card>
    <Card title="Files" href="#files">
        <a href="#file">File</a>에서 확장되며, 단일 필드에 파일 배열에 대한 지원을 추가합니다
    </Card>
    <Card title="Cookie" href="#cookie">
        Object 타입에서 확장된 Cookie Jar의 객체 형태 표현
    </Card>
    <Card title="Nullable" href="#nullable">
    값이 null이 될 수 있지만 undefined는 될 수 없도록 허용합니다
    </Card>
    <Card title="Maybe Empty" href="#maybeempty">
        빈 문자열 또는 null 값을 허용합니다
    </Card>
    <Card title="Form" href="#form">
    	FormData body의 타입을 반환 값으로 강제하고 유효성 검사합니다
    </Card>
	<Card title="UInt8Array" href="#uint8array">
		`Uint8Array`로 파싱될 수 있는 버퍼를 허용합니다
	</Card>
	<Card title="ArrayBuffer" href="#arraybuffer">
		`ArrayBuffer`로 파싱될 수 있는 버퍼를 허용합니다
	</Card>
    <Card title="ObjectString" href="#object-string">
    	객체로 파싱될 수 있는 문자열을 허용합니다
    </Card>
    <Card title="BooleanString" href="#boolean-string">
    	boolean으로 파싱될 수 있는 문자열을 허용합니다
    </Card>
    <Card title="Numeric" href="#numeric">
        숫자 문자열 또는 숫자를 허용하고 값을 숫자로 변환합니다
    </Card>
</Deck>

### UnionEnum

`UnionEnum`은 값이 지정된 값 중 하나가 되도록 허용합니다.

```typescript
t.UnionEnum(['rapi', 'anis', 1, true, false])
```

### File

단일 파일, **파일 업로드** 유효성 검사에 유용합니다.

```typescript
t.File()
```

File은 기본 스키마의 속성을 확장하며 다음과 같은 추가 속성이 있습니다:

#### type

파일의 형식(예: image, video, audio)을 지정합니다.

배열이 제공되면 형식 중 하나가 유효한지 검증하려고 시도합니다.

```typescript
type?: MaybeArray<string>
```

#### minSize

파일의 최소 크기입니다.

바이트 단위의 숫자 또는 파일 단위 접미사를 허용합니다:

```typescript
minSize?: number | `${number}${'k' | 'm'}`
```

#### maxSize

파일의 최대 크기입니다.

바이트 단위의 숫자 또는 파일 단위 접미사를 허용합니다:

```typescript
maxSize?: number | `${number}${'k' | 'm'}`
```

#### File Unit Suffix:

다음은 파일 단위의 사양입니다:
m: MegaByte (1048576 byte)
k: KiloByte (1024 byte)

### Files

[File](#file)에서 확장되며, 단일 필드에 파일 배열에 대한 지원을 추가합니다.

```typescript
t.Files()
```

Files는 기본 스키마, 배열 및 File의 속성을 확장합니다.

### Cookie

Object 타입에서 확장된 Cookie Jar의 객체 형태 표현입니다.

```typescript
t.Cookie({
    name: t.String()
})
```

Cookie는 [Object](https://json-schema.org/draft/2020-12/json-schema-validation#name-validation-keywords-for-obj) 및 [Cookie](https://github.com/jshttp/cookie#options-1)의 속성을 확장하며 다음과 같은 추가 속성이 있습니다:

#### secrets

쿠키 서명을 위한 비밀 키입니다.

문자열 또는 문자열 배열을 허용합니다.

```typescript
secrets?: string | string[]
```

배열이 제공되면 [Key Rotation](https://crypto.stackexchange.com/questions/41796/whats-the-purpose-of-key-rotation)이 사용됩니다. 새로 서명된 값은 첫 번째 비밀을 키로 사용합니다.

### Nullable

값이 null이 될 수 있지만 undefined는 될 수 없도록 허용합니다.

```typescript
t.Nullable(t.String())
```

### MaybeEmpty

값이 null과 undefined가 될 수 있도록 허용합니다.

```typescript
t.MaybeEmpty(t.String())
```

추가 정보는 [`elysia/type-system`](https://github.com/elysiajs/elysia/blob/main/src/type-system.ts)에서 타입 시스템의 전체 소스 코드를 찾을 수 있습니다.

### Form

[form](/essential/handler.html#formdata) (FormData)의 반환 값을 검증하기 위한 지원이 있는 `t.Object`의 구문 설탕입니다.

```typescript
t.FormData({
	someValue: t.File()
})
```

### UInt8Array
`Uint8Array`로 파싱될 수 있는 버퍼를 허용합니다.

```typescript
t.UInt8Array()
```

이는 바이너리 파일 업로드와 같이 `Uint8Array`로 파싱될 수 있는 버퍼를 허용하려는 경우 유용합니다. body 타입을 강제하기 위해 `arrayBuffer` 파서와 함께 body 유효성 검사에 사용하도록 설계되었습니다.

### ArrayBuffer
`ArrayBuffer`로 파싱될 수 있는 버퍼를 허용합니다.

```typescript
t.ArrayBuffer()
```

이는 바이너리 파일 업로드와 같이 `Uint8Array`로 파싱될 수 있는 버퍼를 허용하려는 경우 유용합니다. body 타입을 강제하기 위해 `arrayBuffer` 파서와 함께 body 유효성 검사에 사용하도록 설계되었습니다.

### ObjectString
객체로 파싱될 수 있는 문자열을 허용합니다.

```typescript
t.ObjectString()
```

이는 쿼리 문자열, 헤더 또는 FormData body와 같이 명시적으로 허용되지 않는 환경에서 객체로 파싱될 수 있는 문자열을 허용하려는 경우 유용합니다.

### BooleanString
boolean으로 파싱될 수 있는 문자열을 허용합니다.

[ObjectString](#objectstring)과 유사하게, 이는 명시적으로 허용되지 않는 환경에서 boolean으로 파싱될 수 있는 문자열을 허용하려는 경우 유용합니다.

```typescript
t.BooleanString()
```

### Numeric
Numeric은 숫자 문자열 또는 숫자를 허용하고 값을 숫자로 변환합니다.

```typescript
t.Numeric()
```

이는 경로 매개변수 또는 쿼리 문자열과 같이 들어오는 값이 숫자 문자열인 경우 유용합니다.

Numeric은 [Numeric Instance](https://json-schema.org/draft/2020-12/json-schema-validation#name-validation-keywords-for-num)와 동일한 속성을 허용합니다.

## Elysia behavior

Elysia는 기본적으로 TypeBox를 사용합니다.

그러나 HTTP 처리를 더 쉽게 만들기 위해 Elysia에는 일부 전용 타입이 있으며 TypeBox와 일부 동작 차이가 있습니다.

## Optional
필드를 optional로 만들려면 `t.Optional`을 사용하세요.

이렇게 하면 클라이언트가 쿼리 매개변수를 선택적으로 제공할 수 있습니다. 이 동작은 `body`, `headers`에도 적용됩니다.

이는 optional이 객체의 필드를 optional로 표시하는 TypeBox와 다릅니다.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/optional', ({ query }) => query, {
                       // ^?




		query: t.Optional(
			t.Object({
				name: t.String()
			})
		)
	})
```

## Number to Numeric
기본적으로 Elysia는 라우트 스키마로 제공될 때 `t.Number`를 [t.Numeric](#numeric)으로 변환합니다.

파싱된 HTTP 헤더, 쿼리, url 매개변수는 항상 문자열이기 때문입니다. 즉, 값이 숫자이더라도 문자열로 처리됩니다.

Elysia는 문자열 값이 숫자처럼 보이면 적절하게 변환하여 이 동작을 재정의합니다.

이는 라우트 스키마로 사용될 때만 적용되며 중첩된 `t.Object`에는 적용되지 않습니다.

```ts
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/:id', ({ id }) => id, {
		params: t.Object({
			// Converted to t.Numeric()
			id: t.Number()
		}),
		body: t.Object({
			// NOT converted to t.Numeric()
			id: t.Number()
		})
	})

// NOT converted to t.Numeric()
t.Number()
```

## Boolean to BooleanString
[Number to Numeric](#number-to-numeric)과 유사합니다.

모든 `t.Boolean`은 `t.BooleanString`으로 변환됩니다.

```ts
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/:id', ({ id }) => id, {
		params: t.Object({
			// Converted to t.Boolean()
			id: t.Boolean()
		}),
		body: t.Object({
			// NOT converted to t.Boolean()
			id: t.Boolean()
		})
	})

// NOT converted to t.BooleanString()
t.Boolean()
```
