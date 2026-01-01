import prisma from "@/lib/prisma"
import ExportButton from "@/components/export-button"

export default async function DashboardPage() {
    const eventsRaw = await prisma.event.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: { apiKey: true }
    })

    const events = eventsRaw.map((e: any) => ({
        ...e,
        // payload: JSON.parse(e.payload) // No longer needed for Postgres/Json type
        payload: e.payload
    }))

    // Extract all unique keys from payloads to build dynamic columns
    const allKeys = new Set<string>()
    events.forEach((event: any) => {
        if (event.payload && typeof event.payload === 'object') {
            Object.keys(event.payload).forEach(k => allKeys.add(k))
        }
    })
    const dynamicColumns = Array.from(allKeys).slice(0, 5) // Limit to 5 dynamic columns for view

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Entries</h2>
                <div className="space-x-2">
                    <ExportButton events={events} />
                </div>
            </div>

            <div className="overflow-hidden bg-white dark:bg-zinc-800 shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-zinc-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Timestamp
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Source
                            </th>
                            {dynamicColumns.map(col => (
                                <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {events.map((event) => (
                            <tr key={event.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {new Date(event.createdAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {event.apiKey.name || event.apiKey.key.substring(0, 8) + '...'}
                                </td>
                                {dynamicColumns.map(col => (
                                    <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {/* @ts-ignore - Payload is Json type */}
                                        {typeof event.payload?.[col] === 'object'
                                            ? JSON.stringify(event.payload?.[col])
                                            : event.payload?.[col]?.toString() || '-'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {events.length === 0 && (
                            <tr>
                                <td colSpan={2 + dynamicColumns.length} className="px-6 py-4 text-center text-gray-500">
                                    No entries found. Send a POST to /api/ingest
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
