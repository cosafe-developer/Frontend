import { useForm, Controller } from "react-hook-form";
import { Button, Switch, Table, THead, TBody, Th, Tr, Td, Upload } from "components/ui";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useLlenarListadoFormContext } from "../../contexts/LlenarListadoFormContext";
import { useEffect } from "react";
import { deepMergeDefaults } from "../../utils/deepMergeDefaultsInfo";
import { criminalActsElements, majorAccidentsElements, socialDisturbancesElements } from "./utils/elementsTask";
import { resetDataEstudioStep4 } from "./utils/resetDataEstudioStep4";

import updateListado from "api/listados/updateListado";
import uploadImageWithFirma from "api/upload/uploadImageWithFirma.service";

const sections = [
  { key: "majorAccidents", label: "Accidente Mayor", elements: majorAccidentsElements },
  { key: "criminalActs", label: "Acto Delictivo", elements: criminalActsElements },
  { key: "socialDisturbances", label: "Disturbios Sociales", elements: socialDisturbancesElements },
];

const buildDefaultSection = (elements) =>
  elements.map((element, i) => ({
    _uid: i,
    element: element,
    evidenceUrl: null,
    applies: false,
  }));

const filterForBackend = (item) => {
  const out = { element: item.element };
  if (item.evidenceUrl) out.evidenceUrl = item.evidenceUrl;
  if (typeof item.applies !== "undefined") out.applies = item.applies;
  return out;
};

const EstudioStep4 = ({ onNext, onPrev, listado }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const nonStructuralRisksCtx = llenarListadoFormCtx?.state?.formData?.nonStructuralRisks ?? {};
  const structuralRisksCtx = llenarListadoFormCtx?.state?.formData?.structuralRisks ?? {};
  const serviceInstallationsCtx = llenarListadoFormCtx?.state?.formData?.serviceInstallations ?? {};
  const socioOrganizationalAgentCtx = llenarListadoFormCtx?.state?.formData?.socioOrganizationalAgent ?? {};

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const defaultValues = {}

  sections.forEach((section) => {
    defaultValues[section.key] =
      Array.isArray(socioOrganizationalAgentCtx[section.key]) && socioOrganizationalAgentCtx[section.key].length > 0
        ? socioOrganizationalAgentCtx[section.key].map((it, i) => ({
          _uid: i,
          element: it.element ?? section.elements[i] ?? `Elemento ${i + 1}`,
          evidenceUrl: it.evidenceUrl ?? null,
          applies: typeof it.applies === "boolean" ? it.applies : false,
        }))
        : buildDefaultSection(section.elements);
  });

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues,
  });


  useEffect(() => {
    if (listado && socioOrganizationalAgentCtx) {
      const newData = resetDataEstudioStep4({ listado, socioOrganizationalAgentCtx });
      const merged = deepMergeDefaults(defaultValues, newData);
      reset(merged);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, listado]);


  const handleFieldChange = async (sectionKey, rowIndex, changedFields) => {
    try {
      const backendData = listado?.studyData?.socioOrganizationalAgent ?? {};
      const currentArray = watch(sectionKey) || [];
      const updatedArray = [...currentArray];
      updatedArray[rowIndex] = { ...updatedArray[rowIndex], ...changedFields };

      const newServiceSocioOrganizational = {
        ...socioOrganizationalAgentCtx,
        [sectionKey]: updatedArray,
      };



      llenarListadoFormCtx.dispatch({
        type: "SET_FORM_DATA",
        payload: {
          socioOrganizationalAgent: {
            ...newServiceSocioOrganizational,
            isDone: true,
          },
        },
      });

      const merged = {
        ...backendData,
        ...newServiceSocioOrganizational,
      };

      const socioOrganizational = Object.fromEntries(
        Object.entries(merged).map(([key, arr]) => [
          key,
          Array.isArray(arr) ? arr.map(filterForBackend) : arr,
        ])
      );

      await updateListado({
        requestBody: {
          listado_id: listado?._id,
          studyData: {
            socioOrganizationalAgent: {
              ...socioOrganizational,
              isDone: true,
            },
          },
        },
      });
    } catch (err) {
      console.error("Error al actualizar campo de estudio:", err);
    }
  };

  const onSubmit = async () => {
    try {
      onNext();
    } catch (error) {
      console.error("Error al enviar estudio paso 1:", error);
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
                    <Th className="w-[20%] text-center">Evidencia</Th>
                    <Th className="w-[10%] text-center">No / Sí</Th>
                  </Tr>
                </THead>

                <TBody>
                  {rows.map((row, rowIndex) => (
                    <Tr key={row._uid ?? rowIndex} className="border-b border-gray-200 dark:border-dark-500">
                      <Td>{rowIndex + 1}</Td>
                      <Td className="break-words  text-[15px]">{row.element}</Td>

                      {/* EVIDENCIA */}
                      <Td className="text-center">
                        <Upload
                          onChange={async (file) => {
                            const url = await uploadImageWithFirma(file);
                            await handleFieldChange(section.key, rowIndex, { evidenceUrl: url });
                          }}
                        >
                          {({ ...props }) => (
                            <Button color="primary" {...props}>
                              <PlusIcon className="size-5" />
                              Subir Evidencia
                            </Button>
                          )}
                        </Upload>

                        {row.evidenceUrl ? (
                          <div className="mt-1 text-xs">
                            <a className="underline" href={row.evidenceUrl} target="_blank" rel="noreferrer">Ver evidencia</a>
                          </div>
                        ) : null}
                      </Td>

                      {/* === SWITCH (applies) === */}
                      <Td className="text-center">
                        <Controller
                          name={`${section.key}.${rowIndex}.applies`}
                          control={control}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                field.onChange(checked);
                                handleFieldChange(section.key, rowIndex, { applies: checked });
                              }}
                            />
                          )}
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

      <div className="flex justify-end pt-4 space-x-3">
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

export default EstudioStep4;