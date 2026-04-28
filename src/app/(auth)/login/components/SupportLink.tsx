'use client'

interface SupportLinkProps {
  children: React.ReactNode
}

export function SupportLink({ children }: SupportLinkProps) {
  return (
    <span
      style={{ color: '#3B82F6', fontWeight: 500, cursor: 'pointer' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.textDecoration = 'underline'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.textDecoration = 'none'
      }}
    >
      {children}
    </span>
  )
}
