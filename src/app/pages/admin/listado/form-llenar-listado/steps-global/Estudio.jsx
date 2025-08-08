// Import Dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

// Local Imports
// import { ContextualHelp } from "components/shared/ContextualHelp";
// import { TextEditor } from "components/shared/form/TextEditor";
import { Button } from "components/ui";
import { useLlenarListadoFormContext } from "../LlenarListadoFormContext";
// import { MetaTags } from "../components/MetaTags";
import { estudioSchema } from "../schema";

import { Basic } from "../../basic-table/Basic";

// ----------------------------------------------------------------------

// const editorModules = {
//   toolbar: [
//     ["bold", "italic", "underline", "strike"], // toggled buttons
//     ["blockquote", "code-block"],
//     [{ header: 1 }, { header: 2 }], // custom button values
//     [{ list: "ordered" }, { list: "bullet" }],
//     [{ script: "sub" }, { script: "super" }], // superscript/subscript
//     [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
//     [{ direction: "rtl" }], // text direction
//     [{ size: ["small", false, "large", "huge"] }], // custom dropdown
//     [{ header: [1, 2, 3, 4, 5, 6, false] }],
//     [{ color: [] }, { background: [] }], // dropdown with defaults from theme
//     [{ font: [] }],
//     [{ align: [] }, "image"],
//     ["clean"], // remove formatting button
//   ],
// };

export function Estudio({ setCurrentStep }) {
  const addProductFormCtx = useLlenarListadoFormContext();

  const {
    // register,
    handleSubmit,
    // formState: { errors },
    // control,
  } = useForm({
    resolver: yupResolver(estudioSchema),
    defaultValues: addProductFormCtx.state.formData.estudio,
  });

  const onSubmit = (data) => {
    addProductFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { estudio: { ...data } },
    });
    addProductFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: { estudio: { isDone: true } },
    });
    setCurrentStep(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div>
        <Basic />
      </div>
      <div className="mt-4 flex justify-end space-x-3 ">
        <Button className="min-w-[7rem]" onClick={() => setCurrentStep(0)}>
          Regresar
        </Button>
        {/* <Button type="submit" className="min-w-[7rem]" color="primary">
          Siguiente
        </Button> */}
      </div>
    </form>
  );
}

Estudio.propTypes = {
  setCurrentStep: PropTypes.func,
};
