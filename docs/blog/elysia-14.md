---
title: Elysia 1.4 - Supersymmetry
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 1.4 - Supersymmetry

    - - meta
      - name: 'description'
        content: Support for Standard Schema. Macro with schema, extension, and OpenAPI detail. Lifecycle type soundness. Improves type inference performance by 10%.

    - - meta
      - property: 'og:description'
        content: Support for Standard Schema. Macro with schema, extension, and OpenAPI detail. Lifecycle type soundness. Improves type inference performance by 10%.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-14/elysia-14.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-14/elysia-14.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 1.4 - Supersymmetry"
    src="/blog/elysia-14/elysia-14.webp"
    alt="'Elysia 1.4' as title with the word 'Supersymmetry' on the left with ElysiaJS chan on the right."
    author="saltyaom"
    date="13 Sep 2025"
    shadow
>

Tone Sphere 엔딩 테마인 Sta의 곡 [Supersymmetry](https://youtu.be/NYyjQjtbteA)에서 이름을 따왔습니다.

Elysia 1.4의 하이라이트는 Standard Schema와 **"Type Soundness"**의 도입입니다.

- [Standard Schema](#standard-schema)
- [Macro](#macro)
- [Lifecycle Type Soundness](#lifecycle-type-soundness)
- [Group standalone schema](#group-standalone-schema)

## Standard Schema

3년 동안 Elysia는 TypeBox만을 유일한 validator로 사용했습니다. 성능과 타입 추론으로 인해 Elysia의 가장 사랑받는 기능 중 하나가 되었습니다.

그러나 처음부터([elysia#20](https://github.com/elysiajs/elysia/issues/20)) 커뮤니티로부터 가장 많이 요청된 기능 중 하나는 TypeBox 이외의 validator를 지원하는 것이었습니다.

Elysia가 TypeBox에 깊이 연결되어 있었기 때문에, 각 validator를 개별적으로 지원하는 것은 많은 노력과 변경 사항에 대응하기 위한 지속적인 유지 보수가 필요했습니다.

다행히도, [Standard Schema](https://github.com/standard-schema/standard-schema)라는 새로운 제안이 동일한 API로 다양한 스키마를 사용하는 표준 방법을 정의했습니다. 이를 통해 각 validator에 대한 사용자 정의 통합을 작성하지 않고도 여러 validator를 지원할 수 있게 되었습니다.

Elysia는 이제 Standard Schema를 지원하여 다음과 같은 즐겨 사용하는 validator를 사용할 수 있습니다:

- Zod
- Valibot
- Effect Schema
- ArkType
- Joi
- 그 외 많은 것들!

TypeBox와 유사한 방식으로 스키마를 제공할 수 있으며, 즉시 작동합니다:

```ts twoslash
import { Elysia, t } from 'elysia'
import { z } from 'zod'
import * as v from 'valibot'

const app = new Elysia()
  	.post(
   		'/user/:id',
     	({ body, params }) => {
      		body
      		// ^?




         	params
      		// ^?


     	},
      	{
       		params: z.object({
         		id: z.coerce.number()
         	}),
         	body: v.object({
		 		name: v.literal('lilith')
		 	})
      	})
```

단일 라우트에서 여러 validator를 사용할 수 있으며, 올바른 타입 추론과 함께 원활하게 작동합니다.

### OpenAPI

Standard Schema와 함께 OpenAPI 생성을 위한 JSON Schema 지원 요청이 있었지만 아직 구현되지 않았습니다.

그러나 `openapi`에 사용자 정의 `mapJsonSchema`를 제공하여 스키마를 Json Schema로 매핑하는 사용자 정의 함수를 제공할 수 있는 해결 방법을 제공합니다.

이를 통해 즐겨 사용하는 validator로 아름다운 OpenAPI 문서를 가질 수 있습니다.

![Zod with OpenAPI support](/blog/elysia-14/openapi-zod.webp)
> Zod의 네이티브 OpenAPI 스키마 지원을 **describe**와 함께 사용하여 스키마에 설명 추가

하지만 validator가 JSON Schema를 지원하지 않는 경우, validator의 TypeScript 타입에서 OpenAPI 스키마를 직접 생성하기 위해 [OpenAPI type gen](/blog/openapi-type-gen.html)을 제공합니다.

이는 Elysia가 JSON Schema를 직접 지원하지 않더라도 Standard Schema를 지원하는 모든 validator에 대해 OpenAPI 생성을 지원한다는 것을 의미합니다.

![Valibot with OpenAPI support](/blog/elysia-14/openapi-valibot.webp)
> Valibot은 JSON Schema를 직접 지원하지 않지만, OpenAPI type gen을 사용하여 처리합니다

올바른 입력 타입을 생성할 뿐만 아니라 OpenAPI type gen은 오류 응답을 포함한 가능한 모든 출력 타입을 생성합니다.

이것은 정말 Elysia만의 고유한 기능이며, 우리는 이를 제공하게 되어 매우 자랑스럽습니다.

### Standalone Validator

standalone validator를 사용하여 여러 스키마로 단일 입력을 검증할 수도 있습니다:

```ts twoslash
import { Elysia, t } from 'elysia'
import { z } from 'zod'
import * as v from 'valibot'

const app = new Elysia()
	.guard({
		schema: 'standalone',
		body: z.object({
			id: z.coerce.number()
		})
	})
	.post(
		'/user/:id',
		({ body }) => body,
		//  ^?




		{
			body: v.object({
				name: v.literal('lilith')
			})
		}
	)
```
> 이 예제는 Zod와 Valibot을 모두 사용하여 본문을 검증하므로, 코드베이스의 다양한 validator에서 기존 스키마를 함께 사용할 수 있습니다.

이것은 각 validator를 사용하여 입력의 일부를 파싱한 다음, 각 결과를 스냅샷으로 저장하여 함께 병합하여 단일 출력을 형성하고 타입 무결성을 보장함으로써 작동합니다.

![Using multiple validators to validate part of a body](/blog/elysia-14/standard-schema.webp)
> TypeBox, Zod, Valibot, Joi, Yup, ArkType, Effect Schema, TypeMap 및 ReScript Schema를 사용하여 본문의 다른 부분을 검증

8개의 validator를 동시에 테스트하여 입력의 각 부분을 검증했으며, 완벽하게 작동합니다.

우리는 Standard Schema를 즉시 지원하게 되어 자랑스럽습니다. 이것은 Elysia가 단일 validator에 묶이지 않는 큰 단계이며, 여러분이 이것으로 무엇을 만들지 기대됩니다.

## Macro

Macro는 Elysia의 가장 강력하고 유연한 기능 중 하나입니다.

Elysia의 기능을 수정하고 확장할 수 있는 사용자 정의 속성을 정의할 수 있게 해주어, 원하는 대로 자신만의 "서브 프레임워크"를 만들 수 있습니다.

Macro의 다재다능함은 정말 놀랍습니다. 다른 프레임워크로는 거의 불가능한 일을 쉽게 할 수 있게 해줍니다.

Elysia 1.4에서는 macro를 더욱 다재다능하게 만들기 위한 여러 개선 사항을 제공합니다.

### Macro Schema

이제 macro에 대한 스키마를 정의하여 macro에서 직접 사용자 정의 검증을 추가할 수 있습니다.

![Macro with schema](/blog/elysia-14/macro-schema.webp)
> 스키마 지원이 있는 Macro

스키마가 있는 Macro는 타입 안전성을 보장하기 위해 자동으로 검증하고 타입을 추론하며, 기존 스키마와 공존할 수 있습니다.

여러 macro의 여러 스키마를 쌓거나 심지어 Standard Schema에서도 쌓을 수 있으며, 원활하게 함께 작동합니다.

Macro 스키마는 **동일한 macro 내의 lifecycle**에 대한 타입 추론도 지원하지만, TypeScript 제한으로 인해 이름이 지정된 단일 macro에서만 가능합니다.

![Macro with extension](/blog/elysia-14/macro-schema-lifecycle.webp)
> 이름이 지정된 단일 macro를 사용하여 동일한 macro 내의 lifecycle에 타입 추론

동일한 macro 내에서 lifecycle 타입 추론을 사용하려면, 여러 쌓인 macro 대신 이름이 지정된 단일 macro를 사용해야 합니다.

> macro 스키마를 사용하여 라우트의 lifecycle 이벤트에 타입을 추론하는 것과 혼동하지 마세요. 그것은 잘 작동합니다—이 제한은 동일한 macro 내에서 lifecycle을 사용하는 경우에만 적용됩니다.

### Macro Extension

이제 기존 macro를 확장하여 기존 기능 위에 구축할 수 있습니다.

![Macro with extension](/blog/elysia-14/macro-extension.webp)
> 확장 지원이 있는 Macro

이를 통해 기존 macro 위에 구축하고 더 많은 기능을 추가할 수 있습니다.

또한 자동 중복 제거와 함께 재귀적으로 작동하므로, 이미 다른 macro를 확장하는 기존 macro를 문제 없이 확장할 수 있습니다.

그러나 실수로 순환 종속성을 만들면, Elysia는 런타임과 타입 추론 모두에서 무한 루프를 방지하기 위해 16의 스택 제한이 있습니다.

### Macro Detail

이제 macro에 대한 OpenAPI 세부 정보를 정의하여 macro에서 직접 OpenAPI 문서에 더 많은 세부 정보를 추가할 수 있습니다.

라우트에 이미 OpenAPI 세부 정보가 있는 경우, 세부 정보를 함께 병합하지만 macro 세부 정보보다 라우트 세부 정보를 선호합니다.

## Lifecycle Type Soundness

타입에서 직접 OpenAPI 스키마를 생성하는 [OpenAPI Type Gen](/blog/openapi-type-gen)의 도입 이후, 모든 lifecycle 이벤트에 대한 타입 건전성을 갖는 것이 좋을 것이라고 깨달았습니다.

이렇게 하면 각 lifecycle 이벤트 및 macro의 반환 타입을 정확하게 문서화하여 단일 라우트가 반환할 수 있는 모든 가능성을 나타낼 수 있습니다.

타입 수준에서 모든 lifecycle API에 대한 단위 테스트를 포함하여 타입 무결성을 보장하고 타입 성능을 최적화하면서 응답 상태 타입을 조정하는 3,000줄 이상의 순수 타입을 리팩터링함으로써, 타입 추론이 느려지지 않도록 했습니다.

이러한 모든 복잡한 성과를 통해 단일 라우트가 반환할 수 있는 모든 가능성을 문서화할 수 있습니다.

![Type Soundness](/blog/elysia-14/type-soundness.webp)
> 단일 라우트가 반환할 수 있는 모든 가능성 문서화

이것은 개발자 경험을 향상시킬 뿐만 아니라 API 문서와 Eden Treaty를 사용하는 클라이언트 모두에서 모든 가능성이 고려되도록 하여 코드베이스의 신뢰성을 향상시킵니다.

> Type Soundness는 모든 lifecycle 이벤트와 macro를 포함하므로 API에 대한 완전한 문서를 가질 수 있습니다. 유일한 예외는 성능상의 이유로 인라인 lifecycle 이벤트입니다.

또한 대규모 타입 복잡성 증가에도 불구하고 타입 추론 성능을 ~9-11% 향상시키고 타입 인스턴스화를 11.5% 감소시켰습니다.

![Type inference](/blog/elysia-14/type-inference.webp)
> 내부 벤치마크에서 타입 인스턴스화가 11.57% 감소

## Group standalone schema

이전에는 스키마가 있는 `group`이 덮어쓰기 전략을 사용했습니다. 즉, `group`에서 스키마를 정의하면 라우트의 기존 스키마를 덮어썼습니다.

새 스키마를 정의하려면 기존 스키마를 수동으로 포함해야 했습니다. 이것은 매우 인체공학적이지 않았으며, 기존 스키마를 포함하는 것을 잊으면 오류가 발생할 수 있었습니다.

1.4부터 스키마가 있는 `group`은 standalone 전략을 사용합니다. 즉, `group`에서 스키마를 정의하면 덮어쓰지 않고 라우트 스키마와 공존합니다.

![group standalone](/blog/elysia-14/group-standalone.webp)
> 스키마가 있는 `group`은 라우트 스키마와 공존

이를 통해 기존 스키마를 수동으로 포함하지 않고도 `group`에서 새 스키마를 정의할 수 있습니다.

## Notable changes

1.3.9에서 약 300개의 이슈를 마감했으므로 1.4에는 버그 수정이 많지 않습니다—알려진 대부분의 문제를 해결했습니다.

### Improvements

- [#861](https://github.com/elysiajs/elysia/issues/861) GET 라우트를 정의할 때 자동으로 HEAD 메서드 추가
- [#1389](https://github.com/elysiajs/elysia/pull/1389) 참조 모델의 NoValidate

### Changes

- ObjectString/ArrayString은 보안상의 이유로 더 이상 기본값을 생성하지 않습니다
- Cookie는 이제 형식이 JSON일 가능성이 있을 때 동적으로 파싱합니다
- 정확한 응답을 위한 외부 파일 타입 검증을 위해 `fileType` 내보내기

### Breaking Changes

- 타입 건전성 부족으로 인해 macro v1 제거
- `error` 함수 제거; 대신 `status` 사용
- `mapResponse`, `afterResponse`의 `response`에 대한 사용 중단 알림; 대신 `responseValue` 사용

## Afterword

이번이 릴리스 노트 커버 이미지의 일부로 마스코트인 Elysia chan을 처음으로 소개하는 것입니다! 이것은 향후 릴리스 노트에서도 전통이 될 것입니다!

우리의 커버 아트는 Supersymmetry(음악) 커버 아트의 테마를 반영합니다. ElysiaJS chan이 Weirs와 유사한 포즈로 미러링하고 있습니다.

![Elysia chan mirroring Supersymmetry](/blog/elysia-14/elysia-supersymmetry.webp)
> Elysia chan이 Supersymmetry 커버 아트의 Weirs와 동일한 포즈로 미러링 [(pixiv)](https://www.pixiv.net/en/artworks/134997229)

너무 귀엽지 않나요? 정말 마음에 듭니다! 그녀를 그릴 수 있도록 제 아트 기술을 향상시키기 위해 열심히 노력했습니다. 마음에 들었으면 좋겠습니다!

어쨌든, 이번 릴리스가 마음에 들었으면 좋겠습니다! 여러분이 이것으로 무엇을 만들지 기대됩니다!

좋은 하루 보내세요!

> I am all
>
> In this tiny micro universe
>
> Every morsel of your bittersweet heart
>
> I loved all
>
> <br />
>
> You know
>
> This game of life is our "riverrun,"
>
> You were my lucky friend for this journey
>
> <br />
>
> There is not much time left
>
> The sky is showing its fade
>
> Stars parade
>
> Time to change our fate

</Blog>
