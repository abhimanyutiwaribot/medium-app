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
    <div className="flex gap-4 overflow-x-auto no-scrollbar py-3 px-2">
      {Object.entries(THEMES).map(([key, theme]) => (
        <button
          key={key}
          onClick={() => onSelect(key as ThemeKey)}
          className={`
            flex-shrink-0 min-w-[120px] h-[80px] rounded-xl overflow-hidden 
            relative transition-all duration-200 ease-in-out
            ${selected === key 
              ? "ring-2 ring-white scale-105" 
              : "opacity-80 hover:opacity-100"
            } 
            hover:scale-105 hover:shadow-xl
          `}
        >
          <img
            src={theme.url}
            alt={theme.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <span className="absolute bottom-2 left-2 right-2 text-xs font-medium text-white drop-shadow-lg truncate">
            {theme.name}
          </span>
        </button>
      ))}
    </div>
  );
}