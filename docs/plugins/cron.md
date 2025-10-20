---
title: Cron Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Cron Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Plugin for Elysia that adds support for running cronjob in Elysia server. Start by installing the plugin with "bun add @elysiajs/cron".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that adds support for customizing Cross-Origin Resource Sharing behavior. Start by installing the plugin with "bun add @elysiajs/cors".
---

# Cron Plugin

이 플러그인은 Elysia 서버에서 cronjob을 실행하는 기능을 추가합니다.

설치 방법:

```bash
bun add @elysiajs/cron
```

사용 방법:

```typescript twoslash
import { Elysia } from 'elysia'
import { cron } from '@elysiajs/cron'

new Elysia()
	.use(
		cron({
			name: 'heartbeat',
			pattern: '*/10 * * * * *',
			run() {
				console.log('Heartbeat')
			}
		})
	)
	.listen(3000)
```

위 코드는 10초마다 `heartbeat`를 로그로 출력합니다.

## cron

Elysia 서버용 cronjob을 생성합니다.

타입:

```
cron(config: CronConfig, callback: (Instance['store']) => void): this
```

`CronConfig`는 아래 지정된 매개변수를 허용합니다:

### name

`store`에 등록할 작업 이름입니다.

이렇게 하면 지정된 이름으로 cron 인스턴스를 `store`에 등록하며, 나중에 작업을 중지하는 등의 프로세스에서 참조할 수 있습니다.

### pattern

아래와 같이 지정된 [cron 구문](https://en.wikipedia.org/wiki/Cron)으로 작업을 실행할 시간입니다:

```
┌────────────── 초 (선택사항)
│ ┌──────────── 분
│ │ ┌────────── 시
│ │ │ ┌──────── 일
│ │ │ │ ┌────── 월
│ │ │ │ │ ┌──── 요일
│ │ │ │ │ │
* * * * * *
```

[Crontab Guru](https://crontab.guru/)와 같은 도구로 생성할 수 있습니다.

---

이 플러그인은 [cronner](https://github.com/hexagon/croner)를 사용하여 Elysia에 cron 메서드를 확장합니다.

아래는 cronner가 허용하는 설정입니다.

### timezone

유럽/스톡홀름 형식의 시간대입니다.

### startAt

작업의 예약 시작 시간입니다.

### stopAt

작업의 예약 중지 시간입니다.

### maxRuns

최대 실행 횟수입니다.

### catch

트리거된 함수에서 처리되지 않은 오류가 발생해도 실행을 계속합니다.

### interval

실행 사이의 최소 간격(초)입니다.

## Pattern

플러그인을 사용하는 일반적인 패턴을 찾을 수 있습니다.

## cronjob 중지

`store`에 등록된 cronjob 이름에 액세스하여 수동으로 cronjob을 중지할 수 있습니다.

```typescript
import { Elysia } from 'elysia'
import { cron } from '@elysiajs/cron'

const app = new Elysia()
	.use(
		cron({
			name: 'heartbeat',
			pattern: '*/1 * * * * *',
			run() {
				console.log('Heartbeat')
			}
		})
	)
	.get(
		'/stop',
		({
			store: {
				cron: { heartbeat }
			}
		}) => {
			heartbeat.stop()

			return 'Stop heartbeat'
		}
	)
	.listen(3000)
```

## 미리 정의된 패턴

`@elysiajs/cron/schedule`에서 미리 정의된 패턴을 사용할 수 있습니다.

```typescript
import { Elysia } from 'elysia'
import { cron, Patterns } from '@elysiajs/cron'

const app = new Elysia()
	.use(
		cron({
			name: 'heartbeat',
			pattern: Patterns.everySecond(),
			run() {
				console.log('Heartbeat')
			}
		})
	)
	.get(
		'/stop',
		({
			store: {
				cron: { heartbeat }
			}
		}) => {
			heartbeat.stop()

			return 'Stop heartbeat'
		}
	)
	.listen(3000)
```

### 함수

| 함수                                     | 설명                                     |
| ---------------------------------------- | ---------------------------------------- |
| `.everySeconds(2)`                       | 2초마다 작업 실행                        |
| `.everyMinutes(5)`                       | 5분마다 작업 실행                        |
| `.everyHours(3)`                         | 3시간마다 작업 실행                      |
| `.everyHoursAt(3, 15)`                   | 15분에 3시간마다 작업 실행               |
| `.everyDayAt('04:19')`                   | 매일 04:19에 작업 실행                   |
| `.everyWeekOn(Patterns.MONDAY, '19:30')` | 매주 월요일 19:30에 작업 실행            |
| `.everyWeekdayAt('17:00')`               | 월요일부터 금요일까지 매일 17:00에 작업 실행 |
| `.everyWeekendAt('11:00')`               | 토요일과 일요일 11:00에 작업 실행        |

### 함수 별칭에서 상수로

| 함수              | 상수                               |
| ----------------- | ---------------------------------- |
| `.everySecond()`  | EVERY_SECOND                       |
| `.everyMinute()`  | EVERY_MINUTE                       |
| `.hourly()`       | EVERY_HOUR                         |
| `.daily()`        | EVERY_DAY_AT_MIDNIGHT              |
| `.everyWeekday()` | EVERY_WEEKDAY                      |
| `.everyWeekend()` | EVERY_WEEKEND                      |
| `.weekly()`       | EVERY_WEEK                         |
| `.monthly()`      | EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT |
| `.everyQuarter()` | EVERY_QUARTER                      |
| `.yearly()`       | EVERY_YEAR                         |

### 상수

| 상수                                     | 패턴                 |
| ---------------------------------------- | -------------------- |
| `.EVERY_SECOND`                          | `* * * * * *`        |
| `.EVERY_5_SECONDS`                       | `*/5 * * * * *`      |
| `.EVERY_10_SECONDS`                      | `*/10 * * * * *`     |
| `.EVERY_30_SECONDS`                      | `*/30 * * * * *`     |
| `.EVERY_MINUTE`                          | `*/1 * * * *`        |
| `.EVERY_5_MINUTES`                       | `0 */5 * * * *`      |
| `.EVERY_10_MINUTES`                      | `0 */10 * * * *`     |
| `.EVERY_30_MINUTES`                      | `0 */30 * * * *`     |
| `.EVERY_HOUR`                            | `0 0-23/1 * * *`     |
| `.EVERY_2_HOURS`                         | `0 0-23/2 * * *`     |
| `.EVERY_3_HOURS`                         | `0 0-23/3 * * *`     |
| `.EVERY_4_HOURS`                         | `0 0-23/4 * * *`     |
| `.EVERY_5_HOURS`                         | `0 0-23/5 * * *`     |
| `.EVERY_6_HOURS`                         | `0 0-23/6 * * *`     |
| `.EVERY_7_HOURS`                         | `0 0-23/7 * * *`     |
| `.EVERY_8_HOURS`                         | `0 0-23/8 * * *`     |
| `.EVERY_9_HOURS`                         | `0 0-23/9 * * *`     |
| `.EVERY_10_HOURS`                        | `0 0-23/10 * * *`    |
| `.EVERY_11_HOURS`                        | `0 0-23/11 * * *`    |
| `.EVERY_12_HOURS`                        | `0 0-23/12 * * *`    |
| `.EVERY_DAY_AT_1AM`                      | `0 01 * * *`         |
| `.EVERY_DAY_AT_2AM`                      | `0 02 * * *`         |
| `.EVERY_DAY_AT_3AM`                      | `0 03 * * *`         |
| `.EVERY_DAY_AT_4AM`                      | `0 04 * * *`         |
| `.EVERY_DAY_AT_5AM`                      | `0 05 * * *`         |
| `.EVERY_DAY_AT_6AM`                      | `0 06 * * *`         |
| `.EVERY_DAY_AT_7AM`                      | `0 07 * * *`         |
| `.EVERY_DAY_AT_8AM`                      | `0 08 * * *`         |
| `.EVERY_DAY_AT_9AM`                      | `0 09 * * *`         |
| `.EVERY_DAY_AT_10AM`                     | `0 10 * * *`         |
| `.EVERY_DAY_AT_11AM`                     | `0 11 * * *`         |
| `.EVERY_DAY_AT_NOON`                     | `0 12 * * *`         |
| `.EVERY_DAY_AT_1PM`                      | `0 13 * * *`         |
| `.EVERY_DAY_AT_2PM`                      | `0 14 * * *`         |
| `.EVERY_DAY_AT_3PM`                      | `0 15 * * *`         |
| `.EVERY_DAY_AT_4PM`                      | `0 16 * * *`         |
| `.EVERY_DAY_AT_5PM`                      | `0 17 * * *`         |
| `.EVERY_DAY_AT_6PM`                      | `0 18 * * *`         |
| `.EVERY_DAY_AT_7PM`                      | `0 19 * * *`         |
| `.EVERY_DAY_AT_8PM`                      | `0 20 * * *`         |
| `.EVERY_DAY_AT_9PM`                      | `0 21 * * *`         |
| `.EVERY_DAY_AT_10PM`                     | `0 22 * * *`         |
| `.EVERY_DAY_AT_11PM`                     | `0 23 * * *`         |
| `.EVERY_DAY_AT_MIDNIGHT`                 | `0 0 * * *`          |
| `.EVERY_WEEK`                            | `0 0 * * 0`          |
| `.EVERY_WEEKDAY`                         | `0 0 * * 1-5`        |
| `.EVERY_WEEKEND`                         | `0 0 * * 6,0`        |
| `.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT`    | `0 0 1 * *`          |
| `.EVERY_1ST_DAY_OF_MONTH_AT_NOON`        | `0 12 1 * *`         |
| `.EVERY_2ND_HOUR`                        | `0 */2 * * *`        |
| `.EVERY_2ND_HOUR_FROM_1AM_THROUGH_11PM`  | `0 1-23/2 * * *`     |
| `.EVERY_2ND_MONTH`                       | `0 0 1 */2 *`        |
| `.EVERY_QUARTER`                         | `0 0 1 */3 *`        |
| `.EVERY_6_MONTHS`                        | `0 0 1 */6 *`        |
| `.EVERY_YEAR`                            | `0 0 1 1 *`          |
| `.EVERY_30_MINUTES_BETWEEN_9AM_AND_5PM`  | `0 */30 9-17 * * *`  |
| `.EVERY_30_MINUTES_BETWEEN_9AM_AND_6PM`  | `0 */30 9-18 * * *`  |
| `.EVERY_30_MINUTES_BETWEEN_10AM_AND_7PM` | `0 */30 10-19 * * *` |
