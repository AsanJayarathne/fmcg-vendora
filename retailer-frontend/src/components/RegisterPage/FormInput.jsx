function FormInput({
  label,
  placeholder,
  type = "text",
  ...props
}) {
  return (
    <div className="flex flex-col">
      <label className="text-gray-500 text-base mb-1.5 font-medium">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="bg-[#EEF2F6]
        rounded-2xl
        px-5
        py-3.5
        text-base
        font-semibold
        outline-none
        focus:ring-2
        focus:ring-blue-500"
        {...props}
      />
    </div>
  );
}
export default FormInput;