<script setup>
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'
</script>

<Deck>
    <Card title="핵심 개념 (5분)" href="/key-concept">
    	Elysia의 핵심 개념과 사용 방법.
    </Card>
</Deck>

# 다른 프레임워크와의 비교

Elysia는 직관적이고 사용하기 쉽게 설계되었으며, 특히 다른 웹 프레임워크에 익숙한 사람들에게 적합합니다.

Express, Fastify 또는 Hono와 같은 다른 인기 있는 프레임워크를 사용해본 적이 있다면, 몇 가지 차이점만 있을 뿐 Elysia를 쉽게 사용할 수 있습니다.

<Deck>
	<Card title="Express에서 마이그레이션" href="/migrate/from-express">
		tRPC와 Elysia 비교
	</Card>
    <Card title="Fastify에서 마이그레이션" href="/migrate/from-fastify">
  		Fastify와 Elysia 비교
    </Card>
    <Card title="Hono에서 마이그레이션" href="/migrate/from-hono">
  		tRPC와 Elysia 비교
    </Card>
    <Card title="tRPC에서 마이그레이션" href="/migrate/from-trpc">
  		tRPC와 Elysia 비교
    </Card>
</Deck>
