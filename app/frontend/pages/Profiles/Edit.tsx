import { useForm } from "@inertiajs/react"
import { ReactElement, SubmitEvent } from "react"
import Field from "../../components/Field"
import Layout from "../../components/Layout"
import { cardClass, inputClass, primaryButtonClass } from "../../components/styles"

type User = {
  id: number
  full_name: string
  email: string
  role: string
}

function Edit({ user }: { user: User }) {
  const { data, setData, patch, processing, errors } = useForm({
    full_name: user.full_name,
    email: user.email,
  })

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    patch("/profile")
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold text-gray-900">Edit profile</h1>

      <form onSubmit={handleSubmit} className={`${cardClass} mt-6 space-y-4`}>
        <Field label="Full name" error={errors.full_name}>
          <input
            type="text"
            required
            autoComplete="name"
            className={inputClass}
            value={data.full_name}
            onChange={(event) => setData("full_name", event.target.value)}
          />
        </Field>

        <Field label="Email address" error={errors.email}>
          <input
            type="email"
            required
            autoComplete="username"
            className={inputClass}
            value={data.email}
            onChange={(event) => setData("email", event.target.value)}
          />
        </Field>

        <button type="submit" disabled={processing} className={`${primaryButtonClass} w-full`}>
          Save
        </button>
      </form>
    </div>
  )
}

Edit.layout = (page: ReactElement) => <Layout>{page}</Layout>

export default Edit
