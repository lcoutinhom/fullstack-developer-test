import { Link, router, usePage } from "@inertiajs/react"
import { ReactNode, useEffect, useState } from "react"

type CurrentUser = {
  id: number
  full_name: string
  email: string
  role: "user" | "admin"
} | null

type LayoutPageProps = {
  current_user: CurrentUser
  flash: { notice?: string; alert?: string }
}

export default function Layout({ children }: { children: ReactNode }) {
  const { current_user: currentUser, flash } = usePage<LayoutPageProps>().props
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setDismissed(false)
  }, [flash.notice, flash.alert])

  function handleLogout() {
    router.delete("/session")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="text-lg font-semibold text-gray-900">
            Umanni Users
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            {currentUser?.role === "admin" && (
              <>
                <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link href="/admin/users" className="text-gray-600 hover:text-gray-900">
                  Users
                </Link>
              </>
            )}

            {currentUser ? (
              <>
                <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                  {currentUser.full_name}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-700 hover:bg-gray-200"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/session/new" className="text-gray-600 hover:text-gray-900">
                  Sign in
                </Link>
                <Link
                  href="/registration/new"
                  className="rounded-md bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {!dismissed && (flash.notice || flash.alert) && (
        <div className="mx-auto mt-4 max-w-5xl px-4 sm:px-6">
          <div
            className={
              "flex items-start justify-between rounded-md px-4 py-3 text-sm " +
              (flash.alert ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800")
            }
          >
            <span>{flash.alert || flash.notice}</span>
            <button type="button" onClick={() => setDismissed(true)} className="ml-4 font-medium">
              Dismiss
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  )
}
