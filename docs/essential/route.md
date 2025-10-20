---
title: Route - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Route - ElysiaJS

    - - meta
      - name: 'description'
        content: 클라이언트에 올바른 응답을 결정하기 위해 웹 서버는 경로와 HTTP 메서드를 사용하여 올바른 리소스를 찾습니다. 이 과정을 "라우팅"이라고 합니다. HTTP 동사 이름을 따서 명명된 메서드를 호출하여 경로를 정의할 수 있습니다. 예를 들어 `Elysia.get`, `Elysia.post`에 경로와 일치할 때 실행할 함수를 전달합니다.

    - - meta
      - property: 'og:description'
        content: 클라이언트에 올바른 응답을 결정하기 위해 웹 서버는 경로와 HTTP 메서드를 사용하여 올바른 리소스를 찾습니다. 이 과정을 "라우팅"이라고 합니다. HTTP 동사 이름을 따서 명명된 메서드를 호출하여 경로를 정의할 수 있습니다. 예를 들어 `Elysia.get`, `Elysia.post`에 경로와 일치할 때 실행할 함수를 전달합니다.
---

<script setup>
import Playground from '../components/nearl/playground.vue'
import { Elysia } from 'elysia'

const demo1 = new Elysia()
    .get('/', () => 'hello')
    .get('/hi', () => 'hi')

const demo2 = new Elysia()
    .get('/', () => 'hello')
    .post('/hi', () => 'hi')

const demo3 = new Elysia()
	  .get('/id', () => `id: undefined`)
    .get('/id/:id', ({ params: { id } }) => `id: ${id}`)

const demo4 = new Elysia()
    .get('/', () => 'hi')
    .post('/', () => 'hi')

const demo5 = new Elysia()
    .get('/', () => 'hello')
    .get('/hi', ({ status }) => status(404, 'Route not found :('))

const demo6 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ status }) => status(404))
    .get('/id/anything/test', ({ status }) => status(404))

const demo7 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ status }) => status(404))
    .get('/id/:id/:name', ({ params: { id, name } }) => id + ' ' + name)

const demo8 = new Elysia()
    .get('/get', () => 'hello')
    .post('/post', () => 'hi')
    .route('M-SEARCH', '/m-search', () => 'connect')

const demo9 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ status }) => status(404))
    .get('/id/:id/:name', ({ params: { id, name } }) => id + '/' + name)

const demo10 = new Elysia()
    .get('/id/1', () => 'static path')
    .get('/id/:id', () => 'dynamic path')
    .get('/id/*', () => 'wildcard path')

const demo11 = new Elysia()
    .post('/user/sign-in', () => 'Sign in')
    .post('/user/sign-up', () => 'Sign up')
    .post('/user/profile', () => 'Profile')

const demo12 = new Elysia()
    .group('/user', (app) =>
        app
            .post('/sign-in', () => 'Sign in')
            .post('/sign-up', () => 'Sign up')
            .post('/profile', () => 'Profile')
    )

const users = new Elysia({ prefix: '/user' })
    .post('/sign-in', () => 'Sign in')
    .post('/sign-up', () => 'Sign up')
    .post('/profile', () => 'Profile')

const demo13 = new Elysia()
    .get('/', () => 'hello world')
    .use(users)
</script>

# Routing

웹 서버는 요청의 **경로와 메서드**를 사용하여 올바른 리소스를 찾습니다. 이를 **"라우팅"**이라고 합니다.

**HTTP 동사 메서드**, 경로 및 일치할 때 실행할 함수로 경로를 정의할 수 있습니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', 'hello')
    .get('/hi', 'hi')
    .listen(3000)
```

**http://localhost:3000**으로 이동하여 웹 서버에 액세스할 수 있습니다.

기본적으로 웹 브라우저는 페이지를 방문할 때 GET 메서드를 보냅니다.

<Playground :elysia="demo1" />

::: tip
위의 대화형 브라우저를 사용하여 파란색 강조 영역 위로 마우스를 가져가면 각 경로 간의 다른 결과를 볼 수 있습니다.
:::

## Path type

Elysia의 경로는 3가지 유형으로 그룹화할 수 있습니다:

-   **static paths** - 리소스를 찾기 위한 정적 문자열
-   **dynamic paths** - 세그먼트가 모든 값이 될 수 있음
-   **wildcards** - 특정 지점까지의 경로가 무엇이든 될 수 있음

모든 경로 유형을 함께 사용하여 웹 서버의 동작을 구성할 수 있습니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/1', 'static path')
    .get('/id/:id', 'dynamic path')
    .get('/id/*', 'wildcard path')
    .listen(3000)
```

<Playground
  :elysia="demo10"
    :alias="{
    '/id/:id': '/id/2',
    '/id/*': '/id/2/a'
  }"
  :mock="{
    '/id/*': {
      GET: 'wildcard path'
    }
  }"
/>

<!--Here the server will respond as follows:

| Path    | Response      |
| ------- | ------------- |
| /id/1   | static path   |
| /id/2   | dynamic path  |
| /id/2/a | wildcard path |-->

## Static Path

정적 경로는 서버에서 리소스를 찾기 위한 하드코딩된 문자열입니다.

```ts
import { Elysia } from 'elysia'

new Elysia()
	.get('/hello', 'hello')
	.get('/hi', 'hi')
	.listen(3000)
```

<!--A path or pathname is an identifier to locate resources of a server.

```bash
http://localhost/path/page
```

Elysia uses the path and method to look up the correct resource.

<div class="bg-white rounded-lg">
    <img src="/essential/url-object.svg" alt="URL Representation" />
</div>

A path starts after the origin. Prefix with **/** and ends before search query **(?)**

We can categorize the URL and path as follows:-->

<!--| URL                             | Path         |
| ------------------------------- | ------------ |
| http://example.com/                | /            |
| http://example.com/hello           | /hello       |
| http://example.com/hello/world     | /hello/world |
| http://example.com/hello?name=salt | /hello       |
| http://example.com/hello#title     | /hello       |

::: tip
If the path is not specified, the browser and web server will treat the path as '/' as a default value.
:::

Elysia will look up each request for [route](/essential/route) and response using [handler](/essential/handler) function.
--->

## Dynamic path

동적 경로는 일부를 일치시키고 값을 캡처하여 추가 정보를 추출합니다.

동적 경로를 정의하려면 콜론 `:`과 그 뒤에 이름을 사용할 수 있습니다.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
                      // ^?
    .listen(3000)
```

<br>

여기서 동적 경로는 `/id/:id`로 생성됩니다. 이는 Elysia에게 **/id/1**, **/id/123**, **/id/anything**과 같은 값으로 `:id` 세그먼트의 값을 캡처하도록 지시합니다.

<Playground
  :elysia="demo6"
  :alias="{
    '/id/:id': '/id/1'
  }"
  :mock="{
    '/id/:id': {
      GET: '1'
    }
  }"
/>

요청 시 서버는 다음과 같이 응답해야 합니다:

| Path                   | Response  |
| ---------------------- | --------- |
| /id/1                  | 1         |
| /id/123                | 123       |
| /id/anything           | anything  |
| /id/anything?name=salt | anything  |
| /id                    | Not Found |
| /id/anything/rest      | Not Found |

동적 경로는 나중에 사용할 수 있는 ID와 같은 것을 포함하는 데 적합합니다.

명명된 변수 경로를 **경로 매개변수** 또는 줄여서 **params**라고 합니다.

<!--## Segment

URL segments are each path that is composed into a full path.

Segments are separated by `/`.
![Representation of URL segments](/essential/url-segment.webp)

Path parameters in Elysia are represented by prefixing a segment with ':' followed by a name.
![Representation of path parameter](/essential/path-parameter.webp)

Path parameters allow Elysia to capture a specific segment of a URL.

The named path parameter will then be stored in `Context.params`.

| Route     | Path   | Params  |
| --------- | ------ | ------- |
| /id/:id   | /id/1  | id=1    |
| /id/:id   | /id/hi | id=hi   |
| /id/:name | /id/hi | name=hi |-->

### Multiple path parameters

원하는 만큼 많은 경로 매개변수를 가질 수 있으며, 그러면 `params` 객체에 저장됩니다.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/:id/:name', ({ params: { id, name } }) => id + ' ' + name)
                             // ^?
    .listen(3000)
```

<br>
<br>

<Playground
  :elysia="demo7"
  :alias="{
    '/id/:id': '/id/1',
    '/id/:id/:name': '/id/anything/rest'
  }"
  :mock="{
    '/id/:id': {
      GET: '1'
    },
    '/id/:id/:name': {
      GET: 'anything rest'
    }
  }"
/>

서버는 다음과 같이 응답합니다:

| Path                   | Response      |
| ---------------------- | ------------- |
| /id/1                  | 1             |
| /id/123                | 123           |
| /id/anything           | anything      |
| /id/anything?name=salt | anything      |
| /id                    | Not Found     |
| /id/anything/rest      | anything rest |

## Optional path parameters
때때로 정적 경로와 동적 경로가 같은 핸들러를 해결하기를 원할 수 있습니다.

매개변수 이름 뒤에 물음표 `?`를 추가하여 경로 매개변수를 선택적으로 만들 수 있습니다.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id?', ({ params: { id } }) => `id ${id}`)
                          // ^?
    .listen(3000)
```

<br>

<Playground
  :elysia="demo3"
  :alias="{
    '/id/:id': '/id/1'
  }"
  :mock="{
    '/id/:id': {
      GET: 'id 1'
    },
  }"
/>

<!--The server will respond as follows:

| Path                   | Response      |
| ---------------------- | ------------- |
| /id                    | id undefined  |
| /id/1                  | id 1          |-->

## Wildcards

동적 경로는 단일 세그먼트를 캡처할 수 있지만 와일드카드는 경로의 나머지 부분을 캡처할 수 있습니다.

와일드카드를 정의하려면 별표 `*`를 사용할 수 있습니다.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/*', ({ params }) => params['*'])
                    // ^?
    .listen(3000)
```

<br>

<Playground
  :elysia="demo9"
  :alias="{
    '/id/:id': '/id/1',
    '/id/:id/:name': '/id/anything/rest'
  }"
  :mock="{
    '/id/:id': {
      GET: '1'
    },
    '/id/:id/:name': {
      GET: 'anything/rest'
    }
  }"
/>

<!--In this case the server will respond as follows:

| Path                   | Response      |
| ---------------------- | ------------- |
| /id/1                  | 1             |
| /id/123                | 123           |
| /id/anything           | anything      |
| /id/anything?name=salt | anything      |
| /id                    | Not Found     |
| /id/anything/rest      | anything/rest |-->

## Path priority
Elysia는 다음과 같은 경로 우선순위를 가집니다:

1. static paths
2. dynamic paths
3. wildcards

경로가 정적 경로로 해결되고 동적 경로가 있는 경우, Elysia는 동적 경로가 아닌 정적 경로를 해결합니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/1', 'static path')
    .get('/id/:id', 'dynamic path')
    .get('/id/*', 'wildcard path')
    .listen(3000)
```

<Playground
  :elysia="demo10"
    :alias="{
    '/id/:id': '/id/2',
    '/id/*': '/id/2/a'
  }"
  :mock="{
    '/id/*': {
      GET: 'wildcard path'
    }
  }"
/>

## HTTP Verb

HTTP는 주어진 리소스에 대해 수행할 원하는 작업을 나타내기 위한 일련의 요청 메서드를 정의합니다.

여러 HTTP 동사가 있지만 가장 일반적인 것은 다음과 같습니다:

### GET

GET을 사용하는 요청은 데이터만 검색해야 합니다.

### POST

지정된 리소스에 페이로드를 제출하여 종종 상태 변경이나 부작용을 일으킵니다.

### PUT

요청의 페이로드를 사용하여 대상 리소스의 모든 현재 표현을 대체합니다.

### PATCH

리소스에 부분 수정을 적용합니다.

### DELETE

지정된 리소스를 삭제합니다.

---

각각의 다른 동사를 처리하기 위해 Elysia는 `Elysia.get`과 유사하게 기본적으로 여러 HTTP 동사에 대한 내장 API를 가지고 있습니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', 'hello')
    .post('/hi', 'hi')
    .listen(3000)
```

<Playground :elysia="demo2" />

Elysia HTTP 메서드는 다음 매개변수를 받습니다:

-   **path**: 경로 이름
-   **function**: 클라이언트에 응답하는 함수
-   **hook**: 추가 메타데이터

HTTP 메서드에 대해 더 자세히 알아보려면 [HTTP Request Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)를 참조하세요.

## Custom Method

`Elysia.route`를 사용하여 사용자 정의 HTTP 메서드를 허용할 수 있습니다.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/get', 'hello')
    .post('/post', 'hi')
    .route('M-SEARCH', '/m-search', 'connect') // [!code ++]
    .listen(3000)
```

<Playground :elysia="demo8" />

**Elysia.route**는 다음을 받습니다:

-   **method**: HTTP 동사
-   **path**: 경로 이름
-   **function**: 클라이언트에 응답하는 함수
-   **hook**: 추가 메타데이터

<!--When navigating to each method, you should see the results as the following:
| Path      | Method   | Result  |
| --------- | -------- | ------- |
| /get      | GET      | hello   |
| /post     | POST     | hi      |
| /m-search | M-SEARCH | connect |-->

::: tip
[RFC 7231](https://www.rfc-editor.org/rfc/rfc7231#section-4.1)에 따르면 HTTP 동사는 대소문자를 구분합니다.

Elysia로 사용자 정의 HTTP 동사를 정의할 때 대문자 규칙을 사용하는 것이 좋습니다.
:::

### ALL method

Elysia는 **Elysia.get** 및 **Elysia.post**와 동일한 API를 사용하여 지정된 경로에 대한 모든 HTTP 메서드를 처리하기 위한 `Elysia.all`을 제공합니다.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .all('/', 'hi')
    .listen(3000)
```

<Playground :elysia="demo4" />

경로와 일치하는 모든 HTTP 메서드는 다음과 같이 처리됩니다:
| Path | Method | Result |
| ---- | -------- | ------ |
| / | GET | hi |
| / | POST | hi |
| / | DELETE | hi |

## Handle

대부분의 개발자는 API를 테스트하기 위해 Postman, Insomnia 또는 Hoppscotch와 같은 REST 클라이언트를 사용합니다.

그러나 Elysia는 `Elysia.handle`을 사용하여 프로그래밍 방식으로 테스트할 수 있습니다.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', 'hello')
    .post('/hi', 'hi')
    .listen(3000)

app.handle(new Request('http://localhost/')).then(console.log)
```

**Elysia.handle**은 서버로 전송된 실제 요청을 처리하는 함수입니다.

::: tip
단위 테스트의 모의와 달리 **서버로 전송된 실제 요청처럼 동작할 것으로 기대할 수 있습니다**.

그러나 단위 테스트를 시뮬레이션하거나 만드는 데도 유용합니다.
:::

<!--## 404

If no path matches the defined routes, Elysia will pass the request to [error](/essential/life-cycle.html#on-error) life cycle before returning a **"NOT_FOUND"** with an HTTP status of 404.

We can handle a custom 404 error by returning a value from `error` life cycle like this:

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', 'hi')
    .onError(({ code }) => {
        if (code === 'NOT_FOUND') {
            return 'Route not found :('
        }
    })
    .listen(3000)
```

<Playground :elysia="demo5" />

When navigating to your web server, you should see the result as follows:

| Path | Method | Result              |
| ---- | ------ | ------------------- |
| /    | GET    | hi                  |
| /    | POST   | Route not found :\( |
| /hi  | GET    | Route not found :\( |

You can learn more about life cycle and error handling in [Life Cycle Events](/essential/life-cycle#events) and [Error Handling](/essential/life-cycle.html#on-error).

::: tip
HTTP Status is used to indicate the type of response. By default if everything is correct, the server will return a '200 OK' status code (If a route matches and there is no error, Elysia will return 200 as default)

If the server fails to find any route to handle, like in this case, then the server shall return a '404 NOT FOUND' status code.
:::-->

## Group

웹 서버를 만들 때 동일한 접두사를 공유하는 여러 경로가 있는 경우가 많습니다:

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .post('/user/sign-in', 'Sign in')
    .post('/user/sign-up', 'Sign up')
    .post('/user/profile', 'Profile')
    .listen(3000)
```

<Playground :elysia="demo11" />

이는 `Elysia.group`으로 개선할 수 있으며, 여러 경로를 함께 그룹화하여 동시에 접두사를 적용할 수 있습니다:

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .group('/user', (app) =>
        app
            .post('/sign-in', 'Sign in')
            .post('/sign-up', 'Sign up')
            .post('/profile', 'Profile')
    )
    .listen(3000)
```

<Playground :elysia="demo12" />

이 코드는 첫 번째 예제와 동일하게 동작하며 다음과 같이 구성되어야 합니다:

| Path          | Result  |
| ------------- | ------- |
| /user/sign-in | Sign in |
| /user/sign-up | Sign up |
| /user/profile | Profile |

`.group()`은 그룹과 가드를 함께 사용하는 보일러플레이트를 줄이기 위해 선택적 가드 매개변수를 받을 수도 있습니다:

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .group(
        '/user',
        {
            body: t.Literal('Rikuhachima Aru')
        },
        (app) => app
            .post('/sign-in', 'Sign in')
            .post('/sign-up', 'Sign up')
            .post('/profile', 'Profile')
    )
    .listen(3000)
```

그룹화된 가드에 대한 자세한 정보는 [scope](/essential/plugin.html#scope)에서 확인할 수 있습니다.

### Prefix

생성자에 **prefix**를 제공하여 그룹을 별도의 플러그인 인스턴스로 분리하여 중첩을 줄일 수 있습니다.

```typescript
import { Elysia } from 'elysia'

const users = new Elysia({ prefix: '/user' })
    .post('/sign-in', 'Sign in')
    .post('/sign-up', 'Sign up')
    .post('/profile', 'Profile')

new Elysia()
    .use(users)
    .get('/', 'hello world')
    .listen(3000)
```

<Playground :elysia="demo13" />
