import { useEffect, useState } from "react"
import consumer from "../../channels/consumer"

type Counts = {
  total: number
  by_role: { admin: number; user: number }
}

export default function Dashboard({ total, by_role }: Counts) {
  const [counts, setCounts] = useState<Counts>({ total, by_role })

  useEffect(() => {
    const subscription = consumer.subscriptions.create(
      { channel: "DashboardChannel" },
      { received: (data: Counts) => setCounts(data) },
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <div>
      <h1>Admin dashboard</h1>

      <p>Total users: {counts.total}</p>
      <ul>
        <li>Admins: {counts.by_role.admin}</li>
        <li>Users: {counts.by_role.user}</li>
      </ul>
    </div>
  )
}
