import { useState, useTransition } from "react"

interface FormState {
    success: boolean
    message: string | null
    errors: Record<string, string[]> | null
}

export function useFormState(
  action: (data: FormData) => Promise<FormState>,
  initialState?: FormState
) {

    const [isPading, startTransition] = useTransition()

    const [formState, setFormState] = useState(initialState ?? {
        success: true, message: null, errors: null
    })

    async function handleAction(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget
        const data = new FormData(form)

        startTransition(async () => {
            const state = await action(data)
            setFormState(state)
        })
    }

    return [formState, handleAction, isPading] as const
}
