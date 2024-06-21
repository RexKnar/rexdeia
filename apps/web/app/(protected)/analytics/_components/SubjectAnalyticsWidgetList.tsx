import { Text } from 'ui';

export default function SubjectAnalyticsWidgetList(props) {
  const { analytics, subjectList } = props;
  return (
    <div className="flex flex-wrap gap-3">
      {subjectList.map((subject) => {
        return (
          <div
            className="w-1/5 rounded-md border border-blue-100 bg-white p-3"
            key={subject.id}
          >
            <div className="flex">
              <div className="ml-4 ">
                <span className="text-lg font-bold text-gray-900">
                  {subject.subject.name}
                </span>
                {analytics.has(subject.id) && (
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="w-1/2">
                      <Text className="text-sm">
                        # of Pass -
                        <span className="font-bold text-green-500">
                          {analytics.get(subject.id)?.numberOfPassStudents}
                        </span>
                      </Text>
                      <Text className="text-sm">
                        # of Fail -{' '}
                        <span className="font-bold text-red-500">
                          {analytics.get(subject.id)?.numberOfFailStudents}
                        </span>
                      </Text>
                    </div>
                    <div className="w-1/2">
                      <Text className="text-sm">
                        Highest -{' '}
                        <span className="font-bold text-green-500">
                          {analytics.get(subject.id)?.highestMark}
                        </span>
                      </Text>
                      <Text className="text-sm">
                        Lowest -{' '}
                        <span className="font-bold text-green-500">
                          {analytics.get(subject.id)?.lowestMark}
                        </span>
                      </Text>
                    </div>
                    <div className="w-1/2">
                      <Text className="text-sm">
                        Avg. -{' '}
                        <span className="font-bold text-green-500">
                          {parseFloat(
                            analytics.get(subject.id)?.averageMark.toFixed(2)
                          )}
                          %
                        </span>
                      </Text>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
