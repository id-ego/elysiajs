---
title: Validation - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Validation - ElysiaJS

    - - meta
      - name: 'description'
        content: 스키마는 엄격하게 타입이 정의된 정의로, 들어오는 요청과 나가는 응답의 TypeScript 타입 추론 및 데이터 유효성 검사에 사용됩니다. Elysia의 스키마 유효성 검사는 데이터 유효성 검사를 위한 TypeScript 라이브러리인 Sinclair의 TypeBox를 기반으로 합니다.

    - - meta
      - property: 'og:description'
        content: 스키마는 엄격하게 타입이 정의된 정의로, 들어오는 요청과 나가는 응답의 TypeScript 타입 추론 및 데이터 유효성 검사에 사용됩니다. Elysia의 스키마 유효성 검사는 데이터 유효성 검사를 위한 TypeScript 라이브러리인 Sinclair의 TypeBox를 기반으로 합니다.
---

<script setup>
import { Elysia, t, ValidationError } from 'elysia'

import Playground from '../components/nearl/playground.vue'
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'

const demo1 = new Elysia()
    .get('/none', () => 'hi')
    .guard({
        query: t.Object({
            name: t.String()
        })
    })
    .get('/query', ({ query: { name } }) => name)

const demo2 = new Elysia()
    .get('/id/1', '1')
    .get('/id/a', () => {
        throw new ValidationError(
            'params',
            t.Object({
                id: t.Numeric()
            }),
            {
                id: 'a'
            }
        )
    })

const demo3 = new Elysia()
 	.guard({
        query: t.Object({
            name: t.Number()
        })
    })
    .get('/query?id=1', ({ query: { id } }) => id)
    .get('/query?id=salt', ({ query: { id } }) => id)

const demo4 = new Elysia()
 	.guard({
        query: t.Object({
            name: t.Array(t.String()),
            squad: t.String()
        })
    })
    .get('/query?name=rapi,anis,neon&squad=counter', ({ query: { id } }) => id)
    .get('/query?name=rapi&name=anis&name=neon&squad=counter', ({ query: { id } }) => id)
</script>

# Validation

API 서버를 만드는 목적은 입력을 받아 처리하는 것입니다.

JavaScript는 모든 데이터가 모든 타입이 될 수 있도록 허용합니다. Elysia는 데이터가 올바른 형식인지 확인하기 위해 데이터를 검증하는 도구를 기본적으로 제공합니다.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)
```

### TypeBox

**Elysia.t**는 런타임, 컴파일 타임 및 단일 소스의 진실에서 OpenAPI 스키마 생성에서 타입 안전성을 제공하는 [TypeBox](https://github.com/sinclairzx81/typebox) 기반 스키마 빌더입니다.

Elysia는 원활한 경험을 위해 서버 측 유효성 검사에 TypeBox를 맞춤화합니다.

### Standard Schema
Elysia는 [Standard Schema](https://github.com/standard-schema/standard-schema)도 지원하여 선호하는 유효성 검사 라이브러리를 사용할 수 있습니다:
- Zod
- Valibot
- ArkType
- Effect Schema
- Yup
- Joi
- [그 외](https://github.com/standard-schema/standard-schema)

Standard Schema를 사용하려면 스키마를 가져와서 경로 핸들러에 제공하기만 하면 됩니다.

```typescript twoslash
import { Elysia } from 'elysia'
import { z } from 'zod'
import * as v from 'valibot'

new Elysia()
	.get('/id/:id', ({ params: { id }, query: { name } }) => id, {
	//                           ^?
		params: z.object({
			id: z.coerce.number()
		}),
		query: v.object({
			name: v.literal('Lilith')
		})
	})
	.listen(3000)
```

문제 없이 동일한 핸들러에서 모든 검증기를 함께 사용할 수 있습니다.

## Schema type
Elysia는 다음 타입으로 선언적 스키마를 지원합니다:

<Deck>
    <Card title="Body" href="#body">
        들어오는 HTTP 메시지 유효성 검사
    </Card>
    <Card title="Query" href="#query">
        쿼리 문자열 또는 URL 매개변수
    </Card>
    <Card title="Params" href="#params">
        경로 매개변수
    </Card>
    <Card title="Headers" href="#headers">
        요청 헤더
    </Card>
    <Card title="Cookie" href="#cookie">
        요청 쿠키
    </Card>
    <Card title="Response" href="#response">
        요청 응답
    </Card>
</Deck>

---

이러한 속성은 들어오는 요청의 유효성을 검사하기 위해 경로 핸들러의 세 번째 인수로 제공되어야 합니다.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', () => 'Hello World!', {
        query: t.Object({
            name: t.String()
        }),
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)
```

<Playground :elysia="demo1" />

응답은 다음과 같아야 합니다:
| URL | Query | Params |
| --- | --------- | ------------ |
| /id/a | ❌ | ❌ |
| /id/1?name=Elysia | ✅ | ✅ |
| /id/1?alias=Elysia | ❌ | ✅ |
| /id/a?name=Elysia | ✅ | ❌ |
| /id/a?alias=Elysia | ❌ | ❌ |

스키마가 제공되면 타입이 스키마에서 자동으로 추론되고 API 문서에 대한 OpenAPI 타입이 생성되어 수동으로 타입을 제공하는 중복 작업을 제거합니다.

## Guard

Guard를 사용하여 여러 핸들러에 스키마를 적용할 수 있습니다.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/none', ({ query }) => 'hi')
                   // ^?

    .guard({ // [!code ++]
        query: t.Object({ // [!code ++]
            name: t.String() // [!code ++]
        }) // [!code ++]
    }) // [!code ++]
    .get('/query', ({ query }) => query)
                    // ^?
    .listen(3000)
```

<br>

이 코드는 쿼리가 그 이후의 모든 핸들러에 대해 문자열 값을 가진 **name**을 가져야 함을 보장합니다. 응답은 다음과 같이 나열되어야 합니다:

<Playground
    :elysia="demo1"
    :mock="{
        '/query': {
            GET: 'Elysia'
        }
    }"
/>

응답은 다음과 같이 나열되어야 합니다:

| Path          | Response |
| ------------- | -------- |
| /none         | hi       |
| /none?name=a  | hi       |
| /query        | error    |
| /query?name=a | a        |

동일한 속성에 대해 여러 전역 스키마가 정의된 경우 최신 스키마가 우선합니다. 로컬 및 전역 스키마가 모두 정의된 경우 로컬 스키마가 우선합니다.

### Guard Schema Type
Guard는 유효성 검사를 정의하는 2가지 타입을 지원합니다.

### **override (기본값)**

스키마가 서로 충돌하는 경우 스키마를 재정의합니다.

![Elysia run with default override guard showing schema gets override](/blog/elysia-13/schema-override.webp)

### **standalone**


충돌하는 스키마를 분리하고 둘 다 독립적으로 실행하여 둘 다 유효성을 검사합니다.

![Elysia run with standalone merging multiple guard together](/blog/elysia-13/schema-standalone.webp)

`schema`로 guard의 스키마 타입을 정의하려면:
```ts
import { Elysia } from 'elysia'

new Elysia()
	.guard({
		schema: 'standalone', // [!code ++]
		response: t.Object({
			title: t.String()
		})
	})
```

## Body
들어오는 [HTTP 메시지](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages)는 서버로 전송되는 데이터입니다. JSON, form-data 또는 다른 형식일 수 있습니다.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.post('/body', ({ body }) => body, {
                    // ^?




		body: t.Object({
			name: t.String()
		})
	})
	.listen(3000)
```

유효성 검사는 다음과 같아야 합니다:
| Body | Validation |
| --- | --------- |
| \{ name: 'Elysia' \} | ✅ |
| \{ name: 1 \} | ❌ |
| \{ alias: 'Elysia' \} | ❌ |
| `undefined` | ❌ |

Elysia는 HTTP/1.1 [RFC2616](https://www.rfc-editor.org/rfc/rfc2616#section-4.3)의 사양에 따라 **GET** 및 **HEAD** 메시지에 대한 body-parser를 기본적으로 비활성화합니다.

> 요청 메서드에 entity-body에 대한 정의된 의미 체계가 포함되지 않은 경우 요청을 처리할 때 message-body를 무시해야 합니다(SHOULD).

대부분의 브라우저는 기본적으로 **GET** 및 **HEAD** 메서드에 대한 body의 첨부를 비활성화합니다.

#### Specs
들어오는 [HTTP 메시지](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages) (또는 body)의 유효성을 검사합니다.

이러한 메시지는 웹 서버가 처리할 추가 메시지입니다.

body는 `fetch` API의 `body`와 같은 방식으로 제공됩니다. 콘텐츠 타입은 정의된 body에 따라 적절하게 설정되어야 합니다.

```typescript
fetch('https://elysiajs.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: 'Elysia'
    })
})
```

### File
File은 파일을 업로드하는 데 사용할 수 있는 특수한 타입의 body입니다.
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

파일 타입을 제공하면 Elysia는 자동으로 content-type이 `multipart/form-data`라고 가정합니다.

### File (Standard Schema)
Standard Schema를 사용하는 경우 Elysia가 `t.File`과 유사하게 콘텐츠 타입을 자동으로 검증할 수 없다는 점이 중요합니다.

그러나 Elysia는 매직 넘버를 사용하여 파일 타입을 검증하는 데 사용할 수 있는 `fileType`을 내보냅니다.

```typescript twoslash
import { Elysia, fileType } from 'elysia'
import { z } from 'zod'

new Elysia()
	.post('/body', ({ body }) => body, {
		body: z.object({
			file: z.file().refine((file) => fileType(file, 'image/jpeg')) // [!code ++]
		})
	})
```

**대부분의 검증기가 실제로 파일을 올바르게 검증하지 않기 때문에** `fileType`을 사용하여 파일 타입을 검증**해야 합니다**. 콘텐츠 타입의 값을 확인하는 것과 같이 보안 취약점으로 이어질 수 있습니다.

## Query
Query는 URL을 통해 전송되는 데이터입니다. `?key=value` 형식일 수 있습니다.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/query', ({ query }) => query, {
                    // ^?




		query: t.Object({
			name: t.String()
		})
	})
	.listen(3000)
```

Query는 객체 형식으로 제공되어야 합니다.

유효성 검사는 다음과 같아야 합니다:
| Query | Validation |
| ---- | --------- |
| /?name=Elysia | ✅ |
| /?name=1 | ✅ |
| /?alias=Elysia | ❌ |
| /?name=ElysiaJS&alias=Elysia | ✅ |
| / | ❌ |

#### Specs

쿼리 문자열은 **?**로 시작하는 URL의 일부이며, 일반적으로 필터링이나 검색과 같은 사용자 정의 동작을 위해 서버에 추가 정보를 전달하는 데 사용되는 키-값 쌍인 하나 이상의 쿼리 매개변수를 포함할 수 있습니다.

![URL Object](/essential/url-object.svg)

Query는 Fetch API에서 **?** 뒤에 제공됩니다.

```typescript
fetch('https://elysiajs.com/?name=Elysia')
```

쿼리 매개변수를 지정할 때 모든 쿼리 매개변수 값은 문자열로 표현되어야 한다는 점을 이해하는 것이 중요합니다. 이는 URL에 인코딩되고 추가되는 방식 때문입니다.

### Coercion
Elysia는 `query`에서 적용 가능한 스키마를 각각의 타입으로 자동으로 강제 변환합니다.

자세한 내용은 [Elysia behavior](/patterns/type#elysia-behavior)를 참조하세요.

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/', ({ query }) => query, {
               // ^?




		query: t.Object({ // [!code ++]
			name: t.Number() // [!code ++]
		}) // [!code ++]
	})
	.listen(3000)
```

<Playground
    :elysia="demo3"
    :mock="{
        '/query?id=1': {
            GET: '1'
        },
        '/query?id=salt': {
        	GET: 'string cannot be assigned to number'
        }
    }"
/>

### Array
기본적으로 Elysia는 여러 번 지정되더라도 쿼리 매개변수를 단일 문자열로 취급합니다.

배열을 사용하려면 명시적으로 배열로 선언해야 합니다.

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/', ({ query }) => query, {
               // ^?




		query: t.Object({
			name: t.Array(t.String()) // [!code ++]
		})
	})
	.listen(3000)
```

<Playground
    :elysia="demo4"
    :mock="{
        '/query?name=rapi,anis,neon&squad=counter': {
            GET: JSON.stringify({
                name: ['rapi', 'anis', 'neon'],
                squad: 'counter'
            }, null, 4)
        },
        '/query?name=rapi&name=anis&name=neon&squad=counter': {
        	GET: JSON.stringify({
                name: ['rapi', 'anis', 'neon'],
                squad: 'counter'
            }, null, 4)
        }
    }"
/>

Elysia가 속성이 배열에 할당 가능한 것을 감지하면 Elysia는 지정된 타입의 배열로 강제 변환합니다.

기본적으로 Elysia는 다음 형식으로 쿼리 배열을 포맷합니다:

#### nuqs
이 형식은 [nuqs](https://nuqs.47ng.com)에서 사용됩니다.

**,**를 구분 기호로 사용하면 속성이 배열로 취급됩니다.

```
http://localhost?name=rapi,anis,neon&squad=counter
{
	name: ['rapi', 'anis', 'neon'],
	squad: 'counter'
}
```

#### HTML form format
키가 여러 번 할당되면 키는 배열로 취급됩니다.

이는 같은 이름을 가진 입력이 여러 번 지정될 때 HTML 양식 형식과 유사합니다.

```
http://localhost?name=rapi&name=anis&name=neon&squad=counter
// name: ['rapi', 'anis', 'neon']
```

## Params
Params 또는 경로 매개변수는 URL 경로를 통해 전송되는 데이터입니다.

`/key` 형식일 수 있습니다.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/id/:id', ({ params }) => params, {
                      // ^?




		params: t.Object({
			id: t.Number()
		})
	})
```

<Playground :elysia="demo2" />

Params는 객체 형식으로 제공되어야 합니다.

유효성 검사는 다음과 같아야 합니다:
| URL | Validation |
| --- | --------- |
| /id/1 | ✅ |
| /id/a | ❌ |

#### Specs
경로 매개변수 <small>(쿼리 문자열 또는 쿼리 매개변수와 혼동하지 말 것)</small>.

**특정 값 패턴(예: 숫자 값 또는 템플릿 리터럴 패턴)이 필요한 경우가 아니면 Elysia가 경로 매개변수에서 자동으로 타입을 추론할 수 있으므로 이 필드는 일반적으로 필요하지 않습니다**.

```typescript
fetch('https://elysiajs.com/id/1')
```

### Params type inference
params 스키마가 제공되지 않으면 Elysia는 자동으로 타입을 문자열로 추론합니다.
```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/id/:id', ({ params }) => params)
                      // ^?
```

## Headers
Headers는 요청 헤더를 통해 전송되는 데이터입니다.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/headers', ({ headers }) => headers, {
                      // ^?




		headers: t.Object({
			authorization: t.String()
		})
	})
```

다른 타입과 달리 헤더는 기본적으로 `additionalProperties`가 `true`로 설정됩니다.

즉, 헤더는 모든 키-값 쌍을 가질 수 있지만 값은 스키마와 일치해야 합니다.

#### Specs
HTTP 헤더를 사용하면 클라이언트와 서버가 HTTP 요청 또는 응답과 함께 추가 정보를 전달할 수 있으며 일반적으로 메타데이터로 취급됩니다.

이 필드는 일반적으로 특정 헤더 필드(예: `Authorization`)를 강제하는 데 사용됩니다.

Headers는 `fetch` API의 `body`와 같은 방식으로 제공됩니다.

```typescript
fetch('https://elysiajs.com/', {
    headers: {
        authorization: 'Bearer 12345'
    }
})
```

::: tip
Elysia는 헤더를 소문자 키로만 파싱합니다.

헤더 유효성 검사를 사용할 때 소문자 필드 이름을 사용하고 있는지 확인하세요.
:::

## Cookie
Cookie는 요청 쿠키를 통해 전송되는 데이터입니다.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/cookie', ({ cookie }) => cookie, {
                     // ^?



		cookie: t.Cookie({
			cookieName: t.String()
		})
	})
```

Cookies는 `t.Cookie` 또는 `t.Object` 형식으로 제공되어야 합니다.

`headers`와 마찬가지로 cookies는 기본적으로 `additionalProperties`가 `true`로 설정됩니다.

#### Specs

HTTP 쿠키는 서버가 클라이언트에게 보내는 작은 데이터 조각입니다. 동일한 웹 서버를 방문할 때마다 전송되는 데이터로, 서버가 클라이언트 정보를 기억할 수 있도록 합니다.

간단히 말해서 모든 요청과 함께 전송되는 문자열화된 상태입니다.

이 필드는 일반적으로 특정 쿠키 필드를 강제하는 데 사용됩니다.

쿠키는 Fetch API가 사용자 정의 값을 허용하지 않는 특수한 헤더 필드이지만 브라우저에서 관리됩니다. 쿠키를 보내려면 `credentials` 필드를 사용해야 합니다:

```typescript
fetch('https://elysiajs.com/', {
    credentials: 'include'
})
```

### t.Cookie
`t.Cookie`는 `t.Object`와 동일하지만 쿠키별 옵션을 설정할 수 있는 특수 타입입니다.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/cookie', ({ cookie }) => cookie.name.value, {
                      // ^?




		cookie: t.Cookie({
			name: t.String()
		}, {
			secure: true,
			httpOnly: true
		})
	})
```

## Response
Response는 핸들러에서 반환되는 데이터입니다.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/response', () => {
		return {
			name: 'Jane Doe'
		}
	}, {
		response: t.Object({
			name: t.String()
		})
	})
```

### Response per status
응답은 상태 코드별로 설정할 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/response', ({ status }) => {
		if (Math.random() > 0.5)
			return status(400, {
				error: 'Something went wrong'
			})

		return {
			name: 'Jane Doe'
		}
	}, {
		response: {
			200: t.Object({
				name: t.String()
			}),
			400: t.Object({
				error: t.String()
			})
		}
	})
```

이것은 Elysia 전용 기능으로 필드를 선택적으로 만들 수 있습니다.

## Error Provider

유효성 검사가 실패할 때 사용자 정의 오류 메시지를 제공하는 두 가지 방법이 있습니다:

1. 인라인 `status` 속성
2. [onError](/essential/life-cycle.html#on-error) 이벤트 사용

### Error Property

Elysia는 추가 **error** 속성을 제공하여 필드가 유효하지 않은 경우 사용자 정의 오류 메시지를 반환할 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/', () => 'Hello World!', {
        body: t.Object({
            x: t.Number({
               	error: 'x must be a number'
            })
        })
    })
    .listen(3000)
```

다음은 다양한 타입에서 error 속성을 사용하는 예입니다:

<table class="md-table">
<tbody>
<tr>
<td>TypeBox</td>
<td>Error</td>
</tr>

<tr>
<td>

```typescript
t.String({
    format: 'email',
    error: 'Invalid email :('
})
```

</td>
<td>

```
Invalid Email :(
```

</td>
</tr>

<tr>
<td>

```typescript
t.Array(
    t.String(),
    {
        error: 'All members must be a string'
    }
)
```

</td>
<td>

```
All members must be a string
```

</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number()
}, {
    error: 'Invalid object UnU'
})
```

</td>
<td>

```
Invalid object UnU
```

</td>
</tr>
<tr>
<td>

```typescript
t.Object({
    x: t.Number({
        error({ errors, type, validation, value }) {
            return 'Expected x to be a number'
        }
    })
})
```

</td>
<td>

```
Expected x to be a number
```

</td>
</tr>
</tbody>
</table>

## Custom Error

TypeBox는 추가 "**error**" 속성을 제공하여 필드가 유효하지 않은 경우 사용자 정의 오류 메시지를 반환할 수 있습니다.

<table class="md-table">
<tbody>
<tr>
<td>TypeBox</td>
<td>Error</td>
</tr>

<tr>
<td>

```typescript
t.String({
    format: 'email',
    error: 'Invalid email :('
})
```

</td>
<td>

```
Invalid Email :(
```

</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number()
}, {
    error: 'Invalid object UnU'
})
```

</td>
<td>

```
Invalid object UnU
```

</td>
</tr>
</tbody>
</table>

### Error message as function
문자열 외에도 Elysia 타입의 error는 함수를 받아 각 속성에 대한 사용자 정의 오류를 프로그래밍 방식으로 반환할 수 있습니다.

error 함수는 `ValidationError`와 동일한 인수를 받습니다.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/', () => 'Hello World!', {
        body: t.Object({
            x: t.Number({
                error() {
                    return 'Expected x to be a number'
                }
            })
        })
    })
    .listen(3000)
```

::: tip
`error` 위로 마우스를 가져가면 타입을 볼 수 있습니다.
:::

### Error is Called Per Field
error 함수는 필드가 유효하지 않은 경우에만 호출됩니다.

다음 표를 고려하세요:

<table class="md-table">
<tbody>
<tr>
<td>Code</td>
<td>Body</td>
<td>Error</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number({
        error() {
            return 'Expected x to be a number'
        }
    })
})
```

</td>
<td>

```json
{
    x: "hello"
}
```

</td>
<td>
Expected x to be a number
</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number({
        error() {
            return 'Expected x to be a number'
        }
    })
})
```

</td>
<td>

```json
"hello"
```

</td>
<td>
(default error, `t.Number.error` is not called)
</td>
</tr>

<tr>
<td>

```typescript
t.Object(
    {
        x: t.Number({
            error() {
                return 'Expected x to be a number'
            }
        })
    }, {
        error() {
            return 'Expected value to be an object'
        }
    }
)
```

</td>
<td>

```json
"hello"
```

</td>
<td>
Expected value to be an object
</td>
</tr>
</tbody>
</table>

### onError

오류 코드를 "**VALIDATION**"으로 좁혀서 [onError](/essential/life-cycle.html#on-error) 이벤트를 기반으로 유효성 검사의 동작을 사용자 정의할 수 있습니다.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.onError(({ code, error }) => {
		if (code === 'VALIDATION')
		    return error.message
	})
	.listen(3000)
```

좁혀진 오류 타입은 **elysia/error**에서 가져온 `ValidationError`로 타입이 지정됩니다.

**ValidationError**는 [TypeCheck](https://github.com/sinclairzx81/typebox#typecheck)로 타입이 지정된 **validator**라는 속성을 노출하여 TypeBox 기능을 기본적으로 상호 작용할 수 있습니다.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .onError(({ code, error }) => {
        if (code === 'VALIDATION')
            return error.all[0].message
    })
    .listen(3000)
```

### Error List

**ValidationError**는 모든 오류 원인을 나열할 수 있는 `ValidatorError.all` 메서드를 제공합니다.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.post('/', ({ body }) => body, {
		body: t.Object({
			name: t.String(),
			age: t.Number()
		}),
		error({ code, error }) {
			switch (code) {
				case 'VALIDATION':
                    console.log(error.all)

                    // Find a specific error name (path is OpenAPI Schema compliance)
                    const name = error.all.find(
						(x) => x.summary && x.path === '/name'
					)

                    // If there is a validation error, then log it
                    if(name)
    					console.log(name)
			}
		}
	})
	.listen(3000)
```

TypeBox의 검증기에 대한 자세한 내용은 [TypeCheck](https://github.com/sinclairzx81/typebox#typecheck)을 참조하세요.

## Reference Model
때때로 중복 모델을 선언하거나 같은 모델을 여러 번 재사용하는 경우가 있을 수 있습니다.

참조 모델을 사용하면 모델에 이름을 지정하고 이름을 참조하여 재사용할 수 있습니다.

간단한 시나리오로 시작해보겠습니다.

동일한 모델로 로그인을 처리하는 컨트롤러가 있다고 가정합니다.

```typescript twoslash
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .post('/sign-in', ({ body }) => body, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        }),
        response: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

모델을 변수로 추출하고 참조하여 코드를 리팩토링할 수 있습니다.
```typescript twoslash
import { Elysia, t } from 'elysia'

// Maybe in a different file eg. models.ts
const SignDTO = t.Object({
    username: t.String(),
    password: t.String()
})

const app = new Elysia()
    .post('/sign-in', ({ body }) => body, {
        body: SignDTO,
        response: SignDTO
    })
```

관심사를 분리하는 이 방법은 효과적인 접근 방식이지만 앱이 더 복잡해짐에 따라 여러 컨트롤러에서 여러 모델을 재사용하는 경우가 있을 수 있습니다.

모델을 "참조 모델"로 만들어 이를 해결할 수 있습니다. 이를 통해 모델에 이름을 지정하고 `model`로 모델을 등록하여 `schema`에서 직접 자동 완성을 사용하여 참조할 수 있습니다.

```typescript twoslash
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .model({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .post('/sign-in', ({ body }) => body, {
        // with auto-completion for existing model name
        body: 'sign',
        response: 'sign'
    })
```

모델 그룹에 액세스하려면 `model`을 플러그인으로 분리할 수 있습니다. 등록하면 여러 가져오기 대신 모델 세트를 제공합니다.

```typescript
// auth.model.ts
import { Elysia, t } from 'elysia'

export const authModel = new Elysia()
    .model({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

그런 다음 인스턴스 파일에서:
```typescript twoslash
// @filename: auth.model.ts
import { Elysia, t } from 'elysia'

export const authModel = new Elysia()
    .model({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })

// @filename: index.ts
// ---cut---
// index.ts
import { Elysia } from 'elysia'
import { authModel } from './auth.model'

const app = new Elysia()
    .use(authModel)
    .post('/sign-in', ({ body }) => body, {
        // with auto-completion for existing model name
        body: 'sign',
        response: 'sign'
    })
```

이 접근 방식은 관심사를 분리할 수 있을 뿐만 아니라 여러 곳에서 모델을 재사용하면서 모델을 OpenAPI 문서에 통합할 수 있습니다.

### Multiple Models
`model`은 키가 모델 이름이고 값이 모델 정의인 객체를 받습니다. 여러 모델이 기본적으로 지원됩니다.

```typescript
// auth.model.ts
import { Elysia, t } from 'elysia'

export const authModel = new Elysia()
    .model({
        number: t.Number(),
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

### Naming Convention
중복 모델 이름은 Elysia가 오류를 발생시킵니다. 중복 모델 이름 선언을 방지하려면 다음 명명 규칙을 사용할 수 있습니다.

모든 모델이 `models/<name>.ts`에 저장되어 있고 모델의 접두사를 네임스페이스로 선언한다고 가정해보겠습니다.

```typescript
import { Elysia, t } from 'elysia'

// admin.model.ts
export const adminModels = new Elysia()
    .model({
        'admin.auth': t.Object({
            username: t.String(),
            password: t.String()
        })
    })

// user.model.ts
export const userModels = new Elysia()
    .model({
        'user.auth': t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

이것은 어느 정도 명명 중복을 방지할 수 있지만 궁극적으로는 팀이 명명 규칙을 결정하는 것이 가장 좋습니다.

Elysia는 결정 피로를 방지하는 데 도움이 되는 의견이 있는 옵션을 제공합니다.

### TypeScript
다음과 같이 `static` 속성에 액세스하여 모든 Elysia/TypeBox 타입의 타입 정의를 가져올 수 있습니다:

```ts twoslash
import { t } from 'elysia'

const MyType = t.Object({
	hello: t.Literal('Elysia')
})

type MyType = typeof MyType.static
//    ^?
````

<br>
<br>
<br>

이를 통해 Elysia는 타입을 추론하고 자동으로 제공하여 중복 스키마를 선언할 필요를 줄입니다.

단일 Elysia/TypeBox 스키마는 다음에 사용될 수 있습니다:
- 런타임 유효성 검사
- 데이터 강제 변환
- TypeScript 타입
- OpenAPI 스키마

이를 통해 스키마를 **단일 소스의 진실**로 만들 수 있습니다.
