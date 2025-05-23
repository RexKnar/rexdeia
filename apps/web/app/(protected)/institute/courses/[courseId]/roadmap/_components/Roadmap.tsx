'use client';
import { useGetCourseContentStructureQuery } from 'lib/queries/institute/course/contentStructure/useGetCourseContentStructureQuery';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import FlowChart from '../../_components/FlowChart';

export default function Roadmap() {
  const [courseStructure, setCourseStructure] = useState<any>([]);
  const [courseNodes, setCourseNodes] = useState<any>([]);
  const [courseEdges, setCourseEdges] = useState<any>([]);
  const searchParams = useSearchParams();
  const routeParams = useParams<{ courseId: string; chapterItemId: string }>();
  const courseId = searchParams.get('courseId') || routeParams.courseId;
  const { data: courseStructureResponse } = useGetCourseContentStructureQuery(
    courseId,
    {
      enabled: !!courseId,
    }
  );
  useEffect(() => {
    setCourseStructure(courseStructureResponse);
  }, [courseStructureResponse]);
  useEffect(() => {
    if (courseStructure) {
      let previousNode = null;
      let edges = [];
      let nodes = [];
      let y = 0;
      courseStructure
        ?.map((module: any) => {
          y = y + module?.chapters.length * 120;
          nodes.push({
            id: module.id,
            type: 'module',
            data: { label: module.name, completed: false },
            position: { x: 300, y: y },
          });
          if (previousNode) {
            const edge = {
              id: `${module.id}-edge`,
              source: previousNode,
              target: module.id,
              sourceHandle: 'bottom',
              targetHandle: 'top',
              type: 'bezier',
              animated: false,
              style: { strokeDasharray: '0' },
            };
            previousNode = module.id;
            edges.push(edge);
          } else {
            previousNode = module.id;
          }

          let newY = y - (30 * module?.chapters.length) / 2;
          module?.chapters.map((chapter: any) => {
            newY = newY + 30;
            nodes.push({
              id: chapter.id,
              type: 'chapter',
              data: { label: chapter.name, completed: true, side: 'right' },
              position: { x: 500, y: newY },
            });
            if (previousNode) {
              const cedge = {
                id: `e-${chapter.id}`,
                source: module.id,
                target: chapter.id,
                sourceHandle: 'right',
                targetHandle: 'left',
                type: 'bezier',
                animated: true,
                style: { strokeDasharray: '5 5' },
              };
              edges.push(cedge);
            }
          });
        })
        .filter(() => true);
      setCourseNodes(nodes);
      setCourseEdges(edges);
    }
  }, [courseStructure]);
  return (
    <section className="flex flex-col gap-6 ">
      {courseNodes?.length > 0 && (
        <FlowChart
          courseStructure={courseStructure}
          courseNodes={courseNodes}
          courseEdges={courseEdges}
        />
      )}
    </section>
  );
}
