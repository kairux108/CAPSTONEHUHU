const ReportsChart = () => {
  const data = [
    { day: "Mon", patients: 28 },
    { day: "Tue", patients: 38 },
    { day: "Wed", patients: 32 },
    { day: "Thu", patients: 45 },
    { day: "Fri", patients: 51 },
    { day: "Sat", patients: 34 },
    { day: "Sun", patients: 20 },
  ];

  const chartWidth = 700;
  const chartHeight = 240;
  const left = 42;
  const right = 15;
  const top = 25;
  const bottom = 38;
  const plotWidth = chartWidth - left - right;
  const plotHeight = chartHeight - top - bottom;
  const max = 60;

  const getX = (index) => left + (index * plotWidth) / (data.length - 1);
  const getY = (value) => top + plotHeight - (value / max) * plotHeight;

  const linePoints = data
    .map((item, index) => `${getX(index)},${getY(item.patients)}`)
    .join(" ");

  const areaPoints = `
    ${left},${top + plotHeight}
    ${linePoints}
    ${getX(data.length - 1)},${top + plotHeight}
  `;

  const yTicks = [0, 15, 30, 45, 60];

  return (
    <div>
      <div>
        <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#18a999]">
          Weekly Activity
        </p>
        <h3 className="mt-1 text-[17px] font-black text-[#263d3c] dark:text-white">
          Patient Visits
        </h3>
        <p className="mt-1 text-[10px] text-[#829b99]">
          Total patient visits during the current week.
        </p>
      </div>

      <div className="mt-5 w-full">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-[245px] w-full">
          <defs>
            <linearGradient id="curaVisitArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#18a999" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#18a999" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={left}
                  x2={chartWidth - right}
                  y1={y}
                  y2={y}
                  stroke="#dce9e6"
                  strokeWidth="1"
                  strokeDasharray="4 5"
                />
                <text x={left - 10} y={y + 3} textAnchor="end" fontSize="9" fontWeight="600" fill="#8aa09e">
                  {tick}
                </text>
              </g>
            );
          })}

          <polygon points={areaPoints} fill="url(#curaVisitArea)" />
          <polyline
            points={linePoints}
            fill="none"
            stroke="#18a999"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {data.map((item, index) => {
            const x = getX(index);
            const y = getY(item.patients);
            return (
              <g key={item.day}>
                <circle cx={x} cy={y} r="6" fill="white" stroke="#18a999" strokeWidth="3" />
                <circle cx={x} cy={y} r="2.5" fill="#117f76" />
                <text x={x} y={y - 13} textAnchor="middle" fontSize="9" fontWeight="800" fill="#38514f">
                  {item.patients}
                </text>
                <text x={x} y={chartHeight - 10} textAnchor="middle" fontSize="9" fontWeight="700" fill="#78908e">
                  {item.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-[#dce9e6] pt-4 dark:border-[#29413f]">
        <ChartInfo label="Total Visits" value="248" />
        <ChartInfo label="Highest" value="51 Fri" />
        <ChartInfo label="Daily Avg." value="35" />
      </div>
    </div>
  );
};

const ChartInfo = ({ label, value }) => (
  <div>
    <p className="text-[8px] font-extrabold uppercase tracking-[0.1em] text-[#8aa09e]">
      {label}
    </p>
    <p className="mt-1 text-[12px] font-black text-[#38514f] dark:text-[#dce8e6]">
      {value}
    </p>
  </div>
);

export default ReportsChart;
