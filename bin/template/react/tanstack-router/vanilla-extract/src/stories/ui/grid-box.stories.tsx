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
        <div
            style={{
                width: '100%',
                borderRadius: 12,
                background: '#f1f5f9',
                padding: 16,
            }}
        >
            Item 1
        </div>
        <div
            style={{
                width: '100%',
                borderRadius: 12,
                background: '#e2e8f0',
                padding: 16,
            }}
        >
            Item 2
        </div>
        <div
            style={{
                width: '100%',
                borderRadius: 12,
                background: '#f1f5f9',
                padding: 16,
            }}
        >
            Item 3
        </div>
        <div
            style={{
                width: '100%',
                borderRadius: 12,
                background: '#e2e8f0',
                padding: 16,
            }}
        >
            Item 4
        </div>
        <div
            style={{
                width: '100%',
                borderRadius: 12,
                background: '#f1f5f9',
                padding: 16,
            }}
        >
            Item 5
        </div>
    </>
)

export const ThreeColumns = {
    args: {
        gap: 'large',
        gridTemplateColumns: 'three',
        children: items,
    },
}

export const FiveColumns = {
    args: {
        gap: 'medium',
        gridTemplateColumns: 'five',
        children: items,
    },
}
