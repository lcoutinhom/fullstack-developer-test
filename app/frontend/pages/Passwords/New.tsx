import { useForm } from "@inertiajs/react"
import { ReactElement, SubmitEvent } from "react"
import Field from "../../components/Field"
import Layout from "../../components/Layout"
import { cardClass, inputClass, primaryButtonClass } from "../../components/styles"

function New() {
  const { data, setData, post, processing } = useForm({ email: "" })

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    post("/passwords")
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold text-gray-900">Forgot your password?</h1>

      <form onSubmit={handleSubmit} className={`${cardClass} mt-6 space-y-4`}>
        <Field label="Email address">
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

        <button type="submit" disabled={processing} className={`${primaryButtonClass} w-full`}>
          Email reset instructions
        </button>
      </form>
    </div>
  )
}

New.layout = (page: ReactElement) => <Layout>{page}</Layout>

export default New
