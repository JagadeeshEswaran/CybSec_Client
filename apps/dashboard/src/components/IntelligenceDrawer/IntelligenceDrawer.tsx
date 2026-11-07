import { useEffect, useRef } from "react";
import {
	X,
	ExternalLink,
	ShieldAlert,
	CalendarDays,
	Database,
	ArrowRight,
} from "lucide-react";

import type { IntelligenceItem } from "../../types/intelligence";

import "./IntelligenceDrawer.css";

interface IntelligenceDrawerProps {
	item: IntelligenceItem | null;
	onClose: () => void;
	onNavigate?: (module: "catalog" | "tracker") => void;
}

const IntelligenceDrawer = ({
	item,
	onClose,
	onNavigate,
}: IntelligenceDrawerProps) => {
	const closeButtonRef = useRef<HTMLButtonElement>(null);
	const previousFocusRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!item) return;

		previousFocusRef.current =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;

		closeButtonRef.current?.focus();

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}

			if (event.key === "Tab") {
				const drawer = document.querySelector(".intelligence-drawer");

				const focusableElements = drawer?.querySelectorAll<HTMLElement>(
					'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
				);

				if (!focusableElements?.length) return;

				const first = focusableElements[0];
				const last = focusableElements[focusableElements.length - 1];

				if (event.shiftKey && document.activeElement === first) {
					event.preventDefault();
					last.focus();
				} else if (!event.shiftKey && document.activeElement === last) {
					event.preventDefault();
					first.focus();
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			previousFocusRef.current?.focus();
		};
	}, [item, onClose]);

	useEffect(() => {
		if (!item) return;

		const previousOverflow = document.body.style.overflow;

		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [item]);

	if (!item) return null;

	const severityClass = `severity-${item.severity.toLowerCase()}`;

	return (
		<div
			className="drawer-backdrop"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) {
					onClose();
				}
			}}>
			<aside
				className="intelligence-drawer"
				role="dialog"
				aria-modal="true"
				aria-labelledby="drawer-title"
				aria-describedby="drawer-description">
				<div className="drawer-header">
					<div className="drawer-heading">
						<span>INTELLIGENCE DETAILS</span>
						<small>Investigation workspace</small>
					</div>

					<button
						ref={closeButtonRef}
						className="drawer-close"
						onClick={onClose}
						aria-label="Close intelligence details"
						type="button">
						<X size={19} />
					</button>
				</div>

				<div className="drawer-content">
					<div className="drawer-category">
						<ShieldAlert size={15} />
						{item.category}
					</div>

					<span className={`severity-badge ${severityClass}`}>
						{item.severity}
					</span>

					<h2 id="drawer-title">{item.title}</h2>

					<p id="drawer-description" className="drawer-description">
						{item.description}
					</p>

					<div className="drawer-meta">
						<div>
							<Database size={15} />
							<span>Reference</span>
							<strong>{item.id}</strong>
						</div>

						<div>
							<ExternalLink size={15} />
							<span>Source</span>
							<strong>{item.source}</strong>
						</div>

						<div>
							<CalendarDays size={15} />
							<span>Published</span>
							<strong>{item.publishedAt}</strong>
						</div>
					</div>

					<section className="drawer-section">
						<h3>Potential Impact</h3>
						<p>{item.potentialImpact}</p>
					</section>

					<section className="drawer-section">
						<h3>Affected Products</h3>

						<div className="drawer-tags">
							{item.affectedProducts.map((product) => (
								<span key={product}>{product}</span>
							))}
						</div>
					</section>

					<section className="drawer-section">
						<h3>Recommended Actions</h3>

						<ul className="drawer-actions-list">
							{item.recommendedActions.map((action, index) => (
								<li key={index}>{action}</li>
							))}
						</ul>
					</section>

					<section className="drawer-source">
						<h3>Original Reference</h3>

						{item.sourceUrl ? (
							<a
								href={item.sourceUrl}
								target="_blank"
								rel="noopener noreferrer">
								Open original advisory
								<ExternalLink size={14} />
							</a>
						) : (
							<p>Original source URL is not available in this sample record.</p>
						)}
					</section>
				</div>

				<div className="drawer-footer">
					<button
						type="button"
						className="drawer-secondary-action"
						onClick={() => {
							onClose();
							onNavigate?.("catalog");
						}}>
						View Catalog
					</button>

					<button
						type="button"
						className="drawer-primary-action"
						onClick={() => {
							onClose();
							onNavigate?.("tracker");
						}}>
						Investigate
						<ArrowRight size={15} />
					</button>
				</div>
			</aside>
		</div>
	);
};

export default IntelligenceDrawer;
