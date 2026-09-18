import { Link, useForm } from "@inertiajs/react"
import { ReactElement, SubmitEvent } from "react"
import Field from "../../components/Field"
import Layout from "../../components/Layout"
import { cardClass, inputClass, linkClass, primaryButtonClass } from "../../components/styles"

function New() {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
  })

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    post("/session")
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>

      <form onSubmit={handleSubmit} className={`${cardClass} mt-6 space-y-4`}>
        <Field label="Email address" error={errors.email}>
          <input
            type="email"
            required
            autoFocus
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
            autoComplete="current-password"
            maxLength={72}
            className={inputClass}
            value={data.password}
            onChange={(event) => setData("password", event.target.value)}
          />
        </Field>

        <button type="submit" disabled={processing} className={`${primaryButtonClass} w-full`}>
          Sign in
        </button>
      </form>

      <div className="mt-4 flex justify-between">
        <Link href="/passwords/new" className={linkClass}>
          Forgot password?
        </Link>
        <Link href="/registration/new" className={linkClass}>
          Create an account
        </Link>
      </div>
    </div>
  )
}

New.layout = (page: ReactElement) => <Layout>{page}</Layout>

export default New
