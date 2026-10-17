import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "../../../components/Icon";
import Logo from "../../../layouts/site/components/Logo";
import { loginAdmin } from "../../../services/adminApiService";
import { setAuthSession } from "../../../services/apiHelpers";
import type { ApiError } from "../../../services/apiHelpers";
import { adminLoginSchema } from "./schema/adminLoginSchema";
import type { AdminLoginFormValues } from "./schema/adminLoginSchema";
import "../../contact/Contact.css";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormValues>({
    resolver: yupResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const onSubmit = async (values: AdminLoginFormValues) => {
    setServerError(null);
    try {
      const result = await loginAdmin({ email: values.email, password: values.password });
      setAuthSession(result.accessToken, result.user, result.expiresIn);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from && from.startsWith("/admin") ? from : "/admin", { replace: true });
    } catch (error) {
      setServerError((error as ApiError).message);
    }
  };

  return (
    <section className="admin-login bg-grid">
      <div className="admin-login__card">
        <div className="admin-login__brand">
          <Logo light />
          <div className="admin-login__brand-copy">
            <span className="eyebrow">Admin Portal</span>
            <h1 className="display-md">Manage Bibsikha with confidence.</h1>
            <p>Sign in with your admin email and password to continue.</p>
          </div>
        </div>

        <form className="admin-login__form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="admin-login__head">
            <h2 className="display-md">Admin sign in</h2>
            <p>Restricted to authorised administrators.</p>
          </div>

          {serverError && (
            <div className="admin-login__alert" role="alert">
              {serverError}
            </div>
          )}

          <div className={`form-group ${errors.email ? "has-error" : ""}`}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="username" placeholder="admin@example.com" {...register("email")} />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className={`form-group ${errors.password ? "has-error" : ""}`}>
            <label htmlFor="password">Password</label>
            <div className="admin-login__password">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                {...register("password")}
              />
              <button
                type="button"
                className="admin-login__toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((value) => !value)}
              >
                <Icon name={showPassword ? "close" : "eye"} size={18} />
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <button type="submit" className="btn btn--green admin-login__submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
            {!isSubmitting && <Icon name="arrowRight" size={18} />}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;
