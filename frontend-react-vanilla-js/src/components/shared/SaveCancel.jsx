function SaveCancel({ props }) {
  const { onSave, onCancel, readOnly } = props;
  return (
    <>
      {!readOnly && (
        <button className="btn btn-sm btn-success border border-white me-2" type="button" onClick={onSave}>
          <i className="bi bi-check-lg me-2" />
          Save
        </button>
      )}
      <button className="btn btn-sm btn-secondary border border-white text-white me-2" type="button" onClick={onCancel}>
        <i className="bi bi-arrow-counterclockwise me-2" />
        Cancel
      </button>
    </>
  );
}

export default SaveCancel;
