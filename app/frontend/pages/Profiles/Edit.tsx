import { useForm } from "@inertiajs/react"
import { SubmitEvent } from "react"

type User = {
  id: number
  full_name: string
  email: string
  role: string
}

export default function Edit({ user }: { user: User }) {
  const { data, setData, patch, processing, errors } = useForm({
    full_name: user.full_name,
    email: user.email,
  })

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    patch("/profile")
  }

  return (
    <div>
      <h1>Edit profile</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          required
          autoComplete="name"
          value={data.full_name}
          onChange={(event) => setData("full_name", event.target.value)}
        />
        {errors.full_name && <div>{errors.full_name}</div>}

        <input
          type="email"
          required
          autoComplete="username"
          value={data.email}
          onChange={(event) => setData("email", event.target.value)}
        />
        {errors.email && <div>{errors.email}</div>}

        <button type="submit" disabled={processing}>
          Save
        </button>
      </form>
    </div>
  )
}
