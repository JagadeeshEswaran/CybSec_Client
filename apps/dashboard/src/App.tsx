import "./App.css";

function App() {
	return (
		<div className="dashboard-content">
			<div className="dashboard-grid">
				<div className="stat-card">
					<span>Total Customers</span>
					<h2>12,480</h2>
					<small>+12.8% this month</small>
				</div>

				<div className="stat-card">
					<span>Active Accounts</span>
					<h2>8,240</h2>
					<small>+8.2% this month</small>
				</div>

				<div className="stat-card">
					<span>Pending Reviews</span>
					<h2>128</h2>
					<small>Needs attention</small>
				</div>
			</div>

			<div className="dashboard-panel">
				<h3>Recent Activity</h3>
				<p>Your recent platform activity will appear here.</p>
			</div>
		</div>
	);
}

export default App;
