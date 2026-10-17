import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "../../../../components/Icon";
import Pagination from "../../../../components/Pagination";
import { categoryLabels } from "../../../../data/siteContent";
import type { ServiceCategory } from "../../../../data/siteContent";
import useApiQuery from "../../../../hooks/useApiQuery";
import { deleteProject, listAdminProjects } from "../../../../services/adminApiService";
import type { ProjectApiItem, ProjectVisibilityValue } from "../../../../services/apiHelpers";
import { projectStatusLabels, projectVisibilityLabels } from "../../../../utils/projectMapper";
import "./AdminProjects.css";

const visibilityFilters: { value: ProjectVisibilityValue | ""; label: string }[] = [
  { value: "", label: "All" },
  { value: "active", label: projectVisibilityLabels.active },
  { value: "inactive", label: projectVisibilityLabels.inactive },
];

const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

const AdminProjects = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [visibility, setVisibility] = useState<ProjectVisibilityValue | "">("");
  const [category, setCategory] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const [flash, setFlash] = useState<string | null>((location.state as { flash?: string } | null)?.flash ?? null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (location.state) navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const { data, error, loading } = useApiQuery(`${page}|${visibility}|${category}|${reloadToken}`, () =>
    listAdminProjects({ page, category: category || undefined, visibility: visibility || undefined }),
  );

  const projects = data?.data ?? [];
  const totalCount = data?.pagination.totalCount ?? 0;

  const changeFilter = (update: () => void) => {
    update();
    setPage(1);
    setConfirmingId(null);
  };

  const handleDelete = async (project: ProjectApiItem) => {
    setDeletingId(project.id);
    setActionError(null);
    try {
      await deleteProject(project.id);
      setFlash(`“${project.title}” was deleted.`);
      setConfirmingId(null);
      if (projects.length === 1 && page > 1) setPage(page - 1);
      else setReloadToken((token) => token + 1);
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : "Could not delete the project.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="section admin-projects">
      <div className="container">
        <div className="admin-projects__head">
          <div>
            <h1 className="display-lg">Projects</h1>
            <p className="lead">
              {data ? `${totalCount} project${totalCount === 1 ? "" : "s"}` : "Manage the programmes shown on the website."}
            </p>
          </div>
          <Link to="/admin/projects/new" className="btn btn--gold">
            <Icon name="plus" size={18} />
            New project
          </Link>
        </div>

        {flash && (
          <div className="admin-projects__flash" role="status">
            <span>{flash}</span>
            <button type="button" aria-label="Dismiss" onClick={() => setFlash(null)}>
              <Icon name="close" size={16} />
            </button>
          </div>
        )}
        {actionError && (
          <div className="admin-projects__flash is-error" role="alert">
            <span>{actionError}</span>
            <button type="button" aria-label="Dismiss" onClick={() => setActionError(null)}>
              <Icon name="close" size={16} />
            </button>
          </div>
        )}

        <div className="admin-projects__toolbar">
          <div className="admin-projects__chips" role="group" aria-label="Filter by visibility">
            {visibilityFilters.map((filter) => (
              <button
                key={filter.value || "all"}
                type="button"
                className={`admin-projects__chip ${visibility === filter.value ? "is-active" : ""}`}
                aria-pressed={visibility === filter.value}
                onClick={() => changeFilter(() => setVisibility(filter.value))}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <select
            className="admin-projects__select"
            aria-label="Filter by category"
            value={category}
            onChange={(event) => changeFilter(() => setCategory(event.target.value))}
          >
            <option value="">All categories</option>
            {(Object.keys(categoryLabels) as ServiceCategory[]).map((key) => (
              <option key={key} value={key}>
                {categoryLabels[key]}
              </option>
            ))}
          </select>
        </div>

        <div className={`admin-projects__card ${loading && data ? "is-loading" : ""}`}>
          {error ? (
            <div className="admin-projects__state" role="alert">
              <p>{error}</p>
              <button type="button" className="btn btn--ghost" onClick={() => setReloadToken((token) => token + 1)}>
                Try again
              </button>
            </div>
          ) : !data ? (
            <div className="admin-projects__state" role="status">
              <p>Loading projects…</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="admin-projects__state">
              <p>{visibility || category ? "No projects match these filters." : "No projects yet."}</p>
              {!visibility && !category && (
                <Link to="/admin/projects/new" className="btn btn--green">
                  Create your first project
                </Link>
              )}
            </div>
          ) : (
            <div className="admin-projects__table-wrap">
              <table className="admin-projects__table">
                <thead>
                  <tr>
                    <th scope="col">Project</th>
                    <th scope="col">Category</th>
                    <th scope="col">Status</th>
                    <th scope="col">Visibility</th>
                    <th scope="col">Updated</th>
                    <th scope="col" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td>
                        <div className="admin-projects__project">
                          <img src={project.imageUrl} alt="" loading="lazy" />
                          <div>
                            <strong>{project.title}</strong>
                            <span>{project.location}</span>
                          </div>
                        </div>
                      </td>
                      <td>{categoryLabels[project.category as ServiceCategory] ?? project.category}</td>
                      <td>{projectStatusLabels[project.status]}</td>
                      <td>
                        <span className={`admin-projects__badge is-${project.visibility}`}>
                          {projectVisibilityLabels[project.visibility]}
                        </span>
                      </td>
                      <td>{dateFormatter.format(new Date(project.updatedAt))}</td>
                      <td>
                        <div className="admin-projects__actions">
                          {confirmingId === project.id ? (
                            <>
                              <span>Delete?</span>
                              <button
                                type="button"
                                className="admin-projects__action is-danger"
                                onClick={() => handleDelete(project)}
                                disabled={deletingId === project.id}
                              >
                                {deletingId === project.id ? "Deleting…" : "Yes, delete"}
                              </button>
                              <button
                                type="button"
                                className="admin-projects__action"
                                onClick={() => setConfirmingId(null)}
                                disabled={deletingId === project.id}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <Link to={`/admin/projects/${project.id}/edit`} className="admin-projects__action">
                                Edit
                              </Link>
                              <button
                                type="button"
                                className="admin-projects__action is-danger"
                                onClick={() => setConfirmingId(project.id)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Pagination
          page={page}
          totalPages={data?.pagination.totalPages ?? 0}
          onPageChange={(nextPage) => {
            setPage(nextPage);
            setConfirmingId(null);
          }}
          disabled={loading}
        />
      </div>
    </section>
  );
};

export default AdminProjects;
