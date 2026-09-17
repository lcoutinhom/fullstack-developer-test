import { ReactElement, useEffect, useState } from "react"
import consumer from "../../channels/consumer"
import Layout from "../../components/Layout"
import { cardClass } from "../../components/styles"

type Counts = {
  total: number
  by_role: { admin: number; user: number }
}

function Dashboard({ total, by_role }: Counts) {
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
      <h1 className="text-2xl font-semibold text-gray-900">Admin dashboard</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className={cardClass}>
          <p className="text-sm text-gray-500">Total users</p>
          <p data-testid="total-users" className="mt-2 text-3xl font-semibold text-gray-900">
            {counts.total}
          </p>
        </div>
        <div className={cardClass}>
          <p className="text-sm text-gray-500">Admins</p>
          <p data-testid="admin-users" className="mt-2 text-3xl font-semibold text-gray-900">
            {counts.by_role.admin}
          </p>
        </div>
        <div className={cardClass}>
          <p className="text-sm text-gray-500">Users</p>
          <p data-testid="regular-users" className="mt-2 text-3xl font-semibold text-gray-900">
            {counts.by_role.user}
          </p>
        </div>
      </div>
    </div>
  )
}

Dashboard.layout = (page: ReactElement) => <Layout>{page}</Layout>

export default Dashboard
