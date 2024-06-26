function PathButton({ props }) {
  const { item, path, onPathClick } = props;
  return (
    <button
      type="button"
      className="btn border"
      onClick={() => onPathClick(path)}
    >
      {item}
    </button>
  );
}

export default PathButton;
