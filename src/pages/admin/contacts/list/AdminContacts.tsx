import { Fragment, useEffect, useState } from "react";
import Icon from "../../../../components/Icon";
import Pagination from "../../../../components/Pagination";
import { personas, services } from "../../../../data/siteContent";
import useApiQuery from "../../../../hooks/useApiQuery";
import { listAdminContacts, updateContactStatus } from "../../../../services/adminApiService";
import type { ContactStatusValue, ContactSubmissionApiItem } from "../../../../services/apiHelpers";
import { contactStatusLabels } from "../data/contactSubmissions";
import "../../projects/list/AdminProjects.css";
import "./AdminContacts.css";

const statusValues = Object.keys(contactStatusLabels) as ContactStatusValue[];
const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});

const getSectorLabel = (sector: string) =>
  sector === "other" ? "Individual / Other" : (personas.find((item) => item.id === sector)?.label ?? sector);

const getServiceLabel = (service: string) =>
  service === "other" ? "Something else" : (services.find((item) => item.id === service)?.title ?? service);

const AdminContacts = () => {
  const [filters, setFilters] = useState<{ page: number; status: ContactStatusValue | ""; query: string }>({
    page: 1,
    status: "",
    query: "",
  });
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFilters((current) => current.query === search.trim() ? current : { ...current, page: 1, query: search.trim() });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const { data, error, loading } = useApiQuery(JSON.stringify([filters, reloadToken]), () =>
    listAdminContacts({ page: filters.page, status: filters.status || undefined, q: filters.query || undefined }),
  );

  const submissions = data?.data ?? [];
  const totalCount = data?.pagination.totalCount ?? 0;
  const totalSubmissions = data ? Object.values(data.statusCounts).reduce((total, count) => total + count, 0) : 0;
  const busy = loading || search.trim() !== filters.query || savingId !== null;
  const firstItem = data && submissions.length ? (data.pagination.page - 1) * data.pagination.limit + 1 : 0;

  const changeStatus = async (submission: ContactSubmissionApiItem, status: ContactStatusValue) => {
    if (busy || status === submission.status) return;
    setSavingId(submission.id);
    setActionError(null);
    setFlash(null);
    try {
      const saved = await updateContactStatus(submission.id, status);
      setFlash(`${saved.name}'s feedback marked as ${contactStatusLabels[saved.status]}.`);
      if (filters.status && filters.status !== saved.status) {
        setExpandedId(null);
        if (submissions.length === 1 && filters.page > 1) {
          setFilters((current) => ({ ...current, page: current.page - 1 }));
        }
      }
      setReloadToken((current) => current + 1);
    } catch (saveError) {
      setActionError(saveError instanceof Error ? saveError.message : "Could not update the feedback status. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setFilters({ page: 1, status: "", query: "" });
    setExpandedId(null);
  };

  return (
    <section className="section admin-projects admin-contacts">
      <div className="container">
        <div className="admin-projects__head">
          <div>
            <h1 className="display-lg">Contact Us</h1>
            <p className="lead">Review contact form submissions and track the status of each enquiry.</p>
          </div>
          <button type="button" className="btn btn--ghost" disabled={busy} onClick={() => setReloadToken((current) => current + 1)}>
            Refresh
          </button>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {flash && (
            <div className="admin-projects__flash">
              <span>{flash}</span>
              <button type="button" aria-label="Dismiss status update" onClick={() => setFlash(null)}>
                <Icon name="close" size={16} />
              </button>
            </div>
          )}
        </div>

        {actionError && (
          <div className="admin-projects__flash is-error" role="alert">
            <span>{actionError}</span>
            <button type="button" aria-label="Dismiss status error" onClick={() => setActionError(null)}>
              <Icon name="close" size={16} />
            </button>
          </div>
        )}

        <div className="admin-projects__toolbar admin-contacts__toolbar">
          <div className="admin-contacts__search">
            <label htmlFor="contact-search">Search submissions</label>
            <div className="admin-contacts__search-input">
              <Icon name="search" size={18} />
              <input
                id="contact-search"
                type="search"
                placeholder="Name, email, organisation or message"
                value={search}
                disabled={savingId !== null}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setExpandedId(null);
                }}
              />
            </div>
          </div>
          <div className="admin-contacts__filter">
            <label htmlFor="contact-status-filter">Feedback status</label>
            <select
              id="contact-status-filter"
              className="admin-projects__select"
              value={filters.status}
              disabled={savingId !== null}
              onChange={(event) => {
                setFilters((current) => ({ ...current, page: 1, status: event.target.value as ContactStatusValue | "" }));
                setExpandedId(null);
              }}
            >
              <option value="">All statuses{data ? ` (${totalSubmissions})` : ""}</option>
              {statusValues.map((status) => (
                <option key={status} value={status}>
                  {contactStatusLabels[status]}{data ? ` (${data.statusCounts[status]})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="admin-contacts__count" role="status">
          {savingId ? "Saving feedback status…" : busy ? "Loading submissions…" : data && !error
            ? `${firstItem ? `${firstItem}–${firstItem + submissions.length - 1}` : "0"} of ${totalCount} submissions · Newest first`
            : "Contact submissions are unavailable."}
        </p>

        <div className={`admin-projects__card ${busy && data ? "is-loading" : ""}`} aria-busy={busy}>
          {error ? (
            <div className="admin-projects__state" role="alert">
              <p>{error}</p>
              <button type="button" className="btn btn--ghost" onClick={() => setReloadToken((current) => current + 1)}>
                Try again
              </button>
            </div>
          ) : !data ? (
            <div className="admin-projects__state" role="status"><p>Loading contact submissions…</p></div>
          ) : submissions.length === 0 ? (
            <div className="admin-projects__state">
              <Icon name="mail" size={32} />
              <p>{filters.query || filters.status ? "No submissions match your search or status filter." : "No contact submissions yet."}</p>
              {(filters.query || filters.status) && (
                <button type="button" className="btn btn--ghost" onClick={clearFilters}>Clear filters</button>
              )}
            </div>
          ) : (
            <div className="admin-projects__table-wrap" role="region" aria-label="Contact submissions" tabIndex={0}>
              <table className="admin-projects__table admin-contacts__table" aria-label="Contact form submissions" role="table">
                <thead role="rowgroup">
                  <tr role="row">
                    <th scope="col" role="columnheader">Contact</th>
                    <th scope="col" role="columnheader">Enquiry</th>
                    <th scope="col" role="columnheader">Received (IST)</th>
                    <th scope="col" role="columnheader">Feedback status</th>
                    <th scope="col" role="columnheader">Details</th>
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {submissions.map((submission) => (
                    <Fragment key={submission.id}>
                      <tr role="row" className="admin-contacts__row">
                        <td role="cell" data-label="Contact">
                          <div className="admin-contacts__sender">
                            <strong>{submission.name}</strong>
                            <span>{submission.organisation || "No organisation provided"}</span>
                            <a href={`mailto:${submission.email}`}>{submission.email}</a>
                          </div>
                        </td>
                        <td role="cell" data-label="Enquiry">
                          <div className="admin-contacts__enquiry">
                            <strong>{getServiceLabel(submission.service)}</strong>
                            <p>{submission.message}</p>
                          </div>
                        </td>
                        <td role="cell" data-label="Received (IST)" className="admin-contacts__date">
                          <time dateTime={submission.createdAt}>{dateFormatter.format(new Date(submission.createdAt))}</time>
                        </td>
                        <td role="cell" data-label="Feedback status">
                          <select
                            className={`admin-contacts__status is-${submission.status}`}
                            aria-label={`Feedback status for ${submission.name}`}
                            value={submission.status}
                            disabled={busy}
                            onChange={(event) => changeStatus(submission, event.target.value as ContactStatusValue)}
                          >
                            {statusValues.map((status) => <option key={status} value={status}>{contactStatusLabels[status]}</option>)}
                          </select>
                        </td>
                        <td role="cell" data-label="Details">
                          <button
                            type="button"
                            className="admin-projects__action admin-contacts__view"
                            disabled={busy}
                            aria-expanded={expandedId === submission.id}
                            aria-controls={`contact-details-${submission.id}`}
                            aria-label={`${expandedId === submission.id ? "Close" : "View"} message from ${submission.name}`}
                            onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                          >
                            {expandedId === submission.id ? "Close message" : "View message"}
                          </button>
                        </td>
                      </tr>
                      <tr role="row" id={`contact-details-${submission.id}`} hidden={expandedId !== submission.id}>
                        <td role="cell" colSpan={5} className="admin-contacts__detail-cell">
                          <section className="admin-contacts__details" aria-labelledby={`contact-heading-${submission.id}`}>
                            <h2 id={`contact-heading-${submission.id}`}>Submission from {submission.name}</h2>
                            <dl className="admin-contacts__fields">
                              <div><dt>Full name</dt><dd>{submission.name}</dd></div>
                              <div><dt>Organisation</dt><dd>{submission.organisation || "Not provided"}</dd></div>
                              <div><dt>Email</dt><dd><a href={`mailto:${submission.email}`}>{submission.email}</a></dd></div>
                              <div>
                                <dt>Phone</dt>
                                <dd>{submission.phone ? <a href={`tel:${submission.phone.replace(/\s/g, "")}`}>{submission.phone}</a> : "Not provided"}</dd>
                              </div>
                              <div><dt>I represent</dt><dd>{getSectorLabel(submission.sector)}</dd></div>
                              <div><dt>Service of interest</dt><dd>{getServiceLabel(submission.service)}</dd></div>
                              <div><dt>Consent to be contacted</dt><dd>{submission.consent ? "Given" : "Not given"}</dd></div>
                              <div><dt>Feedback status</dt><dd>{contactStatusLabels[submission.status]}</dd></div>
                            </dl>
                            <h3>Message</h3>
                            <p className="admin-contacts__message">{submission.message}</p>
                          </section>
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Pagination
          page={filters.page}
          totalPages={data?.pagination.totalPages ?? 0}
          disabled={busy || Boolean(error)}
          onPageChange={(page) => {
            setFilters((current) => ({ ...current, page }));
            setExpandedId(null);
          }}
        />
      </div>
    </section>
  );
};

export default AdminContacts;
