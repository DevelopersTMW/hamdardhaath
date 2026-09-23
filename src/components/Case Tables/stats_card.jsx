import "./stats_card.css"

const StatsCard = ({ title, value, icon, trend }) => {
  return (
    <div className="stats-card">
      <div className="stats-header">
        <div className="stats-icon">{icon}</div>
        <div className="stats-trend">{trend}</div>
      </div>
      <div className="stats-content">
        <h3 className="stats-value">{value}</h3>
        <p className="stats-title">{title}</p>
      </div>
    </div>
  )
}

export default StatsCard
