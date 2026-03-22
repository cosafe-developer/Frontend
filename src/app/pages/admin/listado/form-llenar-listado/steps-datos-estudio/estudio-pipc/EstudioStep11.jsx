// EstudioStep1.jsx
import { useForm } from "react-hook-form";
import { Button, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import EvidenceUpload from "components/custom-ui/upload-button/EvidenceUpload.component";
import { useLlenarListadoFormContext } from "../../contexts/LlenarListadoFormContext";
import { useEffect } from "react";
import { resetDataEstudioStep11 } from "./utils/resetDataEstudioStep11";
import { deepMergeDefaults } from "../../utils/deepMergeDefaultsInfo";
import { documentsElements } from "./utils/elementsTask";
import updateListado from "api/listados/updateListado";
import uploadImageWithFirma from "api/upload/uploadImageWithFirma.service";


const sections = [
  { key: "documents", label: "Anexo", elements: documentsElements },
];

const buildDefaultSection = (elements) =>
  elements.map((el, i) => ({
    _uid: i,
    element: el,
    fileUrl: null,
  }));

const filterForBackend = (item) => {
  const out = { element: item.element };
  if (item.fileUrl) out.fileUrl = item.fileUrl;
  return out;
};

// onNext
const EstudioStep11 = ({ onNext, onPrev, listado }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  //? Step 1
  const nonStructuralRisksCtx = llenarListadoFormCtx?.state?.formData?.nonStructuralRisks ?? {};
  // Step 2
  const structuralRisksCtx = llenarListadoFormCtx?.state?.formData?.structuralRisks ?? {};
  //? Step 3
  const serviceInstallationsCtx = llenarListadoFormCtx?.state?.formData?.serviceInstallations ?? {};
  //? Step 4
  const socioOrganizationalAgentCtx = llenarListadoFormCtx?.state?.formData?.socioOrganizationalAgent ?? {};
  //? Step 5
  const geologicalAgentCtx = llenarListadoFormCtx?.state?.formData?.geologicalAgent ?? {};
  //? Step 6
  const physicochemicalAgentCtx = llenarListadoFormCtx?.state?.formData?.physicochemicalAgent ?? {};
  //? Step 7
  const sanitaryAgentCtx = llenarListadoFormCtx?.state?.formData?.sanitaryAgent ?? {};
  //? Step 8
  const surroundingRisksCtx = llenarListadoFormCtx?.state?.formData?.surroundingRisks ?? {};
  //? Step 9
  const securityMeasuresCtx = llenarListadoFormCtx?.state?.formData?.securityMeasures ?? {};
  //? Step 10
  const damageEvaluationCtx = llenarListadoFormCtx?.state?.formData?.damageEvaluation ?? {};
  //? Step 11 -> Actual
  const attachmentsCtx = llenarListadoFormCtx?.state?.formData?.attachments ?? {};

  const defaultValues = {}

  sections.forEach((section) => {
    defaultValues[section.key] =
      Array.isArray(attachmentsCtx[section.key]) && attachmentsCtx[section.key].length > 0
        ? attachmentsCtx[section.key].map((it, i) => ({
          _uid: i,
          element: it.element ?? section.elements[i] ?? `Elemento ${i + 1}`,
          fileUrl: it.fileUrl ?? null,
        }))
        : buildDefaultSection(section.elements);
  });

  const { handleSubmit, setValue, watch, reset } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (listado && attachmentsCtx) {
      const newData = resetDataEstudioStep11({ listado, attachmentsCtx });
      const merged = deepMergeDefaults(defaultValues, newData);
      reset(merged);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, listado]);


  const handleFieldChange = async (sectionKey, rowIndex, changedFields) => {
    try {
      const currentArray = watch(sectionKey) || [];
      const updatedArray = [...currentArray];
      updatedArray[rowIndex] = { ...updatedArray[rowIndex], ...changedFields };

      setValue(sectionKey, updatedArray);

      llenarListadoFormCtx.dispatch({
        type: "SET_FORM_DATA",
        payload: {
          attachments: {
            ...attachmentsCtx,
            [sectionKey]: updatedArray,
          },
        },
      });

      const backendData = listado?.studyData?.attachments ?? {};

      const merged = {
        ...backendData,
        ...attachmentsCtx,
        [sectionKey]: updatedArray,
      };


      const attachments = Object.fromEntries(
        Object.entries(merged).map(([key, arr]) => [
          key,
          Array.isArray(arr) ? arr.map(filterForBackend) : arr,
        ])
      );


      await updateListado({
        requestBody: {
          listado_id: listado?._id,
          studyData: {
            attachments: attachments,
          },
        },
      });
    } catch (err) {
      console.error("Error al actualizar campo de estudio:", err);
    }
  };

  const onSubmit = async () => {
    try {
      llenarListadoFormCtx.dispatch({
        type: "SET_FORM_DATA",
        payload: {
          attachments: {
            ...attachmentsCtx,
            isDone: true,
          },
        },
      });

      const backendData = listado?.studyData?.attachments ?? {};
      const merged = { ...backendData, ...attachmentsCtx };
      const cleanAttachments = Object.fromEntries(
        Object.entries(merged).map(([key, arr]) => [
          key,
          Array.isArray(arr) ? arr.map(filterForBackend) : arr,
        ])
      );

      await updateListado({
        requestBody: {
          listado_id: listado?._id,
          studyData: {
            attachments: {
              ...cleanAttachments,
              isDone: true,
            },
          },
        },
      });

      onNext();
    } catch (error) {
      console.error("Error al enviar estudio paso 11:", error);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex grow flex-col space-y-8">
      {sections.map((section) => {
        const rows = watch(section.key) || [];
        return (
          <div key={section.key} className="space-y-3">
            <h3 className="text-lg font-medium text-white">{section.label}</h3>
            <div className="overflow-x-auto">
              <Table className="w-full text-left rtl:text-right">
                <THead>
                  <Tr className="border-b border-gray-200 dark:border-dark-500">
                    <Th className="w-[5%] text-center">#</Th>
                    <Th className="w-[45%] min-w-[250px] break-words">Elemento a Evaluar</Th>
                    <Th className="w-[30%] text-center">Archivo</Th>
                  </Tr>
                </THead>

                <TBody>
                  {rows.map((row, rowIndex) => (
                    <Tr key={row._uid ?? rowIndex} className="border-b border-gray-200 dark:border-dark-500">
                      <Td>{rowIndex + 1}</Td>
                      <Td className="break-words  text-[15px]">{row.element}</Td>

                      {/* ARCHIVO */}
                      <Td className="text-center">
                        <EvidenceUpload
                          value={row.fileUrl}
                          onChange={async (file) => {
                            const url = await uploadImageWithFirma(file);
                            await handleFieldChange(section.key, rowIndex, { fileUrl: url });
                          }}
                          onRemove={() => handleFieldChange(section.key, rowIndex, { fileUrl: null })}
                        />
                      </Td>

                    </Tr>
                  ))}
                </TBody>
              </Table>
            </div>
          </div>
        );
      })}

      <div className="flex justify-end pt-4">
        <Button
          type="button"
          className="min-w-[7rem]"
          onClick={() => {
            llenarListadoFormCtx.dispatch({
              type: "SET_STEP_STATUS",
              payload: {
                //? Step 1
                nonStructuralRisks: {
                  ...nonStructuralRisksCtx,
                  isDone: listado?.studyData?.nonStructuralRisks?.isDone ?? false,
                },
                //? Step 2
                structuralRisks: {
                  ...structuralRisksCtx,
                  isDone: listado?.studyData?.structuralRisks?.isDone ?? false,
                },
                //? Step 3
                serviceInstallations: {
                  ...serviceInstallationsCtx,
                  isDone: listado?.studyData?.serviceInstallations?.isDone ?? false,
                },
                //? Step 4
                socioOrganizationalAgent: {
                  ...socioOrganizationalAgentCtx,
                  isDone: listado?.studyData?.socioOrganizationalAgent?.isDone ?? false,
                },
                //? Step 5
                geologicalAgent: {
                  ...geologicalAgentCtx,
                  isDone: listado?.studyData?.geologicalAgent?.isDone ?? false,
                },
                //? Step 6
                physicochemicalAgent: {
                  ...physicochemicalAgentCtx,
                  isDone: listado?.studyData?.physicochemicalAgent?.isDone ?? false,
                },
                //? Step 7
                sanitaryAgent: {
                  ...sanitaryAgentCtx,
                  isDone: listado?.studyData?.sanitaryAgent?.isDone ?? false,
                },
                //? Step 8
                surroundingRisks: {
                  ...surroundingRisksCtx,
                  isDone: listado?.studyData?.surroundingRisks?.isDone ?? false,
                },
                //? Step 9
                securityMeasures: {
                  ...securityMeasuresCtx,
                  isDone: listado?.studyData?.securityMeasures?.isDone ?? false,
                },
                //? Step 10
                damageEvaluation: {
                  ...damageEvaluationCtx,
                  isDone: listado?.studyData?.damageEvaluation?.isDone ?? false,
                },
                //? Step 11
                attachments: {
                  ...attachmentsCtx,
                  isDone: listado?.studyData?.attachments?.isDone ?? false,
                },
              },
            });

            onPrev()
          }}
        >
          Atrás
        </Button>

        <Button type="submit" color="primary" className="min-w-[7rem]">
          Siguiente
        </Button>
      </div>
    </form>
  );
};

export default EstudioStep11;