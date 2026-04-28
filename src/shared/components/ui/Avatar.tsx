import { cn } from '@/shared/lib/utils'
import { getInitials } from '@/shared/lib/utils'

interface AvatarProps {
    name: string
    foto?: string
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function Avatar({ name, foto, size = 'md', className }: AvatarProps) {
    const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
    }

    if (foto) {
        return (
        <img
            src={`data:image/jpeg;base64,${foto}`}
            alt={name}
            className={cn('rounded-full object-cover', sizes[size], className)}
        />
        )
    }

    return (
        <div
        className={cn(
            'rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white font-medium',
            sizes[size],
            className
        )}
        >
        {getInitials(name)}
        </div>
    )
}