---
title: Table of Content - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Table of Content - ElysiaJS

  - - meta
    - name: 'description'
      content: There's no correct or organized way to learn Elysia, however, we recommended completing the essential chapter first as the chapter briefly covers most of Elysia's features and foundation before jumping to other topics that interest you. Once you've completed the essential chapter, you may jump to any topic that interests you. However, we recommended following the order of the chapter as it may reference to previous chapter.

  - - meta
    - property: 'og:description'
      content: There's no correct or organized way to learn Elysia, however, we recommended completing the essential chapter first as the chapter briefly covers most of Elysia's features and foundation before jumping to other topics that interest you. Once you've completed the essential chapter, you may jump to any topic that interests you. However, we recommended following the order of the chapter as it may reference to previous chapter.
---

<script setup>
    import Card from './components/nearl/card.vue'
    import Deck from './components/nearl/card-deck.vue'

	import TutorialLink from './components/xiao/tutorial-link.vue'
</script>

# 목차

Elysia를 배우는 올바른 방법은 없지만, 먼저 **인터랙티브 튜토리얼**을 확인하여 Elysia에 익숙해지는 것을 **강력히 권장**합니다:

<TutorialLink />

<!--### 사전 지식
Elysia의 문서는 초보자 친화적으로 설계되었지만, 문서가 Elysia의 기능에 집중할 수 있도록 기준선을 설정해야 합니다. 새로운 개념을 소개할 때마다 관련 문서 링크를 제공합니다.

문서를 최대한 활용하려면 Node.js와 기본 HTTP에 대한 기본적인 이해가 있는 것이 좋습니다.-->

## 먼저 확인하세요
Elysia를 시작하기 전에 다음 2개 페이지를 먼저 확인하는 것을 강력히 권장합니다:

<Deck>
	<Card title="Key Concept" href="/key-concept">
		Elysia의 핵심 개념과 효과적인 사용 방법
    </Card>
    <Card title="Best Practice" href="/essential/best-practice">
        Elysia 코드 작성을 위한 모범 사례 이해
    </Card>
</Deck>

### llms.txt

또는, <a href="/llms.txt" download>llms.txt</a> 또는 <a href="/llms-full.txt" download>llms-full.txt</a>를 다운로드하여 ChatGPT, Claude 또는 Gemini와 같은 선호하는 LLM에 제공하여 더 인터랙티브한 경험을 얻을 수 있습니다.

<Deck>
    <Card title="llms.txt" href="/llms.txt" download>
   		LLM 프롬프팅을 위한 참조와 함께 Markdown 형식으로 요약된 Elysia 문서 다운로드
    </Card>
    <Card title="llms-full.txt" href="/llms-full.txt" download>
  		LLM 프롬프팅을 위한 단일 파일로 된 Markdown 형식의 전체 Elysia 문서 다운로드
    </Card>
</Deck>

### 막힌 경우

GitHub Discussions, Discord 및 Twitter에서 커뮤니티에 자유롭게 문의하세요.

<Deck>
    <Card title="Discord" href="https://discord.gg/eaFJ2KDJck">
        공식 ElysiaJS Discord 커뮤니티 서버
    </Card>
    <Card title="Twitter" href="https://twitter.com/elysiajs">
        Elysia의 업데이트 및 상태 추적
    </Card>
    <Card title="GitHub" href="https://github.com/elysiajs">
        소스 코드 및 개발
    </Card>
</Deck>

## 다른 프레임워크에서 오셨나요?

Express, Fastify 또는 Hono와 같은 다른 인기 있는 프레임워크를 사용해본 적이 있다면 약간의 차이만 있을 뿐 Elysia가 익숙하게 느껴질 것입니다.

<Deck>
	<Card title="From Express" href="/migrate/from-express">
		tRPC와 Elysia의 비교
	</Card>
    <Card title="From Fastify" href="/migrate/from-fastify">
  		Fastify와 Elysia의 비교
    </Card>
    <Card title="From Hono" href="/migrate/from-hono">
  		tRPC와 Elysia의 비교
    </Card>
    <Card title="From tRPC" href="/migrate/from-trpc">
  		tRPC와 Elysia의 비교
    </Card>
</Deck>

## 핵심 챕터

다음은 Elysia의 기초입니다. 다른 주제로 넘어가기 전에 이 페이지들을 살펴보는 것을 강력히 권장합니다:

<Deck>
	<Card title="Route" href="/essential/route">
  Elysia에서 라우팅이 어떻게 작동하는지 이해
	</Card>
	<Card title="Handler" href="/essential/handler">
  		요청 처리 방법 배우기
	</Card>
	<Card title="Validation" href="/essential/plugin">
		Elysia로 타입 안전성을 강제하는 방법
	</Card>
	<Card title="Lifecycle" href="/essential/plugin">
		다양한 라이프사이클 유형 배우기
	</Card>
	<Card title="Plugin" href="/essential/plugin">
	  	Plugin으로 Elysia를 확장하는 방법 배우기
	</Card>
</Deck>

## 더 많은 패턴

더 많은 Elysia 기능을 탐색하고 싶다면 다음을 확인하세요:

<Deck>
    <Card title="Handler" href="/eden/overview">
    	파일 전송, Server Sent Event 등에 대한 더 많은 패턴
    </Card>
    <Card title="Web Socket" href="/patterns/websocket">
   		Elysia로 실시간 애플리케이션을 만드는 방법 보기
    </Card>
    <Card title="Eden" href="/eden/overview">
    	Eden에 대해 자세히 알아보고 효과적으로 사용하는 방법
    </Card>
    <Card title="Open Telemetry" href="/eden/opentelemetry">
   		Open Telemetry로 애플리케이션을 모니터링하는 방법 배우기
    </Card>
    <Card title="Deploy to Production" href="/patterns/deploys">
    	Elysia를 프로덕션에 배포하는 방법 배우기
    </Card>
</Deck>

## 메타 프레임워크와의 통합

Nextjs, Nuxt, Astro 등과 같은 메타 프레임워크와 함께 Elysia를 사용할 수도 있습니다.

<Deck>
	<Card title="Astro" href="/integrations/astro">
		Astro Endpoint에서의 Elysia
	</Card>
	<Card title="Expo" href="/integrations/expo">
		Expo API Route에서의 Elysia
	</Card>
	<Card title="Nextjs" href="/integrations/nextjs">
		Route Handler에서의 Elysia
	</Card>
	<Card title="Nuxt" href="/integrations/nuxt">
		Nuxt Server Route에서의 Elysia
	</Card>
	<Card title="SvelteKit" href="/integrations/sveltekit">
		SvelteKit Endpoint에서의 Elysia
	</Card>
</Deck>

## 선호하는 도구와의 통합

인기 있는 도구와의 통합이 있습니다:

<Deck>
	<Card title="AI SDK" href="/integrations/ai-sdk">
   		Elysia에서 Vercel AI SDK를 사용하는 방법 배우기
    </Card>
    <Card title="Better Auth" href="/integrations/better-auth">
   		Elysia에서 Better Auth를 사용하는 방법 배우기
    </Card>
    <Card title="Drizzle" href="/integrations/drizzle">
  		Elysia는 Drizzle과 함께 타입 안전 유틸리티를 제공합니다
    </Card>
    <Card title="Prisma" href="/integrations/prisma">
  		Elysia에서 Prisma를 사용하는 방법 배우기
    </Card>
    <Card title="React Email" href="/integrations/react-email">
  		JSX를 사용하여 이메일 템플릿 생성하기
    </Card>
</Deck>

---

Elysia를 우리만큼 사랑하시길 바랍니다!
