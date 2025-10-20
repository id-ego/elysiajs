---
title: Elysia 1.3 and Scientific Witchery
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 1.3 and Scientific Witchery

    - - meta
      - name: 'description'
        content: Near 0 overhead normalization with Exact Mirror, Bun System Router, Standalone Validator, Half the type instantiations, and significant memory usage reduction and faster startup time for large app

    - - meta
      - property: 'og:description'
        content: Near 0 overhead normalization with Exact Mirror, Bun System Router, Standalone Validator, Half the type instantiations, and significant memory usage reduction and faster startup time for large app

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-13/elysia-13.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-13/elysia-13.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 1.3 and Scientific Witchery"
    src="/blog/elysia-13/elysia-13.webp"
    alt="pink-violet tint mesh gradient background with word 'Elysia 1.3' and the word 'Scientific Witchery' below the title"
    author="saltyaom"
    date="5 May 2025"
    shadow
>

Mili의 곡 [Ga1ahad and Scientific Witchery](https://youtu.be/d-nxW9qBtxQ)에서 이름을 따왔습니다.

이번 릴리스는 화려한 새 기능을 제공하지 않습니다.

우리가 **"마법"**으로 간주할 정도로 더 나은 것들을 만드는 개선에 관한 것입니다.

Elysia 1.3는 거의 0에 가까운 오버헤드, 개선, 기술 부채 해결 및 내부 코드 리팩터링으로 다음과 같은 기능을 제공합니다:
- [Exact Mirror](#exact-mirror)
- [Bun System Router](#bun-system-router)
- [Standalone Validator](#standalone-validator)
- [Reduced Type Instantiation by half](#reduced-type-instantiation)
- [Performance Improvement](#performance-improvement)
- [Validation DX Improvement](#validation-dx-improvement)
- [Rename error to status](#rename-error-to-status)

## Exact Mirror
우리는 데이터가 원하는 형태와 일치하도록 하기 위해 Elysia 1.1에서 [normalize](/patterns/configuration.html#normalize)를 도입했으며, 잘 작동합니다.

잠재적인 데이터 유출, 예상치 못한 속성을 줄이는 데 도움이 되며 사용자들이 좋아합니다. 그러나 성능 비용이 따릅니다.

내부적으로, 지정된 스키마로 데이터를 **동적으로** 강제 변환하기 위해 `TypeBox의 Value.Clean`을 사용합니다.

잘 작동하지만 우리가 원하는 만큼 빠르지는 않습니다.

TypeBox가 미리 형태를 알고 있는 장점을 활용하는 `TypeCompiler.Check`와 달리 `Value.Clean`의 **컴파일된** 버전을 제공하지 않기 때문입니다.

그래서 우리는 [Exact Mirror](https://github.com/elysiajs/exact-mirror)로 대체품을 도입했습니다.

**Exact Mirror**는 미리 컴파일을 활용하여 상당한 성능 향상을 제공하는 TypeBox의 **Value.Clean**의 드롭인 대체품입니다.

### Performance
배열이 없는 작은 객체의 경우, 동일한 객체에 대해 **최대 ~500배 빠른** 것을 측정했습니다.
![Exact Mirror run on small data resulting in 582.52x faster than TypeBox Value.Clean](/blog/elysia-13/exact-mirror-small.webp)
> 작은 데이터에서 실행한 Exact Mirror

중대형 객체의 경우, **최대 ~30배 빠른** 것을 측정했습니다.
![Exact Mirror run on medium and large data resulting in 29.46x and 31.6x in order](/blog/elysia-13/exact-mirror-large.webp)
> 중대형 데이터에서 실행한 Exact Mirror

### What it means for Elysia
Elysia 1.3부터 Exact Mirror는 TypeBox를 대체하는 정규화의 기본 전략입니다.

Elysia 1.3로 업그레이드하면 **코드 변경 없이** 상당한 성능 향상을 기대할 수 있습니다.

다음은 Elysia 1.2의 처리량입니다.
![Elysia with normalization turned off resulting in 49k req/sec](/blog/elysia-13/normalize-1.2.webp)
> 정규화를 끈 Elysia

다음은 Elysia 1.3의 동일한 코드입니다
![Elysia with normalization turned on resulting in 77k req/sec](/blog/elysia-13/normalize-1.3.webp)
> 정규화를 켠 Elysia

정규화와 함께 **단일** 스키마를 사용할 때 최대 ~1.5배의 처리량 증가를 측정했습니다.

이는 단일 스키마 이상을 사용하면 더 많은 성능 향상을 볼 수 있다는 것을 의미합니다.

**스키마 없는** 동일한 코드와 비교할 때 < 2%의 성능 차이를 봅니다.

![Elysia runs with no validation results in 79k req/sec](/blog/elysia-13/no-validation.webp)
> 유효성 검증 없이 실행되는 Elysia

이것은 엄청납니다.

이전에는 유효성 검증 사용과 사용하지 않음 간의 성능 격차를 좁힐 때 안전성과 성능 중에서 선택해야 했습니다. 하지만 이제는 걱정할 필요가 없습니다.

하지만 이제 우리는 사용자 측에서 어떠한 변경도 요구하지 않고 유효성 검증 오버헤드를 상당한 양에서 거의 0으로 줄였습니다.

마법처럼 작동합니다.

그러나 TypeBox를 사용하거나 정규화를 완전히 비활성화하려면, 다른 구성과 마찬가지로 생성자로 설정할 수 있습니다:
```ts
import { Elysia } from 'elysia'

new Elysia({
	normalize: 'typebox' // Using TypeBox
})
```

[Exact Mirror on GitHub](https://github.com/elysiajs/exact-mirror)를 방문하여 직접 벤치마크를 시도해 볼 수 있습니다.

## System Router
우리는 Elysia에서 라우터에 대한 성능 문제를 겪어본 적이 없습니다.

뛰어난 성능을 가지고 있으며, 가능한 한 최대한 하이퍼 최적화했습니다.

우리는 JavaScript가 실용적인 의미에서 제공할 수 있는 거의 한계에 가깝게 밀어붙였습니다.

### Bun Router
그러나 Bun 1.2.3은 (가능한 경우) 네이티브 코드로 라우팅에 대한 내장 솔루션을 제공합니다.

정적 라우트의 경우 많은 성능 향상을 보지 못했지만, **동적 라우트가 코드 변경 없이 2-5% 더 빠르게** 수행되는 것을 발견했습니다.

Elysia 1.3부터 Bun의 네이티브 라우터와 Elysia의 라우터를 모두 사용하여 이중 라우터 전략을 제공합니다.

Elysia는 가능한 경우 Bun 라우터를 사용하려고 시도하고 Elysia의 라우터로 폴백합니다.

### Adapter
이를 가능하게 하기 위해 **adapter**에서 사용자 정의 라우터를 지원하도록 내부 컴파일 코드를 다시 작성해야 했습니다.

즉, 이제 Elysia 자체 라우터와 함께 사용자 정의 라우터를 사용할 수 있습니다.

이는 일부 환경에서 성능 향상의 기회를 열어줍니다. 예를 들어: 라우팅을 위한 네이티브 구현을 가진 내장 `uWebSocket.js router`를 사용하는 것입니다.

## Standalone Validator
Elysia에서는 스키마를 정의하고 `guard`를 사용하여 여러 라우트에 적용할 수 있습니다.

그런 다음 라우트 핸들러에 스키마를 제공하여 공개 스키마를 재정의할 수 있으며, 때때로 다음과 같이 보입니다:

![Elysia run with default override guard showing schema gets override](/blog/elysia-13/schema-override.webp)
> 기본 재정의 guard로 실행하는 Elysia는 스키마가 재정의되는 것을 보여줍니다

하지만 때때로 우리는 스키마를 **재정의하고 싶지 않습니다**.

대신 둘 다 작동하도록 하여 스키마를 재정의하는 대신 결합할 수 있기를 원합니다.

Elysia 1.3부터 바로 그렇게 할 수 있습니다.

이제 Elysia에게 재정의하지 말고 대신 스키마를 **standalone**으로 제공하여 자체적으로 처리하도록 지시할 수 있습니다.

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

결과적으로, 로컬 및 전역 스키마를 함께 병합하는 것과 같은 결과를 얻습니다.

![Elysia run with standalone merging multiple guard together](/blog/elysia-13/schema-standalone.webp)
> standalone으로 실행하여 여러 guard를 함께 병합하는 Elysia

## Reduced Type Instantiation

Elysia의 타입 추론은 이미 매우 빠릅니다.

우리는 타입 추론 최적화에 대해 정말 자신감이 있으며 express와 유사한 구문을 사용하는 대부분의 프레임워크보다 빠릅니다.

그러나 여러 라우트와 복잡한 타입 추론을 가진 정말 **정말** 대규모 애플리케이션을 가진 사용자들이 있습니다.

우리는 대부분의 경우 **타입 인스턴스화를 절반으로 줄이는** 데 성공했으며, 추론 속도에서 최대 60% 향상을 측정했습니다.

![type instantiation reduced from 109k to 52k](/blog/elysia-13/type-instantiation.webp)
> 타입 인스턴스화가 109k에서 52k로 감소

또한 `decorate`의 기본 동작을 변경하여 명시적으로 지정하지 않는 한 모든 객체와 속성을 재귀적으로 반복하는 대신 교차를 수행하도록 했습니다.

이는 예를 들어 `PrismaClient`와 같은 무거운 객체/클래스를 사용하는 사용자의 문제를 해결해야 합니다.

결과적으로 더 빠른 IDE 자동 완성, 제안, 타입 검사 및 Eden Treaty를 얻어야 합니다.

## Performance Improvement
많은 내부 코드를 리팩터링하고 최적화했으며 상당한 개선으로 누적됩니다.

### Route Registration

라우트 정보를 저장하는 방법을 리팩터링했으며 복제/생성하는 대신 객체 참조를 재사용합니다.

다음과 같은 개선 사항을 확인했습니다:
- 최대 ~5.6배 메모리 사용량 감소
- 최대 ~2.7배 빠른 라우트 등록 시간

![Route registration comparison between Elysia 1.2 (left), and 1.3 (right)](/blog/elysia-13/routes.webp)
> Elysia 1.2(왼쪽)와 1.3(오른쪽) 간의 라우트 등록 비교

이러한 최적화는 서버가 가진 라우트 수에 따라 확장되므로 중대형 규모 앱에서 실제 결과를 보여야 합니다.

### Sucrose
불필요한 재계산을 줄이고 비인라인 이벤트에 대해 각 라우트를 컴파일할 때 컴파일된 라우트를 재사용하기 위해 Sucrose 캐시를 구현했습니다.

![Sucrose performance comparison between Elysia 1.2 (left), and 1.3 (right)](/blog/elysia-13/sucrose.webp)
> Elysia 1.2(왼쪽)와 1.3(오른쪽) 간의 Sucrose 성능 비교

Sucrose는 각 이벤트를 체크섬 숫자로 변환하고 캐시로 저장합니다. 메모리를 적게 사용하며 서버가 시작되면 정리됩니다.

이 개선 사항은 전역/범위 이벤트를 재사용하는 각 라우트의 시작 시간에 도움이 될 것입니다.

### Instance
여러 인스턴스를 생성하고 플러그인으로 적용할 때 상당한 개선을 확인했습니다.

- 최대 ~10배 메모리 사용량 감소
- 최대 ~3배 빠른 플러그인 생성

![Elysia instance comparison between Elysia 1.2 (left), and 1.3 (right)](/blog/elysia-13/instance.webp)
> Elysia 1.2(왼쪽)와 1.3(오른쪽) 간의 Elysia 인스턴스 비교

이러한 최적화는 Elysia 1.3으로 업그레이드하면 자동으로 적용됩니다. 그러나 이러한 성능 최적화는 작은 앱에서는 크게 눈에 띄지 않을 수 있습니다.

간단한 Bun 서버를 제공하는 데 약 10-15MB의 고정 비용이 있기 때문입니다. 이러한 최적화는 기존 오버헤드를 줄이고 시작 시간을 개선하는 데 더 많은 도움이 됩니다.

### Faster performance in general
다양한 마이크로 최적화, 기술 부채 해결 및 사용하지 않는 컴파일된 명령 제거를 통해.

Elysia 요청 처리 속도에서 일반적인 개선을 확인했습니다. 경우에 따라 최대 40%입니다.

![Elysia.handle comparison between Elysia 1.2 and 1.3](/blog/elysia-13/handle.webp)
> Elysia 1.2와 1.3 간의 Elysia.handle 비교

## Validation DX Improvement
우리는 Elysia 유효성 검증이 **그냥 작동**하기를 원합니다.

원하는 것을 말하기만 하면 얻을 수 있는 것입니다. Elysia의 가장 가치 있는 측면 중 하나입니다.

이번 업데이트에서 부족했던 일부 영역을 개선했습니다.

### Encode schema

[encodeSchema](/patterns/configuration.html#encodeschema)를 `experimental`에서 제거하고 기본적으로 활성화했습니다.

이를 통해 [t.Transform](https://github.com/sinclairzx81/typebox?tab=readme-ov-file#types-transform)을 사용하여 최종 사용자에게 반환하는 사용자 정의 응답 매핑을 적용할 수 있습니다.

![Using t.Transform to intercept a value into a new one](/blog/elysia-13/encode-schema.webp)
> t.Transform을 사용하여 값을 새로운 값으로 가로채기

이 예제 코드는 응답을 가로채서 "hi"를 "intercepted"로 대체합니다.

### Sanitize

SQL 인젝션 및 XSS를 방지하고 문자열 입력/출력이 안전한지 확인하기 위해 [sanitize](/patterns/configuration.html#sanitize) 옵션을 도입했습니다.

모든 `t.String`을 가로채서 새로운 값으로 변환하는 함수 또는 함수 배열을 허용합니다.

![Using sanitize with Bun.escapeHTML](/blog/elysia-13/sanitize.webp)
> Bun.escapeHTML과 함께 sanitize 사용

이 예제에서는 **Bun.escapeHTML**을 사용하고 모든 "dorothy"를 "doro"로 대체합니다.

`sanitize`는 모든 스키마에 전역적으로 적용되므로 루트 인스턴스에서 적용되어야 합니다.

이는 각 문자열 필드를 수동으로 안전하게 유효성 검증하고 변환하는 보일러플레이트를 크게 줄여야 합니다.


### Form
이전 버전의 Elysia에서는 컴파일 타임에 [form](/essential/handler.html#formdata)과 `t.Object`로 FormData 응답을 타입 검사하는 것이 불가능했습니다.

이를 수정하기 위해 새로운 [t.Form](/patterns/type#form) 타입을 도입했습니다.

![Using t.Form to validate FormData](/blog/elysia-13/form.webp)
> t.Form을 사용하여 FormData 유효성 검증

form을 타입 검사하도록 마이그레이션하려면, 응답 스키마에서 `t.Object`를 `t.Form`으로 간단히 교체하면 됩니다.

### File Type
Elysia는 이제 [file-type](https://github.com/sindresorhus/file-type)을 사용하여 파일 타입을 유효성 검증합니다.

![Defining file type using t.File](/blog/elysia-13/file-type.webp)
> t.File을 사용하여 파일 타입 정의

`type`이 지정되면, Elysia는 매직 넘버를 확인하여 파일 타입을 자동으로 감지합니다.

그러나 이는 **peerDependencies**로도 나열되어 있으며 필요하지 않은 사용자의 번들 크기를 줄이기 위해 Elysia와 함께 기본적으로 설치되지 않습니다.

더 나은 보안을 위해 파일 타입 유효성 검증에 의존하는 경우 Elysia 1.3으로 업데이트하는 것이 좋습니다.

### Elysia.Ref
`Elysia.model`을 사용하여 참조 모델을 생성하고 이름으로 참조할 수 있습니다.

그러나 때때로 스키마 내부에서 참조해야 합니다.

`Elysia.Ref`를 사용하여 자동 완성으로 모델을 참조하여 바로 그렇게 할 수 있습니다.

![Using Elysia.Ref to reference model](/blog/elysia-13/elysia-ref.webp)
> Elysia.Ref를 사용하여 모델 참조

`t.Ref`를 사용하여 모델을 참조할 수도 있지만 자동 완성을 제공하지 않습니다.

### NoValidate

일부 사용자가 API 프로토타입을 빠르게 만들고 싶어하거나 때때로 유효성 검증을 강제하는 데 문제가 있다는 피드백을 받았습니다.

Elysia 1.3에서 유효성 검증을 건너뛰기 위해 `t.NoValidate`를 도입했습니다.

![Using t.NoValidate to tell Elysia to skip validation](/blog/elysia-13/no-validate.webp)
> t.NoValidate를 사용하여 Elysia에게 유효성 검증을 건너뛰도록 지시

이는 Elysia에게 런타임 유효성 검증을 건너뛰도록 지시하지만, API 문서를 위한 TypeScript 타입 검사 및 OpenAPI 스키마를 여전히 제공합니다.

## Status
`error`의 이름 지정에 대해 많은 응답을 받았습니다.

Elysia 1.3부터 `error`를 더 이상 사용하지 않기로 결정했으며, 대신 `status` 사용을 권장합니다.

![IDE showing that error is deprecated and renamed to status](/blog/elysia-13/status.webp)
> error가 더 이상 사용되지 않으며 status로 이름이 변경되었음을 보여주는 IDE

`error` 함수는 이전 버전처럼 작동하며, 즉각적인 변경이 필요하지 않습니다.

그러나 적어도 다음 6개월 또는 Elysia 1.4 또는 1.5까지 `error` 함수를 지원할 것이므로 대신 `status`로 리팩터링하는 것을 권장합니다.

마이그레이션하려면, 간단히 `error`를 `status`로 이름을 바꾸면 됩니다.

## ".index" is removed from Treaty

이전에는 **/***로 끝나는 경로를 처리하기 위해 `(treaty).index`를 추가해야 했습니다.

Elysia 1.3부터 `.index` 사용을 중단하기로 결정했으며 메서드를 직접 호출하도록 간단히 우회할 수 있습니다.

![Eden Treaty showing no-use of .index](/blog/elysia-13/treaty-index.webp)
> .index를 사용하지 않는 Eden Treaty

이것은 **breaking change**이지만 마이그레이션하는 데 최소한의 노력이 필요합니다.

마이그레이션하려면, 코드베이스에서 `.index`를 간단히 제거하면 됩니다. IDE 검색을 사용하여 `.index`를 일치시켜 제거하도록 대량 변경 및 교체를 통해 간단한 변경이어야 합니다.

## Notable changes
다음은 변경 로그의 일부 주목할 만한 변경 사항입니다.

### Improvement
- `encodeSchema`는 이제 안정적이며 기본적으로 활성화되어 있습니다
- 타입 최적화
- Encode 사용 시 중복 타입 검사 감소
- isAsync 최적화
- 불필요한 UnwrapTypeModule 호출을 방지하기 위해 기본적으로 Definition['typebox']를 언랩합니다
- Elysia.form을 이제 타입 검사할 수 있습니다
- type-system 리팩터링
- `_types`를 `~Types`로 리팩터링
- aot 컴파일을 사용하여 Numeric과 같은 사용자 정의 Elysia 타입을 검사합니다
- `app.router.static`을 리팩터링하고 정적 라우터 코드 생성을 컴파일 단계로 이동합니다
- `add`, `_use` 및 일부 유틸리티 함수의 메모리 사용량 최적화
- 여러 라우트의 시작 시간 개선
- 컴파일 프로세스에서 필요에 따라 동적으로 쿠키 유효성 검증기 생성
- 객체 복제 감소
- content type 헤더의 구분자를 찾기 위한 시작 인덱스 최적화
- Promise는 이제 정적 응답이 될 수 있습니다
- `ParseError`는 이제 스택 추적을 유지합니다
- `parseQuery` 및 `parseQueryFromURL` 리팩터링
- `mount`에 `config` 옵션 추가
- 비동기 모듈이 마운트된 후 자동으로 재컴파일
- 후크에 함수가 있을 때 macro 지원
- ws에서 resolve macro 지원
- [#1146](https://github.com/elysiajs/elysia/pull/1146) 핸들러에서 web API의 File 반환 지원 추가
- [#1165](https://github.com/elysiajs/elysia/pull/1165) 응답 스키마 유효성 검증에서 숫자가 아닌 상태 코드 건너뛰기
- [#1177](https://github.com/elysiajs/elysia/issues/1177) 오류가 발생할 때 쿠키가 서명하지 않습니다

### Bug fix
- `onError`에서 반환된 `Response`가 octet stream을 사용합니다
- `mergeObjectArray` 사용 시 의도하지 않은 메모리 할당
- Date query의 빈 공간 처리

### Change
- `maybeStream`이 true일 때만 mapResponse에 `c.request`를 제공합니다
- `routeTree`에 `Map` 대신 일반 객체 사용
- `compressHistoryHook` 및 `decompressHistoryHook` 제거
- webstandard 핸들러는 이제 Bun이 아닌 경우 `text/plain`을 반환합니다
- 명시적으로 지정하지 않는 한 `decorate`에 비const 값 사용
- `Elysia.mount`는 이제 기본적으로 `detail.hide = true`를 설정합니다

### Breaking Change
- `as('plugin')` 제거, `as('scoped')` 사용
- Eden Treaty의 루트 `index` 제거
- `ElysiaAdapter`에서 `websocket` 제거
- `inference.request` 제거

## 맺음말

안녕하세요? 꽤 오래됐네요.

삶은 혼란스러울 수 있죠?

어느 날 당신은 꿈을 쫓고 있고, 그것을 향해 열심히 일하고 있습니다.

알기도 전에, 뒤를 돌아보면 목표보다 훨씬 앞서 있다는 것을 깨닫습니다.

누군가가 당신을 존경하고, 당신이 그들의 영감이 됩니다. 누군가의 롤 모델이 됩니다.

놀랍게 들리죠?

하지만 저는 다른 사람들에게 좋은 롤 모델이 될 것 같지 않습니다.

### 저는 정직한 삶을 살고 싶습니다

때때로, 일들이 그냥 과장됩니다.

저는 무엇이든 만들 수 있는 천재처럼 보일 수 있지만 그렇지 않습니다. 저는 그냥 최선을 다할 뿐입니다.

저는 친구들과 비디오 게임을 하고, 이상한 노래를 듣고, 영화를 봅니다. 심지어 코스프레 컨벤션에서 친구들을 만나기도 합니다.

보통 사람처럼요.

이 모든 시간 동안, 저는 그냥 *당신의* 팔을 꽉 안고 있었습니다.

**저는 당신과 같습니다. 특별한 것이 없습니다.**

저는 최선을 다하지만 때때로 바보처럼 행동하기도 합니다.

제가 롤 모델이 될 만한 것이 없다고 생각하더라도, 감사하다고 말할 수 있게 해주세요.

제 지루하고 약간 외로운 삶을, 너무 미화하지 마세요.

<small>*~ I'm glad you're evil too.*</small>

</Blog>
