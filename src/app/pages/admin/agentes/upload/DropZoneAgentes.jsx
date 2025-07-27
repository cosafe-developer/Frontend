// Dropzone.jsx

import { useDropzone } from "react-dropzone";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { Button, Upload } from "components/ui";
import { FileItem } from "components/shared/form/FileItem";

const DropzoneAgentes = ({ files, setFiles }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setFiles((prev) => [...prev, ...acceptedFiles]),
    accept: { "image/png": [".png", ".jpeg", ".jpg"] },
  });

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-[20%]">
      <p className="font-medium text-gray-800 dark:text-dark-100 text-[16px]">Fotografia</p>

      <Upload inputProps={{ ...getInputProps() }} {...getRootProps()}>
        {({ ...props }) => (
          <Button
            {...props}
            unstyled
            className={clsx(
              "mt-3 w-full shrink-0 flex-col rounded-lg border-2 border-dashed py-10",
              isDragActive
                ? "border-primary-600 dark:border-primary-500"
                : "border-gray-300 dark:border-dark-450"
            )}
          >
            <CloudArrowUpIcon className="size-12" />
            <span
              className={clsx(
                "pointer-events-none mt-2",
                isDragActive
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-600 dark:text-dark-200"
              )}
            >
            </span>
          </Button>
        )}
      </Upload>
      <div className="mt-4 flex flex-col space-y-4">
        {files.map((file, index) => (
          <FileItem handleRemove={() => handleRemove(index)} file={file} key={index} />
        ))}
      </div>
    </div>
  );
};

export { DropzoneAgentes as Dropzone };
