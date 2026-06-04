type Props = {
  label: string;
};

export function RemoteLoadFallback({ label }: Props) {
  return (
    <div className="remote-fallback" role="alert">
      <h3>{label} could not load</h3>
      <p>
        Start the remote dev server, then refresh. Remotes should be up before
        the shell when using Module Federation.
      </p>
    </div>
  );
}
