import { useForm, Controller } from "react-hook-form";
import { Button, Switch, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import EvidenceUpload from "components/custom-ui/upload-button/EvidenceUpload.component";
import { useLlenarListadoFormContext } from "../../contexts/LlenarListadoFormContext";
import { useEffect } from "react";
import { deepMergeDefaults } from "../../utils/deepMergeDefaultsInfo";
import { criminalActsElements, majorAccidentsElements, socialDisturbancesElements } from "./utils/elementsTask";
import { resetDataEstudioStep4 } from "./utils/resetDataEstudioStep4";

import { useStudyStepPersistence } from "../../utils/useStudyStepPersistence";
import { LabelHelp } from "components/shared/HelpTip";
import { HELP } from "../../../helpers/helpTexts";
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

  const { control, handleSubmit, watch, reset, setValue, getValues } = useForm({
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


  // Guarda el paso completo (todas las sub-secciones) con los valores actuales
  // del formulario; "Siguiente" guarda con isDone:true antes de avanzar.
  const { handleFieldChange, saveAndNext, isSaving } = useStudyStepPersistence({
    stepKey: "socioOrganizationalAgent",
    sections,
    filter: filterForBackend,
    getValues,
    setValue,
    listado,
    onNext,
  });

  const onSubmit = () => saveAndNext();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex grow flex-col space-y-8">
      {sections.map((section) => {
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
                      <LabelHelp label="No / Sí" help={HELP.study.agent.applies} small />
                    </Th>
                  </Tr>
                </THead>

                <TBody>
                  {rows.map((row, rowIndex) => (
                    <Tr key={row._uid ?? rowIndex} className="border-b border-gray-200 dark:border-dark-500">
                      <Td>{rowIndex + 1}</Td>
                      <Td className="break-words text-[15px]">{row.element}</Td>

                      {/* EVIDENCIA */}
                      <Td className="text-center">
                        <EvidenceUpload
                          size="sm"
                          value={row.evidenceUrl}
                          onChange={async (file) => {
                            const url = await uploadImageWithFirma(file, `listado-${listado?._id}`);
                            await handleFieldChange(section.key, rowIndex, { evidenceUrl: url });
                          }}
                          onRemove={() => handleFieldChange(section.key, rowIndex, { evidenceUrl: null })}
                        />
                      </Td>

                      {/* === SWITCH (applies) === */}
                      <Td className="text-center">
                        <Controller
                          name={`${section.key}.${rowIndex}.applies`}
                          control={control}
                          render={({ field }) => (
                            <Switch
                              title={HELP.study.agent.applies}
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
          title={HELP.common.back}
          onClick={() => {
            // Atrás sólo navega: antes metía claves de formData en stepStatus

            onPrev()
          }}
        >
          Atrás
        </Button>

        <Button type="submit" color="primary" className="min-w-[7rem]" disabled={isSaving} title={HELP.common.next}>
          Siguiente
        </Button>
      </div>
    </form>
  );
};

export default EstudioStep4;