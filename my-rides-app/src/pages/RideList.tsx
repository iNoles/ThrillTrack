import { useState, useEffect, useMemo, useDeferredValue } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

type Ride = {
  id: number;
  name: string;
  park: string;
  status: string;
  type: string[];
  thrill_rating: number;
};

const RIDES_ENDPOINT =
  "https://eftfmqrmwlfsxhcaehsx.supabase.co/functions/v1/rides";

function RideList() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [park, setPark] = useState("");
  const [search, setSearch] = useState("");

  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let cancelled = false;

    fetch(RIDES_ENDPOINT)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Ride[]) => {
        if (!cancelled) setRides(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const parks = useMemo(
    () => Array.from(new Set(rides.map((r) => r.park))).sort(),
    [rides]
  );

  const filteredRides = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase();

    return rides.filter((r) => {
      const types = Array.isArray(r.type) ? r.type : [];

      const matchesSearch =
        !term ||
        r.name?.toLowerCase().includes(term) ||
        r.park?.toLowerCase().includes(term) ||
        types.some((t) => t.toLowerCase().includes(term));

      const matchesPark = park === "" || r.park === park;

      return matchesSearch && matchesPark;
    });
  }, [rides, deferredSearch, park]);

  const hasFilters = search !== "" || park !== "";

  if (loading) {
    return (
      <>
        <Helmet>
          <title>All Theme Park Rides | ThrillTrack</title>
        </Helmet>
        <div className="placeholder-glow">
          <div
            className="placeholder col-4 mb-3 d-block"
            style={{ height: "2rem" }}
          />
          <div className="row g-2 mb-3">
            <div className="col-12 col-md-7">
              <div className="placeholder col-12" style={{ height: "2.5rem" }} />
            </div>
            <div className="col-12 col-md-5">
              <div className="placeholder col-12" style={{ height: "2.5rem" }} />
            </div>
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="placeholder col-12 mb-2 d-block"
              style={{ height: "2rem" }}
            />
          ))}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error | ThrillTrack</title>
        </Helmet>
        <div className="alert alert-danger" role="alert">
          <strong>Failed to load rides.</strong> {error}
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>All Theme Park Rides | ThrillTrack</title>
        <meta
          name="description"
          content="Browse all theme park rides by park, status, and ride type."
        />
      </Helmet>

      <h2 className="mb-3">All Rides</h2>

      {/* Filters */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-12 col-md-7">
              <div className="input-group">
                <span className="input-group-text" aria-hidden="true">
                  🔍
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search rides, parks, or types..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search rides"
                />
              </div>
            </div>
            <div className="col-12 col-md-5">
              <select
                className="form-select"
                value={park}
                onChange={(e) => setPark(e.target.value)}
                aria-label="Filter by park"
              >
                <option value="">All Parks</option>
                {parks.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasFilters && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="text-body-secondary small">
                {filteredRides.length} of {rides.length} rides
              </span>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setSearch("");
                  setPark("");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {filteredRides.length === 0 ? (
        <div className="text-center py-5 text-body-secondary">
          <div className="display-6 mb-2" aria-hidden="true">
            🔍
          </div>
          <p className="mb-3">
            {hasFilters
              ? "No rides match your filters."
              : "No rides available."}
          </p>
          {hasFilters && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setSearch("");
                setPark("");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Table — md and up */}
          <div className="table-responsive d-none d-md-block">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col" className="text-body-secondary">
                    #
                  </th>
                  <th scope="col">Name</th>
                  <th scope="col">Park</th>
                  <th scope="col">Status</th>
                  <th scope="col">Type</th>
                  <th scope="col" style={{ width: "160px" }}>
                    Thrill
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRides.map((r) => {
                  const types = Array.isArray(r.type) ? r.type : [];
                  const operating = r.status === "Operating";

                  return (
                    <tr key={r.id}>
                      <td className="text-body-secondary">{r.id}</td>
                      <td>
                        <Link
                          to={`/${r.id}`}
                          className="fw-semibold text-decoration-none"
                        >
                          {r.name}
                        </Link>
                      </td>
                      <td>{r.park}</td>
                      <td>
                        <span
                          className={`badge ${
                            operating ? "text-bg-success" : "text-bg-secondary"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {types.map((t) => (
                            <span
                              key={t}
                              className="badge text-bg-light border fw-normal"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <ThrillBar value={r.thrill_rating} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cards — below md */}
          <div className="d-md-none">
            <div className="row g-3">
              {filteredRides.map((r) => {
                const types = Array.isArray(r.type) ? r.type : [];
                const operating = r.status === "Operating";

                return (
                  <div className="col-12" key={r.id}>
                    <div className="card h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h3 className="h6 mb-0">
                            <Link
                              to={`/${r.id}`}
                              className="text-decoration-none stretched-link"
                            >
                              {r.name}
                            </Link>
                          </h3>
                          <span
                            className={`badge ${
                              operating
                                ? "text-bg-success"
                                : "text-bg-secondary"
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <p className="text-body-secondary small mb-2">
                          {r.park}
                        </p>
                        <div className="d-flex flex-wrap gap-1 mb-3">
                          {types.map((t) => (
                            <span
                              key={t}
                              className="badge text-bg-light border fw-normal"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <ThrillBar value={r.thrill_rating} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function ThrillBar({ value }: { value: number }) {
  const color =
    value >= 8 ? "bg-danger" : value >= 5 ? "bg-warning" : "bg-success";

  return (
    <div className="d-flex align-items-center gap-2">
      <div className="small text-body-secondary" style={{ minWidth: "38px" }}>
        {value}/10
      </div>
      <div
        className="progress flex-grow-1"
        style={{ height: "8px" }}
        role="progressbar"
        aria-label="Thrill rating"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={10}
      >
        <div
          className={`progress-bar ${color}`}
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  );
}

export default RideList;
