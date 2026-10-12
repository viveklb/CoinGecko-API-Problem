function CoinRow({ coin, formatCurrency, formatCompactCurrency }) {
  const priceChange = coin.price_change_percentage_24h;
  const changeClass =
    priceChange > 0 ? "change-positive" : priceChange < 0 ? "change-negative" : "change-neutral";

  return (
    <tr>
      <td className="rank-cell rank-number">{coin.market_cap_rank ?? "—"}</td>
      <td className="asset-cell">
        <div className="asset">
          <img className="coin-icon" src={coin.image} alt="" loading="lazy" />
          <div className="asset-names">
            <span className="coin-name">{coin.name}</span>
            <span className="coin-symbol">{coin.symbol?.toUpperCase()}</span>
          </div>
        </div>
      </td>
      <td className="numeric-cell price-cell">{formatCurrency(coin.current_price, 2)}</td>
      <td className={`numeric-cell ${changeClass}`}>
        {Number.isFinite(priceChange) ? `${priceChange > 0 ? "+" : ""}${priceChange.toFixed(2)}%` : "—"}
      </td>
      <td className="numeric-cell market-cap-cell">{formatCompactCurrency(coin.market_cap)}</td>
      <td className="numeric-cell volume-cell">{formatCompactCurrency(coin.total_volume)}</td>
    </tr>
  );
}

export default CoinRow;
