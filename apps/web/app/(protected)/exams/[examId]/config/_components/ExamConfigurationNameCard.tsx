'use Client';

export function ExamConfigurationNameCard(props) {
  const { currentValue, cardValue, name, onClick } = props;

  return (
    <div
      className="cursor-pointer border-b-2 border-white p-2 font-medium"
      onClick={() => {
        onClick(cardValue);
      }}
    >
      <div>
        {currentValue == cardValue ? (
          <p className="text-green-500">{name}</p>
        ) : (
          <p>{name}</p>
        )}
      </div>
    </div>
  );
}
