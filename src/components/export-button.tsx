"use client"

import { useState } from "react"

export default function ExportButton({ events }: { events: any[] }) {
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = () => {
        setIsExporting(true)
        try {
            // 1. Flatten Data
            const flattened = events.map(e => {
                const payload = (typeof e.payload === 'object' && e.payload) ? e.payload : {}
                return {
                    id: e.id,
                    createdAt: e.createdAt,
                    source: e.apiKey?.name || e.apiKeyId,
                    ...payload
                }
            })

            // 2. Get All Headers
            const headers = new Set<string>()
            flattened.forEach(row => Object.keys(row).forEach(k => headers.add(k)))
            const headerArray = Array.from(headers)

            // 3. Generate CSV
            const csvContent = [
                headerArray.join(","),
                ...flattened.map(row => headerArray.map(fieldName => {
                    const val = row[fieldName] ?? ""
                    // Escape quotes and commas
                    const stringVal = String(val).replace(/"/g, '""')
                    return `"${stringVal}"`
                }).join(","))
            ].join("\n")

            // 4. Download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement("a")
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob)
                link.setAttribute("href", url)
                link.setAttribute("download", "crm_export.csv")
                link.style.visibility = 'hidden'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
        } catch (err) {
            console.error("Export failed", err)
            alert("Export failed")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
            {isExporting ? 'Exporting...' : 'Export CSV'}
        </button>
    )
}
