import { useForm } from "@inertiajs/react"
import { SubmitEvent } from "react"

export default function New() {
  const { data, setData, post, processing } = useForm({ email: "" })

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    post("/passwords")
  }

  return (
    <div>
      <h1>Forgot your password?</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          required
          autoFocus
          autoComplete="username"
          placeholder="Enter your email address"
          value={data.email}
          onChange={(event) => setData("email", event.target.value)}
        />
        <button type="submit" disabled={processing}>
          Email reset instructions
        </button>
      </form>
    </div>
  )
}
