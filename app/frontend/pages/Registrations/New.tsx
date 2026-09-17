import { Link, useForm } from "@inertiajs/react"
import { SubmitEvent } from "react"

export default function New() {
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
    <div>
      <h1>Create your account</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          required
          autoFocus
          autoComplete="name"
          placeholder="Full name"
          value={data.full_name}
          onChange={(event) => setData("full_name", event.target.value)}
        />
        {errors.full_name && <div>{errors.full_name}</div>}

        <input
          type="email"
          required
          autoComplete="username"
          placeholder="Enter your email address"
          value={data.email}
          onChange={(event) => setData("email", event.target.value)}
        />
        {errors.email && <div>{errors.email}</div>}

        <input
          type="password"
          required
          autoComplete="new-password"
          placeholder="Choose a password"
          maxLength={72}
          value={data.password}
          onChange={(event) => setData("password", event.target.value)}
        />
        <input
          type="password"
          required
          autoComplete="new-password"
          placeholder="Repeat password"
          maxLength={72}
          value={data.password_confirmation}
          onChange={(event) => setData("password_confirmation", event.target.value)}
        />
        {errors.password && <div>{errors.password}</div>}

        <button type="submit" disabled={processing}>
          Sign up
        </button>
      </form>

      <Link href="/session/new">Already have an account?</Link>
    </div>
  )
}
