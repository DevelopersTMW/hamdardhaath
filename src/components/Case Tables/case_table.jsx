import "./case_table.css"

const CaseTable = ({ cases }) => {
  return (
    <div className="case-table-container">
      <div className="table-header">
        <h2>Active Cases</h2>
        <div className="table-controls">
          <input type="text" placeholder="Search cases..." className="search-input" />
          <button className="filter-btn">Filter</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="case-table">
          <thead>
            <tr>
              <th>Case Name</th>
              <th>Status</th>
              <th>Amount Needed</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((caseItem) => (
              <tr key={caseItem.id}>
                <td>
                  <div className="case-info">
                    <div className="case-avatar">{caseItem.category === "Education" ? "📚" : "🏥"}</div>
                    <div>
                      <div className="case-title">{caseItem.title}</div>
                      <div className="case-category">{caseItem.category}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${caseItem.status.toLowerCase()}`}>{caseItem.status}</span>
                </td>
                <td className="amount">{caseItem.amount}</td>
                <td>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${caseItem.progress}%` }}></div>
                    </div>
                    <span className="progress-text">{caseItem.progress}%</span>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn edit">✏️</button>
                    <button className="action-btn delete">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div className="showing-info">Showing 1-3 of 3 Cases</div>
        <div className="pagination">
          <button className="page-btn">Previous</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">Next</button>
        </div>
      </div>
    </div>
  )
}

export default CaseTable
