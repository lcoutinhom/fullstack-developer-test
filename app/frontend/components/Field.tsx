import { cloneElement, ReactElement, useId } from "react"

export default function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string | string[]
  children: ReactElement<{ id?: string }>
}) {
  const id = useId()
  const message = Array.isArray(error) ? error.join(", ") : error

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">{cloneElement(children, { id })}</div>
      {message && <p className="mt-1 text-sm text-red-600">{message}</p>}
    </div>
  )
}
