import {CircleCheck,CircleX,Info,LoaderCircle,SearchX,TriangleAlert,} from "lucide-react";

const FeedbackMessage = ({
  type = "empty",
  title = "",
  message = "",
  minHeight = 300,
}) => {
  const icons = {
    loading: <LoaderCircle size={32} className="feedback-spin" />,
    error: <TriangleAlert size={32} />,
    empty: <SearchX size={32} />,
    success: <CircleCheck size={32} />,
    info: <Info size={32} />,
    failed: <CircleX size={32} />,
  };

  return (
    <div
      className={`feedback-message ${type}`}
      style={{ minHeight: `${minHeight}px` }}
    >
      <div className="feedback-icon">
        {icons[type] || icons.empty}
      </div>

      {title && <p className="feedback-title">{title}</p>}

      {message && (
        <span className="feedback-text">
          {message}
        </span>
      )}
    </div>
  );
};

export default FeedbackMessage;