import { useForm, Controller } from "react-hook-form";
import { Button, Table, THead, TBody, Th, Tr, Td, Checkbox } from "components/ui";
import EvidenceUpload from "components/custom-ui/upload-button/EvidenceUpload.component";
import { useLlenarListadoFormContext } from "../../contexts/LlenarListadoFormContext";
import { useEffect } from "react";
import { resetDataEstudioStep9 } from "./utils/resetDataEstudioStep9";
import { deepMergeDefaults } from "../../utils/deepMergeDefaultsInfo";
import { alarmSystemElements } from "./utils/elementsTask";
import { useStudyStepPersistence } from "../../utils/useStudyStepPersistence";
import { LabelHelp } from "components/shared/HelpTip";
import { HELP } from "../../../helpers/helpTexts";
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

  const { control, handleSubmit, watch, reset, setValue, getValues } = useForm({ defaultValues });

  useEffect(() => {
    if (listado && securityMeasuresCtx) {
      const newData = resetDataEstudioStep9({ listado, securityMeasuresCtx });
      const merged = deepMergeDefaults(defaultValues, newData);
      reset(merged);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, listado]);

  // Guarda el paso completo (todas las sub-secciones) con los valores actuales
  // del formulario; "Siguiente" guarda con isDone:true antes de avanzar.
  const { handleFieldChange: handleAlarmChange, saveAndNext, isSaving } = useStudyStepPersistence({
    stepKey: "securityMeasures",
    sections: alarmSections,
    filter: filterAlarmForBackend,
    getValues,
    setValue,
    listado,
    onNext,
  });

  const onSubmit = () => saveAndNext();

  const handlePrev = () => {
    // Atrás sólo navega: antes metía claves de formData en stepStatus
    onPrev();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex grow flex-col space-y-10">
      {alarmSections.map((section) => {
        const rows = watch(section.key) || [];
        return (
          <div key={section.key} className="space-y-3">
            <h3 className="text-lg font-medium text-white">
              <LabelHelp label={section.label} help={HELP.common.sectionTable} />
            </h3>
            <div className="overflow-x-auto">
              <Table dense className="w-full text-left rtl:text-right [&_td]:whitespace-normal [&_th]:whitespace-normal">
                <THead>
                  <Tr className="border-b border-gray-200 dark:border-dark-500">
                    <Th className="w-10 text-center" title={HELP.common.index}>#</Th>
                    <Th className="w-full min-w-[10rem]">
                      <LabelHelp label="Elemento a Evaluar" help={HELP.common.element} small />
                    </Th>
                    <Th className="w-px text-center">
                      <LabelHelp label="Evidencia" help={HELP.common.evidence} small />
                    </Th>
                    <Th className="w-px text-center">
                      <LabelHelp label="Existencia" help={HELP.study.security.exists} small />
                    </Th>
                  </Tr>
                </THead>
                <TBody>
                  {rows.map((row, rowIndex) => (
                    <Tr key={row._uid ?? rowIndex} className="border-b border-gray-200 dark:border-dark-500">
                      <Td>{rowIndex + 1}</Td>
                      <Td className="break-words text-[15px]">{row.element}</Td>
                      <Td className="text-center">
                        <EvidenceUpload
                          size="sm"
                          value={row.evidenceUrl}
                          onChange={async (file) => {
                            const url = await uploadImageWithFirma(file, `listado-${listado?._id}`);
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
                              title={HELP.study.security.exists}
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
        <Button type="button" className="min-w-[7rem]" title={HELP.common.back} onClick={handlePrev}>Atrás</Button>
        <Button type="submit" color="primary" className="min-w-[7rem]" disabled={isSaving} title={HELP.common.next}>Siguiente</Button>
      </div>
    </form>
  );
};

export default EstudioStep9;
