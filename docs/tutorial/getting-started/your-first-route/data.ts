import { Testcases } from '../../../components/xiao/playground/types'

export const code = `import { Elysia } from 'elysia'

new Elysia()
	.get('/', 'Hello Elysia!')
	.listen(3000)
`

export const testcases = [
    {
        title: 'Static Route',
        description:
            'Create a static route "/elysia" with response "Hello Elysia!"',
        test: {
            request: {
                url: '/elysia'
            },
            response: {
                body: 'Hello Elysia!'
            }
        }
    },
    {
        title: 'Dynamic Route',
        description:
            'Create a dynamic route "/friends/:name" with response "Hello ${name}!"',
        test: {
            request: {
                url: '/friends/Eden'
            },
            response: {
                body: 'Hello Eden!'
            }
        }
    },
    {
        title: 'Optional Dynamic Route',
        description: 'modify "/friends/:name" to accept optional parameter',
        test: {
            request: {
                url: '/friends'
            },
            response: {
                status: 200
            }
        }
    },
    {
        title: 'Wildcard Route',
        description:
            'Create a wildcard route "/flame-chasers/*" with response of anything',
        test: {
            request: {
                url: '/flame-chasers/kevin'
            },
            response: {
                status: 200
            }
        }
    }
] satisfies Testcases
