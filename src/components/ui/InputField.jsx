// components/ui/InputField.jsx

const InputField = ({ type = "text", name, placeholder, value, onChange, required = false }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
    className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none"
  />
);

export default InputField;
