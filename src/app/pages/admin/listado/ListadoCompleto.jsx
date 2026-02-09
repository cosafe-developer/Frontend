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

      data.forEach((row) => {
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
          @page {
            size: A4;
            margin: 2.54cm;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Calibri', 'Arial', sans-serif;
            background: #ffffff;
            padding: 0;
            color: #000000;
            font-size: 11pt;
            line-height: 1.5;
          }
          
          .container {
            max-width: 21cm;
            margin: 0 auto;
            background: #ffffff;
            padding: 0;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30pt;
            padding-bottom: 15pt;
            border-bottom: 2pt solid #000000;
          }
          
          .header h1 {
            color: #000000;
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 12pt;
            font-family: 'Calibri', 'Arial', sans-serif;
          }
          
          .header-info {
            display: table;
            width: 100%;
            margin-top: 15pt;
            border-collapse: collapse;
            border: 1pt solid #000000;
          }
          
          .info-item {
            display: table-cell;
            padding: 8pt 12pt;
            border: 1pt solid #000000;
            text-align: left;
            vertical-align: top;
            width: 25%;
          }
          
          .info-item strong {
            color: #000000;
            display: block;
            margin-bottom: 4pt;
            font-weight: bold;
            font-size: 10pt;
          }
          
          .info-item span {
            color: #000000;
            font-size: 10pt;
          }
          
          .section {
            margin-bottom: 24pt;
            page-break-inside: avoid;
          }
          
          .section-title {
            background: #ffffff;
            color: #000000;
            padding: 8pt 0;
            border-bottom: 1.5pt solid #000000;
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 12pt;
            margin-top: 18pt;
            font-family: 'Calibri', 'Arial', sans-serif;
          }
          
          .subsection {
            margin-bottom: 18pt;
            background: #ffffff;
            padding: 0;
            border: none;
          }
          
          .subsection-title {
            color: #000000;
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 10pt;
            margin-top: 14pt;
            padding-bottom: 4pt;
            border-bottom: 1pt solid #000000;
            font-family: 'Calibri', 'Arial', sans-serif;
          }
          
          .table-section {
            margin-bottom: 18pt;
            background: #ffffff;
            padding: 0;
            border: none;
          }
          
          .table-title {
            color: #000000;
            font-size: 11pt;
            font-weight: bold;
            margin-bottom: 8pt;
            margin-top: 12pt;
            padding-bottom: 4pt;
            border-bottom: 0.5pt solid #666666;
            font-family: 'Calibri', 'Arial', sans-serif;
          }
          
          .data-table {
            width: 100%;
            border-collapse: collapse;
            background: #ffffff;
            border: 1pt solid #000000;
            margin-bottom: 12pt;
            font-size: 10pt;
          }
          
          .data-table thead {
            background: #f0f0f0;
            color: #000000;
          }
          
          .data-table th {
            padding: 8pt 10pt;
            text-align: left;
            font-weight: bold;
            border: 1pt solid #000000;
            background: #f0f0f0;
            font-size: 10pt;
            font-family: 'Calibri', 'Arial', sans-serif;
          }
          
          .data-table td {
            padding: 6pt 10pt;
            border: 1pt solid #000000;
            word-wrap: break-word;
            color: #000000;
            font-size: 10pt;
            vertical-align: top;
          }
          
          .data-table tbody tr {
            background: #ffffff;
          }
          
          .data-table tbody tr:nth-child(even) {
            background: #f9f9f9;
          }
          
          .data-table tbody tr:last-child td {
            border-bottom: 1pt solid #000000;
          }
          
          .field-name {
            font-weight: bold;
            color: #000000;
            width: 30%;
            background: #f5f5f5;
          }
          
          .no-data {
            text-align: center;
            color: #666666;
            font-style: italic;
            padding: 12pt;
            background: #ffffff;
            border: 1pt dashed #999999;
            margin: 12pt 0;
          }
          
          p {
            margin-bottom: 6pt;
            text-align: justify;
          }
          
          @media screen {
            body {
              background: #f5f5f5;
              padding: 20px;
            }
            
            .container {
              background: #ffffff;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              padding: 2.54cm;
              margin: 20px auto;
            }
          }
          
          @media print {
            body {
              background: #ffffff;
              padding: 0;
            }
            
            .container {
              box-shadow: none;
              padding: 0;
            }
            
            .section {
              page-break-inside: avoid;
            }
            
            .data-table {
              page-break-inside: auto;
            }
            
            .data-table tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>PLANTILLA DEL LISTADO</h1>
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
          <h2 class="section-title">1. INFORMACIÓN DE LA EMPRESA</h2>
          ${createTableFromObject(listado.companyInfo, 'Datos Generales')}
        </div>
      `;
    }

    // Información de Dirección
    if (listado?.addressInfo) {
      htmlContent += `
        <div class="section">
          <h2 class="section-title">2. INFORMACIÓN DE DIRECCIÓN</h2>
          ${createTableFromObject(listado.addressInfo, 'Datos del Inmueble')}
        </div>
      `;
    }

    // Información de Riesgo
    if (listado?.riskInfo) {
      htmlContent += `
        <div class="section">
          <h2 class="section-title">3. INFORMACIÓN DE RIESGO</h2>
          ${createTableFromObject(listado.riskInfo, 'Riesgos Generales')}
        </div>
      `;
    }

    // Datos del Estudio
    if (listado?.studyData) {
      htmlContent += `
        <div class="section">
          <h2 class="section-title">4. DATOS DEL ESTUDIO</h2>
      `;

      const studyData = listado.studyData;

      // Riesgos No Estructurales
      if (studyData.nonStructuralRisks) {
        htmlContent += `
          <div class="subsection">
            <h3 class="subsection-title">4.1. RIESGOS NO ESTRUCTURALES</h3>
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
            <h3 class="subsection-title">4.2. RIESGOS ESTRUCTURALES</h3>
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
            <h3 class="subsection-title">4.3. INSTALACIONES DE SERVICIO</h3>
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
            <h3 class="subsection-title">4.4. AGENTE SOCIO ORGANIZACIONAL</h3>
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
            <h3 class="subsection-title">4.5. AGENTE GEOLÓGICO</h3>
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
            <h3 class="subsection-title">4.6. AGENTE FÍSICO-QUÍMICO</h3>
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
            <h3 class="subsection-title">4.7. AGENTE SANITARIO</h3>
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
            <h3 class="subsection-title">4.8. RIESGOS CIRCUNDANTES</h3>
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
            <h3 class="subsection-title">4.9. MEDIDAS DE SEGURIDAD</h3>
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
            <h3 class="subsection-title">4.10. EVALUACIÓN DE DAÑOS</h3>
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
            <h3 class="subsection-title">4.11. ANEXOS</h3>
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