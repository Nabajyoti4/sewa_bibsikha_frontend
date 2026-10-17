import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "../../../../components/Icon";
import useApiQuery from "../../../../hooks/useApiQuery";
import { deleteHeroSlide, listAdminHeroSlides } from "../../../../services/adminApiService";
import type { HeroSlideApiItem } from "../../../../services/apiHelpers";
import "../../projects/list/AdminProjects.css";

const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

const AdminHeroSlides = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [reloadToken, setReloadToken] = useState(0);
  const [flash, setFlash] = useState<string | null>((location.state as { flash?: string } | null)?.flash ?? null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (location.state) navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const { data: slides, error, loading } = useApiQuery(String(reloadToken), listAdminHeroSlides);

  const handleDelete = async (slide: HeroSlideApiItem) => {
    setDeletingId(slide.id);
    setActionError(null);
    try {
      await deleteHeroSlide(slide.id);
      setFlash(`“${slide.title}” was deleted.`);
      setConfirmingId(null);
      setReloadToken((token) => token + 1);
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : "Could not delete the slide.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="section admin-projects">
      <div className="container">
        <div className="admin-projects__head">
          <div>
            <h1 className="display-lg">Hero slider</h1>
            <p className="lead">
              {slides
                ? `${slides.length} slide${slides.length === 1 ? "" : "s"} · shown on the home page in the order they were created`
                : "Manage the cards in the home page slider."}
            </p>
          </div>
          <Link to="/admin/hero-slides/new" className="btn btn--gold">
            <Icon name="plus" size={18} />
            New slide
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

        <div className={`admin-projects__card ${loading && slides ? "is-loading" : ""}`}>
          {error ? (
            <div className="admin-projects__state" role="alert">
              <p>{error}</p>
              <button type="button" className="btn btn--ghost" onClick={() => setReloadToken((token) => token + 1)}>
                Try again
              </button>
            </div>
          ) : !slides ? (
            <div className="admin-projects__state" role="status">
              <p>Loading slides…</p>
            </div>
          ) : slides.length === 0 ? (
            <div className="admin-projects__state">
              <p>No slides yet. The slider is hidden on the home page until you add one.</p>
              <Link to="/admin/hero-slides/new" className="btn btn--green">
                Create your first slide
              </Link>
            </div>
          ) : (
            <div className="admin-projects__table-wrap">
              <table className="admin-projects__table">
                <thead>
                  <tr>
                    <th scope="col">Slide</th>
                    <th scope="col">Tag</th>
                    <th scope="col">Images</th>
                    <th scope="col">Updated</th>
                    <th scope="col" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {slides.map((slide) => (
                    <tr key={slide.id}>
                      <td>
                        <div className="admin-projects__project">
                          <img src={slide.images[0]?.imageUrl} alt="" loading="lazy" />
                          <div>
                            <strong>{slide.title}</strong>
                            <span>{slide.caption}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="admin-projects__badge is-active">{slide.tag}</span>
                      </td>
                      <td>{slide.images.length}</td>
                      <td>{dateFormatter.format(new Date(slide.updatedAt))}</td>
                      <td>
                        <div className="admin-projects__actions">
                          {confirmingId === slide.id ? (
                            <>
                              <span>Delete?</span>
                              <button
                                type="button"
                                className="admin-projects__action is-danger"
                                onClick={() => handleDelete(slide)}
                                disabled={deletingId === slide.id}
                              >
                                {deletingId === slide.id ? "Deleting…" : "Yes, delete"}
                              </button>
                              <button
                                type="button"
                                className="admin-projects__action"
                                onClick={() => setConfirmingId(null)}
                                disabled={deletingId === slide.id}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <Link to={`/admin/hero-slides/${slide.id}/edit`} className="admin-projects__action">
                                Edit
                              </Link>
                              <button
                                type="button"
                                className="admin-projects__action is-danger"
                                onClick={() => setConfirmingId(slide.id)}
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
      </div>
    </section>
  );
};

export default AdminHeroSlides;
