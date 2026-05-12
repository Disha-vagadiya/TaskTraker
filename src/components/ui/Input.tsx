import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  as?: 'input' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
}

export const Input: React.FC<InputProps> = ({ label, error, as = 'input', options, className = '', ...props }) => {
  const baseInputStyle = `w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? 'border-red-500' : 'border-gray-300'
  }`;

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      {as === 'select' ? (
        <select className={baseInputStyle} {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : as === 'textarea' ? (
        <textarea className={baseInputStyle} rows={3} {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input className={baseInputStyle} {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />
      )}
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
