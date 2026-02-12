import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function RideList() {
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [park, setPark] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://eftfmqrmwlfsxhcaehsx.supabase.co/functions/v1/rides")
      .then(res => res.json())
      .then(data => setRides(data))
      .finally(() => setLoading(false));
  }, []);

  const parks = Array.from(new Set(rides.map((r) => r.park)));

  // Filter rides based on search input
  const filteredRides = rides.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.park.toLowerCase().includes(search.toLowerCase()) ||
    r.type.some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>All Theme Park Rides</title>
        <meta name="description" content="Browse all theme park rides by park, status, and ride type." />
      </Helmet>

      <h1 className="mb-3">All Rides</h1>

      <div className="mb-3 d-flex gap-2">
        <input
          className="form-control"
          placeholder="Search rides..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          value={park}
          onChange={(e) => setPark(e.target.value)}
        >
          <option value="">All Parks</option>
          {parks.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Park</th>
              <th>Status</th>
              <th>Type</th>
              <th>Thrill</th>
            </tr>
          </thead>
          <tbody>
            {filteredRides.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">No rides found.</td>
              </tr>
            ) : (
              filteredRides.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td><Link to={`/ThrillTrack/${r.id}`}>{r.name}</Link></td>
                  <td>{r.park}</td>
                  <td><span className={`badge ${r.status === "Operating" ? "bg-success" : "bg-secondary"} text-white`}>
                    {r.status}
                  </span></td>
                  <td>{r.type.join(", ")}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="me-2" style={{ minWidth: "30px" }}>{r.thrill_rating}/10</div>
                      <div className="progress" style={{ flex: 1, height: "12px" }}>
                        <div
                          className={`progress-bar ${r.thrill_rating >= 8 ? "bg-danger" : r.thrill_rating >= 5 ? "bg-warning" : "bg-success"}`}
                          role="progressbar"
                          style={{ width: `${(r.thrill_rating / 10) * 100}%` }}
                          aria-valuenow={r.thrill_rating}
                          aria-valuemin={0}
                          aria-valuemax={10}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default RideList;
