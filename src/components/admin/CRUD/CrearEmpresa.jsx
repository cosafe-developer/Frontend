import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import subirImagenSpaces from "../../../api/shared/subirImagen";
import eliminarImagenSpaces from "../../../api/shared/eliminarImagen";
import registrarEmpresa from "../../../api/empresa/crearempresa";

// UI Components
import FileUpload from "../../../components/ui/FileUpload";
import Botones from "../../../components/ui/Botones";
import LabeledField from "../../../components/ui/LabeledField";
import PhoneField from "../../../components/ui/PhoneField";
import mostrarToastPromise from "../../../utils/toastConfig";

function CrearEmpresa() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombreComercial: "",
    email: "",
    telefono: "",
    lada: "+52",
    rfc: "",
    contrasena: "",
    confirmarContrasena: "",
    logotipo: null,
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
      nombreComercial: "",
      email: "",
      telefono: "",
      lada: "+52",
      rfc: "",
      contrasena: "",
      confirmarContrasena: "",
      logotipo: null,
    });
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contrasena !== formData.confirmarContrasena) {
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

      // ✅ Subir imagen primero
      if (formData.logotipo instanceof File) {
        logoUrl = await subirImagenSpaces(formData.logotipo, "profile");
        filePathToDelete = logoUrl.split(".com/")[1];
      }

      const payload = {
        tradeName: formData.nombreComercial,
        email: formData.email,
        phone: `${formData.lada}${formData.telefono}`,
        rfc: formData.rfc,
        password: formData.contrasena,
        logoUrl,
      };

      try {
        await registrarEmpresa(payload);
        handleCancel();
        navigate("/admin/empresas");
      } catch (error) {
        // ✅ Si falla, borrar imagen subida
        if (filePathToDelete) {
          await eliminarImagenSpaces(filePathToDelete);
        }
        throw error;
      }
    };

    mostrarToastPromise(enviar, "✅ Empresa registrada con éxito");
  };

  return (
    <div className="p-8 text-white bg-[#0E0F11] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-[#E6E7EB]">
        Crear Nueva Empresa
      </h1>
      <div className="w-full max-w-none border border-[#2a2d3f] rounded-xl px-10 py-10">
        <h2 className="text-xl font-semibold mb-2 text-[#E6E7EB]">
          Datos Generales
        </h2>
        <p className="text-[#B7BAC4] mb-8">
          Por favor proporcione la información de la empresa.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FileUpload
            previewUrl={previewUrl}
            fileInputRef={fileInputRef}
            handleChange={handleChange}
          />

          <LabeledField
            label="Nombre Comercial *"
            name="nombreComercial"
            placeholder="Nombre Comercial"
            value={formData.nombreComercial}
            onChange={handleChange}
            required
          />

          <LabeledField
            label="RFC *"
            name="rfc"
            placeholder="RFC"
            value={formData.rfc}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabeledField
              label="Email *"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <PhoneField
              label="Teléfono"
              lada={formData.lada}
              telefono={formData.telefono}
              setFormData={setFormData}
            />
          </div>

          <LabeledField
            label="Contraseña *"
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            value={formData.contrasena}
            onChange={handleChange}
            required
          />

          <LabeledField
            label="Confirmar Contraseña *"
            type="password"
            name="confirmarContrasena"
            placeholder="Confirmar Contraseña"
            value={formData.confirmarContrasena}
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

export default CrearEmpresa;
