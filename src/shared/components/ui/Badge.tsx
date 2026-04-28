import { cn } from '@/shared/lib/utils'

interface BadgeProps {
    children: React.ReactNode
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
    className?: string
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
    const variants = {
        primary: 'bg-blue-100 text-blue-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        danger: 'bg-red-100 text-red-700',
        neutral: 'bg-gray-100 text-gray-600',
    }

    return (
        <span
        className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            variants[variant],
            className
        )}
        >
        {children}
        </span>
    )
}