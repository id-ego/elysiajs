---
title: OpenTelemetry Plugin - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: OpenTelemetry Plugin - ElysiaJS

  - - meta
    - name: 'description'
      content: Plugin for Elysia that adds support for OpenTelemetry. Start by installing the plugin with "bun add @elysiajs/opentelemetry".

  - - meta
    - name: 'og:description'
      content: Plugin for Elysia that adds support for OpenTelemetry. Start by installing the plugin with "bun add @elysiajs/opentelemetry".
---

# OpenTelemetry

::: tip
이 페이지는 **OpenTelemetry**에 대한 **설정 참조**입니다. OpenTelemetry를 설정하고 통합하려면 대신 [Integrate with OpenTelemetry](/integrations/opentelemetry)를 참조하는 것이 좋습니다.
:::

OpenTelemetry를 사용하려면 `@elysiajs/opentelemetry`를 설치하고 모든 인스턴스에 플러그인을 적용하세요.

```typescript twoslash
import { Elysia } from 'elysia'
import { opentelemetry } from '@elysiajs/opentelemetry'

import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'

new Elysia()
	.use(
		opentelemetry({
			spanProcessors: [
				new BatchSpanProcessor(
					new OTLPTraceExporter()
				)
			]
		})
	)
```

![jaeger showing collected trace automatically](/blog/elysia-11/jaeger.webp)

Elysia OpenTelemetry는 **OpenTelemetry 표준과 호환되는 모든 라이브러리의 span을 수집**하고 부모 및 자식 span을 자동으로 적용합니다.

## Usage
사용법 및 유틸리티는 [opentelemetry](/integrations/opentelemetry)를 참조하세요.

## Config
이 플러그인은 OpenTelemetry SDK 매개변수 옵션을 확장합니다.

플러그인에서 허용하는 설정은 다음과 같습니다.

### autoDetectResources - boolean
기본 리소스 감지기를 사용하여 환경에서 리소스를 자동으로 감지합니다.

default: `true`

### contextManager - ContextManager
커스텀 context manager를 사용합니다.

default: `AsyncHooksContextManager`

### textMapPropagator - TextMapPropagator
커스텀 propagator를 사용합니다.

default: W3C Trace Context 및 Baggage를 사용하는 `CompositePropagator`

### metricReader - MetricReader
MeterProvider에 전달될 MetricReader를 추가합니다.

### views - View[]
MeterProvider에 전달될 view 목록입니다.

View 인스턴스의 배열을 허용합니다. 이 매개변수는 히스토그램 메트릭의 명시적 버킷 크기를 구성하는 데 사용할 수 있습니다.

### instrumentations - (Instrumentation | Instrumentation[])[]
계측을 구성합니다.

기본적으로 `getNodeAutoInstrumentations`가 활성화되어 있으며, 활성화하려면 메타패키지를 사용하거나 각 계측을 개별적으로 구성할 수 있습니다.

default: `getNodeAutoInstrumentations()`

### resource - IResource
리소스를 구성합니다.

SDK의 autoDetectResources 메서드를 사용하여 리소스를 감지할 수도 있습니다.

### resourceDetectors - Array<Detector | DetectorSync>
리소스 감지기를 구성합니다. 기본적으로 리소스 감지기는 [envDetector, processDetector, hostDetector]입니다. 참고: 감지를 활성화하려면 매개변수 autoDetectResources가 true여야 합니다.

resourceDetectors가 설정되지 않은 경우 환경 변수 OTEL_NODE_RESOURCE_DETECTORS를 사용하여 특정 감지기만 활성화하거나 완전히 비활성화할 수도 있습니다:

- env
- host
- os
- process
- serviceinstance (experimental)
- all - 위의 모든 리소스 감지기 활성화
- none - 리소스 감지 비활성화

예를 들어 env, host 감지기만 활성화하려면:

```bash
export OTEL_NODE_RESOURCE_DETECTORS="env,host"
```

### sampler - Sampler
커스텀 샘플러를 구성합니다. 기본적으로 모든 trace가 샘플링됩니다.

### serviceName - string
식별할 네임스페이스입니다.

### spanProcessors - SpanProcessor[]
tracer provider에 등록할 span processor 배열입니다.

### traceExporter - SpanExporter
trace exporter를 구성합니다. exporter가 구성되면 `BatchSpanProcessor`와 함께 사용됩니다.

exporter 또는 span processor가 프로그래밍 방식으로 구성되지 않은 경우 이 패키지는 BatchSpanProcessor와 함께 기본 otlp exporter를 http/protobuf 프로토콜로 자동 설정합니다.

### spanLimits - SpanLimits
추적 매개변수를 구성합니다. tracer를 구성하는 데 사용되는 것과 동일한 추적 매개변수입니다.
