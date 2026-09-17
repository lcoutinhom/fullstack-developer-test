import { Link, useForm } from "@inertiajs/react"

type User = {
  id: number
  full_name: string
  email: string
  role: string
}

export default function Show({ user }: { user: User }) {
  const { delete: destroy, processing } = useForm()

  function handleDelete() {
    if (confirm("Delete your account? This cannot be undone.")) {
      destroy("/profile")
    }
  }

  return (
    <div>
      <h1>My profile</h1>

      <dl>
        <dt>Full name</dt>
        <dd>{user.full_name}</dd>
        <dt>Email</dt>
        <dd>{user.email}</dd>
        <dt>Role</dt>
        <dd>{user.role}</dd>
      </dl>

      <Link href="/profile/edit">Edit profile</Link>
      <button type="button" onClick={handleDelete} disabled={processing}>
        Delete account
      </button>
    </div>
  )
}
