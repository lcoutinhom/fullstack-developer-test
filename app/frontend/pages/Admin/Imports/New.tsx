import { useForm } from "@inertiajs/react"
import { SubmitEvent } from "react"

export default function New() {
  const { setData, post, processing, errors } = useForm<{ file: File | null }>({
    file: null,
  })

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    post("/admin/imports")
  }

  return (
    <div>
      <h1>Import users</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          required
          accept=".csv,.xlsx"
          onChange={(event) => setData("file", event.target.files?.[0] ?? null)}
        />
        {errors.file && <div>{errors.file}</div>}

        <button type="submit" disabled={processing}>
          Upload
        </button>
      </form>
    </div>
  )
}
