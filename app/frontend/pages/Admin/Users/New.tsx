import { useForm } from "@inertiajs/react"
import { SubmitEvent } from "react"

export default function New() {
  const { data, setData, post, processing, errors } = useForm({
    full_name: "",
    email: "",
    role: "user",
    avatar_url: "",
  })

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    post("/admin/users")
  }

  return (
    <div>
      <h1>New user</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          required
          autoFocus
          placeholder="Full name"
          value={data.full_name}
          onChange={(event) => setData("full_name", event.target.value)}
        />
        {errors.full_name && <div>{errors.full_name}</div>}

        <input
          type="email"
          required
          placeholder="Email address"
          value={data.email}
          onChange={(event) => setData("email", event.target.value)}
        />
        {errors.email && <div>{errors.email}</div>}

        <select value={data.role} onChange={(event) => setData("role", event.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="url"
          placeholder="Avatar image URL (optional)"
          value={data.avatar_url}
          onChange={(event) => setData("avatar_url", event.target.value)}
        />

        <button type="submit" disabled={processing}>
          Create user
        </button>
      </form>
    </div>
  )
}
