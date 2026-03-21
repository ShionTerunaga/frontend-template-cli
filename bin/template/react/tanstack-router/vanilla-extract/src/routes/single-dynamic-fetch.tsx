import { createFileRoute } from '@tanstack/react-router'
import SingleDynamicFetch from '@/pages/single-dynamic-fetch/single-dynamic-fetch'

export const Route = createFileRoute('/single-dynamic-fetch')({
    component: SingleDynamicFetch,
})
