import "../../app.css";

function Wait() {
  return (
    <div>
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.ico" />
      <meta name="robots" content="index, follow" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <link href="/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
      <div className="container-fluid vertical-center">
        <div className="container d-flex justify-content-center">
          <div
            className="spinner-border"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          >
            <span>Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wait;
