import { Link, useForm } from "@inertiajs/react"
import { ReactElement, SubmitEvent } from "react"
import Field from "../../components/Field"
import Layout from "../../components/Layout"
import { cardClass, inputClass, linkClass, primaryButtonClass } from "../../components/styles"

function New() {
  const { data, setData, post, processing, errors } = useForm({
    full_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  })

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    post("/registration")
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>

      <form onSubmit={handleSubmit} className={`${cardClass} mt-6 space-y-4`}>
        <Field label="Full name" error={errors.full_name}>
          <input
            type="text"
            required
            autoFocus
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

        <Field label="Password" error={errors.password}>
          <input
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            className={inputClass}
            value={data.password}
            onChange={(event) => setData("password", event.target.value)}
          />
        </Field>

        <Field label="Repeat password">
          <input
            type="password"
            required
            autoComplete="new-password"
            maxLength={72}
            className={inputClass}
            value={data.password_confirmation}
            onChange={(event) => setData("password_confirmation", event.target.value)}
          />
        </Field>

        <button type="submit" disabled={processing} className={`${primaryButtonClass} w-full`}>
          Sign up
        </button>
      </form>

      <div className="mt-4">
        <Link href="/session/new" className={linkClass}>
          Already have an account?
        </Link>
      </div>
    </div>
  )
}

New.layout = (page: ReactElement) => <Layout>{page}</Layout>

export default New
