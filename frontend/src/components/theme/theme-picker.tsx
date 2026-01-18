import { THEMES, type ThemeKey } from "../../themes";

type Props = {
  selected: ThemeKey | null;
  onSelect: (theme: ThemeKey) => void;
};

export default function ThemePicker({
  selected,
  onSelect,
}: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar py-10 ">
      {Object.entries(THEMES).map(([key, theme]) => (
        <button
          key={key}
          onClick={() => onSelect(key as ThemeKey)}
          className={`min-w-[120px] h-[80px] rounded-xl overflow-hidden relative transition-all duration-200 ease-in-out ${
            selected === key ? "ring-2 ring-black" : ""
          } hover:scale-105 hover:shadow-lg`}
        >
          <img
            src={theme.url}
            alt={theme.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <span className="absolute bottom-1 left-1 text-xs text-white">
            {theme.name}
          </span>
        </button>
      ))}
    </div>
  );
}
