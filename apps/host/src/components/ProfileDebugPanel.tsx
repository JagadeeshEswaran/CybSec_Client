import { useProfile } from "@cybsec/shared-profile";

const ProfileDebugPanel = () => {
	const {
		profile,
		status,
		isSaving,
		error,
		createProfile,
		updateProfile,
		clearProfile,
		refreshProfile,
	} = useProfile();

	const handleCreate = async () => {
		try {
			await createProfile({
				roles: ["developer", "security-architect"],
				technologies: ["React", "Node.js", "Java", "Linux"],
				environments: ["cloud", "hybrid"],
				interests: ["vulnerability-management", "threat-intelligence"],
				priorities: ["application-security", "network-security"],
			});
		} catch (err) {
			console.error("Profile creation failed:", err);
		}
	};

	const handleUpdate = async () => {
		try {
			await updateProfile({
				technologies: ["React", "Node.js", "Java", "Linux", "Docker"],
			});
		} catch (err) {
			console.error("Profile update failed:", err);
		}
	};

	const handleClear = async () => {
		try {
			await clearProfile();
		} catch (err) {
			console.error("Profile clearing failed:", err);
		}
	};

	return (
		<section
			style={{
				margin: "16px",
				padding: "16px",
				border: "1px dashed var(--border)",
				borderRadius: "10px",
				background: "var(--surface)",
				color: "var(--text-primary)",
			}}>
			<h3>Profile Context Debugger</h3>

			<p>
				Status: <strong>{status}</strong>
			</p>

			<p>
				Saving: <strong>{isSaving ? "Yes" : "No"}</strong>
			</p>

			<p>
				Profile: <strong>{profile ? "Configured" : "Not configured"}</strong>
			</p>

			{error && <p style={{ color: "var(--danger)" }}>Error: {error}</p>}

			<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
				<button
					disabled={isSaving || status === "loading" || !!profile}
					onClick={handleCreate}>
					Create Profile
				</button>

				<button disabled={isSaving || !profile} onClick={handleUpdate}>
					Update Technologies
				</button>

				<button disabled={isSaving || !profile} onClick={handleClear}>
					Clear Profile
				</button>

				<button
					disabled={isSaving || status === "loading"}
					onClick={() => void refreshProfile()}>
					Reload Profile
				</button>
			</div>

			{profile && (
				<pre
					style={{
						marginTop: "16px",
						padding: "12px",
						borderRadius: "6px",
						background: "var(--surface-secondary)",
						overflowX: "auto",
						fontSize: "12px",
					}}>
					{JSON.stringify(profile, null, 2)}
				</pre>
			)}
		</section>
	);
};

export default ProfileDebugPanel;
