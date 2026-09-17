import { ReactElement, useEffect, useState } from "react"
import consumer from "../../../channels/consumer"
import Layout from "../../../components/Layout"
import { cardClass } from "../../../components/styles"

type ImportState = {
  id: number
  status: "pending" | "processing" | "completed" | "failed"
  total_rows: number
  processed_rows: number
  succeeded_rows: number
  failed_rows: number
  error_log: Record<string, unknown>[]
}

const statusStyles: Record<ImportState["status"], string> = {
  pending: "bg-gray-100 text-gray-700",
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
}

function Show(initial: ImportState) {
  const [state, setState] = useState<ImportState>(initial)

  useEffect(() => {
    const subscription = consumer.subscriptions.create(
      { channel: "ImportChannel", id: initial.id },
      { received: (data: Omit<ImportState, "id">) => setState((prev) => ({ ...prev, ...data })) },
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [initial.id])

  const percent = state.total_rows > 0 ? Math.round((state.processed_rows / state.total_rows) * 100) : 0

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold text-gray-900">Import progress</h1>

      <div className={`${cardClass} mt-6 space-y-4`}>
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[state.status]}`}>
          {state.status}
        </span>

        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gray-900 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>

        <p className="text-sm text-gray-600">
          {state.processed_rows} / {state.total_rows} rows &middot; {state.succeeded_rows} succeeded &middot;{" "}
          {state.failed_rows} failed
        </p>

        {state.error_log.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-900">Errors</p>
            <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto text-sm text-red-700">
              {state.error_log.map((entry, index) => (
                <li key={index}>{JSON.stringify(entry)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

Show.layout = (page: ReactElement) => <Layout>{page}</Layout>

export default Show
