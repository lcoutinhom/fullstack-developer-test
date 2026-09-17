import { Link, router, useForm } from "@inertiajs/react"
import { ReactElement, SubmitEvent } from "react"
import Layout from "../../../components/Layout"
import { inputClass, linkClass, primaryButtonClass, secondaryButtonClass } from "../../../components/styles"

type User = {
  id: number
  full_name: string
  email: string
  role: string
}

type Pagination = {
  page: number
  pages: number
  count: number
}

function Index({
  users,
  pagination,
  q,
}: {
  users: User[]
  pagination: Pagination
  q: string | null
}) {
  const { data, setData, get } = useForm({ q: q || "" })

  function handleSearch(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    get("/admin/users", { preserveState: true })
  }

  function handleToggleRole(user: User) {
    router.patch(`/admin/users/${user.id}/toggle_role`, {}, { preserveScroll: true })
  }

  function handleDelete(user: User) {
    if (confirm(`Delete ${user.full_name}?`)) {
      router.delete(`/admin/users/${user.id}`, { preserveScroll: true })
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <div className="flex items-center gap-3">
          <Link href="/admin/imports/new" className={secondaryButtonClass}>
            Import users
          </Link>
          <Link href="/admin/users/new" className={primaryButtonClass}>
            New user
          </Link>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mt-6 flex max-w-sm gap-2">
        <input
          type="search"
          placeholder="Search by name or email"
          className={inputClass}
          value={data.q}
          onChange={(event) => setData("q", event.target.value)}
        />
        <button type="submit" className={secondaryButtonClass}>
          Search
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Role</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 text-sm text-gray-900">{user.full_name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                <td className="px-4 py-3 text-sm capitalize text-gray-500">{user.role}</td>
                <td className="px-4 py-3 text-right text-sm">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/users/${user.id}/edit`} className={linkClass}>
                      Edit
                    </Link>
                    <button type="button" onClick={() => handleToggleRole(user)} className={linkClass}>
                      Make {user.role === "admin" ? "user" : "admin"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(user)}
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Page {pagination.page} of {pagination.pages} ({pagination.count} users)
      </p>
    </div>
  )
}

Index.layout = (page: ReactElement) => <Layout>{page}</Layout>

export default Index
