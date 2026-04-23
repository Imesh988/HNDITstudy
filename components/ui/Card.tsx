'use client';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
}

export default function Card({ children, title, className }: CardProps) {
    return (
        <div className={`bg-white rounded-xl shadow-lg p-8 ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {title}
        </h2>
      )}
      {children}
    </div>
    );
}