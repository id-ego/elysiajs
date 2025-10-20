---
title: Elysia with Supabase. Your next backend at sonic speed
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia with Supabase. Your next backend at sonic speed

    - - meta
      - name: 'description'
        content: Elysia, and Supabase are a great match for rapidly developing prototype in less than a hour, let's take a look of how we can take advantage of both.

    - - meta
      - property: 'og:description'
        content: Elysia, and Supabase are a great match for rapidly developing prototype in less than a hour, let's take a look of how we can take advantage of both.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-supabase/elysia-supabase.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-supabase/elysia-supabase.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
  title="Elysia with Supabase. Your next backend at sonic speed"
  src="/blog/elysia-supabase/elysia-supabase.webp"
  alt="Elysia and Supabase resembance as a CPU place closely together"
  author="saltyaom"
  date="10 Mar 2023"
>

Firebase의 오픈 소스 대안인 Supabase는 빠른 개발로 유명한 개발자들이 가장 좋아하는 툴킷 중 하나가 되었습니다.

PostgreSQL, 즉시 사용 가능한 사용자 인증, 서버리스 Edge 함수, 클라우드 스토리지 등을 기본으로 제공하며 바로 사용할 수 있습니다.

Supabase는 이미 사전 구축되어 있고, 모든 프로젝트에서 100번째로 동일한 기능을 다시 수행하는 상황을 10줄 미만의 코드로 구성했습니다.

예를 들어, 모든 프로젝트마다 수백 줄의 코드를 다시 작성해야 했던 인증을 다음과 같이 간단하게:

```ts
supabase.auth.signUp(body)

supabase.auth.signInWithPassword(body)
```

그러면 Supabase가 나머지를 처리합니다. 확인 링크를 보내 이메일을 확인하거나, 매직 링크 또는 OTP로 인증하거나, 행 수준 인증으로 데이터베이스를 보호하는 등 원하는 것을 말하세요.

모든 프로젝트에서 여러 시간이 걸리던 작업이 이제 1분 만에 완료됩니다.

## Elysia

아직 들어보지 못하셨다면, Elysia는 속도와 개발자 경험을 염두에 두고 만든 Bun 우선 웹 프레임워크입니다.

Elysia는 Express보다 거의 ~20배 빠르면서도 Express 및 Fastify와 거의 동일한 구문을 가지고 있습니다.

###### (성능은 기계마다 다를 수 있으므로, 성능을 결정하기 전에 [벤치마크](https://github.com/SaltyAom/bun-http-framework-benchmark)를 기계에서 실행하는 것을 권장합니다)

Elysia는 매우 빠른 개발자 경험을 제공합니다.
타입의 단일 소스를 정의할 수 있을 뿐만 아니라, 실수로 데이터를 변경할 때 감지하고 경고합니다.

모두 선언적으로 작은 코드 줄로 완료됩니다.

## Setting things up

빠른 시작을 위해 Supabase Cloud를 사용할 수 있습니다.

Supabase Cloud는 데이터베이스 설정, 확장 및 클라우드에서 필요한 모든 것을 한 번의 클릭으로 처리합니다.

<img class="-png" src="/blog/elysia-supabase/supabase-web.webp" alt="Supabase landing page" />

프로젝트를 생성하면 다음과 같은 것을 볼 수 있습니다. 필요한 모든 요청을 채우고, 아시아에 계시다면 Supabase는 싱가포르와 도쿄에 서버가 있습니다

##### (아시아에 거주하는 개발자들에게 지연 시간 때문에 때때로 이것이 결정 요인이 됩니다)

<img class="-png" src="/blog/elysia-supabase/supabase-create-project.webp" alt="Creating new Supabase project" />

프로젝트를 생성한 후, 프로젝트 URL과 서비스 역할을 복사할 수 있는 환영 화면이 표시됩니다.

둘 다 프로젝트에서 사용 중인 Supabase 프로젝트를 나타내는 데 사용됩니다.

환영 페이지를 놓쳤다면, **Settings > API**로 이동하여 **Project URL**과 **Project API keys**를 복사하세요

<img class="-png" src="/blog/elysia-supabase/supabase-config.webp" alt="Supabase Config Page" />

이제 명령줄에서 다음을 실행하여 Elysia 프로젝트를 만들 수 있습니다:

```bash
bun create elysia elysia-supabase
```

마지막 인수는 Bun이 생성할 폴더 이름입니다. 원하는 이름으로 자유롭게 변경하세요.

이제 폴더로 **cd**하면, Elysia 0.3 (RC)의 새로운 기능을 사용할 것이므로 먼저 Elysia RC 채널을 설치해야 하며, 나중에 사용할 쿠키 플러그인과 Supabase 클라이언트도 가져오겠습니다.

```bash
bun add elysia@rc @elysiajs/cookie@rc @supabase/supabase-js
```

Supabase 서비스 로드를 비밀로 로드하기 위해 **.env** 파일을 만들겠습니다.

```bash
# .env
supabase_url=https://********************.supabase.co
supabase_service_role=**** **** **** ****
```

Bun은 기본적으로 **.env** 파일을 로드하므로 env 파일을 로드하기 위해 플러그인을 설치할 필요가 없습니다

이제 즐겨 사용하는 IDE에서 프로젝트를 열고 `src/libs/supabase.ts` 안에 파일을 만들겠습니다

```ts
// src/libs/supabase.ts
import { createClient } from '@supabase/supabase-js'

const { supabase_url, supabase_service_role } = process.env

export const supabase = createClient(supabase_url!, supabase_service_role!)
```

그게 다입니다! Supabase와 Elysia 프로젝트를 설정하는 데 필요한 전부입니다.

이제 구현에 뛰어들겠습니다!

## Authentication

이제 메인 파일과 분리된 인증 라우트를 만들겠습니다.

`src/modules/authen.ts` 안에 먼저 라우트의 개요를 만들겠습니다.

```ts
// src/modules/authen.ts
import { Elysia } from 'elysia'

const authen = (app: Elysia) =>
    app.group('/auth', (app) =>
        app
            .post('/sign-up', () => {
                return 'This route is expected to sign up a user'
            })
            .post('/sign-in', () => {
                return 'This route is expected to sign in a user'
            })
    )
```

이제 Supabase를 적용하여 사용자를 인증하겠습니다.

```ts
// src/modules/authen.ts
import { Elysia } from 'elysia'
import { supabase } from '../../libs'  // [!code ++]

const authen = (app: Elysia) =>
    app.group('/auth', (app) =>
        app
            .post('/sign-up', async ({ body }) => {
                const { data, error } = await supabase.auth.signUp(body) // [!code ++]
 // [!code ++]
                if (error) return error // [!code ++]

                return data.user // [!code ++]
                return 'This route is expected to sign up a user' // [!code --]
            })
            .post('/sign-in', async ({ body }) => {
                const { data, error } = await supabase.auth.signInWithPassword( // [!code ++]
                    body // [!code ++]
                ) // [!code ++]
 // [!code ++]
                if (error) return error // [!code ++]
 // [!code ++]
                return data.user // [!code ++]
                return 'This route is expected to sign in a user' // [!code --]
            })
    )
```

완료했습니다! 사용자를 위한 **sign-in**과 **sign-up** 라우트를 만드는 데 필요한 전부입니다.

그러나 여기에 작은 문제가 있습니다. 우리의 라우트는 **어떤** 본문이든 받아들여 Supabase 매개변수에 넣을 수 있으며, 심지어 유효하지 않은 것도 가능합니다.

따라서 올바른 데이터를 넣는지 확인하기 위해 본문에 대한 스키마를 정의할 수 있습니다.

```ts
// src/modules/authen.ts
import { Elysia, t } from 'elysia'
import { supabase } from '../../libs'

const authen = (app: Elysia) =>
    app.group('/auth', (app) =>
        app
            .post(
                '/sign-up',
                async ({ body }) => {
                    const { data, error } = await supabase.auth.signUp(body)

                    if (error) return error

                    return data.user
                },
                { // [!code ++]
                    schema: { // [!code ++]
                        body: t.Object({ // [!code ++]
                            email: t.String({ // [!code ++]
                                format: 'email' // [!code ++]
                            }), // [!code ++]
                            password: t.String({ // [!code ++]
                                minLength: 8 // [!code ++]
                            }) // [!code ++]
                        }) // [!code ++]
                    } // [!code ++]
                } // [!code ++]
            )
            .post(
                '/sign-in',
                async ({ body }) => {
                    const { data, error } =
                        await supabase.auth.signInWithPassword(body)

                    if (error) return error

                    return data.user
                },
                { // [!code ++]
                    schema: { // [!code ++]
                        body: t.Object({ // [!code ++]
                            email: t.String({ // [!code ++]
                                format: 'email' // [!code ++]
                            }), // [!code ++]
                            password: t.String({ // [!code ++]
                                minLength: 8 // [!code ++]
                            }) // [!code ++]
                        }) // [!code ++]
                    } // [!code ++]
                } // [!code ++]
            )
    )
```

이제 **sign-in**과 **sign-up** 둘 다에 스키마를 선언했으므로, Elysia는 들어오는 본문이 우리가 선언한 것과 동일한 형태를 갖도록 하여 유효하지 않은 인수가 `supabase.auth`로 전달되는 것을 방지합니다.

Elysia는 또한 스키마를 이해하므로, TypeScript의 타입을 별도로 선언하는 대신, Elysia가 정의한 스키마로 `body`를 자동으로 타입 지정합니다.

따라서 미래에 실수로 breaking change를 만들면, Elysia가 데이터 타입에 대해 경고합니다.

우리가 가진 코드는 훌륭하고, 기대한 작업을 수행하지만, 조금 더 개선할 수 있습니다.

**sign-in**과 **sign-up** 둘 다 동일한 형태의 데이터를 받아들이므로, 미래에는 여러 라우트에서 긴 스키마를 중복하는 자신을 발견할 수도 있습니다.

Elysia에게 스키마를 기억하도록 지시한 다음, 사용하려는 스키마의 이름을 Elysia에게 알려줌으로써 이를 수정할 수 있습니다.

```ts
// src/modules/authen.ts
import { Elysia, t } from 'elysia'
import { supabase } from '../../libs'

const authen = (app: Elysia) =>
    app.group('/auth', (app) =>
        app
            .setModel({ // [!code ++]
                sign: t.Object({ // [!code ++]
                    email: t.String({ // [!code ++]
                        format: 'email' // [!code ++]
                    }), // [!code ++]
                    password: t.String({ // [!code ++]
                        minLength: 8 // [!code ++]
                    }) // [!code ++]
                }) // [!code ++]
            }) // [!code ++]
            .post(
                '/sign-up',
                async ({ body }) => {
                    const { data, error } = await supabase.auth.signUp(body)

                    if (error) return error
                    return data.user
                },
                {
                    schema: {
                        body: 'sign', // [!code ++]
                        body: t.Object({ // [!code --]
                            email: t.String({ // [!code --]
                                format: 'email' // [!code --]
                            }), // [!code --]
                            password: t.String({ // [!code --]
                                minLength: 8 // [!code --]
                            }) // [!code --]
                        }) // [!code --]
                    }
                }
            )
            .post(
                '/sign-in',
                async ({ body }) => {
                    const { data, error } =
                        await supabase.auth.signInWithPassword(body)

                    if (error) return error

                    return data.user
                },
                {
                    schema: {
                        body: 'sign', // [!code ++]
                        body: t.Object({ // [!code --]
                            email: t.String({ // [!code --]
                                format: 'email' // [!code --]
                            }), // [!code --]
                            password: t.String({ // [!code --]
                                minLength: 8 // [!code --]
                            }) // [!code --]
                        }) // [!code --]
                    }
                }
            )
    )
```

훌륭합니다! 라우트에서 이름 참조를 사용했습니다!

::: tip
긴 스키마가 있는 경우, 별도의 파일에 선언하고 모든 Elysia 라우트에서 재사용하여 비즈니스 로직에 집중할 수 있습니다.
:::

## Storing user session

훌륭합니다. 이제 인증 시스템을 완성하기 위해 마지막으로 해야 할 일은 사용자가 로그인한 후 사용자 세션을 저장하는 것입니다. 토큰은 Supabase에서 `access_token` 및 `refresh_token`으로 알려져 있습니다.

access_token은 단기 JWT 액세스 토큰입니다. 짧은 시간 동안 사용자를 인증하는 데 사용됩니다.
refresh_token은 access_token을 갱신하기 위한 일회용으로 만료되지 않는 토큰입니다. 이 토큰이 있는 한 새 액세스 토큰을 만들어 사용자 세션을 연장할 수 있습니다.

두 값을 쿠키 안에 저장할 수 있습니다.

이제 일부 사람들은 쿠키 안에 액세스 토큰을 저장하는 아이디어를 좋아하지 않고 대신 Bearer를 사용할 수도 있습니다. 그러나 간단함을 위해 여기서는 쿠키를 사용하겠습니다.

::: tip
**HttpOnly**로 쿠키를 설정하여 XSS를 방지하고, **Secure**, **Same-Site**로 설정하고 쿠키를 암호화하여 중간자 공격을 방지할 수 있습니다.
:::

```ts
// src/modules/authen.ts
import { Elysia, t } from 'elysia'
import { cookie } from '@elysiajs/cookie' // [!code ++]

import { supabase } from '../../libs'

const authen = (app: Elysia) =>
    app.group('/auth', (app) =>
        app
            .use( // [!code ++]
                cookie({ // [!code ++]
                    httpOnly: true, // [!code ++]
                    // If you need cookie to deliver via https only // [!code ++]
                    // secure: true, // [!code ++]
                    // // [!code ++]
                    // If you need a cookie to be available for same-site only // [!code ++]
                    // sameSite: "strict", // [!code ++]
                    // // [!code ++]
                    // If you want to encrypt a cookie // [!code ++]
                    // signed: true, // [!code ++]
                    // secret: process.env.COOKIE_SECRET, // [!code ++]
                }) // [!code ++]
            ) // [!code ++]
            .setModel({
                sign: t.Object({
                    email: t.String({
                        format: 'email'
                    }),
                    password: t.String({
                        minLength: 8
                    })
                })
            })
            // rest of the code
    )
```

그리고-- Elysia와 Supabase를 위한 **sign-in**과 **sign-up** 라우트를 만드는 데 필요한 전부입니다!

<img class="-png" src="/blog/elysia-supabase/lagrange-sign-in.webp" alt="Using Rest Client to sign in" />

## Refreshing a token

이제 언급한 대로 access_token은 수명이 짧고, 때때로 토큰을 갱신해야 할 수도 있습니다.

다행히도, Supabase의 한 줄로 그렇게 할 수 있습니다.

```ts
// src/modules/authen.ts
import { Elysia, t } from 'elysia'
import { supabase } from '../../libs'

const authen = (app: Elysia) =>
    app.group('/auth', (app) =>
        app
            .setModel({
                sign: t.Object({
                    email: t.String({
                        format: 'email'
                    }),
                    password: t.String({
                        minLength: 8
                    })
                })
            })
            .post(
                '/sign-up',
                async ({ body }) => {
                    const { data, error } = await supabase.auth.signUp(body)

                    if (error) return error
                    return data.user
                },
                {
                    schema: {
                        body: 'sign'
                    }
                }
            )
            .post(
                '/sign-in',
                async ({ body }) => {
                    const { data, error } =
                        await supabase.auth.signInWithPassword(body)

                    if (error) return error

                    return data.user
                },
                {
                    schema: {
                        body: 'sign'
                    }
                }
            )
            .get( // [!code ++]
                '/refresh', // [!code ++]
                async ({ setCookie, cookie: { refresh_token } }) => { // [!code ++]
                    const { data, error } = await supabase.auth.refreshSession({ // [!code ++]
                        refresh_token // [!code ++]
                    }) // [!code ++]
 // [!code ++]
                    if (error) return error // [!code ++]
 // [!code ++]
                    setCookie('refresh_token', data.session!.refresh_token) // [!code ++]
 // [!code ++]
                    return data.user // [!code ++]
                } // [!code ++]
            ) // [!code ++]
    )
```

마지막으로, 메인 서버에 라우트를 추가합니다.
```ts
import { Elysia, t } from 'elysia'

import { auth } from './modules' // [!code ++]

const app = new Elysia()
    .use(auth) // [!code ++]
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

그게 다입니다!

## Authorization route

방금 사용자 인증을 구현했는데, 재미있고 좋지만 이제 각 라우트에 대한 권한 부여가 필요하고 쿠키를 확인하기 위해 모든 곳에 동일한 코드를 복제하는 자신을 발견할 수 있습니다.

다행히도, Elysia에서 함수를 재사용할 수 있습니다.

사용자가 다음과 같은 데이터베이스 스키마를 가질 수 있는 간단한 블로그 게시물을 만들고 싶다고 예를 들어 보겠습니다:

Supabase 콘솔 안에서 다음과 같이 'post'라는 Postgres 테이블을 만들겠습니다:
<img class="-png" src="/blog/elysia-supabase/supabase-create-table.webp" alt="Creating table using Supabase UI, in the public table with the name of 'post', and a columns of 'id' with type of 'int8' as a primary value, 'created_at' with type of 'timestamp' with default value of 'now()', 'user_id' linked to Supabase's user schema linked as 'user.id', and 'post' with type of 'text'" />

**user_id**는 Supabase가 생성한 **auth** 테이블에 **user.id**로 링크되어 있으며, 이 관계를 사용하여 행 수준 보안을 만들어 게시물 소유자만 데이터를 수정할 수 있도록 할 수 있습니다.

<img class="-png" src="/blog/elysia-supabase/supabase-create-table-link.webp" alt="Linking the 'user_id' field with Supabase's user schema as 'user.id'" />

이제 auth 라우트와 코드를 분리하기 위해 다른 폴더에 새로운 분리된 Elysia 라우트를 만들겠습니다. `src/modules/post/index.ts` 안에

```ts
// src/modules/post/index.ts
import { Elysia, t } from 'elysia'

import { supabase } from '../../libs'

export const post = (app: Elysia) =>
    app.group('/post', (app) =>
        app.put(
            '/create',
            async ({ body }) => {
                const { data, error } = await supabase
                    .from('post')
                    .insert({
                        // Add user_id somehow
                        // user_id: userId,
                        ...body
                    })
                    .select('id')

                if (error) throw error

                return data[0]
            },
            {
                schema: {
                    body: t.Object({
                        detail: t.String()
                    })
                }
            }
        )
    )
```

이제 이 라우트는 본문을 받아들여 데이터베이스에 넣을 수 있으며, 권한 부여를 처리하고 `user_id`를 추출하는 것만 남았습니다.

다행히도 Supabase와 쿠키 덕분에 쉽게 할 수 있습니다.

```ts
import { Elysia, t } from 'elysia'
import { cookie } from '@elysiajs/cookie' // [!code ++]

import { supabase } from '../../libs'

export const post = (app: Elysia) =>
    app.group('/post', (app) =>
        app.put(
            '/create',
            async ({ body }) => {
                let userId: string // [!code ++]
   // [!code ++]
                const { data, error } = await supabase.auth.getUser( // [!code ++]
                    access_token // [!code ++]
                ) // [!code ++]
   // [!code ++]
                if(error) { // [!code ++]
                    const { data, error } = await supabase.auth.refreshSession({ // [!code ++]
                        refresh_token // [!code ++]
                    }) // [!code ++]
   // [!code ++]
                    if (error) throw error // [!code ++]
   // [!code ++]
                    userId = data.user!.id // [!code ++]
                } // [!code ++]

                const { data, error } = await supabase
                    .from('post')
                    .insert({
                        // Add user_id somehow
                        // user_id: userId,
                        ...body
                    })
                    .select('id')

                if (error) throw error

                return data[0]
            },
            {
                schema: {
                    body: t.Object({
                        detail: t.String()
                    })
                }
            }
        )
    )
```

훌륭합니다! 이제 **supabase.auth.getUser**를 사용하여 쿠키에서 `user_id`를 추출할 수 있습니다

## Derive
우리 코드는 지금 잘 작동하지만, 약간의 그림을 그려보겠습니다.

이와 같이 권한 부여가 필요한 라우트가 많아서 `userId`를 추출해야 한다고 가정해 보겠습니다. 여기에 많은 중복 코드가 있을 것입니다. 맞죠?

다행히도, Elysia는 이 문제를 해결하도록 특별히 설계되었습니다.

---

Elysia에는 **scope**라고 하는 것이 있습니다.

변수가 범위 내에서만 사용될 수 있는 **클로저**처럼 상상하거나, Rust를 사용하는 경우 소유권처럼 생각하세요.

**group**, **guard**와 같은 범위에서 선언된 모든 라이프사이클은 범위 내에서만 사용할 수 있습니다.

즉, 범위 내의 특정 라우트에 특정 라이프 사이클을 선언할 수 있습니다.

예를 들어, 권한 부여가 필요한 라우트의 범위와 그렇지 않은 라우트.

따라서 그 모든 코드를 재사용하는 대신, 한 번 정의하고 필요한 모든 라우트에 적용했습니다.

---

이제 이 **user_id** 검색을 플러그인으로 이동하고 범위의 모든 라우트에 적용하겠습니다.

이 플러그인을 `src/libs/authen.ts` 안에 넣겠습니다

```ts
import { Elysia } from 'elysia'
import { cookie } from '@elysiajs/cookie'

import { supabase } from './supabase'

export const authen = (app: Elysia) =>
    app
        .use(cookie())
        .derive(
            async ({ setCookie, cookie: { access_token, refresh_token } }) => {
                const { data, error } = await supabase.auth.getUser(
                    access_token
                )

                if (data.user)
                    return {
                        userId: data.user.id
                    }

                const { data: refreshed, error: refreshError } =
                    await supabase.auth.refreshSession({
                        refresh_token
                    })

                if (refreshError) throw error

                return {
                    userId: refreshed.user!.id
                }
            }
        )
```

이 코드는 userId를 추출하려고 시도하고, `userId`를 라우트의 `Context`에 추가합니다. 그렇지 않으면 오류를 발생시키고 핸들러를 건너뛰어 비즈니스 로직, 즉 **supabase.from.insert**에 유효하지 않은 오류가 들어가는 것을 방지합니다.

::: tip
메인 핸들러에 들어가기 전에 사용자 정의 유효성 검증을 만들기 위해 **onBeforeHandle**을 사용할 수도 있습니다. **.derive**도 동일한 작업을 수행하지만 **derived**에서 반환된 것은 **Context**에 추가되는 반면 **onBeforeHandle**은 그렇지 않습니다.

기술적으로, **derive**는 내부적으로 **transform**을 사용합니다.
:::

한 줄로, 범위 내의 모든 라우트를 권한 부여 전용 라우트로 적용하고 **userId**에 타입 안전 액세스를 제공합니다.

```ts
import { Elysia, t } from 'elysia'

import { authen, supabase } from '../../libs' // [!code ++]

export const post = (app: Elysia) =>
    app.group('/post', (app) =>
        app
            .use(authen) // [!code ++]
            .put(
                '/create',
                async ({ body, userId }) => { // [!code ++]
                    let userId: string // [!code --]
    // [!code --]
                    const { data, error } = await supabase.auth.getUser( // [!code --]
                        access_token // [!code --]
                    ) // [!code --]
    // [!code --]
                    if(error) { // [!code --]
                        const { data, error } = await supabase.auth.refreshSession({ // [!code --]
                            refresh_token // [!code --]
                        }) // [!code --]
    // [!code --]
                        if (error) throw error // [!code --]
    // [!code --]
                        userId = data.user!.id // [!code --]
                    } // [!code --]

                    const { data, error } = await supabase
                        .from('post')
                        .insert({
                            user_id: userId, // [!code ++]
                            ...body
                        })
                        .select('id')

                    if (error) throw error

                    return data[0]
                },
                {
                    schema: {
                        body: t.Object({
                            detail: t.String()
                        })
                    }
                }
            )
    )

```

좋지 않나요? 마법처럼 코드를 보면 권한 부여를 처리했다는 것조차 볼 수 없습니다.

대신 핵심 비즈니스 로직에 집중을 다시 맞춥니다.

<img class="-png" src="/blog/elysia-supabase/lagrange-create-post.webp" alt="Using Rest Client to create post" />

## Non-authorized scope
이제 데이터베이스에서 게시물을 가져오는 라우트를 하나 더 만들겠습니다.

```ts
import { Elysia, t } from 'elysia'

import { authen, supabase } from '../../libs'

export const post = (app: Elysia) =>
    app.group('/post', (app) =>
        app
            .get('/:id', async ({ params: { id } }) => { // [!code ++]
                const { data, error } = await supabase // [!code ++]
                    .from('post') // [!code ++]
                    .select() // [!code ++]
                    .eq('id', id) // [!code ++]
 // [!code ++]
                if (error) return error // [!code ++]
 // [!code ++]
                return { // [!code ++]
                    success: !!data[0], // [!code ++]
                    data: data[0] ?? null // [!code ++]
                } // [!code ++]
            }) // [!code ++]
            .use(authen)
            .put(
                '/create',
                async ({ body, userId }) => {
                    const { data, error } = await supabase
                        .from('post')
                        .insert({
                            // Add user_id somehow
                            // user_id: userId,
                            ...body
                        })
                        .select('id')

                    if (error) throw error

                    return data[0]
                },
                {
                    schema: {
                        body: t.Object({
                            detail: t.String()
                        })
                    }
                }
            )
    )
```

게시물이 존재하는지 여부를 나타내기 위해 success를 사용합니다.
<img class="-png" src="/blog/elysia-supabase/lagrange-get-post-success.webp" alt="Using Rest Client to get post by id" />

그렇지 않으면 `success: false`와 `data: null`을 반환합니다.
<img class="-png" src="/blog/elysia-supabase/lagrange-get-post-failed.webp" alt="Using Rest Client to get post by id but failed" />

이전에 언급한 대로, `.use(authen)`은 범위에 적용되지만 **그 자체 이후에 선언된 것에만** 적용됩니다. 즉, 그 전의 모든 것은 영향을 받지 않으며, 그 후에 오는 것은 이제 권한 부여 전용 라우트입니다.

마지막으로, 메인 서버에 라우트를 추가하는 것을 잊지 마세요.
```ts
import { Elysia, t } from 'elysia'

import { auth, post } from './modules' // [!code ++]

const app = new Elysia()
    .use(auth)
    .use(post) // [!code ++]
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```


## Bonus: Documentation

보너스로, 우리가 만든 모든 것 후에, 라우트별로 정확하게 말하는 대신 프론트엔드 개발자를 위한 문서를 1줄로 만들 수 있습니다.

Swagger 플러그인을 사용하여 설치할 수 있습니다:

```bash
bun add @elysiajs/swagger@rc
```

그런 다음 플러그인만 추가하면 됩니다:

```ts
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger' // [!code ++]

import { auth, post } from './modules'

const app = new Elysia()
    .use(swagger()) // [!code ++]
    .use(auth)
    .use(post)
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

짜잔 🎉 우리 API에 대한 잘 정의된 문서를 얻었습니다.

<img class="-png" src="/blog/elysia-supabase/elysia-swagger.webp" alt="Swagger documentation generated by Elysia" />

그리고 더 나아가, OpenAPI Schema 3.0의 사양을 잊어버릴까 걱정할 필요가 없습니다. 자동 완성과 타입 안전성도 있습니다.

OpenAPI Schema 3.0을 따르는 `schema.detail`로 라우트 세부 정보를 정의할 수 있으므로 문서를 제대로 만들 수 있습니다.
<img class="-png" src="/blog/elysia-supabase/swagger-auto-complete.webp" alt="Using auto-completion with `schema.detail`" />

## What's next

다음 단계로, [이 글에서 방금 작성한 코드](https://github.com/saltyaom/elysia-supabase-example)를 시도하고 더 탐색하며 이미지 업로드 게시물을 추가하여 Supabase와 Elysia 생태계를 모두 탐색하는 것을 권장합니다.

보시다시피, Supabase로 프로덕션 준비가 된 웹 서버를 만드는 것은 매우 쉬우며, 많은 것들이 단지 한 줄이고 빠른 개발에 편리합니다.

특히 Elysia와 함께 사용하면 뛰어난 개발자 경험, 단일 소스의 진실로서의 선언적 스키마, API를 만들기 위한 매우 잘 생각된 디자인 선택, TypeScript를 사용하는 고성능 서버를 얻으며, 보너스로 단 한 줄로 문서를 만들 수 있습니다.

Elysia는 새로운 기술과 새로운 접근 방식으로 Bun 우선 웹 프레임워크를 만드는 여정에 있습니다.

Elysia에 관심이 있다면, [Discord 서버](https://discord.gg/eaFJ2KDJck)를 자유롭게 확인하거나 [Elysia on GitHub](https://github.com/elysiajs/elysia)를 참조하세요

또한 Elysia 서버를 위한 tRPC와 같은 완전한 타입 안전, 코드 생성 없는 fetch 클라이언트인 [Elysia Eden](/eden/overview)을 확인해 보세요.
</Blog>
