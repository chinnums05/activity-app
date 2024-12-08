import { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useActivities } from '../contexts/ActivityContext';
import ActivityCard from '../components/ActivityCard';

const activitySchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  images: Yup.array().max(3, 'Maximum 3 images allowed'),
});

const Activities = () => {
  const { activities, loading, fetchActivities, createActivity } = useActivities();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleCreateActivity = async (values, { setSubmitting, resetForm }) => {
    try {
      await createActivity(values);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating activity:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Activities</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          Create Activity
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}

      {/* Create Activity Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create New Activity</h3>
            <Formik
              initialValues={{ title: '', description: '', images: [] }}
              validationSchema={activitySchema}
              onSubmit={handleCreateActivity}
            >
              {({ errors, touched, setFieldValue, isSubmitting }) => (
                <Form>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Title</span>
                    </label>
                    <Field
                      type="text"
                      name="title"
                      className="input input-bordered"
                    />
                    {errors.title && touched.title && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.title}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      className="textarea textarea-bordered h-24"
                    />
                    {errors.description && touched.description && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.description}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Images (max 3)</span>
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        setFieldValue('images', Array.from(e.target.files));
                      }}
                      className="file-input file-input-bordered w-full"
                    />
                    {errors.images && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.images}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="modal-action">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                      disabled={isSubmitting}
                    >
                      Create
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;