import { style } from '@vanilla-extract/css'

const cardListViewStyle = {
    section: style({
        minHeight: '100dvh',
        padding: '56px 24px 80px',
        background:
            'linear-gradient(160deg, #e2e8f0 0%, #f8fafc 25%, #f1f5f9 70%, #dbeafe 100%)',
    }),
    inner: style({
        maxWidth: 1120,
        margin: '0 auto',
        borderRadius: 24,
        border: '1px solid #dbe1ea',
        background: 'rgba(255, 255, 255, 0.66)',
        padding: '24px 16px 32px',
    }),
    headingWrap: style({
        marginBottom: 28,
    }),
    heading: style({
        letterSpacing: '-0.02em',
        textShadow: '0 4px 16px rgba(2, 6, 23, 0.14)',
    }),
}

export default cardListViewStyle
