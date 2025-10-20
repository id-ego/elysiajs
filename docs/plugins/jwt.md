---
title: JWT Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: JWT Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Plugin for Elysia that adds support for using JWT (JSON Web Token) in Elysia server. Start by installing the plugin with "bun add @elysiajs/jwt".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that adds support for using JWT (JSON Web Token) in Elysia server. Start by installing the plugin with "bun add @elysiajs/jwt".
---

# JWT Plugin
이 플러그인은 Elysia 핸들러에서 JWT를 사용하는 기능을 추가합니다.

설치 방법:
```bash
bun add @elysiajs/jwt
```

사용 방법:

::: code-group

```typescript [cookie]
import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'

const app = new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: 'Fischl von Luftschloss Narfidort'
        })
    )
    .get('/sign/:name', async ({ jwt, params: { name }, cookie: { auth } }) => {
    	const value = await jwt.sign({ name })

        auth.set({
            value,
            httpOnly: true,
            maxAge: 7 * 86400,
            path: '/profile',
        })

        return `Sign in as ${value}`
    })
    .get('/profile', async ({ jwt, status, cookie: { auth } }) => {
        const profile = await jwt.verify(auth.value)

        if (!profile)
            return status(401, 'Unauthorized')

        return `Hello ${profile.name}`
    })
    .listen(3000)
```

```typescript [headers]
import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'

const app = new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: 'Fischl von Luftschloss Narfidort'
        })
    )
    .get('/sign/:name', ({ jwt, params: { name } }) => {
    	return jwt.sign({ name })
    })
    .get('/profile', async ({ jwt, error, headers: { authorization } }) => {
        const profile = await jwt.verify(authorization)

        if (!profile)
            return status(401, 'Unauthorized')

        return `Hello ${profile.name}`
    })
    .listen(3000)
```

:::

## Config
이 플러그인은 [jose](https://github.com/panva/jose)의 설정을 확장합니다.

플러그인에서 허용하는 설정은 다음과 같습니다.

### name
`jwt` 함수를 등록할 이름입니다.

예를 들어, `jwt` 함수는 커스텀 이름으로 등록됩니다.
```typescript
app
    .use(
        jwt({
            name: 'myJWTNamespace',
            secret: process.env.JWT_SECRETS!
        })
    )
    .get('/sign/:name', ({ myJWTNamespace, params }) => {
        return myJWTNamespace.sign(params)
    })
```

단일 서버에서 다른 설정으로 여러 `jwt`를 사용해야 할 수 있으므로 다른 이름으로 JWT 함수를 명시적으로 등록해야 합니다.

### secret
JWT payload를 서명할 개인 키입니다.

### schema
JWT payload에 대한 타입 엄격 유효성 검사입니다.

---
아래는 [cookie](https://npmjs.com/package/cookie)에서 확장된 설정입니다.

### alg
@default `HS256`

JWT payload를 서명할 서명 알고리즘입니다.

jose에서 가능한 속성은 다음과 같습니다:
HS256
HS384
HS512
PS256
PS384
PS512
RS256
RS384
RS512
ES256
ES256K
ES384
ES512
EdDSA

### iss
issuer claim은 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1)에 따라 JWT를 발행한 주체를 식별합니다.

TLDR; 일반적으로 서명자의 (도메인) 이름입니다.

### sub
subject claim은 JWT의 주체인 주체를 식별합니다.

JWT의 claim은 일반적으로 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2)에 따라 주체에 대한 진술입니다.

### aud
audience claim은 JWT가 의도된 수신자를 식별합니다.

JWT를 처리하려는 각 주체는 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.3)에 따라 audience claim의 값으로 자신을 식별해야 합니다.

### jti
JWT ID claim은 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.7)에 따라 JWT에 대한 고유 식별자를 제공합니다.

### nbf
"not before" claim은 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.5)에 따라 JWT가 처리를 위해 허용되어서는 안 되는 시간을 식별합니다.

### exp
expiration time claim은 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4)에 따라 JWT가 처리를 위해 허용되어서는 안 되는 만료 시간을 식별합니다.

### iat
"issued at" claim은 JWT가 발행된 시간을 식별합니다.

이 claim은 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6)에 따라 JWT의 나이를 결정하는 데 사용할 수 있습니다.

### b64
이 JWS Extension Header Parameter는 [RFC7797](https://www.rfc-editor.org/rfc/rfc7797)에 따라 JWS Payload 표현 및 JWS Signing 입력 계산을 수정합니다.

### kid
JWS를 보안하는 데 사용된 키를 나타내는 힌트입니다.

이 매개변수를 사용하면 발신자가 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.4)에 따라 수신자에게 키 변경을 명시적으로 신호할 수 있습니다.

### x5t
(X.509 certificate SHA-1 thumbprint) 헤더 매개변수는 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.7)에 따라 JWS에 디지털 서명하는 데 사용된 키에 해당하는 X.509 인증서 [RFC5280](https://www.rfc-editor.org/rfc/rfc5280)의 DER 인코딩의 base64url로 인코딩된 SHA-1 다이제스트입니다.

### x5c
(X.509 certificate chain) 헤더 매개변수는 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.6)에 따라 JWS에 디지털 서명하는 데 사용된 키에 해당하는 X.509 공개 키 인증서 또는 인증서 체인 [RFC5280](https://www.rfc-editor.org/rfc/rfc5280)을 포함합니다.

### x5u
(X.509 URL) 헤더 매개변수는 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.5)에 따라 JWS에 디지털 서명하는 데 사용된 키에 해당하는 X.509 공개 키 인증서 또는 인증서 체인 [RFC5280]에 대한 리소스를 참조하는 URI [RFC3986](https://www.rfc-editor.org/rfc/rfc3986)입니다.

### jwk
"jku" (JWK Set URL) Header Parameter는 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.2)에 따라 JWS에 디지털 서명하는 데 사용된 키에 해당하는 키 중 하나인 JSON으로 인코딩된 공개 키 세트에 대한 리소스를 참조하는 URI [RFC3986]입니다.

키는 JWK Set [JWK]로 인코딩되어야 합니다.

### typ
`typ` (type) Header Parameter는 JWS 애플리케이션에서 이 전체 JWS의 미디어 타입 [IANA.MediaTypes]을 선언하는 데 사용됩니다.

이것은 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.9)에 따라 JWS를 포함할 수 있는 애플리케이션 데이터 구조에 둘 이상의 종류의 객체가 있을 수 있는 경우 애플리케이션에서 사용하기 위한 것입니다.

### ctr
Content-Type 매개변수는 JWS 애플리케이션에서 보안 콘텐츠(payload)의 미디어 타입 [IANA.MediaTypes]을 선언하는 데 사용됩니다.

이것은 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.9)에 따라 JWS Payload에 둘 이상의 종류의 객체가 있을 수 있는 경우 애플리케이션에서 사용하기 위한 것입니다.

## Handler
핸들러에 추가된 값은 다음과 같습니다.

### jwt.sign
JWT 플러그인에 의해 등록된 JWT와 함께 사용하는 것과 관련된 컬렉션의 동적 객체입니다.

타입:
```typescript
sign: (payload: JWTPayloadSpec): Promise<string>
```

`JWTPayloadSpec`는 [JWT config](#config)와 동일한 값을 허용합니다.

### jwt.verify
제공된 JWT 설정으로 payload를 검증합니다.

타입:
```typescript
verify(payload: string) => Promise<JWTPayloadSpec | false>
```

`JWTPayloadSpec`는 [JWT config](#config)와 동일한 값을 허용합니다.

## Pattern
플러그인을 사용하는 일반적인 패턴을 찾을 수 있습니다.

## JWT 만료 날짜 설정
기본적으로 설정은 `setCookie`에 전달되고 해당 값을 상속합니다.

```typescript
const app = new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: 'kunikuzushi',
            exp: '7d'
        })
    )
    .get('/sign/:name', async ({ jwt, params }) => jwt.sign(params))
```

이렇게 하면 다음 7일의 만료 날짜로 JWT를 서명합니다.
