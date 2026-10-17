import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Icon from "../../components/Icon";
import type { IconName } from "../../components/Icon";
import PageHero from "../../components/PageHero";
import Reveal from "../../components/Reveal";
import { contactInfo, personas, services } from "../../data/siteContent";
import usePersona from "../../hooks/usePersona";
import { ApiError } from "../../services/apiHelpers";
import { createContactSubmission } from "../../services/apiService";
import { contactSchema } from "./schema/contactSchema";
import type { ContactFormValues } from "./schema/contactSchema";
import "./Contact.css";

const channels: { icon: IconName; label: string; value: string; href?: string }[] = [
  { icon: "mail", label: "Email us", value: contactInfo.email, href: `mailto:${contactInfo.email}` },
  { icon: "globe", label: "Website", value: contactInfo.website, href: `https://${contactInfo.website}` },
  { icon: "pin", label: "Head office", value: contactInfo.address },
];

const Contact = () => {
  const { persona } = usePersona();
  const [submitted, setSubmitted] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      name: "",
      organisation: "",
      email: "",
      phone: "",
      sector: persona === "explorer" ? "" : persona,
      service: "",
      message: "",
      consent: false,
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: ContactFormValues) => {
    clearErrors("root.server");
    try {
      await createContactSubmission(values);
      setSubmitted(values.name.split(" ")[0]);
      reset();
    } catch (error) {
      if (error instanceof ApiError) {
        error.details.forEach((detail) => {
          if (Object.hasOwn(contactSchema.fields, detail.field)) {
            setError(detail.field as keyof ContactFormValues, { type: "server", message: detail.message });
          }
        });
      }
      setError("root.server", {
        message: error instanceof Error ? error.message : "Could not send your message. Please try again.",
      });
    }
  };

  return (
    <>
      <PageHero
        crumb="Contact Us"
        eyebrow="Contact Us"
        title={
          <>
            Let’s grow something <span className="text-gradient">great together.</span>
          </>
        }
        lead="Whether it’s carbon credits, clean energy, consultancy or manpower for a large programme — tell us what you need and our team will get back to you."
      />

      <section className="section contact">
        <div className="container contact__grid">
          <div className="contact__info">
            {channels.map((channel, index) => {
              const content = (
                <>
                  <span className="contact-channel__icon">
                    <Icon name={channel.icon} />
                  </span>
                  <span className="contact-channel__text">
                    <span>{channel.label}</span>
                    <strong>{channel.value}</strong>
                  </span>
                </>
              );
              return (
                <Reveal key={channel.label} delay={index * 80}>
                  {channel.href ? (
                    <a href={channel.href} className="contact-channel">
                      {content}
                      <Icon name="arrowUpRight" size={18} className="contact-channel__arrow" />
                    </a>
                  ) : (
                    <div className="contact-channel">{content}</div>
                  )}
                </Reveal>
              );
            })}

            <Reveal delay={320} className="contact-map">
              <svg viewBox="0 0 400 220" className="contact-map__svg" aria-hidden="true">
                {Array.from({ length: 9 }).map((_, i) => (
                  <path key={i} d={`M0 ${20 + i * 24} Q 100 ${i * 24}, 200 ${24 + i * 24} T 400 ${16 + i * 24}`} />
                ))}
              </svg>
              <span className="contact-map__pin">
                <Icon name="pin" size={28} />
              </span>
              <span className="contact-map__label">Bibsikha HQ · Jorhat, Assam</span>
            </Reveal>
          </div>

          <Reveal variant="right" className="contact-form-card">
            {submitted ? (
              <div className="contact-success" role="status">
                <span className="contact-success__icon">
                  <Icon name="check" size={36} strokeWidth={2.4} />
                </span>
                <h2 className="display-md">Thank you, {submitted}!</h2>
                <p>Your message has been received. A member of our team will get back to you shortly.</p>
                <button type="button" className="btn btn--ghost" onClick={() => setSubmitted(null)}>
                  Send another message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting} noValidate>
                <div className="contact-form__head">
                  <h2 className="display-md">Send us a message</h2>
                  <p>Fields marked * are required.</p>
                </div>

                <div className="contact-form__row">
                  <div className={`form-group ${errors.name ? "has-error" : ""}`}>
                    <label htmlFor="name">Full name *</label>
                    <input id="name" type="text" autoComplete="name" placeholder="Your name" {...register("name")} />
                    {errors.name && <span className="form-error">{errors.name.message}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="organisation">Organisation</label>
                    <input id="organisation" type="text" autoComplete="organization" placeholder="Company / department" {...register("organisation")} />
                  </div>
                </div>

                <div className="contact-form__row">
                  <div className={`form-group ${errors.email ? "has-error" : ""}`}>
                    <label htmlFor="email">Email *</label>
                    <input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
                    {errors.email && <span className="form-error">{errors.email.message}</span>}
                  </div>
                  <div className={`form-group ${errors.phone ? "has-error" : ""}`}>
                    <label htmlFor="phone">Phone</label>
                    <input id="phone" type="tel" autoComplete="tel" placeholder="+91" {...register("phone")} />
                    {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                  </div>
                </div>

                <div className="contact-form__row">
                  <div className={`form-group ${errors.sector ? "has-error" : ""}`}>
                    <label htmlFor="sector">I represent *</label>
                    <select id="sector" {...register("sector")}>
                      <option value="">Select sector</option>
                      {personas
                        .filter((item) => item.id !== "explorer")
                        .map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label}
                          </option>
                        ))}
                      <option value="other">Individual / Other</option>
                    </select>
                    {errors.sector && <span className="form-error">{errors.sector.message}</span>}
                  </div>
                  <div className={`form-group ${errors.service ? "has-error" : ""}`}>
                    <label htmlFor="service">Service of interest *</label>
                    <select id="service" {...register("service")}>
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.title}
                        </option>
                      ))}
                      <option value="other">Something else</option>
                    </select>
                    {errors.service && <span className="form-error">{errors.service.message}</span>}
                  </div>
                </div>

                <div className={`form-group ${errors.message ? "has-error" : ""}`}>
                  <label htmlFor="message">Message *</label>
                  <textarea id="message" rows={5} placeholder="Tell us about your project, location and timeline…" {...register("message")} />
                  {errors.message && <span className="form-error">{errors.message.message}</span>}
                </div>

                <div className={`form-check ${errors.consent ? "has-error" : ""}`}>
                  <input id="consent" type="checkbox" {...register("consent")} />
                  <label htmlFor="consent">I agree to be contacted by Bibsikha regarding my enquiry.</label>
                </div>
                {errors.consent && <span className="form-error">{errors.consent.message}</span>}

                {errors.root?.server?.message && (
                  <p className="contact-form__error" role="alert">{errors.root.server.message}</p>
                )}

                <button type="submit" className="btn btn--gold contact-form__submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending…" : "Send message"}
                  {!isSubmitting && <Icon name="arrowRight" size={18} />}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default Contact;
