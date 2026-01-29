type Props = {
  data: Record<string, number>;
};

function getLastNDays(n: number) {
  const days: string[] = [];
  const today = new Date();

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  return days;
}

export default function Heatmap({ data }: Props) {
  const days = getLastNDays(120);
  
  const getIntensity = (count: number) => {
    if (!count) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    return 4;
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-rows-7 grid-flow-col gap-[3px] overflow-x-auto pb-2">
        {days.map((day) => {
          const count = data[day] || 0;
          const intensity = getIntensity(count);
          
          return (
            <div
              key={day}
              title={`${day}: ${count} article${count !== 1 ? 's' : ''}`}
              className={`
                w-3 h-3 rounded-sm transition-all cursor-pointer
                hover:ring-1 hover:ring-white/50
                ${intensity === 0 ? 'bg-white/5' : ''}
                ${intensity === 1 ? 'bg-green-500/30' : ''}
                ${intensity === 2 ? 'bg-green-500/50' : ''}
                ${intensity === 3 ? 'bg-green-500/75' : ''}
                ${intensity === 4 ? 'bg-green-500' : ''}
              `}
            />
          );
        })}
      </div>

      {/* Simple legend */}
      <div className="flex items-center gap-2 text-[10px] text-gray-500">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-white/5" />
          <div className="w-3 h-3 rounded-sm bg-green-500/30" />
          <div className="w-3 h-3 rounded-sm bg-green-500/50" />
          <div className="w-3 h-3 rounded-sm bg-green-500/75" />
          <div className="w-3 h-3 rounded-sm bg-green-500" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}