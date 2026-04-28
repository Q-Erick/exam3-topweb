import { cn } from '@/shared/lib/utils'

interface SkeletonLoaderProps {
    className?: string
}

export function SkeletonLoader({ className }: SkeletonLoaderProps) {
    return (
        <div className={cn('animate-pulse', className)}>
            <div className="h-3 bg-gray-200 rounded-full" />
        </div>
    )
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-3xl p-8 animate-pulse">
                <div className="flex items-center gap-6">
                    {/* Foto Skeleton */}
                    <div className="w-32 h-32 rounded-2xl bg-gray-300" />

                    {/* Info Skeleton */}
                    <div className="flex-1 space-y-3">
                        <div className="h-8 bg-gray-400 rounded-lg w-64" />
                        <div className="h-4 bg-gray-400 rounded w-80" />
                        <div className="h-4 bg-gray-400 rounded w-72" />
                        <div className="h-4 bg-gray-400 rounded w-60" />
                    </div>

                    {/* Promedio Skeleton */}
                    <div className="bg-white/20 rounded-xl p-6 w-40 space-y-2 text-center">
                        <div className="h-4 bg-gray-400 rounded w-full" />
                        <div className="h-10 bg-gray-400 rounded w-full" />
                        <div className="h-6 bg-gray-400 rounded w-24 mx-auto" />
                    </div>
                </div>
            </div>

            {/* Grid de Estadísticas Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                        <div className="h-10 bg-gray-200 rounded-lg w-12 mx-auto mb-4" />
                        <div className="h-4 bg-gray-200 rounded w-full mb-3" />
                        <div className="h-8 bg-gray-300 rounded w-2/3 mx-auto mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-full" />
                    </div>
                ))}
            </div>

            {/* Progreso Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-8 animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-48 mb-6" />
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full" />
                                <div className="h-3 bg-gray-200 rounded w-full" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-8 animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-48 mb-6" />
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 bg-gray-100 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
