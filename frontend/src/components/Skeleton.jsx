import React from 'react';

export const Skeleton = ({ width = 'w-full', height = 'h-4', className = '' }) => {
    return (
        <div className={`${width} ${height} bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse ${className}`} />
    );
};

export const SkeletonCard = ({ lines = 3 }) => {
    return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
            <Skeleton width="w-3/4" height="h-5" className="mb-3" />
            {Array(lines)
                .fill(null)
                .map((_, i) => (
                    <Skeleton key={i} width={i === lines - 1 ? 'w-2/3' : 'w-full'} height="h-3" />
                ))}
        </div>
    );
};

export const SkeletonTable = ({ rows = 5, cols = 4 }) => {
    return (
        <div className="w-full space-y-2">
            {/* Header */}
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                {Array(cols)
                    .fill(null)
                    .map((_, i) => (
                        <Skeleton key={`header-${i}`} height="h-5" />
                    ))}
            </div>
            {/* Rows */}
            {Array(rows)
                .fill(null)
                .map((_, row) => (
                    <div key={`row-${row}`} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                        {Array(cols)
                            .fill(null)
                            .map((_, col) => (
                                <Skeleton key={`cell-${row}-${col}`} height="h-4" />
                            ))}
                    </div>
                ))}
        </div>
    );
};

export const SkeletonStats = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4)
                .fill(null)
                .map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-slate-200">
                        <Skeleton width="w-1/2" height="h-4" className="mb-3" />
                        <Skeleton width="w-2/3" height="h-6" />
                    </div>
                ))}
        </div>
    );
};
