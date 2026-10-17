import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import Icon from "../../../../components/Icon";
import ProjectCard from "../../../../components/ProjectCard";
import { categoryLabels } from "../../../../data/siteContent";
import type { Project, ServiceCategory } from "../../../../data/siteContent";
import useApiQuery from "../../../../hooks/useApiQuery";
import { createProject, getAdminProject, updateProject } from "../../../../services/adminApiService";
import type { ApiError, ProjectApiItem, ProjectStatusValue } from "../../../../services/apiHelpers";
import { projectStatusLabels } from "../../../../utils/projectMapper";
import {
  IMAGE_TYPES,
  MAX_IMAGE_SIZE_MB,
  MAX_METRICS,
  projectSchema,
  projectStatuses,
  projectVisibilities,
} from "./schema/projectSchema";
import type { ProjectFormValues, ProjectSchemaContext } from "./schema/projectSchema";
import "../../../contact/Contact.css";
import "./ProjectForm.css";

const previewPalette: [string, string] = ["#0f5132", "#2fa36f"];

const defaultValues: ProjectFormValues = {
  title: "",
  location: "",
  category: "",
  status: "ongoing",
  visibility: "active",
  summary: "",
  metrics: [],
  image: null,
};

const toFormValues = (project: ProjectApiItem): ProjectFormValues => ({
  title: project.title,
  location: project.location,
  category: project.category,
  status: project.status,
  visibility: project.visibility,
  summary: project.summary,
  metrics: project.metrics,
  image: null,
});

const toFormData = (values: ProjectFormValues): FormData => {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("location", values.location);
  formData.append("category", values.category);
  formData.append("status", values.status);
  formData.append("visibility", values.visibility);
  formData.append("summary", values.summary);
  formData.append("metrics", JSON.stringify(values.metrics ?? []));
  if (values.image) formData.append("image", values.image);
  return formData;
};

const formFields = new Set<string>(Object.keys(defaultValues));

const ProjectForm = () => {
  const { projectId } = useParams();
  const isEdit = Boolean(projectId);
  const navigate = useNavigate();

  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    data: existingProject,
    error: loadError,
    loading,
  } = useApiQuery(projectId ?? "new", () => (projectId ? getAdminProject(projectId) : Promise.resolve(null)));

  useEffect(() => {
    return () => {
      if (newImageUrl) URL.revokeObjectURL(newImageUrl);
    };
  }, [newImageUrl]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues, ProjectSchemaContext>({
    resolver: yupResolver(projectSchema),
    context: { isEdit },
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (existingProject) reset(toFormValues(existingProject));
  }, [existingProject, reset]);

  const { fields, append, remove } = useFieldArray({ control, name: "metrics" });

  const values = useWatch({ control });
  const displayImageUrl = newImageUrl ?? existingProject?.imageUrl ?? null;

  const preview: Project = {
    id: "preview",
    title: values.title || "Project title",
    location: values.location || "Location",
    category: (values.category || "energy") as ServiceCategory,
    status: projectStatusLabels[(values.status as ProjectStatusValue | undefined) ?? "ongoing"],
    summary: values.summary || "A short summary of the project will appear here.",
    metrics: values.metrics
      ?.filter((metric) => metric?.value || metric?.label)
      .map((metric) => ({ value: metric?.value ?? "", label: metric?.label ?? "" })),
    palette: previewPalette,
    icon: "leaf",
    image: displayImageUrl ?? undefined,
  };

  const handleImageSelect = (file?: File) => {
    if (!file) return;
    setValue("image", file, { shouldValidate: true, shouldDirty: true });
    setNewImageUrl(IMAGE_TYPES.includes(file.type) ? URL.createObjectURL(file) : null);
  };

  const handleImageRemove = () => {
    setValue("image", null, { shouldValidate: true, shouldDirty: true });
    setNewImageUrl(null);
  };

  const onSubmit = async (formValues: ProjectFormValues) => {
    setServerError(null);
    try {
      const saved = projectId
        ? await updateProject(projectId, toFormData(formValues))
        : await createProject(toFormData(formValues));
      navigate("/admin/projects", {
        state: { flash: `“${saved.title}” was ${projectId ? "updated" : "created"} successfully.` },
      });
    } catch (error) {
      const apiError = error as ApiError;
      apiError.details?.forEach((detail) => {
        if (formFields.has(detail.field)) {
          setError(detail.field as keyof ProjectFormValues, { type: "server", message: detail.message });
        }
      });
      setServerError(apiError.message);
    }
  };

  if (isEdit && (loading || loadError) && !existingProject) {
    return (
      <section className="section admin-project">
        <div className="container">
          {loadError ? (
            <div className="admin-project__card admin-project__state" role="alert">
              <h2 className="display-md">Couldn’t load this project</h2>
              <p>{loadError}</p>
              <Link to="/admin/projects" className="btn btn--ghost">
                Back to projects
              </Link>
            </div>
          ) : (
            <div className="page-loader" role="status" aria-label="Loading project">
              <span className="page-loader__leaf" />
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="section admin-project">
      <div className="container">
        <div className="admin-project__head">
          <Link to="/admin/projects" className="admin-project__back">
            <Icon name="arrowRight" size={16} />
            All projects
          </Link>
          <h1 className="display-lg">{isEdit ? "Edit project" : "Create a project"}</h1>
          <p className="lead">
            {isEdit ? "Update the details of this programme." : "Add a new programme to the Projects page."} Fields marked * are
            required.
          </p>
        </div>

        <div className="admin-project__grid">
          <form className="admin-project__card admin-project__form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {serverError && (
              <div className="admin-project__alert" role="alert">
                {serverError}
              </div>
            )}

            <fieldset className="admin-project__section">
              <legend>Basic details</legend>

              <div className={`form-group ${errors.title ? "has-error" : ""}`}>
                <label htmlFor="title">Title *</label>
                <input id="title" type="text" placeholder="e.g. Clean Energy Cooking Programme" {...register("title")} />
                {errors.title && <span className="form-error">{errors.title.message}</span>}
              </div>

              <div className="contact-form__row">
                <div className={`form-group ${errors.location ? "has-error" : ""}`}>
                  <label htmlFor="location">Location *</label>
                  <input id="location" type="text" placeholder="e.g. Assam, Bihar" {...register("location")} />
                  {errors.location && <span className="form-error">{errors.location.message}</span>}
                </div>
                <div className={`form-group ${errors.category ? "has-error" : ""}`}>
                  <label htmlFor="category">Category *</label>
                  <select id="category" {...register("category")}>
                    <option value="">Select a category</option>
                    {(Object.keys(categoryLabels) as ServiceCategory[]).map((key) => (
                      <option key={key} value={key}>
                        {categoryLabels[key]}
                      </option>
                    ))}
                  </select>
                  {errors.category && <span className="form-error">{errors.category.message}</span>}
                </div>
              </div>

              <div className="contact-form__row">
                <div className="form-group">
                  <span className="admin-project__label">Status *</span>
                  <div className="admin-project__segmented" role="radiogroup" aria-label="Status">
                    {projectStatuses.map((status) => (
                      <label key={status.value} className={values.status === status.value ? "is-active" : ""}>
                        <input type="radio" value={status.value} {...register("status")} />
                        {status.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <span className="admin-project__label">Visibility *</span>
                  <div className="admin-project__segmented" role="radiogroup" aria-label="Visibility">
                    {projectVisibilities.map((visibility) => (
                      <label key={visibility.value} className={values.visibility === visibility.value ? "is-active" : ""}>
                        <input type="radio" value={visibility.value} {...register("visibility")} />
                        {visibility.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`form-group ${errors.summary ? "has-error" : ""}`}>
                <label htmlFor="summary">Summary *</label>
                <textarea
                  id="summary"
                  rows={4}
                  placeholder="What the project does and the impact it creates…"
                  {...register("summary")}
                />
                <span className="admin-project__hint">{values.summary?.length ?? 0}/300</span>
                {errors.summary && <span className="form-error">{errors.summary.message}</span>}
              </div>
            </fieldset>

            <fieldset className="admin-project__section">
              <legend>Metrics</legend>
              <p className="admin-project__hint">Optional key numbers shown on the card, e.g. “3,00,000 · Households reached”.</p>

              {fields.map((field, index) => (
                <div key={field.id} className="admin-project__metric">
                  <div className={`form-group ${errors.metrics?.[index]?.value ? "has-error" : ""}`}>
                    <label htmlFor={`metric-value-${index}`}>Value</label>
                    <input id={`metric-value-${index}`} type="text" placeholder="3,00,000" {...register(`metrics.${index}.value`)} />
                    {errors.metrics?.[index]?.value && (
                      <span className="form-error">{errors.metrics[index]?.value?.message}</span>
                    )}
                  </div>
                  <div className={`form-group ${errors.metrics?.[index]?.label ? "has-error" : ""}`}>
                    <label htmlFor={`metric-label-${index}`}>Label</label>
                    <input
                      id={`metric-label-${index}`}
                      type="text"
                      placeholder="Households reached"
                      {...register(`metrics.${index}.label`)}
                    />
                    {errors.metrics?.[index]?.label && (
                      <span className="form-error">{errors.metrics[index]?.label?.message}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="admin-project__remove"
                    aria-label={`Remove metric ${index + 1}`}
                    onClick={() => remove(index)}
                  >
                    <Icon name="close" size={18} />
                  </button>
                </div>
              ))}
              {errors.metrics?.message && <span className="form-error">{errors.metrics.message}</span>}

              {fields.length < MAX_METRICS && (
                <button type="button" className="btn btn--ghost admin-project__add" onClick={() => append({ value: "", label: "" })}>
                  <Icon name="plus" size={18} />
                  Add metric
                </button>
              )}
            </fieldset>

            <fieldset className="admin-project__section">
              <legend>Project image</legend>

              <div className={`form-group ${errors.image ? "has-error" : ""}`}>
                <span className="admin-project__label">{isEdit ? "Image" : "Upload image *"}</span>
                <input
                  id="image"
                  type="file"
                  accept={IMAGE_TYPES.join(",")}
                  className="admin-project__file"
                  onChange={(event) => {
                    handleImageSelect(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
                {displayImageUrl ? (
                  <div className="admin-project__image">
                    <img src={displayImageUrl} alt="Project" />
                    <div className="admin-project__image-bar">
                      <span title={values.image?.name}>{newImageUrl ? values.image?.name : "Current image"}</span>
                      <div>
                        <label htmlFor="image" className="admin-project__image-btn">
                          Change
                        </label>
                        {newImageUrl && (
                          <button type="button" className="admin-project__image-btn is-danger" onClick={handleImageRemove}>
                            {isEdit ? "Undo" : "Remove"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="image"
                    className={`admin-project__dropzone ${isDragging ? "is-dragging" : ""}`}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(event) => {
                      event.preventDefault();
                      setIsDragging(false);
                      handleImageSelect(event.dataTransfer.files?.[0]);
                    }}
                  >
                    <span className="admin-project__dropzone-icon">
                      <Icon name="plus" size={24} />
                    </span>
                    <strong>Click to upload or drag &amp; drop</strong>
                    <span>JPG, PNG or WEBP · up to {MAX_IMAGE_SIZE_MB} MB</span>
                  </label>
                )}
                {errors.image && <span className="form-error">{errors.image.message}</span>}
              </div>
            </fieldset>

            <div className="admin-project__actions">
              <Link to="/admin/projects" className="btn btn--ghost">
                Cancel
              </Link>
              <button type="submit" className="btn btn--green" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create project"}
                {!isSubmitting && <Icon name="arrowRight" size={18} />}
              </button>
            </div>
          </form>

          <aside className="admin-project__preview" aria-label="Live preview">
            <span className="admin-project__label">Live preview</span>
            <ProjectCard project={preview} />
          </aside>
        </div>
      </div>
    </section>
  );
};

export default ProjectForm;
