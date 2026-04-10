import { createFileRoute } from '@tanstack/react-router'
import HomeLayout from '@/pages/home/home'

export const Route = createFileRoute('/')({
    component: HomeLayout,
})
