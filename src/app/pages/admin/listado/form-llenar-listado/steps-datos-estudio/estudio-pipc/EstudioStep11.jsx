// EstudioStep1.jsx
import { useForm } from "react-hook-form";
import { Button, THead, TBody, Th, Tr, Td } from "components/ui";
import { StackTable } from "components/shared/StackTable";
import { DocumentIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import MultiFileUpload from "components/custom-ui/upload-button/MultiFileUpload";
import { ConfirmModal } from "components/shared/ConfirmModal";
import { LabelHelp } from "components/shared/HelpTip";
import { displayFileName } from "helpers/listadoData";
import { useLlenarListadoFormContext } from "../../contexts/LlenarListadoFormContext";
import { useEffect, useState } from "react";
import { resetDataEstudioStep11 } from "./utils/resetDataEstudioStep11";
import { deepMergeDefaults } from "../../utils/deepMergeDefaultsInfo";
import { documentsElements } from "./utils/elementsTask";
import updateListado from "api/listados/updateListado";
import uploadImageWithFirma from "api/upload/uploadImageWithFirma.service";
import { progressPercentageOf } from "../../../helpers/calculateProgressGeneralListado.js";
import { HELP } from "../../../helpers/helpTexts";
import {
  addAttachmentFiles,
  attachmentFiles,
  attachmentForBackend,
  removeAttachmentFile,
} from "./utils/attachments";


const sections = [
  { key: "documents", label: "Anexo", elements: documentsElements },
];

const buildDefaultSection = (elements) =>
  elements.map((el, i) => ({
    _uid: i,
    element: el,
    fileUrls: [],
    fileUrl: null,
  }));

// { element, fileUrls: [...], fileUrl: fileUrls[0] } (ver utils/attachments.js)
const filterForBackend = attachmentForBackend;

const ANNEX_ACCEPT = "image/*,application/pdf,.pdf";
const isPdfUrl = (url) => /\.pdf($|[?#])/i.test(url || "");

// onNext
const EstudioStep11 = ({ onNext, onPrev, listado }) => {
  const llenarListadoFormCtx = useLlenarListadoFormContext();
  //? Step 11 -> Actual
  const attachmentsCtx = llenarListadoFormCtx?.state?.formData?.attachments ?? {};

  const defaultValues = {}

  sections.forEach((section) => {
    defaultValues[section.key] =
      Array.isArray(attachmentsCtx[section.key]) && attachmentsCtx[section.key].length > 0
        ? attachmentsCtx[section.key].map((it, i) => ({
          _uid: i,
          element: it.element ?? section.elements[i] ?? `Elemento ${i + 1}`,
          fileUrls: attachmentFiles(it),
          fileUrl: attachmentFiles(it)[0] ?? null,
        }))
        : buildDefaultSection(section.elements);
  });

  const { handleSubmit, setValue, getValues, watch, reset } = useForm({
    defaultValues,
  });

  // Archivo a quitar (confirmación): { sectionKey, rowIndex, url, name }
  const [pendingRemove, setPendingRemove] = useState(null);

  useEffect(() => {
    if (listado && attachmentsCtx) {
      const newData = resetDataEstudioStep11({ listado, attachmentsCtx });
      const merged = deepMergeDefaults(defaultValues, newData);
      reset(merged);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, listado]);


  // `change` es un objeto con los campos nuevos o una función (fila => fila)
  // que se aplica sobre la ÚLTIMA versión de la fila (getValues), para que
  // subidas que terminan a destiempo no se pisen entre sí.
  const handleFieldChange = async (sectionKey, rowIndex, change) => {
    try {
      const currentArray = getValues(sectionKey) || [];
      const updatedArray = [...currentArray];
      const row = updatedArray[rowIndex] ?? {};
      updatedArray[rowIndex] =
        typeof change === "function" ? change(row) : { ...row, ...change };

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
          // Avance con el mismo cálculo que el detalle y la lista
          progressPercentage: progressPercentageOf(
            {
              ...(llenarListadoFormCtx?.state?.formData ?? {}),
              attachments: { ...attachmentsCtx, isDone: true },
            },
            llenarListadoFormCtx?.state?.stepApplicability,
          ),
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
            <h3 className="text-lg font-medium text-white">
              <LabelHelp label={section.label} help={HELP.study.attachments.file} />
            </h3>
            <div className="overflow-x-auto">
              <StackTable dense className="w-full text-left rtl:text-right [&_td]:whitespace-normal [&_th]:whitespace-normal">
                <THead>
                  <Tr className="border-b border-gray-200 dark:border-dark-500">
                    <Th className="w-10 text-center" title={HELP.common.index}>#</Th>
                    <Th className="w-full min-w-[10rem]">
                      <LabelHelp label="Elemento a Evaluar" help={HELP.common.element} small />
                    </Th>
                    <Th className="min-w-[12rem] text-center">
                      <LabelHelp label="Archivos" help={HELP.study.attachments.file} small />
                    </Th>
                  </Tr>
                </THead>

                <TBody>
                  {rows.map((row, rowIndex) => (
                    <Tr key={row._uid ?? rowIndex} className="border-b border-gray-200 dark:border-dark-500">
                      <Td>{rowIndex + 1}</Td>
                      <Td className="break-words text-[15px]">{row.element}</Td>

                      {/* ARCHIVOS (varios por fila) */}
                      <Td className="align-top">
                        <div className="flex flex-col items-stretch gap-2">
                          {attachmentFiles(row).length > 0 && (
                            <ul className="space-y-1">
                              {attachmentFiles(row).map((url, fileIndex) => {
                                const name = displayFileName(url) || `Archivo ${fileIndex + 1}`;
                                const Icon = isPdfUrl(url) ? DocumentIcon : PhotoIcon;
                                return (
                                  <li
                                    key={url}
                                    className="flex items-center gap-1.5 rounded-md bg-gray-50 px-2 py-1 text-xs dark:bg-dark-600"
                                  >
                                    <Icon className="size-4 shrink-0 text-gray-400" aria-hidden="true" />
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="min-w-0 flex-1 truncate text-primary-500 hover:underline dark:text-primary-400"
                                      title={`Abrir ${name}`}
                                    >
                                      {name}
                                    </a>
                                    <button
                                      type="button"
                                      aria-label={`Quitar ${name}`}
                                      title={HELP.study.attachments.removeFile}
                                      onClick={() =>
                                        setPendingRemove({ sectionKey: section.key, rowIndex, url, name })
                                      }
                                      className="shrink-0 cursor-pointer rounded-full p-0.5 text-error hover:bg-error/10"
                                    >
                                      <XMarkIcon className="size-3.5" />
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                          <MultiFileUpload
                            variant="button"
                            size="sm"
                            accept={ANNEX_ACCEPT}
                            label={attachmentFiles(row).length ? "Agregar archivos" : "Subir archivos"}
                            title={HELP.study.attachments.addFiles}
                            upload={(file) => uploadImageWithFirma(file, `listado-${listado?._id}`)}
                            onUploaded={(urls) =>
                              handleFieldChange(section.key, rowIndex, (current) =>
                                addAttachmentFiles(current, urls),
                              )
                            }
                            className="items-center"
                          />
                        </div>
                      </Td>

                    </Tr>
                  ))}
                </TBody>
              </StackTable>
            </div>
          </div>
        );
      })}

      <div className="flex justify-end pt-4">
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

        <Button type="submit" color="primary" className="min-w-[7rem]" title={HELP.study.attachments.finish}>
          Finalizar
        </Button>
      </div>

      <ConfirmModal
        show={pendingRemove !== null}
        onClose={() => setPendingRemove(null)}
        onOk={() => {
          const target = pendingRemove;
          setPendingRemove(null);
          if (!target) return;
          handleFieldChange(target.sectionKey, target.rowIndex, (current) => {
            // Se busca por URL: la lista pudo cambiar mientras se confirmaba
            const idx = attachmentFiles(current).indexOf(target.url);
            return idx === -1 ? current : removeAttachmentFile(current, idx);
          });
        }}
        state="pending"
        messages={{
          pending: {
            title: "¿Quitar archivo del anexo?",
            description: `Se quitará "${pendingRemove?.name ?? ""}" de este anexo.`,
            actionText: "Sí, quitar",
          },
        }}
      />
    </form>
  );
};

export default EstudioStep11;