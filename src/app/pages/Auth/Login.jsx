// Dependencias
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

// Locales
import logoSrc from "assets/logo.png";
import { Page } from "components/shared/Page";
import { schema } from "./schema";
import { useState } from "react";
import { useAuthContext } from "app/contexts/auth/context";
import { Button, Card, Checkbox, Input, InputErrorMsg } from "components/ui";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, errorMessage } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login({
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page title="Login">
      <main className="min-h-100vh grid w-full grow grid-cols-1 place-items-center">
        <div className="w-full max-w-[26rem] p-4 sm:px-5">
          <div className="text-center">
            <img src={logoSrc} alt="logo-cosafe" className="w-16 h-16 mx-auto" />
            <div className="mt-2">
              <h2 className="text-2xl font-semibold text-gray-600 dark:text-dark-100">
                Bienvenido
              </h2>
              <p className="text-gray-400 dark:text-dark-300">
                Inicia sesión para continuar
              </p>
            </div>
          </div>
          <Card className="mt-5 rounded-lg p-5 lg:p-7">
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <div className="space-y-4">
                <Input
                  label="Correo Electrónico"
                  placeholder="Ingresa tu correo"
                  prefix={
                    <EnvelopeIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
                  }
                  {...register("email")}
                  error={errors?.email?.message}
                />
                <Input
                  label="Contraseña"
                  placeholder="Ingresa tu contraseña"
                  type="password"
                  prefix={
                    <LockClosedIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
                  }
                  {...register("password")}
                  error={errors?.password?.message}
                />
              </div>

              <div className="mt-2">
                <InputErrorMsg
                  when={errorMessage && errorMessage?.mensaje !== ""}
                >
                  {errorMessage?.mensaje}
                </InputErrorMsg>
              </div>

              <div className="mt-4 flex items-center justify-between space-x-2">
                <Checkbox label="Recordarme" />
              </div>

              <Button type="submit" disabled={isLoading} className="mt-5 w-full" color="primary">
                {isLoading ? "Ingresando..." : "Iniciar sesión"}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </Page>
  );
}
