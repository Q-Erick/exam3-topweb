import { AlertCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface ErrorMessageProps {
    message: string
    className?: string
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
    return (
        <div
        className={cn(
            'flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600',
            className
        )}
        >
        <AlertCircle size={16} className="shrink-0" />
        <span>{message}</span>
        </div>
    )
}