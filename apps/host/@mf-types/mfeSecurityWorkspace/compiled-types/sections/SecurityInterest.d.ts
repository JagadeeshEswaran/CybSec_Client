import type { SecurityInterest } from "@cybsec/shared-profile";
interface Props {
    value: SecurityInterest[];
    onChange: (value: SecurityInterest[]) => void;
    customInterests: string[];
    onCustomInterestsChange: (value: string[]) => void;
}
export default function SecurityInterests({ value, onChange, customInterests, onCustomInterestsChange, }: Props): import("react").JSX.Element;
export {};
