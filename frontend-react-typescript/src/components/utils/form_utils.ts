export const postJSON = async (url: string, data: any) =>
  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

export const putJSON = async (url: string, data: any) =>
  fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });


  export const getErrorMessage =  (err: any) =>
  {
    let message: string = '';
    if (err instanceof Error) message = err.message;
    else message = String(err);
    return message;
  };
  