---
title: What's Next - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: What's Next - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Congratulations! You have completed the tutorial. Now you're ready to build your own application with Elysia! We highly recommended you to check out these 2 pages first before getting started with Elysia. Key Concept and Best Practice. Alternatively, you can download llms.txt or llms-full.txt and feed it to your favorite LLMs like ChatGPT, Claude or Gemini to get a more interactive experience. If you are stuck, feel free to ask our community on GitHub Discussions, Discord, and Twitter. If you have used other popular frameworks like Express, Fastify, or Hono, you will find Elysia right at home with just a few differences. We also have essential chapters, more patterns, integration with Meta Framework and your favorite tool.

    - - meta
      - property: 'og:description'
        content: Congratulations! You have completed the tutorial. Now you're ready to build your own application with Elysia! We highly recommended you to check out these 2 pages first before getting started with Elysia. Key Concept and Best Practice. Alternatively, you can download llms.txt or llms-full.txt and feed it to your favorite LLMs like ChatGPT, Claude or Gemini to get a more interactive experience. If you are stuck, feel free to ask our community on GitHub Discussions, Discord, and Twitter. If you have used other popular frameworks like Express, Fastify, or Hono, you will find Elysia right at home with just a few differences. We also have essential chapters, more patterns, integration with Meta Framework and your favorite tool.
---

<script setup lang="ts">
import Editor from '../components/xiao/playground/playground.vue'

import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'

import { code } from './data'
</script>

<Editor :code="code">

# Congratulations!

튜토리얼을 완료했습니다.

이제 Elysia로 자신만의 애플리케이션을 만들 준비가 되었습니다!

## First up
Elysia를 시작하기 전에 다음 2개 페이지를 먼저 확인하는 것을 강력히 권장합니다:

<Deck>
	<Card title="Key Concept" href="/key-concept">
		Elysia의 핵심 개념과 효과적인 사용 방법
    </Card>
    <Card title="Best Practice" href="/essential/best-practice">
        Elysia 코드를 작성하는 모범 사례 이해하기
    </Card>
</Deck>

### llms.txt

또는 <a href="/llms.txt" download>llms.txt</a> 또는 <a href="/llms-full.txt" download>llms-full.txt</a>를 다운로드하여 ChatGPT, Claude 또는 Gemini와 같은 좋아하는 LLM에 제공하여 더 인터랙티브한 경험을 얻을 수 있습니다.

<Deck>
    <Card title="llms.txt" href="/llms.txt" download>
   		LLM 프롬프팅을 위한 참조가 포함된 Markdown 형식의 요약된 Elysia 문서 다운로드
    </Card>
    <Card title="llms-full.txt" href="/llms-full.txt" download>
  		LLM 프롬프팅을 위한 단일 파일 Markdown 형식의 전체 Elysia 문서 다운로드
    </Card>
</Deck>

### If you are stuck

GitHub Discussions, Discord, Twitter에서 커뮤니티에 자유롭게 질문하세요.

<Deck>
    <Card title="Discord" href="https://discord.gg/eaFJ2KDJck">
        공식 ElysiaJS 디스코드 커뮤니티 서버
    </Card>
    <Card title="Twitter" href="https://twitter.com/elysiajs">
        Elysia의 업데이트 및 상태 추적
    </Card>
    <Card title="GitHub" href="https://github.com/elysiajs">
        소스 코드 및 개발
    </Card>
</Deck>

## From other Framework?

Express, Fastify, Hono와 같은 다른 인기 있는 프레임워크를 사용해본 적이 있다면 약간의 차이점만 있을 뿐 Elysia가 매우 친숙하게 느껴질 것입니다.

<Deck>
	<Card title="From Express" href="/migrate/from-express">
		tRPC와 Elysia 비교
	</Card>
    <Card title="From Fastify" href="/migrate/from-fastify">
  		Fastify와 Elysia 비교
    </Card>
    <Card title="From Hono" href="/migrate/from-hono">
  		tRPC와 Elysia 비교
    </Card>
    <Card title="From tRPC" href="/migrate/from-trpc">
  		tRPC와 Elysia 비교
    </Card>
</Deck>

## Essential Chapter

다음은 Elysia의 기초입니다. 다른 주제로 넘어가기 전에 이 페이지들을 살펴보는 것을 강력히 권장합니다:

<Deck>
	<Card title="Route" href="/essential/route">
  Elysia에서 라우팅이 작동하는 방식 이해하기
	</Card>
	<Card title="Handler" href="/essential/handler">
  		요청을 처리하는 방법 배우기
	</Card>
	<Card title="Validation" href="/essential/plugin">
		Elysia로 타입 안전성을 강제하는 방법
	</Card>
	<Card title="Lifecycle" href="/essential/plugin">
		다양한 유형의 라이프사이클 배우기
	</Card>
	<Card title="Plugin" href="/essential/plugin">
	  	Plugin으로 Elysia를 확장하는 방법 배우기
	</Card>
</Deck>

## More Patterns

더 많은 Elysia 기능을 탐색하고 싶다면 다음을 확인하세요:

<Deck>
    <Card title="Handler" href="/eden/overview">
    	파일 전송, Server Sent Event 등에 대한 더 많은 패턴
    </Card>
    <Card title="Web Socket" href="/patterns/websocket">
   		Elysia로 실시간 애플리케이션을 만드는 방법 보기
    </Card>
    <Card title="Eden" href="/eden/overview">
    	Eden에 대해 더 알아보고 효과적으로 사용하는 방법
    </Card>
    <Card title="Open Telemetry" href="/eden/opentelemetry">
   		Open Telemetry로 애플리케이션을 모니터링하는 방법 배우기
    </Card>
    <Card title="Deploy to Production" href="/patterns/deploys">
    	Elysia를 프로덕션에 배포하는 방법 배우기
    </Card>
</Deck>

## Integration with Meta Framework

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

## Integration with your favorite tool

인기 있는 도구와의 몇 가지 통합이 있습니다:

<Deck>
	<Card title="AI SDK" href="/integrations/ai-sdk">
   		Elysia와 함께 Vercel AI SDK를 사용하는 방법 배우기
    </Card>
    <Card title="Better Auth" href="/integrations/better-auth">
   		Elysia와 함께 Better Auth를 사용하는 방법 배우기
    </Card>
    <Card title="Drizzle" href="/integrations/drizzle">
  		Elysia는 Drizzle과 함께 타입 안전 유틸리티를 제공합니다
    </Card>
    <Card title="Prisma" href="/integrations/prisma">
  		Elysia와 함께 Prisma를 사용하는 방법 배우기
    </Card>
    <Card title="React Email" href="/integrations/react-email">
  		JSX를 사용하여 이메일 템플릿 만들기
    </Card>
</Deck>

<br>

---

Elysia를 저희만큼 사랑해주시길 바랍니다!

</Editor>
