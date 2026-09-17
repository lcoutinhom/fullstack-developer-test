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
    avatar_url: "",
  })

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    patch(`/admin/users/${user.id}`)
  }

  return (
    <div>
      <h1>Edit user</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          required
          value={data.full_name}
          onChange={(event) => setData("full_name", event.target.value)}
        />
        {errors.full_name && <div>{errors.full_name}</div>}

        <input
          type="email"
          required
          value={data.email}
          onChange={(event) => setData("email", event.target.value)}
        />
        {errors.email && <div>{errors.email}</div>}

        <input
          type="url"
          placeholder="Avatar image URL (optional)"
          value={data.avatar_url}
          onChange={(event) => setData("avatar_url", event.target.value)}
        />

        <button type="submit" disabled={processing}>
          Save
        </button>
      </form>
    </div>
  )
}
