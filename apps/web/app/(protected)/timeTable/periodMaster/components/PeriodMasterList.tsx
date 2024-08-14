'use client';

export default function PeriodMasterList() {
  const periodMasterResponse = [
    {
      day: 'monday',
      periodMaster: [
        {
          id: 1,
          name: 'periodMaster1',
          type: 'periodtype',
        },
        {
          id: 2,
          name: 'periodMaster1',
          type: 'periodtype',
        },
        {
          id: 3,
          name: 'periodMaster1',
          type: 'periodtype',
        },
        {
          id: 4,
          name: 'periodMaster1',
          type: 'break',
        },
        {
          id: 5,
          name: 'periodMaster1',
          type: 'periodtype',
        },
        {
          id: 6,
          name: 'periodMaster1',
          type: 'periodtype',
        },
      ],
    },
    {
      day: 'tuesday',
      periodMaster: [
        {
          id: 1,
          name: 'periodMaster1',
          type: 'periodtype',
        },
        {
          id: 2,
          name: 'periodMaster1',
          type: 'periodtype',
        },
        {
          id: 3,
          name: 'periodMaster1',
          type: 'periodtype',
        },
        {
          id: 4,
          name: 'periodMaster1',
          type: 'break',
        },
        {
          id: 5,
          name: 'periodMaster1',
          type: 'periodtype',
        },
        {
          id: 6,
          name: 'periodMaster1',
          type: 'periodtype',
        },
      ],
    },
    {
      day: 'wednesday',
      periodMaster: [
        {
          id: 1,
          name: 'periodMaster1',
          type: 'periodtype',
        },
        {
          id: 2,
          name: 'periodMaster1',
          type: 'periodtype',
        },
        {
          id: 3,
          name: 'periodMaster1',
          type: 'periodtype',
        },
        {
          id: 4,
          name: 'periodMaster1',
          type: 'break',
        },
        {
          id: 5,
          name: 'periodMaster1',
          type: 'periodtype',
        },
        {
          id: 6,
          name: 'periodMaster1',
          type: 'periodtype',
        },
      ],
    },
  ];

  return (
    <section className="mt-4 rounded-md bg-white p-6">
      <div className="flex w-full flex-col overflow-x-auto border-2">
        {periodMasterResponse &&
          periodMasterResponse.map((item, index) => (
            <div key={index} className="flex border-b-2">
              <div className="flex h-28 w-20 items-center justify-center bg-purple-200 md:w-1/2">
                <p className="text-center">{item.day}</p>
              </div>
              {item.periodMaster.map((periodMaster, index) =>
                periodMaster.type.toLowerCase() === 'break' ? (
                  <div
                    key={index}
                    className="flex w-16 flex-col items-center justify-center bg-amber-200"
                  >
                    <p className="-rotate-90 ">{periodMaster.name}</p>
                  </div>
                ) : (
                  <div
                    key={index}
                    className="flex w-full flex-col items-center justify-center bg-emerald-200"
                  >
                    <p className="text-center">{periodMaster.name}</p>
                    <p className="text-center">{periodMaster.type}</p>
                  </div>
                )
              )}
            </div>
          ))}
      </div>
    </section>
  );
}
