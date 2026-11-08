interface CustomOptionInputProps {
    label: string;
    placeholder: string;
    value: string[];
    onChange: (value: string[]) => void;
}
export default function CustomOptionInput({ label, placeholder, value, onChange, }: CustomOptionInputProps): import("react").JSX.Element;
export {};
