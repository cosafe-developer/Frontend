import React from "react";

const PhoneField = ({ label = "Teléfono", lada, telefono, setFormData }) => {
  const handleLadaChange = (e) => {
    setFormData((prev) => ({ ...prev, lada: e.target.value }));
  };

  const handleTelefonoChange = (e) => {
    const onlyNums = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, telefono: onlyNums }));
  };

  return (
    <div className="w-full">
      <label className="block text-sm mb-2 text-[#B7BAC4]">{label} *</label>
      <div className="flex w-full gap-2 min-w-0">
        <select
          value={lada}
          onChange={handleLadaChange}
          className="bg-[#0E0F11] border border-gray-600 text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-0 appearance-none"
        >
          <option value="+52">🇲🇽 +52</option>
          <option value="+1">🇺🇸 +1</option>
          <option value="+34">🇪🇸 +34</option>
          <option value="+57">🇨🇴 +57</option>
          <option value="+54">🇦🇷 +54</option>
        </select>

        <input
          type="tel"
          name="telefono"
          placeholder="Número de teléfono"
          value={telefono}
          onChange={handleTelefonoChange}
          required
          className="flex-1 min-w-0 px-4 py-2 bg-transparent border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default PhoneField;

