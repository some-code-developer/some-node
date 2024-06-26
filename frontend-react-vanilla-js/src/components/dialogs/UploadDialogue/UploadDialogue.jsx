import { useState, useEffect } from 'react';

// Components
import { ErrorMessage, SaveCancel, Dialogue } from '@shared/index';

export function UploadDialogue({ props }) {
  const { extension, onClose, onSave } = props;

  const [error, setError] = useState(''); // Overall form error
  const [isValid, setIsValid] = useState(true); // Overall form status

  const [formData, setFormData] = useState(undefined); // File

  // Close dialogue on escape
  useEffect(() => {
    const closeDialogue = (e) => {
      if (e.keyCode === 27) onClose();
      // Ctrl + S
      if (e.ctrlKey && e.keyCode === 83) {
        onOKClick();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', closeDialogue);
    return () => window.removeEventListener('keydown', closeDialogue);
  }, [formData]);

  const setErrorMessage = () => {
    setIsValid(false);
    setError('Please select the file');
  };

  const onChangeFile = async (evt) => {
    setIsValid(true);
    if (!evt.target.files[0]) {
      setErrorMessage();
      return;
    }
    const data = new FormData();
    data.append('file', evt.target.files[0]);
    data.append('fileName', evt.target.files[0].name);
    setFormData(data);
  };

  const onOKClick = () => {
    if (formData) onSave(formData);
    else setErrorMessage();
  };

  const body = (
    <>
      <div className="container-fluid">{!isValid && <ErrorMessage props={{ error }} />}</div>
      <div className="container-fluid">
        <div className="input-group input-group-sm mb-3">
          <input type="file" className="form-control" id="fu" accept={extension} onChange={onChangeFile} />
        </div>
      </div>
    </>
  );

  const footer = <SaveCancel props={{ onSave: onOKClick, onCancel: onClose }} />;

  return (
    <Dialogue
      props={{
        id: 'UploadModal',
        icon: 'bi-cloud-upload',
        title: `Upload file (${extension})`,
        body,
        footer,
        onClose,
      }}
    />
  );
}
