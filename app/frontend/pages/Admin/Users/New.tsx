import { useForm } from "@inertiajs/react"
import { ReactElement, SubmitEvent } from "react"
import Field from "../../../components/Field"
import Layout from "../../../components/Layout"
import { cardClass, inputClass, primaryButtonClass } from "../../../components/styles"

function New() {
  const { data, setData, post, processing, errors } = useForm({
    full_name: "",
    email: "",
    role: "user",
    avatar_url: "",
  })

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    post("/admin/users")
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold text-gray-900">New user</h1>

      <form onSubmit={handleSubmit} className={`${cardClass} mt-6 space-y-4`}>
        <Field label="Full name" error={errors.full_name}>
          <input
            type="text"
            required
            autoFocus
            className={inputClass}
            value={data.full_name}
            onChange={(event) => setData("full_name", event.target.value)}
          />
        </Field>

        <Field label="Email address" error={errors.email}>
          <input
            type="email"
            required
            className={inputClass}
            value={data.email}
            onChange={(event) => setData("email", event.target.value)}
          />
        </Field>

        <Field label="Role">
          <select
            className={inputClass}
            value={data.role}
            onChange={(event) => setData("role", event.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </Field>

        <Field label="Avatar image URL (optional)">
          <input
            type="url"
            className={inputClass}
            value={data.avatar_url}
            onChange={(event) => setData("avatar_url", event.target.value)}
          />
        </Field>

        <p className="text-sm text-gray-500">
          They'll be emailed a link to set their own password.
        </p>

        <button type="submit" disabled={processing} className={`${primaryButtonClass} w-full`}>
          Create user
        </button>
      </form>
    </div>
  )
}

New.layout = (page: ReactElement) => <Layout>{page}</Layout>

export default New
