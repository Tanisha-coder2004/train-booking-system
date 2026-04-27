import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Train as TrainIcon, Clock, ArrowRight, ChevronRight } from "lucide-react";
import SearchBar from "../components/SearchBar";
import type { Train } from "../types/Booking";
import "./Search.scss";

const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);

  const src = searchParams.get("src") || "";
  const dest = searchParams.get("dest") || "";
  const date = searchParams.get("date") || "";

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        setLoading(true);
        const data = await api.searchTrains(src, dest, date);
        console.log("Trains fetched:", data);
        setTrains(data);
      } catch (err) {
        console.error("DEBUG: Failed to fetch trains.", {
          src, dest, date, 
          error: err
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrains();
  }, [src, dest, date]);

  return (
    <div className="search-page">
      <div className="search-header-container">
        <div className="container">
          <SearchBar variant="standard" />
        </div>
      </div>

      <div className="search-content">
        <main className="results-list">
          <div className="results-header">
            <span className="count"><strong>{trains.length}</strong> trains found for this route</span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Fetching routes...</p>
            </div>
          ) : trains.length > 0 ? (
            trains.map((train) => (
              <div key={train.id} className="train-card">
                <div className="journey-main">
                  <div className="identity">
                    <h3 className="name">{train.name}</h3>
                    <span className="number">#{train.number}</span>
                  </div>
                  
                  <div className="timeline">
                    <div className="node">
                      <span className="time">{train.departure}</span>
                      <span className="city">{train.src}</span>
                    </div>
                    <div className="path">
                      <span className="duration-badge">{train.duration}</span>
                      <div className="line"></div>
                    </div>
                    <div className="node">
                      <span className="time">{train.arrival}</span>
                      <span className="city">{train.dest}</span>
                    </div>
                  </div>
                </div>

                <div className="experience-action">
                  <div className="classes">
                    {Object.entries(train.inventory).map(([code, details]) => (
                      <div key={code} className="class-opt">
                        <span className="code">{code}</span>
                        <span className="price">₹{details?.price}</span>
                        <span className="availability">{details?.available} left</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    className="btn-book"
                    onClick={() => navigate(`/train/${train.id}`, { state: { train } })}
                  >
                    Select Seats
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results card">
              <TrainIcon size={48} />
              <h3>No Trains Found</h3>
              <p>We couldn't find any trains for this route and date. Try a different search.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;
