// components/ui/LabeledField.jsx

import InputField from "./InputField";

const LabeledField = ({ label, name, ...props }) => (
  <div className="w-full">
    <label htmlFor={name} className="block text-sm mb-2 text-[#B7BAC4]">
      {label}
    </label>
    <InputField name={name} {...props} />
  </div>
);

export default LabeledField;
