import { useForm } from "@inertiajs/react"
import { ReactElement, SubmitEvent } from "react"
import Field from "../../../components/Field"
import Layout from "../../../components/Layout"
import { cardClass, primaryButtonClass } from "../../../components/styles"

function New() {
  const { setData, post, processing, errors } = useForm<{ file: File | null }>({
    file: null,
  })

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    post("/admin/imports")
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold text-gray-900">Import users</h1>
      <p className="mt-1 text-sm text-gray-500">Upload a .csv or .xlsx file with "full_name" and "email" columns.</p>

      <form onSubmit={handleSubmit} className={`${cardClass} mt-6 space-y-4`}>
        <Field label="Spreadsheet" error={errors.file}>
          <input
            type="file"
            required
            accept=".csv,.xlsx"
            className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-700"
            onChange={(event) => setData("file", event.target.files?.[0] ?? null)}
          />
        </Field>

        <button type="submit" disabled={processing} className={`${primaryButtonClass} w-full`}>
          Upload
        </button>
      </form>
    </div>
  )
}

New.layout = (page: ReactElement) => <Layout>{page}</Layout>

export default New
