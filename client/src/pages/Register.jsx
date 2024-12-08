import { useNavigate } from 'react-router';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';

const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .min(6, 'Too Short!')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await api.post('/auth/register', {
        username: values.username,
        email: values.email,
        password: values.password,
      });
      
      if (response.data.status === 'success') {
        navigate('/login');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      setFieldError('general', error.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center mb-4">Register</h2>
          <Formik
            initialValues={{
              username: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Username</span>
                  </label>
                  <Field
                    type="text"
                    name="username"
                    className="input input-bordered"
                    placeholder="johndoe"
                  />
                  {errors.username && touched.username && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.username}</span>
                    </label>
                  )}
                </div>

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

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Confirm Password</span>
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    className="input input-bordered"
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.confirmPassword}</span>
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
                    Register
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

export default Register;