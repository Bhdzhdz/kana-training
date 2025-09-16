type Props = {
  kana: string;
  onClick: () => void;
  disabled: boolean;
};

export default function KanaButton({ kana, onClick, disabled }: Props) {
  return (
    <button
      className={`border text-xl p-3 rounded hover:bg-blue-100 disabled:opacity-50`}
      disabled={disabled}
      onClick={onClick}
    >
      {kana}
    </button>
  );
}
