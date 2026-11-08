import type { ProfessionalRole } from "@cybsec/shared-profile";
interface Props {
    value: ProfessionalRole[];
    onChange: (value: ProfessionalRole[]) => void;
    customRoles: string[];
    onCustomRolesChange: (value: string[]) => void;
}
export default function ProfessionalIdentity({ value, onChange, customRoles, onCustomRolesChange, }: Props): import("react").JSX.Element;
export {};
