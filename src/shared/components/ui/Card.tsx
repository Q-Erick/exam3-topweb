import { cn } from '@/shared/lib/utils'

interface CardProps {
    children: React.ReactNode
    className?: string
    padding?: 'sm' | 'md' | 'lg'
}

export function Card({ children, className, padding = 'md' }: CardProps) {
    const paddings = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    }

    return (
        <div
        className={cn(
            'bg-white rounded-2xl border border-[#E2E8F0] shadow-sm',
            paddings[padding],
            className
        )}
        >
        {children}
        </div>
    )
}