'use client'

import { cn } from '@/shared/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outlined' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    children: React.ReactNode
}

export function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    children,
    className,
    disabled,
    ...props
}: ButtonProps) {
    const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary: 'bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white hover:opacity-90',
        secondary: 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED]',
        outlined: 'border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9]',
        ghost: 'text-[#64748B] hover:bg-[#F1F5F9]',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base w-full',
    }

    return (
        <button
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
        >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
        </button>
    )
}