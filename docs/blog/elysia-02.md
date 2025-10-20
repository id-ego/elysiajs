---
title: Elysia 0.2 - The Blessing
sidebar: false
editLink: false
search: false
comment: false
head:
  - - meta
    - property: 'og:title'
      content: Elysia 0.2 소개 - The Blessing

  - - meta
    - name: 'description'
      content: 주로 TypeScript 성능, 타입 추론, 더 나은 자동 완성 및 보일러플레이트를 줄이는 새로운 기능에서 많은 개선사항을 제공하는 Elysia 0.2를 소개합니다.

  - - meta
    - property: 'og:description'
      content: 주로 TypeScript 성능, 타입 추론, 더 나은 자동 완성 및 보일러플레이트를 줄이는 새로운 기능에서 많은 개선사항을 제공하는 Elysia 0.2를 소개합니다.

  - - meta
    - property: 'og:image'
      content: https://elysiajs.com/blog/elysia-02/blessing.webp

  - - meta
    - property: 'twitter:image'
      content: https://elysiajs.com/blog/elysia-02/blessing.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.2 - The Blessing"
    src="/blog/elysia-02/blessing.webp"
    alt="눈 덮인 산 위로 보이는 푸른색에서 보라색으로 변하는 밤하늘의 오로라"
    author="saltyaom"
    date="29 Jan 2023"
>


「[Blessing](https://youtu.be/3eytpBOkOFA)」는 주로 TypeScript 성능, 타입 추론, 더 나은 자동 완성 및 보일러플레이트를 줄이기 위한 새로운 기능에서 많은 개선사항을 제공합니다.

"Mobile Suit Gundam: The Witch from Mercury"의 오프닝곡인 YOASOBI의 「祝福」(Shukufuku)에서 이름을 따왔습니다.

## Defers / Lazy Loading Module
Elysia 0.2는 이제 지연 로딩 모듈 및 비동기 플러그인을 지원합니다.

이를 통해 플러그인 등록을 연기하고 Elysia 서버가 시작된 후 점진적으로 플러그인을 적용할 수 있어 Serverless/Edge 환경에서 가능한 가장 빠른 시작 시간을 달성할 수 있습니다.

지연 모듈을 생성하려면 플러그인을 async로 표시하기만 하면 됩니다:
```typescript
const plugin = async (app: Elysia) => {
    const stuff = await doSomeHeavyWork()

    return app.get('/heavy', stuff)
}

app.use(plugin)
```

### Lazy Loading
일부 모듈은 무거울 수 있으며 서버를 시작하기 전에 가져오는 것이 좋은 생각이 아닐 수 있습니다.

Elysia에 모듈을 건너뛰도록 지시한 다음 나중에 모듈을 등록하고, `use`에서 `import` 문을 사용하여 로딩이 완료되면 모듈을 등록할 수 있습니다:
```typescript
app.use(import('./some-heavy-module'))
```

이렇게 하면 import가 완료된 후 모듈이 등록되어 모듈이 지연 로드됩니다.

지연 플러그인 및 지연 로딩 모듈은 즉시 사용 가능한 완전한 타입 추론을 제공합니다.

## Reference Model
이제 Elysia는 스키마를 기억하고 import 파일을 만들지 않고 `Elysia.setModel`을 통해 Schema 필드에서 직접 참조할 수 있습니다.

사용 가능한 스키마 목록은 인라인 스키마에서 기대하는 것처럼 자동 완성, 완전한 타입 추론 및 유효성 검사를 제공합니다.

참조 모델을 사용하려면 먼저 `setModel`로 모델을 등록한 다음 모델 이름을 작성하여 `schema`에서 모델을 참조하십시오:
```typescript
const app = new Elysia()
    .setModel({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .post('/sign', ({ body }) => body, {
        schema: {
            body: 'sign',
            response: 'sign'
        }
    })
```

이렇게 하면 알려진 모델의 자동 완성이 제공됩니다.
<img width="1624" alt="Screenshot 2566-01-23 at 13 24 28" src="https://user-images.githubusercontent.com/35027979/213980696-8f20a934-c500-4f97-884c-ff2dd2efadfe.png">

그리고 타입 참조는 실수로 잘못된 타입을 반환하는 것을 방지합니다.
<img width="1624" alt="Screenshot 2566-01-23 at 13 26 00" src="https://user-images.githubusercontent.com/35027979/213980738-0e99cb25-a50f-4888-8879-f00d4ad04363.png">

`@elysiajs/swagger`를 사용하면 사용 가능한 모델을 나열하기 위한 별도의 `Model` 섹션도 생성됩니다.
<img width="1624" alt="Screenshot 2566-01-23 at 13 23 41" src="https://user-images.githubusercontent.com/35027979/213980936-5857e30b-fd4b-4fc3-8aff-fdb9054980d3.png">

참조는 예상대로 유효성 검사도 처리합니다.

간단히 말해서, 인라인 스키마를 사용하는 것과 동일하지만 이제는 긴 import 목록 대신 스키마 이름만 입력하여 유효성 검사 및 타이핑을 처리하면 됩니다.

## OpenAPI Detail field
OpenAPI Schema V2 표준을 따르는 경로에 대한 세부 정보를 사용자 정의하기 위한 새로운 필드인 `schema.detail`을 소개합니다. 자동 완성 기능이 포함되어 있습니다.

<img width="1624" alt="Screenshot 2566-01-23 at 13 54 11" src="https://user-images.githubusercontent.com/35027979/213981321-5717e514-aa4b-492a-b45a-9e69099dc8a8.png">

이를 통해 더 나은 문서를 작성하고 원하는 대로 완전히 편집 가능한 Swagger를 사용할 수 있습니다:
<img width="1624" alt="Screenshot 2566-01-23 at 13 23 41" src="https://user-images.githubusercontent.com/35027979/213981545-46efc6cc-34bc-4db2-86ed-530d27d7ba97.png">

## Union Type
이전 버전의 Elysia는 때때로 구별되는 Union 타입에 문제가 있었는데, 이는 Elysia가 Eden을 위한 전체 타입 참조를 생성하기 위해 응답을 캡처하려고 시도했기 때문입니다.

이로 인해 가능한 타입의 무효화가 발생했습니다.

## Union Response
Union Type으로 가능해진 `schema`에 대해 `schema.response[statusCode]`를 사용하여 여러 응답 상태를 반환할 수 있습니다.

```typescript
app
    .post(
        '/json/:id',
        ({ body, params: { id } }) => ({
            ...body,
            id
        }),
        {
            schema: {
                body: 'sign',
                response: {
                    200: t.Object({
                        username: t.String(),
                        password: t.String(),
                        id: t.String()
                    }),
                    400: t.Object({
                        error: t.String()
                    })
                }
            }
        }
    )
```

Elysia는 `response`의 모든 스키마를 유효성 검사하여 타입 중 하나를 반환할 수 있도록 시도합니다.

반환 타입도 지원되며 Swagger의 응답에 보고됩니다.

## Faster Type Inference
Elysia 0.1이 Developer Experience를 개선하기 위해 타입 추론을 사용하는 가능성을 탐구하면서 때때로 무거운 타입 추론과 비효율적인 사용자 지정 제네릭 때문에 타입 추론을 업데이트하는 데 오랜 시간이 걸린다는 것을 발견했습니다.

Elysia 0.2에서는 타입 추론이 속도에 최적화되어 무거운 타입 언래핑의 중복을 방지하여 타입 및 추론 업데이트 성능이 향상되었습니다.

## Ecosystem
Elysia 0.2가 비동기 플러그인 및 지연 모듈을 활성화함에 따라 이전에는 불가능했던 많은 새로운 플러그인이 현실이 되었습니다.

예를 들어:
- 논블로킹 기능을 갖춘 Elysia Static 플러그인
- 여러 응답에 대한 union-type 추론이 있는 Eden
- Elysia를 위한 새로운 Elysia Apollo Plugin

### 주목할 만한 개선사항:
- `onRequest` 및 `onParse`가 이제 `PreContext`에 액세스할 수 있습니다
- 기본적으로 `application/x-www-form-urlencoded` 지원
- Body parser가 이제 추가 속성이 있는 `content-type`을 구문 분석합니다. 예: `application/json;charset=utf-8`
- URI 경로 매개변수 디코딩
- Elysia가 설치되지 않은 경우 Eden이 이제 오류를 보고합니다
- 기존 모델 및 데코레이터의 선언 건너뛰기

### Breaking Changes:
- `onParse`는 이제 `(request: Request, contentType: string)` 대신 `(context: PreContext, contentType: string)`을 허용합니다
    - 마이그레이션하려면 `.request`를 컨텍스트에 추가하여 `Request`에 액세스하십시오

### Afterward
Elysia를 지원해 주시고 이 프로젝트에 관심을 가져주셔서 감사합니다.

이번 릴리스는 더 나은 DX를 제공하며 Bun으로 훌륭한 소프트웨어를 작성하는 데 필요한 모든 것을 제공하기를 바랍니다.

이제 Elysia에 대해 질문하거나 그냥 어울리며 쉴 수 있는 [Discord 서버](https://discord.gg/eaFJ2KDJck)가 있습니다. 모든 분을 환영합니다.

이러한 훌륭한 도구들로 여러분이 어떤 놀라운 소프트웨어를 만들지 기대됩니다.

> 누군가가 그린 그림의 일부가 되지 않기 위해
>
> 다른 누군가가 선택한 쇼에서 앞으로 나아가지 않기 위해
>
> 너와 나, 우리의 이야기를 쓰기 위해 살아가는
>
> 결코 너를 혼자 두지 않고 네 곁을 떠나지 않을 것이다
>

</Blog>
