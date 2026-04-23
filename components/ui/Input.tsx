'use client';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input ({ label ,error, className = '' , ...props }: InputProps) {
  return (
  
    <div className="mb-4">
        {label && (
            <label htmlFor="block text-sm font-medium text-gray-700 mb-1">{label}</label> 
        )}

        <input type="text" 
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
            `} 
        {...props} />
        
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}