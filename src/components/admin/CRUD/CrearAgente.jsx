import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import subirImagenSpaces from "../../../api/shared/subirImagen";
import eliminarImagenSpaces from "../../../api/shared/eliminarImagen";
import registrarAgente from "../../../api/agente/crearAgente";
import FileUpload from "../../../components/ui/FileUpload";
import Botones from "../../../components/ui/Botones";
import LabeledField from "../../../components/ui/LabeledField";
import PhoneField from "../../../components/ui/PhoneField";
import mostrarToastPromise from "../../../utils/toastConfig";

function CrearAgente() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    startDate: "",
    email: "",
    telefono: "",
    lada: "+52",
    position: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      gender: "",
      startDate: "",
      email: "",
      telefono: "",
      lada: "+52",
      position: "",
      password: "",
      confirmPassword: "",
      avatar: null,
    });
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("❌ Las contraseñas no coinciden", {
        style: {
          background: "#e53935",
          color: "#fff",
          borderRadius: "8px",
          border: "none",
          boxShadow: "none",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#e53935",
        },
        duration: 4000,
      });
      return;
    }

    const enviar = async () => {
      let logoUrl = "";
      let filePathToDelete = "";

      if (formData.avatar instanceof File) {
        logoUrl = await subirImagenSpaces(formData.avatar, "profile");
        filePathToDelete = logoUrl.split(".com/")[1];
      }

      const payload = {
        logoUrl,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        startDate: formData.startDate,
        email: formData.email,
        phone: `${formData.lada}${formData.telefono}`,
        position: formData.position,
        password: formData.password,
      };

      try {
        await registrarAgente(payload);
        handleCancel();
        navigate("/admin/agentes");
      } catch (error) {
        if (filePathToDelete) {
          await eliminarImagenSpaces(filePathToDelete);
        }
        throw error;
      }
    };

    mostrarToastPromise(enviar, "✅ Agente registrado con éxito");
  };

  return (
    <div className="p-8 text-white bg-[#0E0F11] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-[#E6E7EB]">
        Crear Nuevo Agente
      </h1>
      <div className="w-full max-w-none border border-[#2a2d3f] rounded-xl px-10 py-10">
        <h2 className="text-xl font-semibold mb-2 text-[#E6E7EB]">
          Información de Agente
        </h2>
        <p className="text-[#B7BAC4] mb-8">
          Por favor proporcione la información del personal para crear su perfil.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FileUpload
            previewUrl={previewUrl}
            fileInputRef={fileInputRef}
            handleChange={handleChange}
            name="avatar"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabeledField
              label="Nombre(s) *"
              name="firstName"
              placeholder="Escribir Nombre(s)..."
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <LabeledField
              label="Apellido(s) *"
              name="lastName"
              placeholder="Escribir Apellido(s)..."
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabeledField
              label="Género *"
              name="gender"
              placeholder="Seleccionar Género..."
              value={formData.gender}
              onChange={handleChange}
              required
            />
            <LabeledField
              label="Fecha de entrada a la empresa *"
              type="date"
              name="startDate"
              placeholder="Elegir Fecha..."
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabeledField
              label="Email *"
              type="email"
              name="email"
              placeholder="Escribir Email..."
              value={formData.email}
              onChange={handleChange}
              required
            />

            <PhoneField
              label="Teléfono *"
              lada={formData.lada}
              telefono={formData.telefono}
              setFormData={setFormData}
              required
            />
          </div>

          <LabeledField
            label="Cargo *"
            name="position"
            placeholder="Cargo del Agente..."
            value={formData.position}
            onChange={handleChange}
            required
          />

          <LabeledField
            label="Crear Contraseña *"
            type="password"
            name="password"
            placeholder="Nueva Contraseña..."
            value={formData.password}
            onChange={handleChange}
            required
          />

          <LabeledField
            label="Confirmar Contraseña *"
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Contraseña..."
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <p className="text-sm text-red-500 italic pt-2">
            * Campos obligatorios
          </p>

          <Botones onCancel={handleCancel} />
        </form>
      </div>
    </div>
  );
}

export default CrearAgente;

