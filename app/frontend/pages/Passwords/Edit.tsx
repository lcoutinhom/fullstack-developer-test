import { useForm } from "@inertiajs/react"
import { ReactElement, SubmitEvent } from "react"
import Field from "../../components/Field"
import Layout from "../../components/Layout"
import { cardClass, inputClass, primaryButtonClass } from "../../components/styles"

function Edit({ token }: { token: string }) {
  const { data, setData, put, processing, errors } = useForm({
    password: "",
    password_confirmation: "",
  })

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    put(`/passwords/${token}`)
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold text-gray-900">Update your password</h1>

      <form onSubmit={handleSubmit} className={`${cardClass} mt-6 space-y-4`}>
        <Field label="New password" error={errors.password}>
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

        <Field label="Repeat new password">
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
          Save
        </button>
      </form>
    </div>
  )
}

Edit.layout = (page: ReactElement) => <Layout>{page}</Layout>

export default Edit
