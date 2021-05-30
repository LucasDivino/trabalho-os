import React, { useCallback, useContext } from "react";
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
import { LoginSchema } from "../../../validators";
import { post } from "../../../services";
import AuthContext from "../../../context";

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

const initialValues = { email: "", password: "" };

export default function Login() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const { values, handleSubmit, setFieldValue, errors } = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async () => {
      const response = await post("user/auth", {
        username: values.email,
        password: values.password,
      });
      if (response.status === 200) {
        setAuth({
          authorized: true,
          token: response.data.token,
          user: response.data.user_id,
        });
        navigate("/");
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
          Conectar-se
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
            Entrar
          </Button>
          <Grid container>
            <Grid item>
              Não tem uma conta?
              <Link onClick={() => navigate("/register")}> Registre-se</Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
