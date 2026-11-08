import type { DeploymentEnvironment } from "@cybsec/shared-profile";
interface Props {
    value: DeploymentEnvironment[];
    onChange: (value: DeploymentEnvironment[]) => void;
    customEnvironments: string[];
    onCustomEnvironmentsChange: (value: string[]) => void;
}
export default function DeploymentEnvironmentSection({ value, onChange, customEnvironments, onCustomEnvironmentsChange, }: Props): import("react").JSX.Element;
export {};
