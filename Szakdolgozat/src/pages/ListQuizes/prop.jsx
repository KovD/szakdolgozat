const FillerDetails = ({ IsInfinite, filler }) => {
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
        {IsInfinite ? (
          <>
            <div id="score-value-inf">🥇 {filler.score} 🥇</div>
          </>
        ) : (
          <>
            <span>Percentage:</span>
            <div id="score-value">{filler.score}%</div>
          </>
        )}
      </div>
    </div>
  );
};

export default FillerDetails