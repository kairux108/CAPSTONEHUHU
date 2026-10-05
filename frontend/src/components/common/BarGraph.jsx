const BarGraph = ({
  data = [],
  orientation = "horizontal",
  valueKey = "value",
  secondValueKey = null,
  firstLabel = "",
  secondLabel = "",
}) => {
  const values = data.flatMap((item) => {
    const list = [
      Number(item[valueKey]) || 0,
    ];

    if (secondValueKey) {
      list.push(
        Number(item[secondValueKey]) || 0
      );
    }

    return list;
  });

  const maxValue =
    Math.max(...values, 1);

  if (!data.length) {
    return (
      <div className="common-chart-empty">
        <p>No chart data available.</p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | HORIZONTAL BAR GRAPH
  |--------------------------------------------------------------------------
  */

  if (orientation === "horizontal") {
    return (
      <div className="common-bar-horizontal">

        {data.map((item, index) => {
          const value =
            Number(item[valueKey]) || 0;

          const width =
            (value / maxValue) * 100;

          return (
            <div
              className="common-bar-row"
              key={`${item.label}-${index}`}
            >
              <span className="common-bar-label">
                {item.label}
              </span>

              <div className="common-bar-track">

                <div
                  className={`common-bar-fill bar-color-${
                    (index % 6) + 1
                  }`}
                  style={{
                    width: `${width}%`,
                  }}
                />

              </div>

              <span className="common-bar-value">
                {value}
              </span>
            </div>
          );
        })}

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | VERTICAL BAR GRAPH
  |--------------------------------------------------------------------------
  */

  return (
    <div className="common-bar-vertical-wrapper">

      {(firstLabel || secondLabel) && (
        <div className="common-chart-legend">

          {firstLabel && (
            <span>
              <i className="legend-one" />
              {firstLabel}
            </span>
          )}

          {secondLabel && (
            <span>
              <i className="legend-two" />
              {secondLabel}
            </span>
          )}

        </div>
      )}

      <div className="common-bar-vertical">

        {data.map((item, index) => {
          const firstValue =
            Number(item[valueKey]) || 0;

          const secondValue =
            secondValueKey
              ? Number(
                  item[secondValueKey]
                ) || 0
              : 0;

          const firstHeight =
            (firstValue / maxValue) * 100;

          const secondHeight =
            (secondValue / maxValue) *
            100;

          return (
            <div
              className="common-bar-column"
              key={`${item.label}-${index}`}
            >
              <div className="common-bar-column-bars">

                <div
                  className="common-vertical-bar first"
                  style={{
                    height: `${firstHeight}%`,
                  }}
                />

                {secondValueKey && (
                  <div
                    className="common-vertical-bar second"
                    style={{
                      height: `${secondHeight}%`,
                    }}
                  />
                )}

              </div>

              <span>
                {item.label}
              </span>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default BarGraph;