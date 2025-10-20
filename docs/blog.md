---
title: Elysia 블로그
layout: page
sidebar: false
editLink: false
search: false
comments: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: 블로그 - ElysiaJS

    - - meta
      - name: 'description'
        content: 핵심 유지보수자로부터의 ElysiaJS 업데이트

    - - meta
      - property: 'og:description'
        content: 핵심 유지보수자로부터의 ElysiaJS 업데이트
---

<script setup>
    import Blogs from './components/blog/Landing.vue'
</script>

<Blogs
  :blogs="[
      {
        title: 'Elysia 1.4 - Supersymmetry',
		href: '/blog/elysia-14',
		cover: 'elysia-14.webp',
		detail: 'Standard Validator 지원. 스키마, 확장 및 OpenAPI 상세 정보가 포함된 Macro. 라이프사이클 타입 견고성. 타입 추론 성능 10% 향상.'
      },
      {
        title: 'Elysia를 위한 OpenAPI Type Gen 소개',
		href: '/blog/openapi-type-gen',
		cover: 'cover.webp',
		detail: 'Elysia는 이제 OpenAPI Type Gen을 지원합니다. 이는 수동 주석 없이 Elysia 라우트와 타입에서 자동으로 OpenAPI 문서를 생성하는 강력한 도구입니다.'
      },
      {
        title: 'Elysia 1.3과 Scientific Witchery',
        href: '/blog/elysia-13',
        cover: 'elysia-13.webp',
        detail: 'Exact Mirror를 통한 거의 0 오버헤드 정규화, Bun System Router, Standalone Validator, 타입 인스턴스화 절반 감소, 메모리 사용량 크게 감소 및 더 빠른 시작 시간.'
      },
      {
        title: 'Elysia 1.2 - You and Me',
        href: '/blog/elysia-12',
        cover: 'elysia-12.webp',
        detail: '범용 런타임 지원을 위한 Adapter, resolve를 사용한 Object macro, 사용자 정의 이름을 가진 Parser, 라이프사이클이 있는 WebSocket, 재귀 타입을 지원하는 TypeBox 0.34, Eden 검증 추론 소개.'
      },
	  {
	    title: 'Elysia 1.1 - Grown-up\'s Paradise',
	    href: '/blog/elysia-11',
        cover: 'elysia-11.webp',
	    detail: 'OpenTelemetry 및 Trace v2 소개. 데이터 강제 변환 및 정규화. Guard 플러그인 및 대량 캐스트. 선택적 경로 매개변수. Decorator 및 Response status 조정. 제너레이터 응답 스트림.'
	  },
      {
        title: 'Elysia 1.0 - Lament of the Fallen',
        href: '/blog/elysia-10',
        cover: 'lament-of-the-fallen.webp',
        detail: 'Sucrose 소개, 더 나은 정적 코드 분석 엔진, 최대 14배 향상된 시작 시간, 40 routes/instance 제한 제거, 최대 ~3.8배 빠른 타입 추론, Eden Treaty 2, Hook 타입(중요 변경 사항), 엄격한 타입 검사를 위한 인라인 오류.'
      },
      {
        title: 'Elysia 0.8 소개 - Gate of Steiner',
        href: '/blog/elysia-08',
        cover: 'gate-of-steiner.webp',
        detail: 'Elysia와 상호작용하는 새로운 방식인 Macro API 소개. Elysia와 더욱 상호작용하기 위한 새로운 라이프사이클, resolve 및 mapResponse. 정적 리소스를 미리 컴파일하는 Static Content. Default Property, Default Header 및 여러 개선사항.'
      },
      {
        title: 'Elysia 0.7 소개 - Stellar Stellar',
        href: '/blog/elysia-07',
        cover: 'stellar-stellar.webp',
        detail: '최대 13배 빠른 타입 추론 소개. trace를 사용한 선언적 원격 측정. 반응형 쿠키 모델 및 쿠키 검증. TypeBox 0.31 및 사용자 정의 디코더 지원. Web Socket 재작성. Definitions 재매핑 및 사용자 정의 접사. Elysia의 더 밝은 미래를 위한 더 견고한 기반.'
      },
      {
        title: 'Elysia 0.6 소개 - This Game',
        href: '/blog/elysia-06',
        cover: 'this-game.webp',
        detail: '재구상된 플러그인 모델, 동적 모드, 선언적 사용자 정의 오류를 통한 더 나은 개발자 경험, 사용자 정의 가능한 느슨한 및 엄격한 경로 매핑, TypeBox 0.30 및 WinterCG 프레임워크 상호 운용성 소개. 가능한 것의 경계를 다시 한번 밀어붙입니다.'
      },
      {
        title: 'Elysia로 다음 Prisma 서버 가속화하기',
        href: '/blog/with-prisma',
        cover: 'prism.webp',
        detail: 'Bun 및 Elysia와 함께 Prisma를 지원하면서, 우리는 새로운 수준의 개발자 경험의 시대로 진입하고 있습니다. Prisma를 통해 데이터베이스와의 상호작용을 가속화할 수 있으며, Elysia는 개발자 경험과 성능 측면에서 백엔드 웹 서버 생성을 가속화합니다.'
      },
      {
          title: 'Elysia 0.5 소개 - Radiant',
          href: '/blog/elysia-05',
          cover: 'radiant.webp',
          detail: 'Static Code Analysis, 새로운 라우터 Memoirist, TypeBox 0.28, Numeric 타입, 인라인 스키마, state/decorate/model/group 재작업, 타입 안정성 소개.'
      },
      {
          title: 'Elysia 0.4 소개 - 月夜の音楽会 (Moonlit Night Concert)',
          href: '/blog/elysia-04',
          cover: 'moonlit-night-concert.webp',
          detail: 'Ahead of Time Compilation, TypeBox 0.26, 상태별 Response 검증, Elysia Fn 분리 소개.'
      },
      {
          title: 'Supabase와 함께하는 Elysia. 음속으로 빠른 다음 백엔드',
          href: '/blog/elysia-supabase',
          cover: 'elysia-supabase.webp',
          detail: 'Elysia와 Supabase는 1시간 이내에 프로토타입을 빠르게 개발하는 데 훌륭한 조합입니다. 두 가지의 장점을 어떻게 활용할 수 있는지 살펴봅시다.'
      },
      {
          title: 'Elysia 0.3 소개 - 大地の閾を探して [Looking for Edge of Ground]',
          href: '/blog/elysia-03',
          cover: 'edge-of-ground.webp',
          detail: 'Elysia Fn, 고도로 확장 가능한 TypeScript 성능을 위한 Type 재작업, 파일 업로드 지원 및 검증, Eden Treaty 재작업 소개.'
      },
      {
          title: 'Elysia 0.2 소개 - The Blessing',
          href: '/blog/elysia-02',
          cover: 'blessing.webp',
          detail: 'Elysia 0.2 소개, 주로 TypeScript 성능, 타입 추론, 더 나은 자동 완성 개선 사항과 보일러플레이트를 줄이는 몇 가지 새로운 기능 제공.'
      }
  ]"
/>
