---
title: Elysia 0.3 - 大地の閾を探して [Looking for Edge of Ground]
sidebar: false
editLink: false
search: false
comment: false
head:
  - - meta
    - property: 'og:title'
      content: Elysia 0.3 소개 - 大地の閾を探して [Looking for Edge of Ground]

  - - meta
    - name: 'description'
      content: Elysia Fn, 고도로 확장 가능한 TypeScript 성능을 위한 Type 재작업, 파일 업로드 지원 및 검증, Eden Treaty 재작업 소개.

  - - meta
    - property: 'og:description'
      content: Elysia Fn, 고도로 확장 가능한 TypeScript 성능을 위한 Type 재작업, 파일 업로드 지원 및 검증, Eden Treaty 재작업 소개.

  - - meta
    - property: 'og:image'
      content: https://elysiajs.com/blog/elysia-03/edge-of-ground.webp

  - - meta
    - property: 'twitter:image'
      content: https://elysiajs.com/blog/elysia-03/edge-of-ground.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.3 - 大地の閾を探して [Looking for Edge of Ground]"
    src="/blog/elysia-03/edge-of-ground.webp"
    alt="심연에 떠 있는 산산이 부서진 유리 조각들"
    author="saltyaom"
    date="17 Mar 2023"
>

Camellia의 노래 [「大地の閾を探して [Looking for Edge of Ground]」](https://youtu.be/oyJf72je2U0) ft. Hatsune Miku에서 이름을 따왔으며, 내가 가장 좋아하는 Camellia 앨범인 「U.U.F.O」의 마지막 트랙입니다. 이 노래는 개인적으로 큰 영향을 미쳤기 때문에 이름을 가볍게 사용하지 않습니다.

이것은 가장 도전적인 업데이트이며, 가능한 한 적은 중대한 변경으로 Elysia 아키텍처를 고도로 확장 가능하도록 재고하고 재설계하여 Elysia의 가장 큰 릴리스를 제공합니다.

다음과 같은 흥미로운 새 기능과 함께 Elysia 0.3 릴리스 후보를 발표하게 되어 기쁩니다.

## Elysia Fn
Elysia Fn을 소개합니다. 완전한 자동 완성 및 전체 타입 지원을 통해 프론트엔드에서 백엔드 함수를 실행하십시오.

<video controls autoplay muted>
  <source src="/blog/elysia-03/elysia-fn.mp4" type="video/mp4" />
</video>

빠른 개발을 위해 Elysia Fn을 사용하면 백엔드 코드를 "노출"하여 완전한 타입 안전성, 자동 완성, 원래 코드 주석 및 "클릭하여 정의로 이동"을 통해 프론트엔드에서 호출할 수 있어 개발 속도를 높일 수 있습니다.

Eden Fn을 통해 완전한 타입 안전성을 위해 Eden과 함께 Elysia Fn을 사용할 수 있습니다.

### Permission
함수의 허용 또는 거부 범위를 제한하고, 인증 헤더 및 기타 헤더 필드를 확인하고, 매개변수를 검증하거나 프로그래밍 방식으로 키 액세스를 제한할 수 있습니다.

키 확인은 타입 안전성과 가능한 모든 함수의 자동 완성을 지원하므로 일부 함수를 놓치거나 실수로 잘못된 이름을 입력하는 일이 없습니다.
![Narrowed Key](/blog/elysia-03/narrowed-key.webp)

프로그래밍 방식으로 속성 범위를 좁히면 매개변수 타입도 좁아집니다. 즉, 완전한 타입 안전성을 제공합니다.
![Narrowed Params](/blog/elysia-03/narrowed-param.webp)

### Technical detail
기술적으로 Elysia Fn은 JavaScript의 Proxy를 사용하여 객체 속성과 매개변수를 캡처하여 서버에 일괄 요청을 생성하고 네트워크를 통해 값을 처리하고 반환합니다.

Elysia Fn은 superjson을 확장하여 JavaScript의 Error, Map, Set 및 undefined와 같은 네이티브 타입을 JSON 데이터를 통해 구문 분석할 수 있습니다.

Elysia Fn은 클라이언트 측 Nextjs 앱에서 Prisma에 액세스하는 것과 같은 여러 사용 사례를 지원합니다.
이론적으로 Redis, Sequelize, RabbitMQ 등을 사용할 수 있습니다.
Elysia는 Bun에서 실행되므로 Elysia Fn은 동시에 초당 120만 작업 이상을 실행할 수 있습니다(M1 Max에서 테스트).

Elysia Fn에 대한 자세한 내용은 [Eden Fn](/plugins/eden/fn)을 참조하십시오.

## Type Rework
타입 검사가 6.5~9배 더 빠르고 타입의 코드 라인 수가 셀 수 없을 정도로 감소했습니다.

Elysia 0.3에서는 Elysia 및 Eden 타입의 80% 이상이 성능, 타입 추론 및 빠른 자동 완성에 초점을 맞춰 다시 작성되었습니다.

복잡한 타입의 350개 이상의 경로에 대해 테스트한 결과, Elysia는 Eden과 함께 사용할 타입 선언을 생성하는 데 단 0.22초만 사용합니다.

Elysia 경로는 이제 Typebox 참조 대신 리터럴 객체로 직접 컴파일되므로 Elysia 타입 선언이 0.2보다 훨씬 작아지고 Eden이 더 쉽게 사용할 수 있습니다. 훨씬 작다는 것은 50~99% 더 작다는 의미입니다.

Elysia와 TypeScript의 통합이 훨씬 빨라졌을 뿐만 아니라 Elysia가 TypeScript와 코드를 더 잘 이해합니다.

예를 들어 0.3에서 Elysia는 플러그인 등록에 대해 덜 엄격하여 Elysia 인스턴스의 전체 타입 완성 없이 플러그인을 등록할 수 있습니다.
`use` 함수를 인라인으로 사용하면 이제 상위 타입을 추론하고 중첩된 가드가 상위의 모델 타입을 더 정확하게 참조할 수 있습니다.

이제 타입 선언을 빌드하고 내보낼 수도 있습니다.

타입을 다시 작성하면서 Elysia는 이전보다 TypeScript를 훨씬 더 잘 이해하며, 타입 완성이 이전보다 훨씬 빨라지므로 얼마나 빠른지 직접 시도해 보는 것이 좋습니다.
자세한 내용은 [Twitter의 이 스레드](https://twitter.com/saltyAom/status/1629876280517869568?s=20)를 참조하십시오.

## File Upload
Bun 0.5.7 덕분에 Form Data가 구현되었으며 `multipart/formdata`와 함께 Elysia 0.3에서 기본적으로 활성화되었습니다.

파일 업로드에 대한 타입 완성 및 검증을 정의하기 위해 `Elysia.t`는 이제 파일 검증을 위해 `File` 및 `Files`로 TypeBox를 확장합니다.

검증에는 표준 파일 크기의 자동 완성이 있는 파일 타입 확인, 파일의 최소 및 최대 크기, 필드당 총 파일 수가 포함됩니다.

Elysia 0.3에는 또한 데이터를 검증하기 전에 헤더를 엄격하게 확인하기 위해 들어오는 요청 타입을 명시적으로 검증하는 `schema.contentType`이 있습니다.

## OpenAPI Schema 3.0.x
Elysia 0.3을 사용하면 Elysia는 이제 기본적으로 OpenAPI 스키마 3.0.x를 사용하여 API 정의를 더 잘 설명하고 content-type을 기반으로 여러 타입을 더 잘 지원합니다.

`schema.details`는 이제 OpenAPI 3.0.x로 업데이트되었으며 Elysia는 Swagger 플러그인도 OpenAPI 3.0.x와 일치하도록 업데이트하여 OpenAPI 3 및 Swagger의 새로운 기능, 특히 파일 업로드를 활용합니다.

## Eden Rework
Elysia에 대한 더 많은 수요를 지원하고 Elysia Fn, Rest를 모두 지원하기 위해 Eden은 새로운 아키텍처로 확장되도록 재작업되었습니다.

Eden은 이제 3가지 타입의 함수를 내보냅니다.
- [Eden Treaty](/plugins/eden/treaty) `eden/treaty`: 여러분이 알고 사랑하는 원래 Eden 구문
- [Eden Fn](/plugins/eden/fn) `eden/fn`: Eden Fn에 대한 액세스
- [Eden Fetch](/plugins/eden/fetch) `eden/fetch`: 매우 복잡한 Elysia 타입(> 1,000 경로 / Elysia 인스턴스)을 위한 Fetch와 유사한 구문

타입 정의를 재작업하고 Elysia Eden을 지원하면서 Eden은 이제 서버에서 타입을 추론하는 데 훨씬 빠르고 더 나아졌습니다.

자동 완성이 더 빠르고 이전보다 적은 리소스를 사용합니다. 실제로 Eden의 타입 선언은 크기와 추론 시간을 줄이기 위해 거의 100% 재작업되어 눈 깜짝할 사이에 350개 이상의 경로의 자동 완성을 지원합니다(~0.26초).

Elysia Eden을 완전히 타입 안전하게 만들기 위해 Elysia의 TypeScript에 대한 더 나은 이해를 통해 Eden은 이제 응답 상태에 따라 타입을 좁힐 수 있어 어떤 조건에서도 타입을 올바르게 캡처할 수 있습니다.
![Narrowed error.webp](/blog/elysia-03/narrowed-error.webp)

### Notable Improvement:
- Add string format: 'email', 'uuid', 'date', 'date-time'
- Update @sinclair/typebox to 0.25.24
- Update Raikiri to 0.2.0-beta.0 (ei)
- Add file upload test thanks to #21 (@amirrezamahyari)
- Pre compile lowercase method for Eden
- Reduce complex instruction for most Elysia types
- Compile `ElysiaRoute` type to literal
- Optimize type compliation, type inference and auto-completion
- Improve type compilation speed
- Improve TypeScript inference between plugin registration
- Optimize TypeScript inference size
- Context creation optimization
- Use Raikiri router by default
- Remove unused function
- Refactor `registerSchemaPath` to support OpenAPI 3.0.3
- Add `error` inference for Eden
- Mark `@sinclair/typebox` as optional `peerDenpendencies`

Fix:
- Raikiri 0.2 thrown error on not found
- Union response with `t.File` is not working
- Definitions isn't defined on Swagger
- details are missing on group plugin
- group plugin, isn't unable to compile schema
- group is not exportable because EXPOSED is a private property
- Multiple cookies doesn't set `content-type` to `application/json`
- `EXPOSED` is not export when using `fn.permission`
- Missing merged return type for `.ws`
- Missing nanoid
- context side-effects
- `t.Files` in swagger is referring to single file
- Eden response type is unknown
- Unable to type `setModel` inference definition via Eden
- Handle error thrown in non permission function
- Exported variable has or is using name 'SCHEMA' from external module
- Exported variable has or is using name 'DEFS' from external module
- Possible errors for building Elysia app with `declaration: true` in `tsconfig.json`

Breaking Change:
- Rename `inject` to `derive`
- Depreacate `ElysiaRoute`, changed to inline
- Remove `derive`
- Update from OpenAPI 2.x to OpenAPI 3.0.3
- Move context.store[SYMBOL] to meta[SYMBOL]


## Afterward
Elysia Fn의 도입으로 프론트엔드 개발에서 어떻게 채택될지 개인적으로 기대됩니다. 프론트엔드와 백엔드 사이의 경계를 제거합니다. 그리고 Elysia의 Type Rework로 타입 검사와 자동 완성이 훨씬 빨라졌습니다.

여러분이 Elysia를 사용하여 만들 멋진 것들을 어떻게 사용할지 기대됩니다.

Elysia 전용 [Discord 서버](https://discord.gg/eaFJ2KDJck)가 있습니다. 자유롭게 인사하거나 그냥 편하게 놀러 오세요.

Elysia를 지원해 주셔서 감사합니다.

> 끝없는 천체 지도 아래
>
> 이름 없는 절벽에서
>
> 나는 그저 울부짖었다
>
> 끝없는 반향이 너에게 닿기를 바라며
>
> 그리고 언젠가는 땅의 가장자리에 서있을 것이라고 믿는다
>
> (너에게 돌아가서 말할 수 있는 그날까지)
>

</Blog>
