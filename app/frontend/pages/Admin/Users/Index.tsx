import { Link, router, useForm } from "@inertiajs/react"
import { SubmitEvent } from "react"

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

export default function Index({
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
      <h1>Users</h1>

      <Link href="/admin/users/new">New user</Link>
      <Link href="/admin/imports/new">Import users</Link>

      <form onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Search by name or email"
          value={data.q}
          onChange={(event) => setData("q", event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Link href={`/admin/users/${user.id}/edit`}>Edit</Link>
                <button type="button" onClick={() => handleToggleRole(user)}>
                  Make {user.role === "admin" ? "user" : "admin"}
                </button>
                <button type="button" onClick={() => handleDelete(user)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        Page {pagination.page} of {pagination.pages} ({pagination.count} users)
      </p>
    </div>
  )
}
