export function ExamConfigSubjectCard(props) {
  const { subjectId, groupId, name, currentSubjectId, onClick } = props;

  return (
    <div
      className="cursor-pointer border-b-2 border-white p-2 font-medium"
      onClick={() => {
        onClick({ subjectId, groupId });
      }}
    >
      <div>
        {subjectId == currentSubjectId ? (
          <p className="text-green-500">{name}</p>
        ) : (
          <p>{name}</p>
        )}
      </div>
    </div>
  );
}
