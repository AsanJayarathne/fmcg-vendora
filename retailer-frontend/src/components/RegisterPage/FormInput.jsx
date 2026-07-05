function FormInput({
  label,
  placeholder,
  type = "text",
}) {
  return (
    <div className="flex flex-col">
      <label className="text-gray-500 text-lg mb-2">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="bg-[#EEF2F6]
        rounded-3xl
        px-7
        py-5
        text-2xl
        font-semibold
        outline-none
        focus:ring-2
        focus:ring-blue-500"
      />
    </div>
  );
}
export default FormInput;