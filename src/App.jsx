import { useEffect, useState } from "react";
import CoinRow from "./components/CoinRow.jsx";

const MARKET_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

function formatCurrency(value, digits = 2) {
  if (value == null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value < 1 ? Math.min(digits, 6) : digits,
    maximumFractionDigits: value < 1 ? Math.min(digits, 6) : digits,
  }).format(value);
}

function formatCompactCurrency(value) {
  if (value == null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function App() {
  const [coins, setCoins] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMarkets() {
      setStatus("loading");
      setError("");

      try {
        const response = await fetch(MARKET_URL, {
          signal: controller.signal,
          headers: { accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(
            `CoinGecko returned ${response.status}. Please try again in a moment.`,
          );
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("The market data response was not in the expected format.");
        }

        setCoins(data);
        setLastUpdated(new Date());
        setStatus("success");
      } catch (fetchError) {
        if (fetchError.name === "AbortError") return;
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Something went wrong while loading market data.",
        );
        setStatus("error");
      }
    }

    loadMarkets();
    return () => controller.abort();
  }, []);

  const gainers = coins.filter(
    (coin) => Number.isFinite(coin.price_change_percentage_24h) && coin.price_change_percentage_24h > 0,
  ).length;

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="CoinScope home">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>coin<span className="brand-light">scope</span></span>
        </a>
        <div className="topbar-right">
          <span className="live-indicator"><span /> Live market</span>
          <a className="source-link" href="https://www.coingecko.com/" target="_blank" rel="noreferrer">
            Data by CoinGecko <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <main className="main-content">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> MARKET OVERVIEW</div>
            <h1>Crypto, at a glance.</h1>
            <p className="hero-subtitle">
              Track the world&apos;s top digital assets, all in one place.
            </p>
          </div>
          <div className="hero-note">
            <span className="note-icon" aria-hidden="true">↗</span>
            <span>Top 10 coins by<br /><strong>market capitalization</strong></span>
          </div>
        </section>

        <section className="summary-grid" aria-label="Market summary">
          <article className="summary-card">
            <div className="summary-label">ASSETS TRACKED <span className="summary-icon">◈</span></div>
            <div className="summary-value">{status === "success" ? coins.length : "—"}</div>
            <div className="summary-foot">Top coins by market cap</div>
          </article>
          <article className="summary-card">
            <div className="summary-label">CURRENCY <span className="summary-icon">$</span></div>
            <div className="summary-value">USD</div>
            <div className="summary-foot">All prices in US dollars</div>
          </article>
          <article className="summary-card">
            <div className="summary-label">24H GAINERS <span className="summary-icon">↗</span></div>
            <div className="summary-value">{status === "success" ? `${gainers}/${coins.length}` : "—"}</div>
            <div className="summary-foot">Assets up in the last 24 hours</div>
          </article>
        </section>

        <section className="market-section" aria-labelledby="market-title">
          <div className="section-heading">
            <div>
              <h2 id="market-title">Top cryptocurrencies</h2>
              <p>A snapshot of the market&apos;s leading assets</p>
            </div>
            <div className="updated-label">
              <span className={`status-dot ${status === "error" ? "status-dot-error" : ""}`} />
              {status === "loading" && "Fetching latest data"}
              {status === "error" && "Update failed"}
              {status === "success" &&
                `Updated ${lastUpdated?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
            </div>
          </div>

          <div className="table-card">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th className="rank-cell">#</th>
                    <th className="asset-cell">ASSET</th>
                    <th className="numeric-cell">PRICE</th>
                    <th className="numeric-cell">24H CHANGE</th>
                    <th className="numeric-cell market-cap-cell">MARKET CAP</th>
                    <th className="numeric-cell volume-cell">24H VOLUME</th>
                  </tr>
                </thead>
                <tbody>
                  {status === "loading" &&
                    Array.from({ length: 5 }, (_, index) => (
                      <tr className="skeleton-row" key={`skeleton-${index}`}>
                        <td><span /></td><td><span /></td><td><span /></td>
                        <td><span /></td><td><span /></td><td><span /></td>
                      </tr>
                    ))}
                  {status === "success" &&
                    coins.map((coin) => (
                      <CoinRow
                        key={coin.id}
                        coin={coin}
                        formatCurrency={formatCurrency}
                        formatCompactCurrency={formatCompactCurrency}
                      />
                    ))}
                  {status === "success" && coins.length === 0 && (
                    <tr><td className="empty-state" colSpan="6">No market data is available right now.</td></tr>
                  )}
                  {status === "error" && (
                    <tr>
                      <td className="empty-state error-state" colSpan="6">
                        <span>{error}</span>
                        <button className="retry-button" onClick={() => window.location.reload()}>
                          Reload page
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <span><span className="footer-live-dot" /> Prices are updated in real time</span>
              <span>Ranked by market capitalization</span>
            </div>
          </div>
          <p className="disclaimer">Market data provided by CoinGecko. Prices and figures may be delayed.</p>
        </section>
      </main>

      <footer className="page-footer">
        <a className="footer-brand" href="#">coinscope</a>
        <span>Clearer view of the crypto market.</span>
        <span>Made for curious minds <span className="footer-spark">✳</span></span>
      </footer>
    </div>
  );
}

export default App;
