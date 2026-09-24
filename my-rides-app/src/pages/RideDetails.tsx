import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

type Ride = {
  id: number;
  name: string;
  park: string;
  status: string;
  type: string[];
  thrill_rating: number;
  description?: string;
  height?: number;
  speed?: number;
  duration?: number;
  opened?: string;
};

const RIDES_ENDPOINT =
  "https://eftfmqrmwlfsxhcaehsx.supabase.co/functions/v1/rides";

function RideDetails() {
  const { id } = useParams<{ id: string }>();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetch(`${RIDES_ENDPOINT}/${id}`)
      .then((res) => {
        if (res.status === 404) throw new Error("not-found");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Ride) => {
        if (!cancelled) setRide(data);
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
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error === "not-found" || (!loading && !ride && !error)) {
    return (
      <div className="text-center py-5">
        <h2 className="display-6">🎢 Ride not found</h2>
        <p className="text-body-secondary">
          That coaster isn't in the park.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to all rides
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Failed to load ride.</strong> {error}
      </div>
    );
  }

  if (!ride) return null;

  const types = Array.isArray(ride.type) ? ride.type : [];
  const operating = ride.status === "Operating";

  return (
    <>
      <Helmet>
        <title>{ride.name} | ThrillTrack</title>
        <meta
          name="description"
          content={`${ride.name} at ${ride.park} — ${types.join(", ")}. Thrill rating ${ride.thrill_rating}/10.`}
        />
      </Helmet>

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">All Rides</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {ride.name}
          </li>
        </ol>
      </nav>

      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
        <div>
          <h2 className="mb-1">{ride.name}</h2>
          <p className="text-body-secondary mb-0">{ride.park}</p>
        </div>
        <span
          className={`badge fs-6 ${operating ? "bg-success" : "bg-secondary"}`}
        >
          {ride.status}
        </span>
      </div>

      <div className="row g-3 mb-4">
        <Stat label="Thrill" value={`${ride.thrill_rating}/10`} />
        {ride.height != null && (
          <Stat label="Height" value={`${ride.height} ft`} />
        )}
        {ride.speed != null && (
          <Stat label="Speed" value={`${ride.speed} mph`} />
        )}
        {ride.duration != null && (
          <Stat label="Duration" value={`${ride.duration}s`} />
        )}
        {ride.opened && <Stat label="Opened" value={ride.opened} />}
      </div>

      <div className="mb-4">
        <h3 className="h6 text-body-secondary text-uppercase">Type</h3>
        <div className="d-flex flex-wrap gap-2">
          {types.length > 0 ? (
            types.map((t) => (
              <span key={t} className="badge text-bg-light border">
                {t}
              </span>
            ))
          ) : (
            <span className="text-body-secondary">—</span>
          )}
        </div>
      </div>

      {ride.description && (
        <div className="mb-4">
          <h3 className="h6 text-body-secondary text-uppercase">About</h3>
          <p>{ride.description}</p>
        </div>
      )}

      <Link to="/" className="btn btn-outline-secondary">
        ← Back to all rides
      </Link>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="col-6 col-md-3">
      <div className="border rounded p-3 h-100">
        <div className="text-body-secondary small text-uppercase">{label}</div>
        <div className="fs-4 fw-semibold">{value}</div>
      </div>
    </div>
  );
}

export default RideDetails;
