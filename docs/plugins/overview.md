---
title: Plugin 개요 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Plugin 개요 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia는 모듈식이고 경량화되도록 설계되었으며, 이것이 바로 Elysia가 편리한 개발자 사용을 위한 일반적인 패턴과 관련된 사전 구축 플러그인을 포함하는 이유입니다. Elysia는 커뮤니티 플러그인에 의해 더욱 향상되어 더욱 맞춤화됩니다.

    - - meta
      - name: 'og:description'
        content: Elysia는 모듈식이고 경량화되도록 설계되었으며, 이것이 바로 Elysia가 편리한 개발자 사용을 위한 일반적인 패턴과 관련된 사전 구축 플러그인을 포함하는 이유입니다. Elysia는 커뮤니티 플러그인에 의해 더욱 향상되어 더욱 맞춤화됩니다.
---

# 개요

Elysia는 모듈식이고 경량화되도록 설계되었습니다.

Arch Linux(참고로 저는 Arch를 사용합니다)와 동일한 아이디어를 따릅니다:

> 설계 결정은 개발자 합의를 통해 사례별로 이루어집니다

이는 개발자가 만들고자 하는 성능이 뛰어난 웹 서버로 끝나도록 보장하기 위한 것입니다. 확장으로 Elysia는 편리한 개발자 사용을 위해 미리 구축된 일반적인 패턴 플러그인을 포함합니다:

## 공식 플러그인

Elysia 팀에서 유지 관리하는 공식 플러그인은 다음과 같습니다:

-   [Bearer](/plugins/bearer) - [Bearer](https://swagger.io/docs/specification/authentication/bearer-authentication/) 토큰을 자동으로 검색
-   [CORS](/plugins/cors) - [Cross-origin resource sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 설정
-   [Cron](/plugins/cron) - [cron](https://en.wikipedia.org/wiki/Cron) 작업 설정
-   [Eden](/eden/overview) - Elysia용 엔드 투 엔드 타입 안전 클라이언트
-   [GraphQL Apollo](/plugins/graphql-apollo) - Elysia에서 [Apollo GraphQL](https://www.apollographql.com/) 실행
-   [GraphQL Yoga](/plugins/graphql-yoga) - Elysia에서 [GraphQL Yoga](https://github.com/dotansimha/graphql-yoga) 실행
-   [HTML](/plugins/html) - HTML 응답 처리
-   [JWT](/plugins/jwt) - [JWT](https://jwt.io/)로 인증
-   [OpenAPI](/plugins/openapi) - [OpenAPI](https://swagger.io/specification/) 문서 생성
-   [OpenTelemetry](/plugins/opentelemetry) - OpenTelemetry 지원 추가
-   [Server Timing](/plugins/server-timing) - [Server-Timing API](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing)로 성능 병목 현상 감사
-   [Static](/plugins/static) - 정적 파일/폴더 제공

## 커뮤니티 플러그인

-   [Create ElysiaJS](https://github.com/kravetsone/create-elysiajs) - Elysia 프로젝트를 쉽게 환경으로 스캐폴드 (ORM, Linters 및 Plugins 지원)!
-   [Lucia Auth](https://github.com/pilcrowOnPaper/lucia) - 단순하고 깨끗한 인증
-   [Elysia Clerk](https://github.com/wobsoriano/elysia-clerk) - 비공식 Clerk 인증 플러그인
-   [Elysia Polyfills](https://github.com/bogeychan/elysia-polyfills) - Node.js 및 Deno에서 Elysia 생태계 실행
-   [Vite server](https://github.com/kravetsone/elysia-vite-server) - `development`에서 [`vite`](https://vitejs.dev/) 개발 서버를 시작하고 데코레이트하고 `production` 모드에서는 정적 파일 제공 (필요시)
-   [Vite](https://github.com/timnghg/elysia-vite) - Vite의 스크립트가 주입된 진입 HTML 파일 제공
-   [Nuxt](https://github.com/trylovetom/elysiajs-nuxt) - Elysia를 Nuxt와 쉽게 통합!
-   [Remix](https://github.com/kravetsone/elysia-remix) - `HMR` 지원과 함께 [Remix](https://remix.run/) 사용 ([`vite`](https://vitejs.dev/) 제공)! 오래된 플러그인 요청 [#12](https://github.com/elysiajs/elysia/issues/12) 해결
-   [Sync](https://github.com/johnny-woodtke/elysiajs-sync) - [Dexie.js](https://dexie.org/)로 구동되는 경량 오프라인 우선 데이터 동기화 프레임워크
-   [Connect middleware](https://github.com/kravetsone/elysia-connect-middleware) - [`express`](https://www.npmjs.com/package/express)/[`connect`](https://www.npmjs.com/package/connect) 미들웨어를 Elysia에서 직접 사용할 수 있는 플러그인!
-   [Elysia HTTP Exception](https://github.com/codev911/elysia-http-exception) - 구조화된 예외 클래스를 사용한 HTTP 4xx/5xx 오류 처리를 위한 Elysia 플러그인
-   [Elysia Helmet](https://github.com/DevTobias/elysia-helmet) - 다양한 HTTP 헤더로 Elysia 앱 보안
-   [Vite Plugin SSR](https://github.com/timnghg/elysia-vite-plugin-ssr) - Elysia 서버를 사용한 Vite SSR 플러그인
-   [OAuth 2.0](https://github.com/kravetsone/elysia-oauth2) - **42개 이상**의 제공업체와 **타입 안전성**을 갖춘 [OAuth 2.0](https://en.wikipedia.org/wiki/OAuth) Authorization Flow용 플러그인!
-   [OAuth2](https://github.com/bogeychan/elysia-oauth2) - OAuth 2.0 인증 코드 흐름 처리
-   [OAuth2 Resource Server](https://github.com/ap-1/elysia-oauth2-resource-server) - issuer, audience 및 scope 검증 지원과 함께 JWKS 엔드포인트에 대해 OAuth2 제공자의 JWT 토큰을 검증하는 플러그인
-   [Elysia OpenID Client](https://github.com/macropygia/elysia-openid-client) - [openid-client](https://github.com/panva/node-openid-client) 기반 OpenID 클라이언트
-   [Rate Limit](https://github.com/rayriffy/elysia-rate-limit) - 단순하고 경량화된 rate limiter
-   [Logysia](https://github.com/tristanisham/logysia) - 클래식 로깅 미들웨어
-   [Logestic](https://github.com/cybercoder-naj/logestic) - ElysiaJS용 고급 및 사용자 정의 가능한 로깅 라이브러리
-   [Logger](https://github.com/bogeychan/elysia-logger) - [pino](https://github.com/pinojs/pino) 기반 로깅 미들웨어
-   [Elylog](https://github.com/eajr/elylog) - 일부 커스터마이제이션이 가능한 간단한 stdout 로깅 라이브러리
-   [Logify for Elysia.js](https://github.com/0xrasla/logify) - Elysia.js 애플리케이션용 아름답고 빠르며 타입 안전한 로깅 미들웨어
-   [Nice Logger](https://github.com/tanishqmanuja/nice-logger) - 가장 좋지는 않지만 Elysia용 꽤 좋고 달콤한 로거
-   [Sentry](https://github.com/johnny-woodtke/elysiajs-sentry) - 이 [Sentry](https://docs.sentry.io/) 플러그인으로 추적 및 오류 캡처
-   [Elysia Lambda](https://github.com/TotalTechGeek/elysia-lambda) - AWS Lambda에 배포
-   [Decorators](https://github.com/gaurishhs/elysia-decorators) - TypeScript 데코레이터 사용
-   [Autoload](https://github.com/kravetsone/elysia-autoload) - [`Bun.build`](https://github.com/kravetsone/elysia-autoload?tab=readme-ov-file#bun-build-usage) 지원과 함께 [Eden](/eden/overview)용 타입을 생성하는 디렉터리 구조 기반 파일시스템 라우터
-   [Msgpack](https://github.com/kravetsone/elysia-msgpack) - [MessagePack](https://msgpack.org) 작업 가능
-   [XML](https://github.com/kravetsone/elysia-xml) - XML 작업 가능
-   [Autoroutes](https://github.com/wobsoriano/elysia-autoroutes) - 파일시스템 라우트
-   [Group Router](https://github.com/itsyoboieltr/elysia-group-router) - 그룹용 파일시스템 및 폴더 기반 라우터
-   [Basic Auth](https://github.com/itsyoboieltr/elysia-basic-auth) - 기본 HTTP 인증
-   [ETag](https://github.com/bogeychan/elysia-etag) - 자동 HTTP [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) 생성
-   [CDN Cache](https://github.com/johnny-woodtke/elysiajs-cdn-cache) - Elysia용 Cache-Control 플러그인 - 더 이상 수동으로 HTTP 헤더 설정 불필요
-   [Basic Auth](https://github.com/eelkevdbos/elysia-basic-auth) - 기본 HTTP 인증 (`request` 이벤트 사용)
-   [i18n](https://github.com/eelkevdbos/elysia-i18next) - [i18next](https://www.i18next.com/) 기반 [i18n](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/i18n) 래퍼
-   [Elysia Request ID](https://github.com/gtramontina/elysia-requestid) - 요청 ID 추가/전달 (`X-Request-ID` 또는 커스텀)
-   [Elysia HTMX](https://github.com/gtramontina/elysia-htmx) - [HTMX](https://htmx.org/)용 context 헬퍼
-   [Elysia HMR HTML](https://github.com/gtrabanco/elysia-hmr-html) - 디렉터리의 파일을 변경할 때 HTML 파일 다시 로드
-   [Elysia Inject HTML](https://github.com/gtrabanco/elysia-inject-html) - HTML 파일에 HTML 코드 주입
-   [Elysia HTTP Error](https://github.com/yfrans/elysia-http-error) - Elysia 핸들러에서 HTTP 오류 반환
-   [Elysia Http Status Code](https://github.com/sylvain12/elysia-http-status-code) - HTTP 상태 코드 통합
-   [NoCache](https://github.com/gaurishhs/elysia-nocache) - 캐싱 비활성화
-   [Elysia Tailwind](https://github.com/gtramontina/elysia-tailwind) - 플러그인에서 [Tailwindcss](https://tailwindcss.com/) 컴파일
-   [Elysia Compression](https://github.com/gusb3ll/elysia-compression) - 응답 압축
-   [Elysia IP](https://github.com/gaurishhs/elysia-ip) - IP 주소 가져오기
-   [OAuth2 Server](https://github.com/myazarc/elysia-oauth2-server) - Elysia로 OAuth2 서버 개발
-   [Elysia Flash Messages](https://github.com/gtramontina/elysia-flash-messages) - 플래시 메시지 활성화
-   [Elysia AuthKit](https://github.com/gtramontina/elysia-authkit) - 비공식 [WorkOS' AuthKit](https://www.authkit.com/) 인증
-   [Elysia Error Handler](https://github.com/gtramontina/elysia-error-handler) - 더 간단한 오류 처리
-   [Elysia env](https://github.com/yolk-oss/elysia-env) - typebox를 사용한 타입 안전 환경 변수
-   [Elysia Drizzle Schema](https://github.com/Edsol/elysia-drizzle-schema) - Elysia OpenAPI 모델 내에서 Drizzle ORM 스키마 사용 지원
-   [Unify-Elysia](https://github.com/qlaffont/unify-elysia) - Elysia용 통합 오류 코드
-   [Unify-Elysia-GQL](https://github.com/qlaffont/unify-elysia-gql) - Elysia GraphQL Server (Yoga & Apollo)용 통합 오류 코드
-   [Elysia Auth Drizzle](https://github.com/qlaffont/elysia-auth-drizzle) - JWT로 인증을 처리하는 라이브러리 (Header/Cookie/QueryParam)
-   [graceful-server-elysia](https://github.com/qlaffont/graceful-server-elysia) - [graceful-server](https://github.com/gquittet/graceful-server)에서 영감을 받은 라이브러리
-   [Logixlysia](https://github.com/PunGrumpy/logixlysia) - 색상과 타임스탬프가 있는 ElysiaJS용 아름답고 간단한 로깅 미들웨어
-   [Elysia Fault](https://github.com/vitorpldev/elysia-fault) - 자체 HTTP 오류를 생성할 수 있는 간단하고 사용자 정의 가능한 오류 처리 미들웨어
-   [Elysia Compress](https://github.com/vermaysha/elysia-compress) - [@fastify/compress](https://github.com/fastify/fastify-compress)에서 영감을 받은 응답 압축 ElysiaJS 플러그인
-   [@labzzhq/compressor](https://github.com/labzzhq/compressor/) - gzip, deflate 및 brotli 지원과 함께 Elysia 및 Bunnyhop용 HTTP 압축기
-   [Elysia Accepts](https://github.com/morigs/elysia-accepts) - accept 헤더 파싱 및 콘텐츠 협상을 위한 Elysia 플러그인
-   [Elysia Compression](https://github.com/chneau/elysia-compression) - 응답 압축을 위한 Elysia 플러그인
-   [Elysia Logger](https://github.com/chneau/elysia-logger) - [hono/logger](https://hono.dev/docs/middleware/builtin/logger)에서 영감을 받은 HTTP 요청 및 응답 로깅을 위한 Elysia 플러그인
-   [Elysia CQRS](https://github.com/jassix/elysia-cqrs) - CQRS 패턴을 위한 Elysia 플러그인
-   [Elysia Supabase](https://github.com/mastermakrela/elysia-supabase) - Elysia에 [Supabase](https://supabase.com/) 인증 및 데이터베이스 기능을 원활하게 통합하여 인증된 사용자 데이터 및 Supabase 클라이언트 인스턴스에 쉽게 액세스. [Edge Functions](https://supabase.com/docs/guides/functions)에 특히 유용
-   [Elysia XSS](https://www.npmjs.com/package/elysia-xss) - 요청 본문 데이터를 정리하여 XSS (Cross-Site Scripting) 보호를 제공하는 Elysia.js용 플러그인
-   [Elysiajs Helmet](https://www.npmjs.com/package/elysiajs-helmet) - 다양한 HTTP 헤더를 설정하여 앱 보안을 지원하는 Elysia.js 애플리케이션용 포괄적인 보안 미들웨어
-   [Decorators for Elysia.js](https://github.com/Ateeb-Khan-97/better-elysia) - 이 작은 라이브러리로 API, Websocket 및 Streaming API를 원활하게 개발하고 통합
-   [Elysia Protobuf](https://github.com/ilyhalight/elysia-protobuf) - Elysia용 protobuf 지원
-   [Elysia Prometheus](https://github.com/m1handr/elysia-prometheus) - Prometheus용 HTTP 메트릭 노출을 위한 Elysia 플러그인
-   [Elysia Remote DTS](https://github.com/rayriffy/elysia-remote-dts) - Eden Treaty가 사용할 수 있도록 원격으로 .d.ts 타입을 제공하는 플러그인
-   [Cap Checkpoint plugin for Elysia](https://capjs.js.org/guide/middleware/elysia.html) - SHA-256 PoW를 사용하여 설계된 경량의 현대적인 오픈 소스 CAPTCHA 대안인 Cap용 Cloudflare와 유사한 미들웨어
-   [Elysia Background](https://github.com/staciax/elysia-background) - Elysia.js용 백그라운드 작업 처리 플러그인
-   [@fedify/elysia](https://github.com/fedify-dev/fedify/tree/main/packages/elysia) - ActivityPub 서버 프레임워크인 [Fedify](https://fedify.dev/)와의 원활한 통합을 제공하는 플러그인
-   [elysia-healthcheck](https://github.com/iam-medvedev/elysia-healthcheck) - Elysia.js용 Healthcheck 플러그인

## 보완 프로젝트:

-   [prismabox](https://github.com/m1212e/prismabox) - 데이터베이스 모델을 기반으로 한 typebox 스키마용 생성기, elysia와 잘 작동

---

Elysia용으로 작성한 플러그인이 있다면 아래 **<i>GitHub에서 이 페이지 편집</i>을 클릭**하여 목록에 플러그인을 추가해 주세요 👇
