const CuraCard = ({
  title,
  action,
  children,
  className = "",
  bodyClassName = "",
}) => {
  return (
    <section className={`cura-card ${className}`}>
      {(title || action) && (
        <div className="cura-card-header">
          {title && (
            <h3 className="cura-card-title">
              {title}
            </h3>
          )}

          {action && (
            <div className="cura-card-action">
              {action}
            </div>
          )}
        </div>
      )}

      <div className={`cura-card-body ${bodyClassName}`}>
        {children}
      </div>
    </section>
  );
};

export default CuraCard;