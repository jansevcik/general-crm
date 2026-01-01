'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function QueryBuilder() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [field, setField] = useState(searchParams.get('field') || 'email')
    const [operator, setOperator] = useState(searchParams.get('op') || 'equals')
    const [value, setValue] = useState(searchParams.get('val') || '')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams(searchParams.toString())

        if (value) {
            params.set('field', field)
            params.set('op', operator)
            params.set('val', value)
        } else {
            params.delete('field')
            params.delete('op')
            params.delete('val')
        }

        router.push(`?${params.toString()}`)
    }

    const reset = () => {
        setField('email')
        setOperator('equals')
        setValue('')
        router.push('?')
    }

    return (
        <form onSubmit={handleSearch} className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 space-y-4 md:space-y-0 md:flex md:items-end md:space-x-4">
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Field</label>
                <select
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-zinc-800 dark:border-zinc-700"
                >
                    <option value="email">Email</option>
                    <option value="source">Source</option>
                    <option value="campaign">Campaign</option>
                    <option value="medium">Medium</option>
                    <option value="affiliateId">Affiliate ID</option>
                    <option value="value">Value</option>
                    <option value="status">Event Type</option>
                </select>
            </div>

            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Operator</label>
                <select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-zinc-800 dark:border-zinc-700"
                >
                    <option value="equals">Equals (=)</option>
                    <option value="contains">Contains (LIKE)</option>
                    <option value="gt">Greater Than (&gt;)</option>
                    <option value="lt">Less Than (&lt;)</option>
                </select>
            </div>

            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value</label>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Search value..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-zinc-800 dark:border-zinc-700"
                />
            </div>

            <div className="flex space-x-2">
                <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Filter
                </button>
                {searchParams.has('val') && (
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-white dark:border-zinc-600 dark:hover:bg-zinc-700"
                    >
                        Reset
                    </button>
                )}
            </div>
        </form>
    )
}
