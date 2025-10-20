---
title: Trace - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Trace - ElysiaJS

    - - meta
      - name: 'description'
        content: Trace is an API to measure the performance of your server. It allows you to interact with the duration span of each life-cycle event and measure the performance of each function to identify performance bottlenecks of the server.

    - - meta
      - name: 'og:description'
        content: Trace is an API to measure the performance of your server. It allows you to interact with the duration span of each life-cycle event and measure the performance of each function to identify performance bottlenecks of the server.
---

# Trace

성능은 Elysia에게 중요한 측면입니다.

우리는 벤치마킹 목적으로 빠른 것을 원하는 것이 아니라 실제 시나리오에서 진짜 빠른 서버를 원합니다.

앱의 속도를 늦출 수 있는 많은 요인이 있으며 이를 식별하기 어렵지만 **trace**는 각 life-cycle에 시작 및 중지 코드를 주입하여 이 문제를 해결하는 데 도움이 될 수 있습니다.

Trace를 사용하면 각 life-cycle 이벤트의 전후에 코드를 주입하고 함수 실행을 차단하고 상호 작용할 수 있습니다.

::: warning
trace는 dynamic mode `aot: false`와 작동하지 않습니다. 함수가 컴파일 시간에 정적이고 알려져 있어야 하며 그렇지 않으면 성능에 큰 영향을 미칩니다.
:::

## Trace
Trace는 callback 리스너를 사용하여 callback 함수가 다음 lifecycle 이벤트로 이동하기 전에 완료되도록 합니다.

`trace`를 사용하려면 Elysia 인스턴스에서 `trace` 메서드를 호출하고 각 life-cycle 이벤트에 대해 실행될 callback 함수를 전달해야 합니다.

lifecycle 이름 앞에 `on` 접두사를 추가하여 각 lifecycle을 수신할 수 있습니다. 예를 들어 `handle` 이벤트를 수신하려면 `onHandle`을 사용합니다.

```ts twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
    .trace(async ({ onHandle }) => {
	    onHandle(({ begin, onStop }) => {
			onStop(({ end }) => {
        		console.log('handle took', end - begin, 'ms')
			})
	    })
    })
    .get('/', () => 'Hi')
    .listen(3000)
```

자세한 내용은 [Life Cycle Events](/essential/life-cycle#events)를 참조하세요:

![Elysia Life Cycle](/assets/lifecycle-chart.svg)

## Children
`handle`을 제외한 모든 이벤트에는 각 lifecycle 이벤트 내에서 실행되는 이벤트 배열인 children이 있습니다.

`onEvent`를 사용하여 순서대로 각 child 이벤트를 수신할 수 있습니다

```ts twoslash
import { Elysia } from 'elysia'

const sleep = (time = 1000) =>
    new Promise((resolve) => setTimeout(resolve, time))

const app = new Elysia()
    .trace(async ({ onBeforeHandle }) => {
        onBeforeHandle(({ total, onEvent }) => {
            console.log('total children:', total)

            onEvent(({ onStop }) => {
                onStop(({ elapsed }) => {
                    console.log('child took', elapsed, 'ms')
                })
            })
        })
    })
    .get('/', () => 'Hi', {
        beforeHandle: [
            function setup() {},
            async function delay() {
                await sleep()
            }
        ]
    })
    .listen(3000)
```

이 예제에서 total children은 `beforeHandle` 이벤트에 2개의 children이 있으므로 `2`가 됩니다.

그런 다음 `onEvent`를 사용하여 각 child 이벤트를 수신하고 각 child 이벤트의 duration을 출력합니다.

## Trace Parameter
각 lifecycle이 호출될 때

```ts twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
	// 이것은 trace parameter입니다
	// hover하여 타입을 확인하세요
	.trace((parameter) => {
	})
	.get('/', () => 'Hi')
	.listen(3000)
```

`trace`는 다음 매개변수를 받습니다:

### id - `number`
각 요청에 대해 무작위로 생성된 고유 id

### context - `Context`
Elysia의 [Context](/essential/handler.html#context), 예: `set`, `store`, `query`, `params`

### set - `Context.set`
`context.set`의 바로 가기, context의 헤더 또는 status를 설정합니다

### store - `Singleton.store`
`context.store`의 바로 가기, context에서 데이터에 액세스합니다

### time - `number`
요청이 호출된 시간의 타임스탬프

### on[Event] - `TraceListener`
각 life-cycle 이벤트에 대한 이벤트 리스너입니다.

다음 life-cycle을 수신할 수 있습니다:
-   **onRequest** - 모든 새 요청에 대한 알림
-   **onParse** - body를 파싱하는 함수 배열
-   **onTransform** - 검증 전에 요청과 context를 변환
-   **onBeforeHandle** - 메인 핸들러 전에 확인할 커스텀 요구 사항, 응답이 반환되면 메인 핸들러를 건너뛸 수 있습니다.
-   **onHandle** - 경로에 할당된 함수
-   **onAfterHandle** - 클라이언트에 보내기 전에 응답과 상호 작용
-   **onMapResponse** - 반환된 값을 Web Standard Response로 매핑
-   **onError** - 요청 처리 중 발생한 오류 처리
-   **onAfterResponse** - 응답이 전송된 후 정리 함수

## Trace Listener
각 life-cycle 이벤트에 대한 리스너

```ts twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
	.trace(({ onBeforeHandle }) => {
		// 이것은 trace listener입니다
		// hover하여 타입을 확인하세요
		onBeforeHandle((parameter) => {

		})
	})
	.get('/', () => 'Hi')
	.listen(3000)
```

각 lifecycle 리스너는 다음을 받습니다

### name - `string`
함수의 이름, 함수가 익명인 경우 이름은 `anonymous`가 됩니다

### begin - `number`
함수가 시작된 시간

### end - `Promise<number>`
함수가 종료된 시간, 함수가 종료되면 resolve됩니다

### error - `Promise<Error | null>`
lifecycle에서 발생한 오류, 함수가 종료되면 resolve됩니다

### onStop - `callback?: (detail: TraceEndDetail) => any`
lifecycle이 종료될 때 실행될 callback

```ts twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
	.trace(({ onBeforeHandle, set }) => {
		onBeforeHandle(({ onStop }) => {
			onStop(({ elapsed }) => {
				set.headers['X-Elapsed'] = elapsed.toString()
			})
		})
	})
	.get('/', () => 'Hi')
	.listen(3000)
```

다음 lifecycle 이벤트로 이동하기 전에 context가 성공적으로 변경되도록 하는 잠금 메커니즘이 있으므로 이 함수에서 context를 변경하는 것이 좋습니다

## TraceEndDetail
`onStop` callback에 전달되는 매개변수

### end - `number`
함수가 종료된 시간

### error - `Error | null`
lifecycle에서 발생한 오류

### elapsed - `number`
lifecycle의 경과 시간 또는 `end - begin`
