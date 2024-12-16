export function ExamConfigSectionCard(props) {
  const { sectionId, name, currentSectionIds, onClick } = props;

  const handleClick = () => {
    onClick(sectionId);
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation();

    onClick(sectionId);
  };

  return (
    <div
      className="cursor-pointer border-b-2 border-white p-2 font-medium"
      onClick={handleClick}
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={currentSectionIds.includes(sectionId)}
          onChange={handleCheckboxChange}
        />
      </div>
      <div>
        {currentSectionIds.includes(sectionId) ? (
          <p className="text-green-500">{name}</p>
        ) : (
          <p>{name}</p>
        )}
      </div>
    </div>
  );
}
