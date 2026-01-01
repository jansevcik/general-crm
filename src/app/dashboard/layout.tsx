import Link from "next/link"
import { signOut } from "@/auth"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-zinc-900">
            <aside className="w-64 bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                        AffiliateCRM
                    </h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        Entries
                    </Link>
                    <Link
                        href="/dashboard/apikeys"
                        className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        API Keys
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <form
                        action={async () => {
                            "use server"
                            await signOut({ redirectTo: "/login" })
                        }}
                    >
                        <button className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Mobile Header placeholder (not implemented for simplicity, relying on hidden md:flex above, but content is visible) */}

            <main className="flex-1 overflow-auto p-8">
                {children}
            </main>
        </div>
    )
}
