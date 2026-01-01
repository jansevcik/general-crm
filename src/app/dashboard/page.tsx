import prisma from "@/lib/prisma"
import EventsTable from "@/components/events-table"
import QueryBuilder from "@/components/query-builder"

// Force dynamic rendering to prevent build-time DB connection on Vercel
export const dynamic = 'force-dynamic'

interface DashboardPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
    // Build filter based on search params
    // Tier 3: Analytics Engine
    const params = await searchParams
    const where: any = {}

    const field = typeof params.field === 'string' ? params.field : null
    const op = typeof params.op === 'string' ? params.op : null
    const val = typeof params.val === 'string' ? params.val : null

    if (field && op && val) {
        if (op === 'equals') {
            where[field] = val
        } else if (op === 'contains') {
            where[field] = { contains: val, mode: 'insensitive' }
        } else if (op === 'gt') {
            // Handle numeric values for gt/lt
            if (field === 'value') {
                where[field] = { gt: parseFloat(val) }
            }
        } else if (op === 'lt') {
            if (field === 'value') {
                where[field] = { lt: parseFloat(val) }
            }
        }
    }

    const eventsRaw = await prisma.event.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
        include: { apiKey: true },
        where: where
    })

    const events = eventsRaw.map((e: any) => ({
        ...e,
        // Ensure payload is passed as is (Json type handled by client component now)
        payload: e.payload
    }))

    return (
        <div className="space-y-6">
            <QueryBuilder />
            <EventsTable initialEvents={events} />
        </div>
    )
}
