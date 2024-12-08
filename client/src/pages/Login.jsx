import { useNavigate } from 'react-router';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .required('Required'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await login(values);
      navigate('/activities');
    } catch (error) {
      setFieldError('general', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center mb-4">Login</h2>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="input input-bordered"
                    placeholder="email@example.com"
                  />
                  {errors.email && touched.email && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.email}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <Field
                    type="password"
                    name="password"
                    className="input input-bordered"
                    placeholder="••••••••"
                  />
                  {errors.password && touched.password && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.password}</span>
                    </label>
                  )}
                </div>

                {errors.general && (
                  <div className="alert alert-error mt-4">
                    <span>{errors.general}</span>
                  </div>
                )}

                <div className="form-control mt-6">
                  <button 
                    type="submit" 
                    className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                  >
                    Login
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;