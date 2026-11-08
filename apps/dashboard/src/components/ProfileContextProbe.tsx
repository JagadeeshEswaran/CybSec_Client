import { useProfile } from "@cybsec/shared-profile";

function ProfileContextProbe() {
	const { profile, status, error } = useProfile();

	return (
		<section
			style={{
				padding: "16px",
				marginBottom: "20px",
				border: "1px dashed var(--border)",
				borderRadius: "10px",
				background: "var(--surface)",
				color: "var(--text-primary)",
			}}>
			<h3>Cross-MFE Profile Consumer</h3>

			<p>
				Context status: <strong>{status}</strong>
			</p>

			<p>
				Profile ID: <strong>{profile?.id ?? "No profile"}</strong>
			</p>

			<p>Roles: {profile?.roles.join(", ") || "None"}</p>

			<p>Technologies: {profile?.technologies.join(", ") || "None"}</p>

			{error && <p style={{ color: "var(--danger)" }}>{error}</p>}
		</section>
	);
}

export default ProfileContextProbe;
