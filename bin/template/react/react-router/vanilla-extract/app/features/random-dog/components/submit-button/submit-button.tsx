import type { CheckerProps } from '@/shared/types/object'

interface SubmitButtonProps {
    title: string
}

export function SubmitButton<T extends SubmitButtonProps>({
    title,
}: CheckerProps<T, SubmitButtonProps, 'Invalid SubmitButton props'>) {
    return <button type="submit">{title}</button>
}
