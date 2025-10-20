---
title: Introducing OpenAPI Type Gen for Elysia
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Introducing OpenAPI Type Gen for Elysia

    - - meta
      - name: 'description'
        content: Elysia now supports OpenAPI Type Gen, a powerful tool that automatically generates OpenAPI documentation from your Elysia routes and types without any manual annotation.

    - - meta
      - property: 'og:description'
        content: Elysia now supports OpenAPI Type Gen, a powerful tool that automatically generates OpenAPI documentation from your Elysia routes and types without any manual annotation

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/openapi-type-gen/cover.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/openapi-type-gen/cover.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
title="Introducing OpenAPI Type Gen for Elysia"
src="/blog/openapi-type-gen/cover.webp"
alt="OpenAPI Type Gen: Automatic API Documentation for Elysia"
author="saltyaom"
date="4 Sep 2025"
>

API 문서화는 API 개발에서 중요한 역할을 합니다.

팀, 벤더 또는 타사 서비스와의 연락은 원활한 통합과 협업을 보장하기 위해 잘 문서화된 API가 필요합니다.

오늘날 대부분의 프레임워크는 수동 OpenAPI 주석에 대한 부담을 개발자에게 남깁니다. 이것은 시간이 많이 걸리고 오류가 발생하기 쉬우며 API가 발전함에 따라 유지 관리하기 어려울 수 있습니다.

### But Elysia takes OpenAPI seriously
우리는 API 문서화가 쉽고 자동으로 이루어져야 한다고 믿으며, 개발자가 문서화에 대해 걱정하지 않고 훌륭한 API를 구축하는 데 집중할 수 있도록 합니다.

그래서 우리는 Elysia와 함께 처음부터 OpenAPI를 중심으로 구축했습니다.

- 스키마가 단일 소스의 진실에서 데이터 검증, 타입 추론 및 OpenAPI 주석에 사용될 수 있도록 합니다.
- Standard Schema(Zod, Valibot 등)와의 통합을 제공하며, 가능한 경우 OpenAPI 문서로 변환합니다.
- Scalar과 함께 API와 상호 작용할 수 있는 아름다운 UI를 추가하는 1줄짜리 OpenAPI 플러그인이 있습니다.

![Scalar Preview](/blog/openapi-type-gen/scalar-preview-light.webp)

> Elysia OpenAPI 플러그인의 1줄에서 Scalar UI로 실행되는 Elysia

하지만 이미 뛰어난 경험이지만, 더 나아가고 싶습니다.

오늘, 우리는 어떠한 수동 주석 없이 Elysia 코드에서 OpenAPI 문서를 생성하는 **OpenAPI Type Gen**의 출시를 발표하게 되어 기쁩니다.

## OpenAPI Type Gen

우리는 코드를 작성하기만 하면 문서가 자동으로 정확하게 생성되는 세상을 꿈꿉니다. 전혀 수동 주석 없이요.

우리가 가진 가장 가까운 것은 pydantic 모델에서 OpenAPI 문서를 생성할 수 있는 **Python의 FastAPI**입니다. 하지만 이것은 pydantic 모델로만 제한되며 다른 라이브러리나 타입과 함께 사용할 수 없습니다.

Elysia Type Gen은 TypeScript에 유사한 경험을 제공하지만, 그 제한이 없습니다. **어떤 TypeScript 타입**이든 **어떤 라이브러리**에서든 Elysia로 제한되지 않고 OpenAPI 문서로 자동으로 변환할 수 있습니다.

![Elysia Type Gen](/blog/openapi-type-gen/type-gen.webp)

> Elysia는 전혀 수동 스키마 주석 없이 TypeScript 타입에서 직접 본문 타입을 응답 스키마로 자동으로 참조하여 가능한 모든 응답 상태 코드를 나열합니다.

**TypeScript 타입**에서 직접 전혀 주석 없이 Elysia 코드에서 OpenAPI 문서를 생성하는 데 **1줄**의 코드가 걸립니다.

### This is truly ground-breaking

역사상 처음으로, 실제로 어떠한 수동 주석 없이 자동으로 API를 문서화할 수 있습니다. 어떤 라이브러리와도 즉시 작동합니다.

<!--타입 생성은 해당 OpenAPI 문서를 생성하기 위해 Elysia 인스턴스 타입을 분석하여 작동하며, Elysia의 강력한 타입 건전성과 무결성에 대한 투자 덕분입니다.-->

기존 Elysia 코드베이스 및 스키마 정의와 함께 작동하며 타입 변환기(예: Typia)와 같은 추가 구성이나 breaking change 없이 작동합니다.

Type Gen은 타입에서 추론하기 전에 기존 스키마 정의를 우선시하여 기존 스키마 정의와 공존합니다.

![Using Drizzle with type gen Elysia Type Gen](/blog/openapi-type-gen/drizzle-typegen.webp)

> Elysia 라우트 핸들러에서 Drizzle 쿼리를 반환하면 OpenAPI 스키마로 자동으로 추론됩니다.

또한 **Drizzle** 및 **Prisma**와 같은 현대적인 라이브러리의 복잡한 타입을 포함하여 어떤 TypeScript 라이브러리와도 즉시 호환됩니다.

### Type Soundness
OpenAPI Type Gen은 또한 서로 겹치는 여러 응답 상태 코드로 분리된 lifecycle/macro에서 여러 상태와 같은 복잡한 시나리오를 지원합니다.

각 상태 코드는 Elysia가 동일한 상태 코드 아래의 가능한 모든 반환 값을 union 타입으로 처리하는 여러 값을 반환할 수 있습니다. 가능한 모든 반환 값을 정확하게 나열합니다.

![Union response](/blog/openapi-type-gen/union.webp)
> union 타입에서 자동으로 여러 응답 상태 코드 나열

이것은 심오한 것이며 다른 프레임워크로는 거의 복제할 수 없습니다.

## Adopt OpenAPI Type Gen
코드베이스에 OpenAPI Type Gen을 추가하려면 간단히:

1. Elysia 인스턴스를 내보냅니다
2. 루트 Elysia 파일 경로를 제공합니다(제공되지 않으면 Elysia는 `src/index.ts`를 사용합니다)

```ts
import { Elysia } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi' // [!code ++]

export const app = new Elysia() // [!code ++]
	.use(
		openapi({
			references: fromTypes() // [!code ++]
		})
	)
```

Elysia Type Gen은 Elysia 인스턴스를 분석하고 빌드 단계 없이 즉석에서 OpenAPI 문서를 자동으로 생성합니다.

OpenAPI Type Gen에 대한 문서는 [Patterns: OpenAPI](/patterns/openapi#openapi-from-types)에서 찾을 수 있습니다.

---

### We believe that this feature is truly unique to Elysia

대부분의 웹 프레임워크가 API 문서를 작성하는 데 많은 노력과 수동 주석이 필요한 반면.

Elysia는 API 문서를 자동으로 작성할 수 있으며, 이 경험에 근접한 다른 프레임워크는 없습니다.

이것은 **Elysia의 엔드투엔드 타입 안전성에 대한 놀라운 지원** 덕분에만 가능합니다.

우리는 Elysia와 함께 최소한의 노력으로 고품질 API 문서를 작성하고 유지하는 데 도움이 될 것이라고 기대합니다.

오늘 `@elysiajs/openapi`를 최신 버전으로 업데이트하거나 [GitHub 저장소](https://github.com/saltyaom/elysia-typegen-example)의 예제 설정을 실험해 볼 수 있습니다.
</Blog>
