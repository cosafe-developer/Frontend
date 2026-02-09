import getEmpresaById from "api/empresa/getEmpresaById";
import getListadoById from "api/listados/getListadoById";
import { useToastContext } from "app/contexts/toast-provider/context";
import LoadingErrorComponent from "components/custom-ui/loadings/LoadingError.component";
import { Page } from "components/shared/Page";
import LoadingContent from "components/template/LoadingContent";
import { Avatar, Button, Card } from "components/ui";
import { useCallback, useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { useParams } from "react-router";
import serverStatesFetching from "types/fetch/serverStatesFetching.type";
import { calculateProgressGeneralListado } from "./helpers/calculateProgressGeneralListado";
import { estudioSteps } from "./form-llenar-listado/steps-datos-estudio/estudio-pipc/EstudioSteps";

const ListadoCompleto = () => {

  const [listado, setListado] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [estado, setEstado] = useState(serverStatesFetching.fetching);
  const { showToast } = useToastContext();
  const { listado_id } = useParams();

  const fetchData = useCallback(async () => {
    setEstado(serverStatesFetching.fetching);

    const response = await getListadoById({ requestBody: { listado_id } });
    if (!response?.ok) {
      setEstado(serverStatesFetching.error);
      showToast({ message: "Error al obtener el listado", type: "error" });
      return;
    }

    const listadoData = response?.data;

    const studyData = listadoData?.studyData ?? {};
    const { globalPercent, totalGlobal, completadosGlobal, progressSections } =
      calculateProgressGeneralListado(studyData, true);


    const listadoConProgreso = {
      ...listadoData,
      progressPercentage: Math.round(globalPercent),
      progressSections,
      progressMeta: { totalItems: totalGlobal, completedItems: completadosGlobal },
    };


    if (listadoData?.companyId?._id) {
      const responseEmpresa = await getEmpresaById({ requestBody: { empresa_id: listadoData?.companyId?._id } });
      if (!responseEmpresa?.ok) {
        setEstado(serverStatesFetching.error);
        showToast({ message: "Error al obtener la empresa", type: "error" });
        return;
      }
      setEmpresa(responseEmpresa?.data?.empresa);
    }

    setListado(listadoConProgreso);
    setEstado(serverStatesFetching.success);
  }, [listado_id, showToast]);


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Función para generar tablas HTML del listado
  const handleDescargarPlantilla = () => {
    if (!listado) {
      showToast({ message: "No hay datos del listado", type: "error" });
      return;
    }

    // Función helper para crear tablas de arrays
    const createTableFromArray = (data, title, columns = null) => {
      if (!Array.isArray(data) || data.length === 0) {
        return `<p class="no-data">No hay datos disponibles</p>`;
      }

      // Si no se especifican columnas, usar las keys del primer objeto
      const keys = columns || Object.keys(data[0] || {});
      
      let tableHTML = `
        <div class="table-section">
          <h3 class="table-title">${title}</h3>
          <table class="data-table">
            <thead>
              <tr>
                ${keys.map(key => `<th>${key}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
      `;

      data.forEach((row, index) => {
        tableHTML += '<tr>';
        keys.forEach(key => {
          const value = row[key];
          let displayValue = '';
          
          if (value === null || value === undefined) {
            displayValue = '-';
          } else if (typeof value === 'object') {
            displayValue = JSON.stringify(value, null, 2);
          } else if (typeof value === 'boolean') {
            displayValue = value ? 'Sí' : 'No';
          } else {
            displayValue = String(value);
          }
          
          tableHTML += `<td>${displayValue}</td>`;
        });
        tableHTML += '</tr>';
      });

      tableHTML += `
            </tbody>
          </table>
        </div>
      `;

      return tableHTML;
    };

    // Función helper para crear tablas de objetos simples
    const createTableFromObject = (data, title) => {
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return '';
      }

      let tableHTML = `
        <div class="table-section">
          <h3 class="table-title">${title}</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>Campo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
      `;

      Object.entries(data).forEach(([key, value]) => {
        let displayValue = '';
        
        if (value === null || value === undefined) {
          displayValue = '-';
        } else if (typeof value === 'object' && !Array.isArray(value)) {
          displayValue = JSON.stringify(value, null, 2);
        } else if (Array.isArray(value)) {
          displayValue = value.length > 0 ? `${value.length} elementos` : 'Vacío';
        } else if (typeof value === 'boolean') {
          displayValue = value ? 'Sí' : 'No';
        } else {
          displayValue = String(value);
        }

        tableHTML += `
          <tr>
            <td class="field-name">${key}</td>
            <td>${displayValue}</td>
          </tr>
        `;
      });

      tableHTML += `
            </tbody>
          </table>
        </div>
      `;

      return tableHTML;
    };

    // Construir el HTML completo
    let htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Plantilla del Listado - ${empresa?.tradeName || 'Listado'}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            color: #333;
          }
          
          .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            padding: 30px;
          }
          
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #667eea;
          }
          
          .header h1 {
            color: #667eea;
            font-size: 2.5em;
            margin-bottom: 10px;
          }
          
          .header-info {
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
            flex-wrap: wrap;
            gap: 20px;
          }
          
          .info-item {
            background: #f8f9fa;
            padding: 15px 20px;
            border-radius: 8px;
            min-width: 200px;
          }
          
          .info-item strong {
            color: #667eea;
            display: block;
            margin-bottom: 5px;
          }
          
          .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
          }
          
          .section-title {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 8px 8px 0 0;
            font-size: 1.5em;
            margin-bottom: 0;
          }
          
          .subsection {
            margin-bottom: 30px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
          }
          
          .subsection-title {
            color: #667eea;
            font-size: 1.4em;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
          }
          
          .table-section {
            margin-bottom: 30px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
          }
          
          .table-title {
            color: #667eea;
            font-size: 1.3em;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
          }
          
          .data-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          
          .data-table thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          
          .data-table th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.9em;
            letter-spacing: 0.5px;
          }
          
          .data-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #e0e0e0;
            word-wrap: break-word;
            max-width: 300px;
          }
          
          .data-table tbody tr {
            transition: background-color 0.2s ease;
          }
          
          .data-table tbody tr:hover {
            background: #f0f4ff;
            transform: scale(1.01);
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
          }
          
          .data-table tbody tr:nth-child(even) {
            background: #fafbfc;
          }
          
          .data-table tbody tr:nth-child(even):hover {
            background: #f0f4ff;
          }
          
          .data-table tbody tr:last-child td {
            border-bottom: none;
          }
          
          .field-name {
            font-weight: 600;
            color: #667eea;
            width: 30%;
            text-transform: capitalize;
          }
          
          .no-data {
            text-align: center;
            color: #999;
            font-style: italic;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 2px dashed #e0e0e0;
          }
          
          .info-item span {
            color: #555;
            font-size: 1.1em;
          }
          
          @media (max-width: 768px) {
            .header-info {
              flex-direction: column;
            }
            
            .data-table {
              font-size: 0.9em;
            }
            
            .data-table th,
            .data-table td {
              padding: 8px 10px;
            }
          }
          
          @media print {
            body {
              background: white;
              padding: 0;
            }
            
            .container {
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Plantilla del Listado</h1>
            <div class="header-info">
              <div class="info-item">
                <strong>Empresa:</strong>
                <span>${empresa?.tradeName || listado?.companyId?.tradeName || 'N/A'}</span>
              </div>
              <div class="info-item">
                <strong>Estudio:</strong>
                <span>${listado?.studyId?.studyName || 'N/A'}</span>
              </div>
              <div class="info-item">
                <strong>Estado:</strong>
                <span>${listado?.status || 'N/A'}</span>
              </div>
              <div class="info-item">
                <strong>Progreso:</strong>
                <span>${listado?.progressPercentage || 0}%</span>
              </div>
            </div>
          </div>
    `;

    // Información de la Empresa
    if (listado?.companyInfo) {
      htmlContent += `
        <div class="section">
          <h2 class="section-title">🏢 Información de la Empresa</h2>
          ${createTableFromObject(listado.companyInfo, 'Datos Generales')}
        </div>
      `;
    }

    // Información de Dirección
    if (listado?.addressInfo) {
      htmlContent += `
        <div class="section">
          <h2 class="section-title">📍 Información de Dirección</h2>
          ${createTableFromObject(listado.addressInfo, 'Datos del Inmueble')}
        </div>
      `;
    }

    // Información de Riesgo
    if (listado?.riskInfo) {
      htmlContent += `
        <div class="section">
          <h2 class="section-title">⚠️ Información de Riesgo</h2>
          ${createTableFromObject(listado.riskInfo, 'Riesgos Generales')}
        </div>
      `;
    }

    // Datos del Estudio
    if (listado?.studyData) {
      htmlContent += `
        <div class="section">
          <h2 class="section-title">🔬 Datos del Estudio</h2>
      `;

      const studyData = listado.studyData;

      // Riesgos No Estructurales
      if (studyData.nonStructuralRisks) {
        htmlContent += `
          <div class="subsection">
            <h3 class="subsection-title">⚙️ Riesgos No Estructurales</h3>
        `;
        
        Object.entries(studyData.nonStructuralRisks).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0 && key !== 'isDone') {
            const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
            htmlContent += createTableFromArray(value, title);
          }
        });
        
        htmlContent += `</div>`;
      }

      // Riesgos Estructurales
      if (studyData.structuralRisks) {
        htmlContent += `
          <div class="subsection">
            <h3 class="subsection-title">🧱 Riesgos Estructurales</h3>
        `;
        
        Object.entries(studyData.structuralRisks).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0 && key !== 'isDone') {
            const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
            htmlContent += createTableFromArray(value, title);
          }
        });
        
        htmlContent += `</div>`;
      }

      // Instalaciones de Servicio
      if (studyData.serviceInstallations) {
        htmlContent += `
          <div class="subsection">
            <h3 class="subsection-title">⚡ Instalaciones de Servicio</h3>
        `;
        
        Object.entries(studyData.serviceInstallations).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0 && key !== 'isDone') {
            const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
            htmlContent += createTableFromArray(value, title);
          }
        });
        
        htmlContent += `</div>`;
      }

      // Agente Socio Organizacional
      if (studyData.socioOrganizationalAgent) {
        htmlContent += `
          <div class="subsection">
            <h3 class="subsection-title">👥 Agente Socio Organizacional</h3>
        `;
        
        Object.entries(studyData.socioOrganizationalAgent).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0 && key !== 'isDone') {
            const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
            htmlContent += createTableFromArray(value, title);
          }
        });
        
        htmlContent += `</div>`;
      }

      // Agente Geológico
      if (studyData.geologicalAgent) {
        htmlContent += `
          <div class="subsection">
            <h3 class="subsection-title">🌋 Agente Geológico</h3>
        `;
        
        Object.entries(studyData.geologicalAgent).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0 && key !== 'isDone') {
            const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
            htmlContent += createTableFromArray(value, title);
          }
        });
        
        htmlContent += `</div>`;
      }

      // Agente Físico-Químico
      if (studyData.physicochemicalAgent) {
        htmlContent += `
          <div class="subsection">
            <h3 class="subsection-title">⚗️ Agente Físico-Químico</h3>
        `;
        
        Object.entries(studyData.physicochemicalAgent).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0 && key !== 'isDone') {
            const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
            htmlContent += createTableFromArray(value, title);
          }
        });
        
        htmlContent += `</div>`;
      }

      // Agente Sanitario
      if (studyData.sanitaryAgent) {
        htmlContent += `
          <div class="subsection">
            <h3 class="subsection-title">💊 Agente Sanitario</h3>
        `;
        
        Object.entries(studyData.sanitaryAgent).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0 && key !== 'isDone') {
            const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
            htmlContent += createTableFromArray(value, title);
          }
        });
        
        htmlContent += `</div>`;
      }

      // Riesgos Circundantes
      if (studyData.surroundingRisks) {
        htmlContent += `
          <div class="subsection">
            <h3 class="subsection-title">🧭 Riesgos Circundantes</h3>
        `;
        
        Object.entries(studyData.surroundingRisks).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0 && key !== 'isDone') {
            const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
            htmlContent += createTableFromArray(value, title);
          }
        });
        
        htmlContent += `</div>`;
      }

      // Medidas de Seguridad
      if (studyData.securityMeasures) {
        htmlContent += `
          <div class="subsection">
            <h3 class="subsection-title">🚨 Medidas de Seguridad</h3>
        `;
        
        Object.entries(studyData.securityMeasures).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0 && key !== 'isDone') {
            const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
            htmlContent += createTableFromArray(value, title);
          }
        });
        
        htmlContent += `</div>`;
      }

      // Evaluación de Daños
      if (studyData.damageEvaluation) {
        htmlContent += `
          <div class="subsection">
            <h3 class="subsection-title">🧱 Evaluación de Daños</h3>
        `;
        
        Object.entries(studyData.damageEvaluation).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0 && key !== 'isDone') {
            const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
            htmlContent += createTableFromArray(value, title);
          }
        });
        
        htmlContent += `</div>`;
      }

      // Anexos
      if (studyData.attachments) {
        htmlContent += `
          <div class="subsection">
            <h3 class="subsection-title">📎 Anexos</h3>
        `;
        
        Object.entries(studyData.attachments).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0 && key !== 'isDone') {
            const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
            htmlContent += createTableFromArray(value, title);
          }
        });
        
        htmlContent += `</div>`;
      }

      htmlContent += `</div>`;
    }

    htmlContent += `
        </div>
      </body>
      </html>
    `;

    // Abrir nueva ventana con el contenido
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
      showToast({ message: "Plantilla generada correctamente", type: "success" });
    } else {
      showToast({ message: "Error al abrir la ventana. Verifica los bloqueadores de ventanas emergentes", type: "error" });
    }
  };

  if (estado === serverStatesFetching.fetching) {
    return (
      <>
        <LoadingContent />
      </>
    );
  }

  if (estado === serverStatesFetching.error) {
    return <LoadingErrorComponent />;
  }

  const taskScores = Object.entries(listado?.progressSections).map(([key, value]) => {
    const labelObj = estudioSteps.find((estudio) => estudio.key === key);
    return {
      key: key,
      label: labelObj ? labelObj.label : key,
      progress: Math.round(value)
    };
  });

  return (
    <Page title="Listado Detalle">
      <div className="transition-content w-full px-(--margin-x) pt-5 lg:pt-6">
        <h2 className="text-white text-2xl">Listado Detalle</h2>

        <div className="mt-8 flex gap-8">

          <div className="w-full">
            <Card className="flex flex-col p-5 pt-10 ">
              <div className="px-3 text-lg font-semibold">
                <div className="flex items-center space-x-10">
                  <Avatar
                    size={30}
                    name={empresa?.tradeName}
                    classNames={{
                      display: "mask is-squircle rounded-none text-2xl",
                    }}
                  />
                  <div className="flex flex-col space-y-1">
                    <p className="font-normal text-xl text-white">{empresa?.tradeName}</p>
                    <p className="font-light text-primary-400">{listado?.studyId?.studyName}</p>
                    {/*  <p className="font-light text-green-400">• Completado 08.03.25</p> */}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3 px-3 pt-4">
                <Button
                  onClick={close}
                  color="success"
                  className="h-10 text-base font-light"
                >
                  Aprobar
                </Button>

                <Button
                  onClick={handleDescargarPlantilla}
                  color="primary"
                  className="h-10 text-base font-light"
                  disabled={false}
                >
                  Descargar Plantilla
                </Button>
              </div>
            </Card>
          </div>


          <div className="w-[35%]">
            <h1 className="text-lg text-white mb-[2rem]">Total de procesos completados</h1>
            <ol className="steps is-vertical" style={{ borderColor: '#2a2c32' }}>
              {taskScores.map((step, index) => (
                <li
                  className="step pb-6 before:bg-gray-200 dark:before:bg-surface-2"
                  key={index}
                >
                  <div
                    style={{
                      border: `2px solid ${step.progress === 100 ? "#3cb030" : "#757575"}`,
                    }}
                    className="step-header rounded-full bg-gray-200 text-gray-800 dark:bg-surface-2 dark:text-white"
                  >
                    {step.progress === 100 ? <FiCheck className="text-green-500" /> : index + 1}
                  </div>
                  <h3 className="text-gray-600 text-[15px] ltr:ml-4 rtl:mr-4 dark:text-dark-100">
                    {step?.label}: <span className="text-blue-400">{step?.progress} %</span>
                  </h3>
                </li>
              ))}
            </ol>
          </div>

        </div>
      </div>
    </Page>
  );
}

export default ListadoCompleto;