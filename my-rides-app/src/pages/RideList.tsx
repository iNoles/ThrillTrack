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
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Failed to load rides.</strong> {error}
      </div>
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

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-8">
          <input
            type="search"
            className="form-control"
            placeholder="Search rides, parks, or types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search rides"
          />
        </div>
        <div className="col-12 col-md-4">
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
        <div className="d-flex justify-content-between align-items-center mb-2">
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

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Park</th>
              <th scope="col">Status</th>
              <th scope="col">Type</th>
              <th scope="col">Thrill</th>
            </tr>
          </thead>
          <tbody>
            {filteredRides.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-body-secondary">
                  {hasFilters
                    ? "No rides match your filters."
                    : "No rides available."}
                </td>
              </tr>
            ) : (
              filteredRides.map((r) => {
                const types = Array.isArray(r.type) ? r.type : [];
                const operating = r.status === "Operating";

                return (
                  <tr key={r.id}>
                    <td className="text-body-secondary">{r.id}</td>
                    <td>
                      <Link to={`/${r.id}`} className="fw-medium">
                        {r.name}
                      </Link>
                    </td>
                    <td>{r.park}</td>
                    <td>
                      <span
                        className={`badge ${
                          operating ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>{types.join(", ")}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="me-2 small" style={{ minWidth: "38px" }}>
                          {r.thrill_rating}/10
                        </div>
                        <div
                          className="progress flex-grow-1"
                          style={{ height: "12px" }}
                          role="progressbar"
                          aria-label="Thrill rating"
                          aria-valuenow={r.thrill_rating}
                          aria-valuemin={0}
                          aria-valuemax={10}
                        >
                          <div
                            className={`progress-bar ${
                              r.thrill_rating >= 8
                                ? "bg-danger"
                                : r.thrill_rating >= 5
                                ? "bg-warning"
                                : "bg-success"
                            }`}
                            style={{ width: `${(r.thrill_rating / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default RideList;
