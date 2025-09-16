type Props = {
  text: string;
};

export default function Feedback({ text }: Props) {
  return <div className="text-lg font-semibold mt-2">{text}</div>;
}
