import { useEffect, useState } from "react"
import consumer from "../../../channels/consumer"

type ImportState = {
  id: number
  status: "pending" | "processing" | "completed" | "failed"
  total_rows: number
  processed_rows: number
  succeeded_rows: number
  failed_rows: number
  error_log: Record<string, unknown>[]
}

export default function Show(initial: ImportState) {
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
    <div>
      <h1>Import progress</h1>

      <p>Status: {state.status}</p>
      <progress value={percent} max={100} />
      <p>
        {state.processed_rows} / {state.total_rows} rows ({state.succeeded_rows} succeeded, {state.failed_rows}{" "}
        failed)
      </p>

      {state.error_log.length > 0 && (
        <ul>
          {state.error_log.map((entry, index) => (
            <li key={index}>{JSON.stringify(entry)}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
