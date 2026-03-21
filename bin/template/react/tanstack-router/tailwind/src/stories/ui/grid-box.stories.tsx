import { GridBox } from '@/components/ui'

const meta = {
    title: 'components/ui/grid-box',
    component: GridBox,
    parameters: {
        layout: 'fullscreen',
    },
}
export default meta

const items = (
    <>
        <div className="w-full rounded-lg bg-slate-100 p-4">Item 1</div>
        <div className="w-full rounded-lg bg-slate-200 p-4">Item 2</div>
        <div className="w-full rounded-lg bg-slate-100 p-4">Item 3</div>
        <div className="w-full rounded-lg bg-slate-200 p-4">Item 4</div>
        <div className="w-full rounded-lg bg-slate-100 p-4">Item 5</div>
    </>
)

export const ThreeColumns = {
    args: {
        gap: 'large',
        gridTemplateColumns: 'three',
        children: items,
    },
}

export const FourColumns = {
    args: {
        gap: 'medium',
        gridTemplateColumns: 'four',
        children: items,
    },
}
