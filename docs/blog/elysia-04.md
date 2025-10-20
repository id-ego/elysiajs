---
title: Elysia 0.4 - 月夜の音楽会 (Moonlit Night Concert)
sidebar: false
editLink: false
search: false
comment: false
head:
  - - meta
    - property: 'og:title'
      content: Elysia 0.4 소개 - 月夜の音楽会 (Moonlit Night Concert)

  - - meta
    - name: 'description'
      content: Ahead of Time Compilation, TypeBox 0.26, 상태별 Response 검증, Elysia Fn 분리 소개.

  - - meta
    - property: 'og:description'
      content: Ahead of Time Compilation, TypeBox 0.26, 상태별 Response 검증, Elysia Fn 분리 소개.

  - - meta
    - property: 'og:image'
      content: https://elysiajs.com/blog/elysia-04/moonlit-night-concert.webp

  - - meta
    - property: 'twitter:image'
      content: https://elysiajs.com/blog/elysia-04/moonlit-night-concert.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.4 - 月夜の音楽会 (Moonlit Night Concert)"
    src="/blog/elysia-04/moonlit-night-concert.webp"
    alt="심연에 떠 있는 산산이 부서진 유리 조각들"
    author="saltyaom"
    date="30 Mar 2023"
>

["The Liar Princess and the Blind Prince" 트레일러](https://youtu.be/UdBespMvxaA)의 오프닝 음악인 Akiko Shikata가 작곡하고 노래한 [「月夜の音楽会」(Moonlit Night Concert)](https://youtu.be/o8b-IQulh1c)에서 이름을 따왔습니다.

이 버전은 흥미로운 새 기능을 소개하지는 않지만, 나중에 더 견고한 기반을 위한 것이며 Elysia의 미래를 위한 내부 개선입니다.

## Ahead of Time Complie
기본적으로 Elysia는 다양한 상황에서 조건 검사를 처리해야 합니다. 예를 들어, 수행하기 전에 경로의 라이프사이클이 존재하는지 확인하거나 제공된 경우 검증 스키마를 언래핑합니다.

이는 Elysia에 최소한의 오버헤드를 도입하며, 경로에 라이프사이클 이벤트가 연결되어 있지 않더라도 런타임 검사가 필요하기 때문입니다.

모든 함수는 컴파일 타임에 검사되므로 조건부 async를 가질 수 없습니다. 예를 들어, 파일을 반환하는 간단한 경로는 동기화되어야 하지만 컴파일 타임 검사이므로 일부 경로가 async일 수 있어 동일한 간단한 경로도 async가 됩니다.

async 함수는 함수에 추가 틱을 도입하여 약간 느려집니다. 하지만 Elysia는 웹 서버의 기반이므로 성능 문제가 발생하지 않도록 모든 부분을 최적화하고 싶습니다.

우리는 Ahead Time Compilation을 도입하여 이 작은 오버헤드를 수정합니다.

이름에서 알 수 있듯이 런타임에서 동적 라이프사이클 및 검증을 확인하는 대신 Elysia는 라이프사이클, 검증 및 async 함수의 가능성을 확인하고 컴팩트한 함수를 생성하여 사용되지 않는 라이프사이클 및 검증과 같은 불필요한 부분을 제거합니다.

처리를 위해 중앙 집중식 함수를 사용하는 대신 각 경로를 위해 특별히 생성된 새 함수를 구성하기 때문에 조건부 async 함수가 가능합니다. 그런 다음 Elysia는 모든 라이프사이클 함수와 핸들러를 확인하여 async가 있는지 확인하고, 없으면 추가 오버헤드를 줄이기 위해 함수가 동기화됩니다.

## TypeBox 0.26
TypeBox는 Elysia의 검증 및 타입 제공자를 지원하는 라이브러리로 **Elysia.t**로 재내보냅니다.

이번 업데이트에서 우리는 TypeBox를 0.25.4에서 0.26으로 업데이트합니다.

이는 많은 개선 사항과 새로운 기능을 제공합니다. 예를 들어 `Not` 타입과 `coercion` 값을 위한 `Convert`가 있으며 이는 Elysia의 다음 버전에서 지원할 수 있습니다.

그러나 Elysia의 한 가지 이점은 `Error.First()`로, Iterator를 사용하는 대신 타입의 첫 번째 오류를 가져올 수 있으므로 클라이언트에 다시 보낼 새 오류를 생성하는 오버헤드가 줄어듭니다.

**TypeBox** 및 **Elysia.t**에 일부 변경 사항이 있지만 일반적으로 큰 영향을 미치지는 않지만 [여기에서 TypeBox 릴리스의 새로운 기능을 볼 수 있습니다.](https://github.com/sinclairzx81/typebox/blob/master/changelog/0.26.0.md)

## Validate response per status
이전에는 Elysia의 응답이 union 타입을 사용하여 여러 상태 응답을 검증했습니다.

이는 상태에 대한 엄격한 응답이 있는 고도로 동적인 앱에 예기치 않은 결과를 초래할 수 있습니다.
예를 들어 다음과 같은 경로가 있는 경우:
```ts
app.post('/strict-status', process, {
    schema: {
        response: {
            200: t.String(),
            400: t.Number()
        }
    }
})
```

200 응답이 문자열이 아닌 경우 검증 오류가 발생할 것으로 예상되지만 실제로는 응답 검증이 union을 사용하기 때문에 오류가 발생하지 않습니다. 이는 최종 사용자에게 예기치 않은 값을 남기고 Eden Treaty에 대한 타입 오류를 발생시킬 수 있습니다.

이번 릴리스에서는 응답이 union 대신 상태별로 검증되므로 union 타입 대신 응답 상태를 기반으로 엄격하게 검증됩니다.

## Separation of Elysia Fn
Elysia Fn은 Elysia에 훌륭한 추가 기능이며, Eden과 함께 클라이언트와 서버 사이의 경계를 허물어 완전한 타입 안전성과 심지어 Error, Set 및 Map과 같은 원시 타입으로 서버 측 함수를 클라이언트에서 사용할 수 있습니다.

그러나 원시 타입 지원으로 Elysia Fn은 Elysia의 종속성 크기의 약 38%인 "superjson"에 의존합니다.

이번 릴리스에서는 Elysia Fn을 사용하려면 `@elysiajs/fn`을 명시적으로 설치해야 합니다. 이 접근 방식은 `cargo add --feature`와 같은 추가 기능을 설치하는 것과 같습니다.

이렇게 하면 Elysia Fn을 사용하지 않는 서버에 대해 Elysia가 더 가벼워지며, 우리의 철학인 **실제로 필요한 것만 있도록 보장**합니다.

그러나 Elysia Fn을 설치하는 것을 잊고 실수로 Elysia Fn을 사용하면 사용하기 전에 Elysia Fn을 설치하도록 상기시키는 타입 경고가 표시되며 런타임 오류도 동일한 내용을 알려줍니다.

마이그레이션의 경우 `@elysiajs/fn`을 명시적으로 설치하는 중대한 변경 외에는 마이그레이션이 필요하지 않습니다.

## Conditional Route
이 릴리스는 조건부 경로 또는 플러그인 등록을 위한 `.if` 메서드를 소개합니다.

이를 통해 특정 조건에 대해 선언적으로 사용할 수 있습니다. 예를 들어 프로덕션 환경에서 Swagger 문서를 제외합니다.
```ts
const isProduction = process.env.NODE_ENV === 'production'

const app = new Elysia().if(!isProduction, (app) =>
    app.use(swagger())
)
```

Eden Treaty는 일반 경로/플러그인인 것처럼 경로를 인식할 수 있습니다.

## Custom Validation Error
[#31](https://github.com/elysiajs/elysia/pull/31)에서 amirrezamahyari에게 큰 감사를 드립니다. 이를 통해 Elysia가 TypeBox의 오류 속성에 액세스하여 더 나은 프로그래밍 방식 오류 응답을 제공할 수 있습니다.

```ts
new Elysia()
    .onError(({ code, error, set }) => {
        if (code === 'NOT_FOUND') {
            set.status = 404

            return 'Not Found :('
        }

        if (code === 'VALIDATION') {
            set.status = 400

            return {
                fields: error.all()
            }
        }
    })
    .post('/sign-in', () => 'hi', {
        schema: {
            body: t.Object({
                username: t.String(),
                password: t.String()
            })
        }
    })
    .listen(3000)
```

이제 첫 번째 오류에만 국한되지 않고 API에 대한 검증 오류를 생성할 수 있습니다.

---

### Notable Improvement:
- Update TypeBox to 0.26.8
- Inline a declaration for response type
- Refactor some type for faster response
- Use Typebox `Error().First()` instead of iteration
- Add `innerHandle` for returning an actual response (for benchmark)

### Breaking Change:
- Separate `.fn` to `@elysiajs/fn`

## Afterward
이번 릴리스는 새롭고 흥미로운 기능이 있는 큰 릴리스가 아닐 수 있지만 견고한 기반을 개선하고 미래를 위해 Elysia에 대해 계획한 것에 대한 개념 증명이며 Elysia를 이전보다 더 빠르고 다재다능하게 만듭니다.

앞으로 어떤 일이 펼쳐질지 정말 기대됩니다.

Elysia에 대한 지속적인 지원에 감사드립니다~

> 달빛 아래의 음악회, 우리의 비밀
>
> 이 손을 놓지 않고 다시 시작하자

> 달빛 아래의 음악회, 우리의 유대
>
> "너는 거짓말쟁이가 아니야"라고 말하고 싶어

> 내 마음속의 기억은 계속 피어나는 꽃과 같아
>
> 네가 어떻게 생겼든, 너는 나의 가수야
>
> 오늘 밤 내 곁에 있어줘

</Blog>
