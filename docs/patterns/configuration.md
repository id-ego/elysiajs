---
title: Config - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Config - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia can be configured by passing an object to the constructor. We can configure Elysia behavior by passing an object to the constructor.

  - - meta
    - property: 'og:description'
      content: Elysia can be configured by passing an object to the constructor. We can configure Elysia behavior by passing an object to the constructor.
---

# Config

Elysia는 설정 가능한 동작을 제공하여 다양한 기능을 사용자 정의할 수 있습니다.

생성자를 사용하여 설정을 정의할 수 있습니다.

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia({
	prefix: '/v1',
	normalize: true
})
```

## adapter

###### Since 1.1.11

다른 환경에서 Elysia를 사용하기 위한 런타임 adapter입니다.

환경에 따라 적절한 adapter가 기본값으로 설정됩니다.

```ts
import { Elysia, t } from 'elysia'
import { BunAdapter } from 'elysia/adapter/bun'

new Elysia({
	adapter: BunAdapter
})
```

## aot

###### Since 0.4.0

Ahead of Time 컴파일입니다.

Elysia는 [성능을 최적화](/blog/elysia-04.html#ahead-of-time-complie)할 수 있는 내장 JIT _"컴파일러"_를 가지고 있습니다.

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	aot: true
})
```
Ahead of Time 컴파일을 비활성화합니다

#### Options - @default `false`

- `true` - 서버를 시작하기 전에 모든 라우트를 사전 컴파일합니다

- `false` - JIT를 완전히 비활성화합니다. 성능 비용 없이 더 빠른 시작 시간을 제공합니다

## detail

인스턴스의 모든 라우트에 대한 OpenAPI 스키마를 정의합니다.

이 스키마는 인스턴스의 모든 라우트에 대한 OpenAPI 문서를 생성하는 데 사용됩니다.

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	detail: {
		hide: true,
		tags: ['elysia']
	}
})
```

## encodeSchema

응답을 클라이언트에 반환하기 전에 커스텀 `Encode`를 사용하여 커스텀 `t.Transform` 스키마를 처리합니다.

이를 통해 클라이언트에 응답을 보내기 전에 데이터에 대한 커스텀 인코딩 함수를 만들 수 있습니다.

```ts
import { Elysia, t } from 'elysia'

new Elysia({ encodeSchema: true })
```

#### Options - @default `true`

- `true` - 클라이언트에 응답을 보내기 전에 `Encode`를 실행합니다
- `false` - `Encode`를 완전히 건너뜁니다

## name

[Plugin Deduplication](/essential/plugin.html#plugin-deduplication)과 디버깅에 사용되는 인스턴스의 이름을 정의합니다

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	name: 'service.thing'
})
```

## nativeStaticResponse
###### Since 1.1.11

각 런타임에 대한 인라인 값을 처리하기 위해 최적화된 함수를 사용합니다.

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	nativeStaticResponse: true
})
```

#### Example

Bun에서 활성화되면 Elysia는 인라인 값을 `Bun.serve.static`에 삽입하여 정적 값의 성능을 향상시킵니다.

```ts
import { Elysia } from 'elysia'

// 이렇게
new Elysia({
	nativeStaticResponse: true
}).get('/version', 1)

// 다음과 동일합니다
Bun.serve({
	static: {
		'/version': new Response(1)
	}
})
```

## normalize

###### Since 1.1.0

Elysia가 필드를 지정된 스키마로 강제 변환할지 여부입니다.

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia({
	normalize: true
})
```

입력 및 출력에서 스키마에 지정되지 않은 알 수 없는 속성이 발견되면 Elysia는 해당 필드를 어떻게 처리해야 할까요?

Options - @default `true`

- `true`: Elysia는 [exact mirror](/blog/elysia-13.html#exact-mirror)를 사용하여 필드를 지정된 스키마로 강제 변환합니다

- `typebox`: Elysia는 [TypeBox의 Value.Clean](https://github.com/sinclairzx81/typebox)을 사용하여 필드를 지정된 스키마로 강제 변환합니다

- `false`: 요청 또는 응답에 각 핸들러의 스키마에서 명시적으로 허용되지 않은 필드가 포함되어 있으면 Elysia는 오류를 발생시킵니다.

## precompile

###### Since 1.0.0

Elysia가 서버를 시작하기 전에 [모든 라우트를 미리 컴파일](/blog/elysia-10.html#improved-startup-time)해야 하는지 여부입니다.

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	precompile: true
})
```

Options - @default `false`

- `true`: 서버를 시작하기 전에 모든 라우트에서 JIT를 실행합니다

- `false`: 요청 시 동적으로 라우트를 컴파일합니다

`false`로 두는 것이 좋습니다.

## prefix

인스턴스의 모든 라우트에 대한 접두사를 정의합니다

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia({
	prefix: '/v1'
})
```

접두사가 정의되면 모든 라우트에 지정된 값이 접두사로 추가됩니다.

#### Example

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia({ prefix: '/v1' }).get('/name', 'elysia') // Path는 /v1/name입니다
```

## sanitize

검증 중 모든 `t.String`에서 호출하고 가로채는 함수 또는 함수 배열입니다.

문자열을 읽고 새 값으로 변환할 수 있습니다.

```ts
import { Elysia, t } from 'elysia'

new Elysia({
	sanitize: (value) => Bun.escapeHTML(value)
})
```

## seed

[Plugin Deduplication](/essential/plugin.html#plugin-deduplication)에 사용되는 인스턴스의 체크섬을 생성하는 데 사용할 값을 정의합니다

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	seed: {
		value: 'service.thing'
	}
})
```

값은 문자열, 숫자 또는 객체에 국한되지 않고 어떤 유형이든 될 수 있습니다.

## strictPath

Elysia가 경로를 엄격하게 처리해야 하는지 여부입니다.

[RFC 3986](https://tools.ietf.org/html/rfc3986#section-3.3)에 따르면 경로는 라우트에 정의된 경로와 엄격하게 동일해야 합니다.

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia({ strictPath: true })
```

#### Options - @default `false`

- `true` - 경로 일치를 위해 [RFC 3986](https://tools.ietf.org/html/rfc3986#section-3.3)을 엄격하게 따릅니다
- `false` - 접미사 '/' 또는 그 반대를 허용합니다.

#### Example

```ts twoslash
import { Elysia, t } from 'elysia'

// 경로는 /name 또는 /name/일 수 있습니다
new Elysia({ strictPath: false }).get('/name', 'elysia')

// 경로는 /name만 가능합니다
new Elysia({ strictPath: true }).get('/name', 'elysia')
```

## serve

HTTP 서버 동작을 사용자 정의합니다.

Bun serve 설정입니다.

```ts
import { Elysia } from 'elysia'

new Elysia({
	serve: {
		hostname: 'elysiajs.com',
		tls: {
			cert: Bun.file('cert.pem'),
			key: Bun.file('key.pem')
		}
	},
})
```

이 설정은 [Bun Serve API](https://bun.sh/docs/api/http) 및 [Bun TLS](https://bun.sh/docs/api/http#tls)를 확장합니다

### Example: Max body size
`serve` 설정에서 [`serve.maxRequestBodySize`](#serve-maxrequestbodysize)를 설정하여 최대 본문 크기를 설정할 수 있습니다.

```ts
import { Elysia } from 'elysia'

new Elysia({
	serve: {
		maxRequestBodySize: 1024 * 1024 * 256 // 256MB
	}
})
```

기본적으로 최대 요청 본문 크기는 128MB(1024 * 1024 * 128)입니다.
본문 크기 제한을 정의합니다.

```ts
import { Elysia } from 'elysia'

new Elysia({
	serve: {
		// 최대 메시지 크기(바이트)
	    maxPayloadLength: 64 * 1024,
	}
})
```

### Example: HTTPS / TLS
키와 인증서에 대한 값을 전달하여 TLS(SSL의 후속)를 활성화할 수 있습니다. 둘 다 TLS를 활성화하는 데 필요합니다.

```ts
import { Elysia, file } from 'elysia'

new Elysia({
	serve: {
		tls: {
			cert: file('cert.pem'),
			key: file('key.pem')
		}
	}
})
```

### Example: Increase timeout

`serve` 설정에서 [`serve.idleTimeout`](#serve-idletimeout)을 설정하여 유휴 타임아웃을 늘릴 수 있습니다.

```ts
import { Elysia } from 'elysia'

new Elysia({
	serve: {
		// 유휴 타임아웃을 30초로 늘립니다
		idleTimeout: 30
	}
})
```

기본적으로 유휴 타임아웃은 (Bun에서) 10초입니다.

---

## serve
HTTP 서버 설정입니다.

Elysia는 기본적으로 TLS를 지원하고 BoringSSL로 구동되는 Bun 설정을 확장합니다.

사용 가능한 설정에 대해서는 [serve.tls](#serve-tls)를 참조하세요.

### serve.hostname
@default `0.0.0.0`

서버가 수신하는 호스트 이름을 설정합니다

### serve.id
ID로 서버 인스턴스를 고유하게 식별합니다

이 문자열은 보류 중인 요청이나 WebSocket을 중단하지 않고 서버를 핫 리로드하는 데 사용됩니다. 제공되지 않으면 값이 생성됩니다. 핫 리로딩을 비활성화하려면 이 값을 `null`로 설정하세요.

### serve.idleTimeout
@default `10` (10초)

기본적으로 Bun은 유휴 타임아웃을 10초로 설정합니다. 즉, 요청이 10초 이내에 완료되지 않으면 중단됩니다.

### serve.maxRequestBodySize
@default `1024 * 1024 * 128` (128MB)

요청 본문의 최대 크기를 설정합니다(바이트 단위)

### serve.port
@default `3000`

수신할 포트입니다

### serve.rejectUnauthorized
@default `NODE_TLS_REJECT_UNAUTHORIZED` 환경 변수

`false`로 설정하면 모든 인증서가 허용됩니다.

### serve.reusePort
@default `true`

`SO_REUSEPORT` 플래그를 설정해야 하는지 여부입니다

이를 통해 여러 프로세스가 동일한 포트에 바인딩할 수 있으며, 이는 로드 밸런싱에 유용합니다

이 설정은 Elysia에 의해 재정의되고 기본적으로 켜져 있습니다

### serve.unix
설정된 경우 HTTP 서버는 포트 대신 Unix 소켓에서 수신합니다.

(hostname+port와 함께 사용할 수 없습니다)

### serve.tls
키와 인증서에 대한 값을 전달하여 TLS(SSL의 후속)를 활성화할 수 있습니다. 둘 다 TLS를 활성화하는 데 필요합니다.

```ts
import { Elysia, file } from 'elysia'

new Elysia({
	serve: {
		tls: {
			cert: file('cert.pem'),
			key: file('key.pem')
		}
	}
})
```

Elysia는 기본적으로 TLS를 지원하고 BoringSSL로 구동되는 Bun 설정을 확장합니다.

### serve.tls.ca
선택적으로 신뢰할 수 있는 CA 인증서를 재정의합니다. 기본값은 Mozilla에서 선별한 잘 알려진 CA를 신뢰하는 것입니다.

이 옵션을 사용하여 CA를 명시적으로 지정하면 Mozilla의 CA가 완전히 교체됩니다.

### serve.tls.cert
PEM 형식의 인증서 체인입니다. 제공된 개인 키당 하나의 인증서 체인을 제공해야 합니다.

각 인증서 체인은 제공된 개인 키에 대한 PEM 형식의 인증서와 PEM 형식의 중간 인증서(있는 경우)를 순서대로 구성해야 하며 루트 CA를 포함하지 않아야 합니다(루트 CA는 피어에게 미리 알려져 있어야 합니다. ca 참조).

여러 인증서 체인을 제공할 때 키에서 개인 키와 동일한 순서일 필요는 없습니다.

중간 인증서가 제공되지 않으면 피어가 인증서를 검증할 수 없으며 핸드셰이크가 실패합니다.

### serve.tls.dhParamsFile
사용자 정의 Diffie Helman 매개변수에 대한 .pem 파일의 파일 경로입니다

### serve.tls.key
PEM 형식의 개인 키입니다. PEM은 개인 키가 암호화되는 옵션을 허용합니다. 암호화된 키는 options.passphrase로 복호화됩니다.

다양한 알고리즘을 사용하는 여러 키는 암호화되지 않은 키 문자열 또는 버퍼의 배열 또는 형식의 객체 배열로 제공할 수 있습니다.

객체 형식은 배열에서만 발생할 수 있습니다.

**object.passphrase**는 선택 사항입니다. 암호화된 키는 제공된 경우 **object.passphrase**로 복호화되거나 제공되지 않은 경우 **options.passphrase**로 복호화됩니다.

### serve.tls.lowMemoryMode
@default `false`

이것은 `OPENSSL_RELEASE_BUFFERS`를 1로 설정합니다.

전체 성능은 감소하지만 일부 메모리를 절약합니다.

### serve.tls.passphrase
단일 개인 키 및/또는 PFX에 대한 공유 암호입니다.

### serve.tls.requestCert
@default `false`

`true`로 설정하면 서버가 클라이언트 인증서를 요청합니다.

### serve.tls.secureOptions
선택적으로 OpenSSL 프로토콜 동작에 영향을 줍니다. 일반적으로 필요하지 않습니다.

이것은 전혀 사용하지 않는 경우 신중하게 사용해야 합니다!

값은 OpenSSL Options의 SSL_OP_* 옵션에 대한 숫자 비트마스크입니다

### serve.tls.serverName
서버 이름을 명시적으로 설정합니다

## tags

[detail](#detail)과 유사하게 인스턴스의 모든 라우트에 대한 OpenAPI 스키마의 태그를 정의합니다

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	tags: ['elysia']
})
```

### systemRouter

가능한 경우 런타임/프레임워크에서 제공하는 라우터를 사용합니다.

Bun에서 Elysia는 [Bun.serve.routes](https://bun.sh/docs/api/http#routing)를 사용하고 Elysia의 자체 라우터로 폴백합니다.

## websocket

WebSocket 설정을 재정의합니다

Elysia는 WebSocket을 자동으로 처리하기 위한 적절한 설정을 생성하므로 기본값으로 두는 것이 좋습니다

이 설정은 [Bun의 WebSocket API](https://bun.sh/docs/api/websockets)를 확장합니다

#### Example
```ts
import { Elysia } from 'elysia'

new Elysia({
	websocket: {
		// 압축 및 압축 해제 활성화
    	perMessageDeflate: true
	}
})
```

---

<!-- <br />

# Experimental

Try out an experimental feature which might be available in the future version of Elysia. -->
