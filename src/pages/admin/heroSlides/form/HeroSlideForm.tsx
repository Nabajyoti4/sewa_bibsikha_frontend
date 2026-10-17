import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import HeroSlideImages from "../../../../components/HeroSlideImages";
import Icon from "../../../../components/Icon";
import useApiQuery from "../../../../hooks/useApiQuery";
import { createHeroSlide, getAdminHeroSlide, updateHeroSlide } from "../../../../services/adminApiService";
import type { ApiError, HeroSlideApiItem } from "../../../../services/apiHelpers";
import { IMAGE_TYPES } from "../../projects/form/schema/projectSchema";
import {
  MAX_CAPTION_LENGTH,
  MAX_NEW_IMAGES_PER_SAVE,
  MAX_SLIDE_IMAGE_SIZE_MB,
  MAX_TAG_LENGTH,
  MAX_TITLE_LENGTH,
  heroSlideSchema,
} from "./schema/heroSlideSchema";
import type { HeroSlideFormValues } from "./schema/heroSlideSchema";
import "../../../../components/HeroCarousel.css";
import "../../../contact/Contact.css";
import "../../projects/form/ProjectForm.css";
import "./HeroSlideForm.css";

const defaultValues: HeroSlideFormValues = {
  title: "",
  tag: "",
  caption: "",
  images: [],
};

const toFormValues = (slide: HeroSlideApiItem): HeroSlideFormValues => ({
  title: slide.title,
  tag: slide.tag,
  caption: slide.caption,
  images: slide.images.map((image) => ({ imageId: image.id, url: image.imageUrl, file: null })),
});

const toFormData = (values: HeroSlideFormValues): FormData => {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("tag", values.tag);
  formData.append("caption", values.caption);
  formData.append("existingImageIds", JSON.stringify(values.images.filter((image) => !image.file).map((image) => image.imageId)));
  values.images.forEach((image) => {
    if (image.file) formData.append("images", image.file);
  });
  return formData;
};

const formFields = new Set<string>(Object.keys(defaultValues));

const HeroSlideForm = () => {
  const { slideId } = useParams();
  const isEdit = Boolean(slideId);
  const navigate = useNavigate();

  const objectUrls = useRef<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    data: existingSlide,
    error: loadError,
    loading,
  } = useApiQuery(slideId ?? "new", () => (slideId ? getAdminHeroSlide(slideId) : Promise.resolve(null)));

  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const {
    register,
    control,
    handleSubmit,
    setError,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HeroSlideFormValues>({
    resolver: yupResolver(heroSlideSchema),
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (existingSlide) reset(toFormValues(existingSlide));
  }, [existingSlide, reset]);

  const { fields, append, remove } = useFieldArray({ control, name: "images", keyName: "fieldKey" });

  const values = useWatch({ control });
  const previewImages = (values.images ?? [])
    .filter((image) => image?.imageId && image.url)
    .map((image) => ({ id: image!.imageId!, imageUrl: image!.url! }));

  const handleImagesSelect = (files?: FileList | null) => {
    if (!files?.length) return;
    const added = Array.from(files).map((file) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.push(url);
      return { imageId: `new-${crypto.randomUUID()}`, url, file };
    });
    append(added);
    trigger("images");
  };

  const handleImageRemove = (index: number) => {
    remove(index);
    trigger("images");
  };

  const onSubmit = async (formValues: HeroSlideFormValues) => {
    setServerError(null);
    try {
      const saved = slideId
        ? await updateHeroSlide(slideId, toFormData(formValues))
        : await createHeroSlide(toFormData(formValues));
      navigate("/admin/hero-slides", {
        state: { flash: `“${saved.title}” was ${slideId ? "updated" : "created"} successfully.` },
      });
    } catch (error) {
      const apiError = error as ApiError;
      apiError.details?.forEach((detail) => {
        if (formFields.has(detail.field)) {
          setError(detail.field as keyof HeroSlideFormValues, { type: "server", message: detail.message });
        }
      });
      setServerError(apiError.message);
    }
  };

  if (isEdit && (loading || loadError) && !existingSlide) {
    return (
      <section className="section admin-project">
        <div className="container">
          {loadError ? (
            <div className="admin-project__card admin-project__state" role="alert">
              <h2 className="display-md">Couldn’t load this slide</h2>
              <p>{loadError}</p>
              <Link to="/admin/hero-slides" className="btn btn--ghost">
                Back to hero slides
              </Link>
            </div>
          ) : (
            <div className="page-loader" role="status" aria-label="Loading slide">
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
          <Link to="/admin/hero-slides" className="admin-project__back">
            <Icon name="arrowRight" size={16} />
            All hero slides
          </Link>
          <h1 className="display-lg">{isEdit ? "Edit hero slide" : "Create a hero slide"}</h1>
          <p className="lead">
            {isEdit ? "Update this card in the home page slider." : "Add a new card to the home page slider."} Fields marked * are
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
              <legend>Card details</legend>

              <div className="contact-form__row">
                <div className={`form-group ${errors.title ? "has-error" : ""}`}>
                  <label htmlFor="title">Title *</label>
                  <input id="title" type="text" placeholder="e.g. Clean Cooking Programme" {...register("title")} />
                  <span className="admin-project__hint">
                    {values.title?.length ?? 0}/{MAX_TITLE_LENGTH}
                  </span>
                  {errors.title && <span className="form-error">{errors.title.message}</span>}
                </div>
                <div className={`form-group ${errors.tag ? "has-error" : ""}`}>
                  <label htmlFor="tag">Tag *</label>
                  <input id="tag" type="text" placeholder="e.g. Clean Energy" {...register("tag")} />
                  <span className="admin-project__hint">
                    {values.tag?.length ?? 0}/{MAX_TAG_LENGTH}
                  </span>
                  {errors.tag && <span className="form-error">{errors.tag.message}</span>}
                </div>
              </div>

              <div className={`form-group ${errors.caption ? "has-error" : ""}`}>
                <label htmlFor="caption">Caption *</label>
                <textarea
                  id="caption"
                  rows={3}
                  placeholder="Shown below the slider while this card is in front…"
                  {...register("caption")}
                />
                <span className="admin-project__hint">
                  {values.caption?.length ?? 0}/{MAX_CAPTION_LENGTH}
                </span>
                {errors.caption && <span className="form-error">{errors.caption.message}</span>}
              </div>
            </fieldset>

            <fieldset className="admin-project__section">
              <legend>Images</legend>
              <p className="admin-project__hint">
                Images rotate inside the card in this order, 5 seconds each. JPG, PNG or WEBP · up to {MAX_SLIDE_IMAGE_SIZE_MB} MB each ·
                up to {MAX_NEW_IMAGES_PER_SAVE} new images per save.
              </p>

              <div className={`form-group ${errors.images?.message || errors.images?.root ? "has-error" : ""}`}>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept={IMAGE_TYPES.join(",")}
                  className="admin-project__file"
                  onChange={(event) => {
                    handleImagesSelect(event.target.files);
                    event.target.value = "";
                  }}
                />

                {fields.length > 0 && (
                  <div className="admin-slide__images">
                    {fields.map((field, index) => {
                      const fileError = errors.images?.[index]?.file?.message;
                      return (
                        <div key={field.fieldKey} className={`admin-slide__thumb ${fileError ? "has-error" : ""}`}>
                          <img src={field.url} alt={`Image ${index + 1}`} />
                          <span className="admin-slide__thumb-num">{index + 1}</span>
                          <button
                            type="button"
                            className="admin-slide__thumb-remove"
                            aria-label={`Remove image ${index + 1}`}
                            onClick={() => handleImageRemove(index)}
                          >
                            <Icon name="close" size={14} />
                          </button>
                          {fileError && <span className="admin-slide__thumb-error">{fileError}</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                <label
                  htmlFor="images"
                  className={`admin-project__dropzone ${isDragging ? "is-dragging" : ""}`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                    handleImagesSelect(event.dataTransfer.files);
                  }}
                >
                  <span className="admin-project__dropzone-icon">
                    <Icon name="plus" size={24} />
                  </span>
                  <strong>{fields.length ? "Add more images" : "Click to upload or drag & drop"}</strong>
                  <span>You can select several images at once</span>
                </label>
                {(errors.images?.message || errors.images?.root?.message) && (
                  <span className="form-error">{errors.images?.message ?? errors.images?.root?.message}</span>
                )}
              </div>
            </fieldset>

            <div className="admin-project__actions">
              <Link to="/admin/hero-slides" className="btn btn--ghost">
                Cancel
              </Link>
              <button type="submit" className="btn btn--green" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create slide"}
                {!isSubmitting && <Icon name="arrowRight" size={18} />}
              </button>
            </div>
          </form>

          <aside className="admin-project__preview" aria-label="Live preview">
            <span className="admin-project__label">Live preview</span>
            <div className="admin-slide__preview">
              <div className="hero-slide is-active">
                <HeroSlideImages images={previewImages} alt={values.title || "Slide preview"}>
                  <span className="hero-slide__title">{values.title || "Slide title"}</span>
                </HeroSlideImages>
                {previewImages.length === 0 && <span className="admin-slide__preview-empty">Add images to see them rotate</span>}
                <span className="hero-slide__shade" />
                <span className="hero-slide__tag">{values.tag || "Tag"}</span>
              </div>
            </div>
            <p className="admin-slide__preview-caption">{values.caption || "The caption appears below the slider."}</p>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default HeroSlideForm;
