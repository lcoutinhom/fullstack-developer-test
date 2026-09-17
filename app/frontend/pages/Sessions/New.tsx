import { Link, useForm } from "@inertiajs/react"
import { SubmitEvent } from "react"

export default function New() {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
  })

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    post("/session")
  }

  return (
    <div>
      <h1>Sign in</h1>

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
        <input
          type="password"
          required
          autoComplete="current-password"
          placeholder="Enter your password"
          maxLength={72}
          value={data.password}
          onChange={(event) => setData("password", event.target.value)}
        />
        {errors.email && <div>{errors.email}</div>}
        <button type="submit" disabled={processing}>
          Sign in
        </button>
      </form>

      <Link href="/passwords/new">Forgot password?</Link>
      <Link href="/registration/new">Create an account</Link>
    </div>
  )
}
