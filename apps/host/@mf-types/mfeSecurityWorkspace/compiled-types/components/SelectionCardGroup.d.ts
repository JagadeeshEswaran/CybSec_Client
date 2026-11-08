interface SelectionOption<T extends string> {
    value: T;
    label: string;
    description: string;
    icon: string;
}
interface SelectionCardGroupProps<T extends string> {
    options: SelectionOption<T>[];
    value: T[];
    onChange: (value: T[]) => void;
}
export default function SelectionCardGroup<T extends string>({ options, value, onChange, }: SelectionCardGroupProps<T>): import("react").JSX.Element;
export {};
