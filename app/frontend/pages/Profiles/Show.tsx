import { Link, useForm } from "@inertiajs/react"
import { ReactElement } from "react"
import Layout from "../../components/Layout"
import { cardClass, dangerButtonClass, primaryButtonClass } from "../../components/styles"

type User = {
  id: number
  full_name: string
  email: string
  role: string
}

function Show({ user }: { user: User }) {
  const { delete: destroy, processing } = useForm()

  function handleDelete() {
    if (confirm("Delete your account? This cannot be undone.")) {
      destroy("/profile")
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold text-gray-900">My profile</h1>

      <div className={`${cardClass} mt-6`}>
        <dl className="divide-y divide-gray-100">
          <div className="grid grid-cols-3 gap-4 py-3">
            <dt className="text-sm text-gray-500">Full name</dt>
            <dd className="col-span-2 text-sm text-gray-900">{user.full_name}</dd>
          </div>
          <div className="grid grid-cols-3 gap-4 py-3">
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="col-span-2 text-sm text-gray-900">{user.email}</dd>
          </div>
          <div className="grid grid-cols-3 gap-4 py-3">
            <dt className="text-sm text-gray-500">Role</dt>
            <dd className="col-span-2 text-sm capitalize text-gray-900">{user.role}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Link href="/profile/edit" className={primaryButtonClass}>
          Edit profile
        </Link>
        <button type="button" onClick={handleDelete} disabled={processing} className={dangerButtonClass}>
          Delete account
        </button>
      </div>
    </div>
  )
}

Show.layout = (page: ReactElement) => <Layout>{page}</Layout>

export default Show
