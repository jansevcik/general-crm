import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"

// Force dynamic rendering to prevent build-time DB connection on Vercel
export const dynamic = 'force-dynamic'

export default async function ApiKeysPage() {
    const keys = await prisma.apiKey.findMany({ orderBy: { createdAt: 'desc' } })

    async function createKey(formData: FormData) {
        "use server"
        const name = formData.get("name") as string
        const key = randomUUID()
        await prisma.apiKey.create({
            data: { name, key }
        })
        revalidatePath("/dashboard/apikeys")
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Keys</h2>

            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New Key</h3>
                <form action={createKey} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <input
                            id="name"
                            name="name"
                            required
                            placeholder="e.g. Affiliate Shop A"
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:bg-zinc-900 dark:border-gray-700 bg-white px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm transition-colors">
                        Generate Key
                    </button>
                </form>
            </div>

            <div className="overflow-hidden bg-white dark:bg-zinc-800 shadow sm:rounded-lg">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {keys.map((k) => (
                        <li key={k.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{k.name}</p>
                                <code className="mt-1 inline-block bg-gray-100 dark:bg-zinc-900 px-2 py-1 rounded text-sm text-gray-600 dark:text-gray-300 font-mono select-all">
                                    {k.key}
                                </code>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${k.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800'}`}>
                                    {k.isActive ? 'Active' : 'Revoked'}
                                </span>
                            </div>
                        </li>
                    ))}
                    {keys.length === 0 && (
                        <li className="p-8 text-center text-gray-500 dark:text-gray-400">
                            No API keys found. Create one to start ingesting data.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}
