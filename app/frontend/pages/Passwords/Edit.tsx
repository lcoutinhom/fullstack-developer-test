import { useForm } from "@inertiajs/react"
import { SubmitEvent } from "react"

export default function Edit({ token }: { token: string }) {
  const { data, setData, put, processing, errors } = useForm({
    password: "",
    password_confirmation: "",
  })

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    put(`/passwords/${token}`)
  }

  return (
    <div>
      <h1>Update your password</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          required
          autoComplete="new-password"
          placeholder="Enter new password"
          maxLength={72}
          value={data.password}
          onChange={(event) => setData("password", event.target.value)}
        />
        <input
          type="password"
          required
          autoComplete="new-password"
          placeholder="Repeat new password"
          maxLength={72}
          value={data.password_confirmation}
          onChange={(event) => setData("password_confirmation", event.target.value)}
        />
        {errors.password && <div>{errors.password}</div>}
        <button type="submit" disabled={processing}>
          Save
        </button>
      </form>
    </div>
  )
}
