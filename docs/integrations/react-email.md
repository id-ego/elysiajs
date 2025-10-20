---
title: React Email - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: React Email - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia는 Bun을 런타임 환경으로 사용하므로, React Email을 직접 사용하고 JSX를 코드에 직접 가져와서 이메일을 보낼 수 있습니다.

  - - meta
    - name: 'og:description'
      content: Elysia는 Bun을 런타임 환경으로 사용하므로, React Email을 직접 사용하고 JSX를 코드에 직접 가져와서 이메일을 보낼 수 있습니다.
---

# React Email
React Email은 React 컴포넌트를 사용하여 이메일을 생성할 수 있게 해주는 라이브러리입니다.

Elysia는 Bun을 런타임 환경으로 사용하므로, React Email 컴포넌트를 직접 작성하고 JSX를 코드에 직접 가져와서 이메일을 보낼 수 있습니다.

## 설치
React Email을 설치하려면 다음 명령을 실행하세요:

```bash
bun add -d react-email
bun add @react-email/components react react-dom
```

그런 다음 `package.json`에 다음 스크립트를 추가하세요:
```json
{
  "scripts": {
    "email": "email dev --dir src/emails"
  }
}
```

`src/emails` 디렉토리에 이메일 템플릿을 추가하는 것을 권장합니다. JSX 파일을 직접 가져올 수 있기 때문입니다.

### TypeScript
TypeScript를 사용하는 경우 `tsconfig.json`에 다음을 추가해야 할 수 있습니다:

```json
{
  "compilerOptions": {
	"jsx": "react"
  }
}
```

## 첫 번째 이메일
다음 코드로 `src/emails/otp.tsx` 파일을 생성하세요:

```tsx
import * as React from 'react'
import { Tailwind, Section, Text } from '@react-email/components'

export default function OTPEmail({ otp }: { otp: number }) {
    return (
        <Tailwind>
            <Section className="flex justify-center items-center w-full min-h-screen font-sans">
                <Section className="flex flex-col items-center w-76 rounded-2xl px-6 py-1 bg-gray-50">
                    <Text className="text-xs font-medium text-violet-500">
                        Verify your Email Address
                    </Text>
                    <Text className="text-gray-500 my-0">
                        Use the following code to verify your email address
                    </Text>
                    <Text className="text-5xl font-bold pt-2">{otp}</Text>
                    <Text className="text-gray-400 font-light text-xs pb-4">
                        This code is valid for 10 minutes
                    </Text>
                    <Text className="text-gray-600 text-xs">
                        Thank you for joining us
                    </Text>
                </Section>
            </Section>
        </Tailwind>
    )
}

OTPEmail.PreviewProps = {
    otp: 123456
}
```

`@react-email/components`를 사용하여 이메일 템플릿을 생성하고 있음을 알 수 있습니다.

이 라이브러리는 Gmail, Outlook 등의 이메일 클라이언트와 호환되는 **Tailwind로 스타일링**을 포함한 컴포넌트 세트를 제공합니다.

또한 `OTPEmail` 함수에 `PreviewProps`를 추가했습니다. 이는 플레이그라운드에서 이메일을 미리 볼 때만 적용됩니다.

## 이메일 미리보기
이메일을 미리 보려면 다음 명령을 실행하세요:

```bash
bun email
```

이것은 이메일 미리보기와 함께 브라우저 창을 엽니다.

![React Email playground showing an OTP email we have just written](/recipe/react-email/email-preview.webp)

## 이메일 보내기
이메일을 보내려면 `react-dom/server`를 사용하여 이메일을 렌더링한 다음 선호하는 제공업체를 사용하여 제출할 수 있습니다:

::: code-group

```tsx [Nodemailer]
import { Elysia, t } from 'elysia'

import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import OTPEmail from './emails/otp'

import nodemailer from 'nodemailer' // [!code ++]

const transporter = nodemailer.createTransport({ // [!code ++]
  	host: 'smtp.gehenna.sh', // [!code ++]
  	port: 465, // [!code ++]
  	auth: { // [!code ++]
  		user: 'makoto', // [!code ++]
  		pass: '12345678' // [!code ++]
  	} // [!code ++]
}) // [!code ++]

new Elysia()
	.get('/otp', async ({ body }) => {
		// Random between 100,000 and 999,999
  		const otp = ~~(Math.random() * (900_000 - 1)) + 100_000

		const html = renderToStaticMarkup(<OTPEmail otp={otp} />)

        await transporter.sendMail({ // [!code ++]
        	from: 'ibuki@gehenna.sh', // [!code ++]
           	to: body, // [!code ++]
           	subject: 'Verify your email address', // [!code ++]
            html, // [!code ++]
        }) // [!code ++]

        return { success: true }
	}, {
		body: t.String({ format: 'email' })
	})
	.listen(3000)
```

``` tsx [Resend]
import { Elysia, t } from 'elysia'

import OTPEmail from './emails/otp'

import Resend from 'resend' // [!code ++]

const resend = new Resend('re_123456789') // [!code ++]

new Elysia()
	.get('/otp', ({ body }) => {
		// Random between 100,000 and 999,999
  		const otp = ~~(Math.random() * (900_000 - 1)) + 100_000

        await resend.emails.send({ // [!code ++]
        	from: 'ibuki@gehenna.sh', // [!code ++]
           	to: body, // [!code ++]
           	subject: 'Verify your email address', // [!code ++]
            html: <OTPEmail otp={otp} />, // [!code ++]
        }) // [!code ++]

        return { success: true }
	}, {
		body: t.String({ format: 'email' })
	})
	.listen(3000)
```

```tsx [AWS SES]
import { Elysia, t } from 'elysia'

import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import OTPEmail from './emails/otp'

import { type SendEmailCommandInput, SES } from '@aws-sdk/client-ses' // [!code ++]
import { fromEnv } from '@aws-sdk/credential-providers' // [!code ++]

const ses = new SES({ // [!code ++]
    credentials: // [!code ++]
        process.env.NODE_ENV === 'production' ? fromEnv() : undefined // [!code ++]
}) // [!code ++]

new Elysia()
	.get('/otp', ({ body }) => {
		// Random between 100,000 and 999,999
  		const otp = ~~(Math.random() * (900_000 - 1)) + 100_000

		const html = renderToStaticMarkup(<OTPEmail otp={otp} />)

        await ses.sendEmail({ // [!code ++]
            Source: 'ibuki@gehenna.sh', // [!code ++]
            Destination: { // [!code ++]
                ToAddresses: [body] // [!code ++]
            }, // [!code ++]
            Message: { // [!code ++]
                Body: { // [!code ++]
                    Html: { // [!code ++]
                        Charset: 'UTF-8', // [!code ++]
                        Data: html // [!code ++]
                    } // [!code ++]
                }, // [!code ++]
                Subject: { // [!code ++]
                    Charset: 'UTF-8', // [!code ++]
                    Data: 'Verify your email address' // [!code ++]
                } // [!code ++]
            } // [!code ++]
        } satisfies SendEmailCommandInput) // [!code ++]

        return { success: true }
	}, {
		body: t.String({ format: 'email' })
	})
	.listen(3000)
```

``` tsx [Sendgrid]
import { Elysia, t } from 'elysia'

import OTPEmail from './emails/otp'

import sendgrid from "@sendgrid/mail" // [!code ++]

sendgrid.setApiKey(process.env.SENDGRID_API_KEY) // [!code ++]

new Elysia()
	.get('/otp', ({ body }) => {
		// Random between 100,000 and 999,999
  		const otp = ~~(Math.random() * (900_000 - 1)) + 100_000

    	const html = renderToStaticMarkup(<OTPEmail otp={otp} />)

        await sendgrid.send({ // [!code ++]
        	from: 'ibuki@gehenna.sh', // [!code ++]
           	to: body, // [!code ++]
           	subject: 'Verify your email address', // [!code ++]
            html // [!code ++]
        }) // [!code ++]

        return { success: true }
	}, {
		body: t.String({ format: 'email' })
	})
	.listen(3000)
```

:::

::: tip
Bun 덕분에 이메일 컴포넌트를 바로 가져올 수 있습니다
:::

React Email과의 사용 가능한 모든 통합은 [React Email Integration](https://react.email/docs/integrations/overview)에서 확인할 수 있으며, React Email에 대한 자세한 내용은 [React Email 문서](https://react.email/docs)에서 확인할 수 있습니다.
