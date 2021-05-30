import React, { useCallback } from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Avatar,
  Container,
  Link,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import AirportShuttleIcon from "@material-ui/icons/AirportShuttle";
import { makeStyles } from "@material-ui/core/styles";
import { useFormik } from "formik";
import { RegisterSchema } from "../../../validators";
import { post } from "../../../services";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const initialValues = { email: "", password: "", firstName: "", lastName: "" };

export default function Register() {
  const classes = useStyles();
  const navigate = useNavigate();

  const { values, handleSubmit, setFieldValue, errors } = useFormik({
    initialValues,
    validationSchema: RegisterSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async () => {
      const response = await post("user/register", {
        username: values.email,
        email: values.email,
        first_name: values.firstName,
        last_name: values.lastName,
        password: values.password,
      });

      if (response.status === 201) {
        navigate("/login");
      }
    },
  });

  const handleChange = useCallback(
    (e) => {
      setFieldValue(e.currentTarget.name, e.currentTarget.value);
    },
    [setFieldValue]
  );

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AirportShuttleIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registrar-se
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
          <TextField
            error={!!errors.email}
            helperText={errors.email}
            value={values.email}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoFocus
          />
          <TextField
            error={!!errors.firstName}
            helperText={errors.firstName}
            value={values.firstName}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            fullWidth
            id="firstName"
            label="Nome"
            name="firstName"
          />
          <TextField
            error={!!errors.lastName}
            helperText={errors.lastName}
            value={values.lastName}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            fullWidth
            id="lastName"
            label="Sobrenome"
            name="lastName"
          />
          <TextField
            error={!!errors.password}
            helperText={errors.password}
            value={values.password}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Registrar
          </Button>
          <Grid container>
            <Grid item>
              Já possui uma conta?
              <Link onClick={() => navigate("/login")}> Conecte-se</Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
