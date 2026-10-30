const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatMonthYear = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

export const formatDateRange = (startYear, endYear) => {
  const start = formatMonthYear(startYear);
  const end = formatMonthYear(endYear) ?? "Present";
  return start ? `${start} - ${end}` : "";
};

const DateRange = ({ startYear, endYear, id }) => (
  <p id={id} className="sub-content">{formatDateRange(startYear, endYear)}</p>
);
export default DateRange;
