'use client';

import { useGetExamListQuery } from 'lib/queries/exams/useGetExamListQuery';
import { useGetBatchesListQuery } from 'lib/queries/batches/useGetBatchesListQuery';
import { ArrowLeft, Copy, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from 'ui';

import {
  ConfigState,
  SharedPartition,
  SharedSubjectMarks,
} from '../_state/types';

const defaultState: ConfigState = {
  selectedClassIds: [],
  sectionsByClass: {},
  subjectsByClass: {},
  subjectMarks: { totalMarks: '', convertTo: '', minMark: '' },
  partitions: [],
  overrides: {},
};

const normalize = (s?: string) => (s ?? '').trim().toLowerCase().replace(/\s+/g, ' ');

export default function CopyConfigPage() {
  const params = useParams<{ examId: string }>();
  const examId = params.examId;
  const router = useRouter();
  const { toast } = useToast();

  const [savedData, setSavedData] = useState<{ state: ConfigState; sectionNames: Record<string, string> } | null>(null);
  const [currentAcademicItems, setCurrentAcademicItems] = useState<any[]>([]);
  const [loadingStructure, setLoadingStructure] = useState(false);

  const [sourceExamId, setSourceExamId] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState('all');
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [selectedSourceClassSections, setSelectedSourceClassSections] = useState<Record<string, string>>({});
  const [sourceSubjects, setSourceSubjects] = useState<{ id: string; name: string }[]>([]);
  const [sourceConfigs, setSourceConfigs] = useState<any[]>([]);
  const [loadingConfigs, setLoadingConfigs] = useState(false);
  const [copying, setCopying] = useState(false);

  // Load parent state from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem(`exam-config-state-${examId}`);
    if (saved) {
      try {
        setSavedData(JSON.parse(saved));
      } catch (e) {
        console.error('Error reading configuration state:', e);
      }
    }
  }, [examId]);

  // Load all current year classes, sections, and subjects from the structure API
  useEffect(() => {
    if (!examId) return;
    setLoadingStructure(true);
    fetch(`/api/exam/${examId}/config/copy/structure`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load academic structure');
        return res.json();
      })
      .then((data) => {
        setCurrentAcademicItems(data ?? []);
      })
      .catch((err) => {
        console.error('Error fetching academic structure:', err);
        toast({
          title: 'Error loading structure',
          description: 'Could not load classes and sections for the current exam.',
          variant: 'destructive',
        });
      })
      .finally(() => {
        setLoadingStructure(false);
      });
  }, [examId, toast]);

  const { batches } = useGetBatchesListQuery({
    page: 1,
    limit: 99,
    filter: {},
  });

  const { data: examList } = useGetExamListQuery({
    page: 1,
    limit: 999,
    batchId: selectedBatchId === 'all' ? undefined : selectedBatchId,
  });
  const exams = (examList?.data ?? []).filter((e) => e.id !== examId);

  // Unique source class-sections list compiled from fetched source configs
  const sourceClassSections = useMemo(() => {
    const list: { key: string; label: string }[] = [];
    const seen = new Set<string>();
    for (const c of sourceConfigs) {
      const key = `${c.class?.id}:${c.section?.id}`;
      if (c.class?.id && c.section?.id && !seen.has(key)) {
        seen.add(key);
        list.push({
          key,
          label: `${c.class.name} ${c.section.name}`,
        });
      }
    }
    return list.sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: 'base' }));
  }, [sourceConfigs]);

  // Fetch subjects and configs from the source exam
  useEffect(() => {
    if (!sourceExamId || currentAcademicItems.length === 0) {
      setSourceSubjects([]);
      setSourceConfigs([]);
      setSelections({});
      setSelectedSourceClassSections({});
      return;
    }

    let active = true;
    setLoadingConfigs(true);

    fetch(`/api/exam/${sourceExamId}/subject/`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch subjects');
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        const subjectsList = (data ?? [])
          .map((d: any) => ({
            id: d.subject?.id,
            name: d.subject?.name,
          }))
          .filter((s: any) => s.id && s.name);

        const uniqueSubjects = subjectsList.filter(
          (subject, index, self) =>
            index === self.findIndex((t) => t.id === subject.id)
        );

        setSourceSubjects(uniqueSubjects);

        // Fetch configs for each of these unique subjects in parallel
        const fetchPromise = Promise.all(
          uniqueSubjects.map(async (subj: any) => {
            const res = await fetch(`/api/exam/${sourceExamId}/config/subject/${subj.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sectionIds: [] }),
            });
            if (!res.ok) throw new Error(`Failed to fetch config for ${subj.name}`);
            return res.json();
          })
        );

        return fetchPromise.then((configResults) => ({
          uniqueSubjects,
          configResults,
        }));
      })
      .then((res) => {
        if (active && res) {
          const { uniqueSubjects, configResults } = res;
          const flatResult = configResults.flat();
          // Deduplicate configs by examSubjectId
          const uniqueConfigs = flatResult.filter(
            (c, idx, arr) => arr.findIndex((x) => x.examSubjectId === c.examSubjectId) === idx
          );
          setSourceConfigs(uniqueConfigs);

          // Get unique source class sections list for auto-mapping lookup
          const classSecList: { key: string; className: string; sectionName: string }[] = [];
          const seen = new Set<string>();
          for (const c of uniqueConfigs) {
            const key = `${c.class?.id}:${c.section?.id}`;
            if (c.class?.id && c.section?.id && !seen.has(key)) {
              seen.add(key);
              classSecList.push({
                key,
                className: c.class.name,
                sectionName: c.section.name,
              });
            }
          }

          // Auto-mapping by matching names without blind fallbacks
          const initialClassSections: Record<string, string> = {};
          const initialSelections: Record<string, string> = {};

          for (const item of currentAcademicItems) {
            // Find class/section matching current class and section names
            const matchingClassSec = classSecList.find(
              (cs) =>
                normalize(cs.className) === normalize(item.className) &&
                normalize(cs.sectionName) === normalize(item.sectionName)
            );

            if (matchingClassSec) {
              initialClassSections[item.key] = matchingClassSec.key;

              // Find config for this class/section matching current subject name
              const [cId, sId] = matchingClassSec.key.split(':');
              const match = uniqueConfigs.find(
                (c) =>
                  c.class?.id === cId &&
                  c.section?.id === sId &&
                  normalize(c.subjectName) === normalize(item.subjectName)
              );
              if (match) {
                initialSelections[item.key] = match.examSubjectId;
              } else {
                initialSelections[item.key] = '';
              }
            } else {
              initialClassSections[item.key] = '';
              initialSelections[item.key] = '';
            }
          }
          setSelectedSourceClassSections(initialClassSections);
          setSelections(initialSelections);
        }
      })
      .catch((err) => {
        console.error('Error fetching source exam configurations:', err);
        if (active) {
          toast({
            title: 'Error loading configurations',
            description: 'Could not load configurations from the selected exam.',
            variant: 'destructive',
          });
        }
      })
      .finally(() => {
        if (active) setLoadingConfigs(false);
      });

    return () => {
      active = false;
    };
  }, [sourceExamId, currentAcademicItems, toast]);

  const apply = async () => {
    const itemsToSave: any[] = [];

    for (const [itemKey, sourceId] of Object.entries(selections)) {
      if (!sourceId) continue;
      const config = sourceConfigs.find((c) => c.examSubjectId === sourceId);
      if (!config) continue;

      const itemInfo = currentAcademicItems.find((itm) => itm.key === itemKey);
      const [classId, sectionId, subjectId] = itemKey.split(':');

      const partitions = (config.examSubjectPartition ?? [])
        .filter((p: any) => p?.assessmentFormat)
        .map((p: any) => ({
          assessmentFormatId: p.assessmentFormat.id,
          totalMarks: Number(p.totalMarks ?? 0),
          convertTo: Number(p.convertTo ?? 0),
          minMark: Number(p.minMark ?? 0),
          dateToConduct: p.dateToConduct
            ? new Date(p.dateToConduct).toISOString()
            : new Date().toISOString(),
          order: Number(p.order ?? 1),
          excludeSubjectValidation: Boolean(p.excludeSubjectValidation),
        }));

      itemsToSave.push({
        classId,
        sectionId,
        subjectId,
        groupId: itemInfo?.groupId,
        totalMarks: Number(config.totalMarks ?? 0),
        convertTo: Number(config.convertTo ?? 0),
        minMark: Number(config.minMark ?? 0),
        partitions,
      });
    }

    if (itemsToSave.length === 0) {
      toast({
        title: 'No config selected',
        description: 'Please match at least one configuration to copy.',
        variant: 'destructive',
      });
      return;
    }

    setCopying(true);
    try {
      const res = await fetch(`/api/exam/${examId}/config/copy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToSave }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save copied configurations');
      }

      const data = await res.json();

      // Clean up localStorage draft since configurations are now safely saved in DB
      localStorage.removeItem(`exam-config-state-${examId}`);

      toast({
        title: 'Configuration copied successfully',
        description: `Successfully copied and saved ${data.copiedCount || itemsToSave.length} configuration(s) to this exam.`,
      });

      // Redirect to the edit tab where configurations are displayed
      router.push(`/exam/${examId}/config?tab=edit`);
    } catch (e: any) {
      console.error('Error copying configuration:', e);
      toast({
        title: 'Copy failed',
        description: e.message || 'Could not copy configurations to the exam.',
        variant: 'destructive',
      });
    } finally {
      setCopying(false);
    }
  };

  const hasMappingsToCopy = Object.values(selections).some(Boolean);

  return (
    <div className="space-y-6 p-6">
      {/* Title Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/exam/${examId}/config`)}>
            <ArrowLeft size={16} className="mr-2" /> Back
          </Button>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Copy Exam Configuration</h1>
        </div>
      </div>

      <Card className="p-6 bg-white space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Copy from Academic Year</label>
            <Select value={selectedBatchId} onValueChange={(val) => {
              setSelectedBatchId(val);
              setSourceExamId('');
            }}>
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="All Academic Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Academic Years</SelectItem>
                {batches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Source Exam</label>
            <Select 
              value={sourceExamId} 
              onValueChange={setSourceExamId}
              disabled={exams.length === 0}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder={exams.length === 0 ? "No exams found" : "Choose source exam"} />
              </SelectTrigger>
              <SelectContent>
                {exams.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name} {e.batch?.name ? `(${e.batch.name})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Matrix Tabular View */}
        {sourceExamId && (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full border-collapse text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-700 border-b border-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-4">Current Class</th>
                    <th scope="col" className="px-6 py-4">Current Section</th>
                    <th scope="col" className="px-6 py-4">Current Subject</th>
                    <th scope="col" className="px-6 py-4">Source Class &amp; Section</th>
                    <th scope="col" className="px-6 py-4">Source Subject (Configuration)</th>
                    <th scope="col" className="px-6 py-4">Partitions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loadingStructure || loadingConfigs ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          <span>
                            {loadingStructure
                              ? 'Loading current year structures…'
                              : 'Loading source exam configurations…'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : currentAcademicItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                        No classes, sections, and subjects found in the current academic year.
                      </td>
                    </tr>
                  ) : (
                    currentAcademicItems.map((item) => {
                      const classSecKey = selectedSourceClassSections[item.key] || '';
                      const [cId, sId] = classSecKey ? classSecKey.split(':') : [undefined, undefined];

                      const availableConfigs = sourceConfigs.filter(
                        (c) => c.class?.id === cId && c.section?.id === sId
                      );
                      const uniqueAvailableConfigs = availableConfigs.filter(
                        (c, idx, arr) => arr.findIndex((x) => x.examSubjectId === c.examSubjectId) === idx
                      );

                      const selectedSourceId = selections[item.key];
                      const selectedConfig = uniqueAvailableConfigs.find(
                        (c) => c.examSubjectId === selectedSourceId
                      );
                      const partitions = (selectedConfig?.examSubjectPartition ?? []).filter(
                        (p: any) => p?.assessmentFormat
                      );

                      return (
                        <tr key={item.key} className="hover:bg-gray-50/50">
                          {/* Col 1: Class */}
                          <td className="px-6 py-4 font-medium text-gray-900">{item.className}</td>
                          {/* Col 2: Section */}
                          <td className="px-6 py-4 font-medium text-gray-900">{item.sectionName}</td>
                          {/* Col 3: Subject */}
                          <td className="px-6 py-4 font-semibold text-primary">{item.subjectName}</td>
                          {/* Col 4: Source Class & Section Dropdown */}
                          <td className="px-6 py-3">
                            <div className="w-[180px]">
                              <Select
                                value={classSecKey}
                                onValueChange={(val) => {
                                  setSelectedSourceClassSections((prev) => ({
                                    ...prev,
                                    [item.key]: val,
                                  }));

                                  // Auto-select subject in the new section if it has a matching name
                                  const [newClassId, newSecId] = val.split(':');
                                  const match = sourceConfigs.find(
                                    (c) =>
                                      c.class?.id === newClassId &&
                                      c.section?.id === newSecId &&
                                      normalize(c.subjectName) === normalize(item.subjectName)
                                  );

                                  setSelections((prev) => ({
                                    ...prev,
                                    [item.key]: match ? match.examSubjectId : '',
                                  }));
                                }}
                              >
                                <SelectTrigger className="h-9 text-xs">
                                  <SelectValue placeholder="Select section" />
                                </SelectTrigger>
                                <SelectContent>
                                  {sourceClassSections.map((sc) => (
                                    <SelectItem key={sc.key} value={sc.key}>
                                      {sc.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </td>
                          {/* Col 5: Source Subject Dropdown */}
                          <td className="px-6 py-3">
                            <div className="w-[240px]">
                              <Select
                                value={selections[item.key] || 'none'}
                                onValueChange={(val) => {
                                  setSelections((prev) => ({
                                    ...prev,
                                    [item.key]: val === 'none' ? '' : val,
                                  }));
                                }}
                                disabled={!classSecKey}
                              >
                                <SelectTrigger className="h-9 text-xs">
                                  <SelectValue placeholder="Do not copy" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Do not copy</SelectItem>
                                  {uniqueAvailableConfigs.map((c) => (
                                    <SelectItem key={c.examSubjectId} value={c.examSubjectId}>
                                      {c.subjectName} · {c.totalMarks} Marks
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </td>
                          {/* Col 6: Partitions Display */}
                          <td className="px-6 py-3">
                            {selectedSourceId && partitions.length > 0 ? (
                              <div className="flex flex-wrap items-center gap-1.5 max-w-[360px]">
                                {partitions.map((p: any, idx: number) => {
                                  const formatName = p.assessmentFormat?.name || 'Partition';
                                  const total = p.totalMarks;
                                  const convert = p.convertTo;
                                  const min = p.minMark;
                                  return (
                                    <span
                                      key={p.id || p.assessmentFormat?.id || idx}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                                      title={`${formatName}: Total ${total}M, Convert ${convert}M, Min ${min}M`}
                                    >
                                      <span className="font-semibold text-slate-900">{formatName}</span>
                                      <span className="text-slate-400">:</span>
                                      <span className="text-primary font-semibold">{total}M</span>
                                      {convert && String(convert) !== String(total) && (
                                        <span className="text-gray-400 text-[10px]">conv {convert}</span>
                                      )}
                                      {min && (
                                        <span className="text-amber-700 text-[10px]">min {min}</span>
                                      )}
                                    </span>
                                  );
                                })}
                              </div>
                            ) : selectedSourceId ? (
                              <span className="text-xs text-gray-400 italic">No partitions</span>
                            ) : (
                              <span className="text-xs text-gray-300">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={() => router.push(`/exam/${examId}/config`)}>
                Cancel
              </Button>
              <Button
                onClick={apply}
                disabled={!hasMappingsToCopy || loadingConfigs || loadingStructure || copying}
              >
                {copying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving configurations…
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" /> Copy configuration
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
