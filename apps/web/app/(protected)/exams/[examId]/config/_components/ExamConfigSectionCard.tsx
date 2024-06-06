export function ExamConfigSectionCard(props) {
  const { sectionId, name, currentSectionId, onClick } = props;

  return (
    <div
      className="cursor-pointer border-b-2 border-white p-2 font-medium"
      onClick={() => {
        onClick(sectionId);
      }}
    >
      <div>
        {sectionId == currentSectionId ? (
          <p className="text-green-500">{name}</p>
        ) : (
          <p>{name}</p>
        )}
      </div>
    </div>
  );
}
