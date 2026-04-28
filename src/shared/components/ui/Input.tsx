'use client'

import { cn } from '@/shared/lib/utils'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: React.ReactNode
}

export function Input({
    label,
    error,
    icon,
    className,
    type,
    ...props
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'

    return (
        <div className="flex flex-col gap-2">
        {label && (
            <label className="text-sm font-semibold text-[#0F172A]">{label}</label>
        )}
        <div className="relative">
            {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]">
                {icon}
            </div>
            )}
            <input
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            className={cn(
                'w-full rounded-xl border border-[#E2E8F0] bg-white px-5 py-3.5 text-base text-[#0F172A] outline-none transition-all',
                'placeholder:text-[#94A3B8] placeholder:text-sm',
                'focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20',
                error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
                icon && 'pl-14',
                isPassword && 'pr-10',
                className
            )}
            {...props}
            />
            {isPassword && (
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
            >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}