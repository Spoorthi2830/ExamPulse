export function FormInput({ label, required, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        className={`border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2878D0] focus:border-transparent transition ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function FormSelect({ label, required, error, children, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        className={`border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2878D0] focus:border-transparent transition bg-white ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function FormTextarea({ label, required, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        className={`border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2878D0] focus:border-transparent transition resize-none ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
        rows={4}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
