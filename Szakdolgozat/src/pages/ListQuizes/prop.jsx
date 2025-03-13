
const FillerDetails = ({ filler }) => {
    return (
      <div className="filler-block">
        <div className="filler-properties">
          {filler.properties?.map((prop, index) => (
            <div key={index} className="property-row">
              <strong>{prop.name}:</strong> {prop.value}
            </div>
          ))}
        </div>
        <div id="scoreSection">
          <span>Percentage:</span>
          <div id="score-value">{filler.score}%</div>
        </div>
      </div>
    );
  };
  
  export default FillerDetails;