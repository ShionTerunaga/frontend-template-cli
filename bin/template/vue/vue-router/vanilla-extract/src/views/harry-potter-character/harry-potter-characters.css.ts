import { style } from '@vanilla-extract/css'

export const gridBoxBaseStyles = style({
  display: 'grid',
  justifyItems: 'center',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 24,
})

export const titleStyles = style({
  fontSize: '24px',
  textAlign: 'center',
})
