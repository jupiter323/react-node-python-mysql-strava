import React from "react";
import Button from "components/CustomButtons/Button.jsx";
class GPXUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
    };
  }

  render() {
    const { onChange, accept, multiple, innerText } = this.props
    return (
      <div className="gpxfile-container">
        <Button color="primary">{innerText || "Choose GPX Files"}</Button>
        <input type="file" onChange={onChange} accept={accept} multiple={multiple} />
      </div>
    );
  }
}

export default GPXUpload;
