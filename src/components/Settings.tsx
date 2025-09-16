interface Props { sets: string[]; selected: string[]; onChange: (s: string[]) => void; }
export default function Settings({ sets, selected, onChange }: Props) {
  function toggle(key: string) {
    onChange(selected.includes(key)
      ? selected.filter(s => s !== key)
      : [...selected, key]
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {sets.map(key => (
        <button
          key={key}
          className={`px-3 py-1 rounded-xl border ${selected.includes(key) ? 'bg-blue-500 text-white' : 'bg-white'}`}
          onClick={() => toggle(key)}
        >{key}</button>
      ))}
    </div>
  );
}
