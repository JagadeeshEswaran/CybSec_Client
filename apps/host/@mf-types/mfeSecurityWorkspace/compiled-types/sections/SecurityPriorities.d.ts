import type { SecurityPriority } from "@cybsec/shared-profile";
interface Props {
    value: SecurityPriority[];
    onChange: (value: SecurityPriority[]) => void;
    customPriorities: string[];
    onCustomPrioritiesChange: (value: string[]) => void;
}
export default function SecurityPrioritiesSection({ value, onChange, customPriorities, onCustomPrioritiesChange, }: Props): import("react").JSX.Element;
export {};
