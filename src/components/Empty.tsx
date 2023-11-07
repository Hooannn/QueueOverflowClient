export default function Empty({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-4 h-full w-full">
      <img src="/Empty_Post.svg" className="w-1/2" />
      <small className="text-muted-foreground">{text ?? 'No data.'}</small>
    </div>
  );
}
