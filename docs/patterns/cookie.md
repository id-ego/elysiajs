---
title: Reactive Cookie - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Reactive Cookie - ElysiaJS

  - - meta
    - name: 'description'
      content: Reactive Cookie takes a more modern approach like signals to handle cookies with an ergonomic API. There's no 'getCookie', 'setCookie', everything is just a cookie object. When you want to use cookies, you just extract the name and value directly.

  - - meta
    - property: 'og:description'
      content: Reactive Cookie takes a more modern approach like signals to handle cookies with an ergonomic API. There's no 'getCookie', 'setCookie', everything is just a cookie object. When you want to use cookies, you just extract the name and value directly.
---

# Cookie
Elysia는 Cookie와 상호작용하기 위한 변경 가능한 signal을 제공합니다.

get/set이 없으며, cookie 이름을 추출하고 값을 직접 검색하거나 업데이트할 수 있습니다.
```ts
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ cookie: { name } }) => {
        // Get
        name.value

        // Set
        name.value = "New Value"
    })
```

기본적으로 Reactive Cookie는 객체 타입을 자동으로 인코딩/디코딩할 수 있어 인코딩/디코딩을 걱정하지 않고 cookie를 객체로 취급할 수 있습니다. **그냥 작동합니다**.

## Reactivity
Elysia cookie는 반응형입니다. 즉, cookie 값을 변경하면 signal과 같은 접근 방식을 기반으로 cookie가 자동으로 업데이트됩니다.

Elysia cookie는 자동으로 헤더를 설정하고 cookie 값을 동기화하는 기능을 가진 cookie 처리를 위한 단일 진실 소스를 제공합니다.

cookie는 기본적으로 Proxy 종속 객체이므로 추출된 값은 절대 **undefined**가 될 수 없으며, 항상 `Cookie<unknown>`의 값이 되며 **.value** 속성을 호출하여 얻을 수 있습니다.

cookie jar를 일반 객체로 취급할 수 있으며, 이를 반복하면 이미 존재하는 cookie 값만 반복합니다.

## Cookie Attribute
Cookie attribute를 사용하려면 다음 중 하나를 사용할 수 있습니다:

1. 속성을 직접 설정
2. `set` 또는 `add`를 사용하여 cookie 속성 업데이트

자세한 내용은 [cookie attribute config](/patterns/cookie.html#config)를 참조하세요.

### Assign Property
일반 객체처럼 cookie의 속성을 가져오거나 설정할 수 있으며, 반응형 모델이 cookie 값을 자동으로 동기화합니다.

```ts
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ cookie: { name } }) => {
        // get
        name.domain

        // set
        name.domain = 'millennium.sh'
        name.httpOnly = true
    })
```

## set
**set**은 **모든 속성을 재설정**하고 새 값으로 속성을 덮어써서 여러 cookie 속성을 한 번에 업데이트할 수 있습니다.

```ts
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ cookie: { name } }) => {
        name.set({
            domain: 'millennium.sh',
            httpOnly: true
        })
    })
```

## add
**set**과 마찬가지로 **add**는 여러 cookie 속성을 한 번에 업데이트할 수 있지만, 재설정하는 대신 정의된 속성만 덮어씁니다.

## remove
cookie를 제거하려면 다음 중 하나를 사용할 수 있습니다:
1. name.remove
2. delete cookie.name

```ts
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ cookie, cookie: { name } }) => {
        name.remove()

        delete cookie.name
    })
```

## Cookie Schema
`t.Cookie`를 사용하여 cookie 스키마로 cookie 타입을 엄격하게 검증하고 cookie에 대한 타입 추론을 제공할 수 있습니다.

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', ({ cookie: { name } }) => {
        // Set
        name.value = {
            id: 617,
            name: 'Summoning 101'
        }
    }, {
        cookie: t.Cookie({
            name: t.Object({
                id: t.Numeric(),
                name: t.String()
            })
        })
    })
```

## Nullable Cookie
nullable cookie 값을 처리하려면 nullable로 만들고 싶은 cookie 이름에 `t.Optional`을 사용할 수 있습니다.

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', ({ cookie: { name } }) => {
        // Set
        name.value = {
            id: 617,
            name: 'Summoning 101'
        }
    }, {
        cookie: t.Cookie({
            name: t.Optional(
                t.Object({
                    id: t.Numeric(),
                    name: t.String()
                })
            )
        })
    })
```

## Cookie Signature
Cookie Schema와 `t.Cookie` 타입이 도입되면서 cookie signature를 자동으로 서명/검증하기 위한 통합 타입을 만들 수 있습니다.

Cookie signature는 보안을 강화하기 위해 비밀 키와 cookie의 내용을 사용하여 생성된 cookie 값에 추가되는 암호화 해시로, cookie에 서명을 추가합니다.

이는 cookie 값이 악의적인 행위자에 의해 수정되지 않았는지 확인하고 cookie 데이터의 진위성과 무결성을 검증하는 데 도움이 됩니다.

## Using Cookie Signature
cookie secret을 제공하고 서명 검증이 필요한 cookie를 나타내는 `sign` 속성을 제공하여 사용합니다.
```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', ({ cookie: { profile } }) => {
        profile.value = {
            id: 617,
            name: 'Summoning 101'
        }
    }, {
        cookie: t.Cookie({
            profile: t.Object({
                id: t.Numeric(),
                name: t.String()
            })
        }, {
            secrets: 'Fischl von Luftschloss Narfidort',
            sign: ['profile']
        })
    })
```

Elysia는 cookie 값을 자동으로 서명하고 서명을 해제합니다.

## Constructor
모든 라우트에 인라인하는 대신 Elysia 생성자를 사용하여 전역 cookie `secret`과 `sign` 값을 설정할 수 있습니다.

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia({
    cookie: {
        secrets: 'Fischl von Luftschloss Narfidort',
        sign: ['profile']
    }
})
    .get('/', ({ cookie: { profile } }) => {
        profile.value = {
            id: 617,
            name: 'Summoning 101'
        }
    }, {
        cookie: t.Cookie({
            profile: t.Object({
                id: t.Numeric(),
                name: t.String()
            })
        })
    })
```

## Cookie Rotation
Elysia는 Cookie의 secret rotation을 자동으로 처리합니다.

Cookie Rotation은 더 새로운 secret으로 cookie에 서명하면서도 cookie의 이전 서명을 검증할 수 있는 마이그레이션 기술입니다.

```ts
import { Elysia } from 'elysia'

new Elysia({
    cookie: {
        secrets: ['Vengeance will be mine', 'Fischl von Luftschloss Narfidort']
    }
})
```

## Config
다음은 Elysia에서 허용하는 cookie config입니다.

### secret
cookie를 서명/서명 해제하기 위한 비밀 키입니다.

배열이 전달되면 Key Rotation을 사용합니다.

Key rotation은 암호화 키가 폐기되고 새로운 암호화 키를 생성하여 교체되는 것입니다.

---
다음은 [cookie](https://npmjs.com/package/cookie)에서 확장된 config입니다

### domain
[Domain Set-Cookie attribute](https://tools.ietf.org/html/rfc6265#section-5.2.3)의 값을 지정합니다.

기본적으로 domain이 설정되지 않으며 대부분의 클라이언트는 cookie가 현재 domain에만 적용되는 것으로 간주합니다.


### encode
@default `encodeURIComponent`

cookie 값을 인코딩하는 데 사용할 함수를 지정합니다.

cookie 값은 제한된 문자 집합을 가지고 있으므로(그리고 단순 문자열이어야 함), 이 함수를 사용하여 값을 cookie 값에 적합한 문자열로 인코딩할 수 있습니다.

기본 함수는 전역 `encodeURIComponent`로, JavaScript 문자열을 UTF-8 바이트 시퀀스로 인코딩한 다음 cookie 범위를 벗어나는 모든 것을 URL 인코딩합니다.

### expires
[Expires Set-Cookie attribute](https://tools.ietf.org/html/rfc6265#section-5.2.1)의 값이 될 Date 객체를 지정합니다.

기본적으로 만료가 설정되지 않으며 대부분의 클라이언트는 이를 "비영구 cookie"로 간주하고 웹 브라우저 애플리케이션을 종료하는 것과 같은 조건에서 삭제합니다.

::: tip
[cookie storage model specification](https://tools.ietf.org/html/rfc6265#section-5.3)에 따르면 `expires`와 `maxAge`가 모두 설정된 경우 `maxAge`가 우선하지만 모든 클라이언트가 이를 따르지는 않으므로 둘 다 설정된 경우 동일한 날짜와 시간을 가리켜야 합니다.
:::

### httpOnly
@default `false`

[HttpOnly Set-Cookie attribute](https://tools.ietf.org/html/rfc6265#section-5.2.6)의 boolean 값을 지정합니다.

truthy인 경우 HttpOnly attribute가 설정되고, 그렇지 않으면 설정되지 않습니다.

기본적으로 HttpOnly attribute는 설정되지 않습니다.

::: tip
이를 true로 설정할 때는 주의하세요. 호환 클라이언트는 클라이언트 측 JavaScript가 `document.cookie`에서 cookie를 보지 못하도록 합니다.
:::

### maxAge
@default `undefined`

[Max-Age Set-Cookie attribute](https://tools.ietf.org/html/rfc6265#section-5.2.2)의 값이 될 숫자(초)를 지정합니다.

주어진 숫자는 내림하여 정수로 변환됩니다. 기본적으로 최대 age는 설정되지 않습니다.

::: tip
[cookie storage model specification](https://tools.ietf.org/html/rfc6265#section-5.3)에 따르면 `expires`와 `maxAge`가 모두 설정된 경우 `maxAge`가 우선하지만 모든 클라이언트가 이를 따르지는 않으므로 둘 다 설정된 경우 동일한 날짜와 시간을 가리켜야 합니다.
:::

### path
[Path Set-Cookie attribute](https://tools.ietf.org/html/rfc6265#section-5.2.4)의 값을 지정합니다.

기본적으로 path handler가 기본 경로로 간주됩니다.

### priority
[Priority Set-Cookie attribute](https://tools.ietf.org/html/draft-west-cookie-priority-00#section-4.1)의 값이 될 문자열을 지정합니다.
`low`는 Priority attribute를 Low로 설정합니다.
`medium`은 Priority attribute를 Medium으로 설정하며, 설정되지 않은 경우 기본 우선순위입니다.
`high`는 Priority attribute를 High로 설정합니다.

다양한 우선순위 수준에 대한 자세한 내용은 [the specification](https://tools.ietf.org/html/draft-west-cookie-priority-00#section-4.1)에서 찾을 수 있습니다.

::: tip
이것은 아직 완전히 표준화되지 않은 attribute이며 향후 변경될 수 있습니다. 또한 많은 클라이언트가 이해할 때까지 이 attribute를 무시할 수 있습니다.
:::

### sameSite
[SameSite Set-Cookie attribute](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-09#section-5.4.7)의 값이 될 boolean 또는 문자열을 지정합니다.
`true`는 SameSite attribute를 Strict로 설정하여 엄격한 동일 사이트 적용을 합니다.
`false`는 SameSite attribute를 설정하지 않습니다.
`'lax'`는 SameSite attribute를 Lax로 설정하여 느슨한 동일 사이트 적용을 합니다.
`'none'`은 SameSite attribute를 None으로 설정하여 명시적인 교차 사이트 cookie를 만듭니다.
`'strict'`는 SameSite attribute를 Strict로 설정하여 엄격한 동일 사이트 적용을 합니다.
다양한 적용 수준에 대한 자세한 내용은 [the specification](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-09#section-5.4.7)에서 찾을 수 있습니다.

::: tip
이것은 아직 완전히 표준화되지 않은 attribute이며 향후 변경될 수 있습니다. 또한 많은 클라이언트가 이해할 때까지 이 attribute를 무시할 수 있습니다.
:::

### secure
[Secure Set-Cookie attribute](https://tools.ietf.org/html/rfc6265#section-5.2.5)의 boolean 값을 지정합니다. truthy인 경우 Secure attribute가 설정되고, 그렇지 않으면 설정되지 않습니다. 기본적으로 Secure attribute는 설정되지 않습니다.

::: tip
이를 true로 설정할 때는 주의하세요. 브라우저가 HTTPS 연결을 갖고 있지 않으면 호환 클라이언트는 향후 cookie를 서버로 다시 보내지 않습니다.
:::
