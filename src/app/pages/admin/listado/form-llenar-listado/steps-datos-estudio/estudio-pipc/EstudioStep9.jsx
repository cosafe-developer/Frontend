import { useForm, Controller } from "react-hook-form";
import { Button, Table, THead, TBody, Th, Tr, Td, Checkbox } from "components/ui";
import EvidenceUpload from "components/custom-ui/upload-button/EvidenceUpload.component";
import { useLlenarListadoFormContext } from "../../contexts/LlenarListadoFormContext";
import { useEffect } from "react";
import { resetDataEstudioStep9 } from "./utils/resetDataEstudioStep9";
import { deepMergeDefaults } from "../../utils/deepMergeDefaultsInfo";
import { alarmSystemElements } from "./utils/elementsTask";
import updateListado from "api/listados/updateListado";
import uploadImageWithFirma from "api/upload/uploadImageWithFirma.service";

const alarmSections = [
  { key: "alarmSystem", label: "Sistema de Alarma", elements: alarmSystemElements },
];

const buildDefaultAlarm = (elements) =>
  elements.map((el, i) => ({
    _uid: i,
    element: el,
    evidenceUrl: null,
    exists: false,
  }));

const filterAlarmForBackend = (item) => {
  const out = { element: item.element };
  if (item.evidenceUrl) out.evidenceUrl = item.evidenceUrl;
  if (typeof item.exists !== "undefined") out.exists = item.exists;
  return out;
};

const EstudioStep9 = ({ onNext, onPrev, listado }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  const securityMeasuresCtx = llenarListadoFormCtx?.state?.formData?.securityMeasures ?? {};

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const defaultValues = {};
  alarmSections.forEach((section) => {
    defaultValues[section.key] =
      Array.isArray(securityMeasuresCtx[section.key]) && securityMeasuresCtx[section.key].length > 0
        ? securityMeasuresCtx[section.key].map((item, i) => ({
            _uid: i,
            element: item.element ?? section.elements[i] ?? `Elemento ${i + 1}`,
            evidenceUrl: item.evidenceUrl ?? null,
            exists: typeof item.exists === "boolean" ? item.exists : false,
          }))
        : buildDefaultAlarm(section.elements);
  });

  const { control, handleSubmit, watch, reset, setValue } = useForm({ defaultValues });

  useEffect(() => {
    if (listado && securityMeasuresCtx) {
      const newData = resetDataEstudioStep9({ listado, securityMeasuresCtx });
      const merged = deepMergeDefaults(defaultValues, newData);
      reset(merged);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, listado]);

  const handleAlarmChange = async (sectionKey, rowIndex, changedFields) => {
    try {
      const currentArray = watch(sectionKey) || [];
      const updatedArray = [...currentArray];
      updatedArray[rowIndex] = { ...updatedArray[rowIndex], ...changedFields };
      setValue(sectionKey, updatedArray);

      const newSecurityMeasures = { ...securityMeasuresCtx, [sectionKey]: updatedArray };

      llenarListadoFormCtx.dispatch({
        type: "SET_FORM_DATA",
        payload: { securityMeasures: { ...newSecurityMeasures, isDone: true } },
      });

      const backendData = listado?.studyData?.securityMeasures ?? {};
      const merged = { ...backendData, ...newSecurityMeasures };
      const cleaned = Object.fromEntries(
        Object.entries(merged).map(([key, arr]) => [
          key,
          Array.isArray(arr) ? arr.map(filterAlarmForBackend) : arr,
        ])
      );

      await updateListado({
        requestBody: {
          listado_id: listado?._id,
          studyData: { securityMeasures: { ...cleaned, isDone: true } },
        },
      });
    } catch (err) {
      console.error("Error al actualizar alarma:", err);
    }
  };

  const onSubmit = async () => { onNext(); };

  const handlePrev = () => {
    llenarListadoFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: {
        securityMeasures: {
          ...securityMeasuresCtx,
          isDone: listado?.studyData?.securityMeasures?.isDone ?? false,
        },
      },
    });
    onPrev();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex grow flex-col space-y-10">
      {alarmSections.map((section) => {
        const rows = watch(section.key) || [];
        return (
          <div key={section.key} className="space-y-3">
            <h3 className="text-lg font-medium text-white">{section.label}</h3>
            <div className="overflow-x-auto">
              <Table className="w-full text-left rtl:text-right">
                <THead>
                  <Tr className="border-b border-gray-200 dark:border-dark-500">
                    <Th className="w-[5%] text-center">#</Th>
                    <Th className="w-[45%] min-w-[250px]">Elemento a Evaluar</Th>
                    <Th className="w-[20%] text-center">Evidencia</Th>
                    <Th className="w-[10%] text-center">Existencia</Th>
                  </Tr>
                </THead>
                <TBody>
                  {rows.map((row, rowIndex) => (
                    <Tr key={row._uid ?? rowIndex} className="border-b border-gray-200 dark:border-dark-500">
                      <Td>{rowIndex + 1}</Td>
                      <Td className="text-[15px]">{row.element}</Td>
                      <Td className="text-center">
                        <EvidenceUpload
                          value={row.evidenceUrl}
                          onChange={async (file) => {
                            const url = await uploadImageWithFirma(file);
                            await handleAlarmChange(section.key, rowIndex, { evidenceUrl: url });
                          }}
                          onRemove={() => handleAlarmChange(section.key, rowIndex, { evidenceUrl: null })}
                        />
                      </Td>
                      <Td className="text-center">
                        <Controller
                          name={`${section.key}.${rowIndex}.exists`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              color="success"
                              checked={field.value || false}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                field.onChange(checked);
                                handleAlarmChange(section.key, rowIndex, { exists: checked });
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
        <Button type="button" className="min-w-[7rem]" onClick={handlePrev}>Atrás</Button>
        <Button type="submit" color="primary" className="min-w-[7rem]">Siguiente</Button>
      </div>
    </form>
  );
};

export default EstudioStep9;
