import { defineLoader } from 'vitepress'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export interface Sponsor {
    sponsorEntity: {
        login: string
        name: string
        avatarUrl: string
    }
    createdAt: string
    tier: {
        isOneTime: boolean
        isCustomAmount: boolean
        monthlyPriceInDollars: number
    }
    duration: string
}

export interface GoldSponsorDetail {
    url: string
    caption: string
}

declare const data: Sponsor[]
export { data }

// Key is sponsorEntity.login
export const goldSponsorDetail: Record<
    string,
    Sponsor['sponsorEntity']['login']
> = {}

// Sponsors contact to not be displayed
// although you will be able to see it here
// but you won't see the duration, and tier
const hidden = ['l2D']

export default defineLoader({
    async load(): Promise<Sponsor[]> {
        try {
            // Return empty array if GITHUB_TOKEN is not set (development mode)
            if (!process.env.GITHUB_TOKEN)
                return []

            const result = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    Authorization: `bearer ${process.env.GITHUB_TOKEN}`
                },
                body: JSON.stringify({
                    query: `query {
	                  user(login: "saltyaom") {
	                    sponsorshipsAsMaintainer(
	                        first: 100,
							activeOnly: true
	                    ) {
	                      nodes {
	                        sponsorEntity {
	                          ... on User {
	                            login
	                            name
	                            avatarUrl
	                          }
	                          ... on Organization {
	                            login
	                            name
	                            avatarUrl
	                          }
	                        }
	                        createdAt
	                        tier {
	                          isOneTime
	                          isCustomAmount
	                          monthlyPriceInDollars
	                        }
	                      }
	                    }
	                  }
	                }`
                })
            }).then((x) => x.json())

            const data: Sponsor[] =
                result.data?.user?.sponsorshipsAsMaintainer?.nodes || []

            return data
                .filter((x) => !x.tier.isOneTime && !hidden.includes(x.sponsorEntity.login))
                .sort(
                    (a, b) =>
                        b?.tier?.monthlyPriceInDollars -
                            a?.tier?.monthlyPriceInDollars ||
                        new Date(a?.createdAt).getTime() -
                            new Date(b?.createdAt).getTime()
                )
                .map((sponsor) => ({
                    ...sponsor,
                    duration: dayjs()
                        .from(dayjs(sponsor.createdAt))
                        .replace('in', 'for')
                }))
        } catch (error) {
            console.warn('Fetch sponsors error')
            console.warn(error)

            return []
        }
    }
})
