'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ExportButton from "@/components/export-button"

interface Event {
    id: string
    createdAt: Date | string
    payload: any
    apiKey: {
        name: string | null
        key: string
    }
}

interface EventsTableProps {
    initialEvents: Event[]
}

export default function EventsTable({ initialEvents }: EventsTableProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // 1. Discover all unique keys from payloads
    const allKeys = useMemo(() => {
        const keys = new Set<string>()
        initialEvents.forEach(event => {
            if (event.payload && typeof event.payload === 'object') {
                Object.keys(event.payload).forEach(k => keys.add(k))
            }
        })
        return Array.from(keys).sort()
    }, [initialEvents])

    // 2. Determine selected keys from URL or default
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])

    useEffect(() => {
        const colsParam = searchParams.get('cols')
        if (colsParam) {
            setSelectedKeys(colsParam.split(','))
        } else {
            // Default: first 5 keys
            setSelectedKeys(allKeys.slice(0, 5))
        }
    }, [searchParams, allKeys])

    // 3. Update URL when selection changes
    const toggleKey = (key: string) => {
        let newKeys: string[]
        if (selectedKeys.includes(key)) {
            newKeys = selectedKeys.filter(k => k !== key)
        } else {
            newKeys = [...selectedKeys, key]
        }
        
        // Optimistic update
        setSelectedKeys(newKeys)

        // Persist to URL
        const params = new URLSearchParams(searchParams.toString())
        if (newKeys.length > 0) {
            params.set('cols', newKeys.join(','))
        } else {
            params.delete('cols')
        }
        router.push(`?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Entries</h2>
                <div className="flex items-center space-x-2">
                    {/* Column Picker */}
                    <details className="relative">
                        <summary className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white dark:border-zinc-700">
                            Customize Columns
                        </summary>
                        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 dark:bg-zinc-800 dark:ring-white/10">
                            <div className="py-1 p-2 max-h-60 overflow-y-auto">
                                {allKeys.map(key => (
                                    <label key={key} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer dark:text-gray-200 dark:hover:bg-zinc-700">
                                        <input
                                            type="checkbox"
                                            className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            checked={selectedKeys.includes(key)}
                                            onChange={() => toggleKey(key)}
                                        />
                                        {key}
                                    </label>
                                ))}
                                {allKeys.length === 0 && (
                                    <span className="block px-4 py-2 text-sm text-gray-500">No dynamic fields found</span>
                                )}
                            </div>
                        </div>
                    </details>
                    
                    <ExportButton events={initialEvents} />
                </div>
            </div>

            <div className="overflow-hidden bg-white dark:bg-zinc-800 shadow sm:rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-zinc-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Timestamp
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Source
                            </th>
                            {selectedKeys.map(col => (
                                <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {initialEvents.map((event) => (
                            <tr key={event.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {new Date(event.createdAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {event.apiKey.name || event.apiKey.key.substring(0, 8) + '...'}
                                </td>
                                {selectedKeys.map(col => (
                                    <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {/* Handle object/array stringification */}
                                        {typeof event.payload?.[col] === 'object' && event.payload?.[col] !== null
                                            ? JSON.stringify(event.payload?.[col])
                                            : event.payload?.[col]?.toString() || '-'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {initialEvents.length === 0 && (
                            <tr>
                                <td colSpan={2 + selectedKeys.length} className="px-6 py-4 text-center text-gray-500">
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
