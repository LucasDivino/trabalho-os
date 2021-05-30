import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  email: Yup.string().required("Este campo é obrigatório"),
  password: Yup.string().required("Este campo é obrigatório"),
});

export const RegisterSchema = Yup.object().shape({
  email: Yup.string().required("Este campo é obrigatório").email(),
  firstName: Yup.string().required("Este campo é obrigatório"),
  lastName: Yup.string().required("Este campo é obrigatório"),
  password: Yup.string()
    .required("Este campo é obrigatório")
    .min(8, "A senha deve conter no mínimo 8 caracteres"),
});
