import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import FileUpload from "../../../components/ui/FileUpload";
import Botones from "../../../components/ui/Botones";
import LabeledField from "../../../components/ui/LabeledField";
import PhoneField from "../../../components/ui/PhoneField";

import obtenerEmpresa from "../../../api/empresa/getempresa";
import editarempresa from "../../../api/empresa/editarempresa";
import subirImagenSpaces from "../../../api/shared/subirImagen";
import eliminarImagenSpaces from "../../../api/shared/eliminarImagen";
import mostrarToastPromise from "../../../utils/toastConfig";

function EditarEmpresa() {
  const { empresaId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    nombreComercial: "",
    email: "",
    telefono: "",
    lada: "+52",
    rfc: "",
    logotipo: null,
    password: "",
    confirmPassword: "",
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [originalLogoUrl, setOriginalLogoUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const data = await obtenerEmpresa(empresaId);

        setFormData({
          nombreComercial: data.tradeName || "",
          email: data.email || "",
          telefono: data.phone?.replace("+52", "") || "",
          lada: data.phone?.startsWith("+52") ? "+52" : "",
          rfc: data.rfc || "",
          logotipo: null,
          password: "",
          confirmPassword: "",
        });

        if (data.logoUrl) {
          setOriginalLogoUrl(data.logoUrl);
          setPreviewUrl(data.logoUrl);
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar empresa.");
        navigate("/admin/empresas");
      }
    };

    fetchEmpresa();
  }, [empresaId, navigate]);

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
    navigate("/admin/empresas");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validaciones frontend
    if (!formData.nombreComercial.trim()) {
      toast.error("El nombre comercial es obligatorio.");
      return;
    }

    if (!formData.rfc.trim()) {
      toast.error("El RFC es obligatorio.");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("El email es obligatorio.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("El email no tiene un formato válido.");
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    const enviar = async () => {
      let logoUrl = previewUrl;

      if (formData.logotipo instanceof File) {
        if (originalLogoUrl) {
          const filePath = originalLogoUrl.split(".com/")[1];
          if (filePath) {
            await eliminarImagenSpaces(filePath);
            console.log("Archivo original eliminado:", filePath);
          }
        }

        logoUrl = await subirImagenSpaces(formData.logotipo, "profile");
        console.log("Nuevo archivo subido:", logoUrl);
      }

      const body = {
        tradeName: formData.nombreComercial,
        email: formData.email,
        phone: `${formData.lada}${formData.telefono}`,
        rfc: formData.rfc,
        password: formData.password || undefined,
        logoUrl: logoUrl || undefined,
      };

      Object.keys(body).forEach(
        (key) => body[key] === undefined && delete body[key]
      );

      await editarempresa(empresaId, body);
      navigate("/admin/empresas");
    };

    mostrarToastPromise(enviar, "✅ Empresa actualizada correctamente");
  };

  if (loading) return null;

  return (
    <div className="p-8 text-white bg-[#0E0F11] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-[#E6E7EB]">
        Editar Empresa
      </h1>

      <div className="w-full max-w-none border border-[#2a2d3f] rounded-xl px-10 py-10">
        <h2 className="text-xl font-semibold mb-2 text-[#E6E7EB]">
          Datos Generales
        </h2>
        <p className="text-[#B7BAC4] mb-8">
          Modifique la información de la empresa.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
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
            label="Crear contraseña nueva"
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
          />

          <LabeledField
            label="Confirmar Contraseña"
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
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

export default EditarEmpresa;
