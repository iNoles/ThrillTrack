import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

function RideDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://eftfmqrmwlfsxhcaehsx.supabase.co/functions/v1/rides/${id}`)
      .then(res => res.json())
      .then(data => setRide(data))
      .finally(() => setLoading(false));
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

  if (!ride) return <p>Ride not found</p>;

  return (
    <>
      <Helmet>
        <title>{ride.name} | Theme Park Rides</title>
        <meta
          name="description"
          content={`${ride.name} at ${ride.park}. Status: ${ride.status}. Ride type: ${ride.type.join(", ")}.`}
        />
      </Helmet>

      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="card">
        <div className="card-body">
          <h1 className="card-title mb-3">{ride.name}</h1>

          <p className="card-text">
            <strong>Park:</strong> {ride.park}
          </p>

          <p className="card-text">
            <strong>Status:</strong>{" "}
            <span className={`badge ${ride.status === "Operating" ? "bg-success" : "bg-secondary"} text-white`}>
              {ride.status}
            </span>
          </p>

          <p className="card-text">
            <strong>Type:</strong> {ride.type.join(", ")}
          </p>

          {ride.description && (
            <p className="card-text">
              <strong>Description:</strong> {ride.description}
            </p>
          )}

          {ride.manufacturer && (
            <p className="card-text">
              <strong>Manufacturer:</strong> {ride.manufacturer}
            </p>
          )}

          {ride.opening_year && (
            <p className="card-text">
              <strong>Opening Year:</strong> {ride.opening_year}
            </p>
          )}

          {ride.height_requirement && (
            <p className="card-text">
              <strong>Height Requirement:</strong> {ride.height_requirement} in
            </p>
          )}

          {/* Thrill Rating */}
          {ride.thrill_rating !== undefined && (
            <div className="mb-3">
              <strong>Thrill Rating:</strong> {ride.thrill_rating}/10
              <div className="progress mt-1" style={{ height: "12px" }}>
                <div
                  className={`progress-bar ${
                    ride.thrill_rating >= 8
                      ? "bg-danger"
                      : ride.thrill_rating >= 5
                      ? "bg-warning"
                      : "bg-success"
                  }`}
                  role="progressbar"
                  style={{ width: `${(ride.thrill_rating / 10) * 100}%` }}
                  aria-valuenow={ride.thrill_rating}
                  aria-valuemin={0}
                  aria-valuemax={10}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default RideDetails;
