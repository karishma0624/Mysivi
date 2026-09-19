import { useState, useCallback, useEffect, useRef } from 'react';
import {
  PainPointInput,
  RankedHook,
  StudioScriptsOutput,
  StudioMediaPlanOutput,
} from '@shared/types';
import {
  SAMPLE_RANKED_HOOKS,
  SAMPLE_SCRIPTS_OUTPUT,
  SAMPLE_MEDIA_PLAN_OUTPUT,
} from '@/data/samples/studio.sample';

export const AGENT_BASE_URL =
  ((import.meta as any).env?.VITE_AGENT_URL as string) || 'http://localhost:8000';

export type AgentNodeId =
  | 'ideate'
  | 'critique'
  | 'quality_gate'
  | 'revise'
  | 'compliance'
  | 'rank'
  | 'human_select'
  | 'write_script'
  | 'media_plan'
  | 'generate_visuals'
  | 'package';

export interface NodeState {
  id: AgentNodeId;
  name: string;
  role: string;
  status: 'idle' | 'working' | 'done' | 'failed';
  durationMs?: number;
  modelCalls?: number;
  summary?: string;
  preview?: string;
  toolCalls?: string[];
}

export interface TraceItem {
  id: string;
  timestamp: string;
  node: string;
  eventType: string;
  summary: string;
  preview?: string;
  durationMs?: number;
  modelCalls?: number;
  toolCalls?: string[];
  raw?: any;
}

export interface InterruptData {
  prompt: string;
  selected_hook_ids: string[];
  ranked_hooks: RankedHook[];
}

export const DEFAULT_NODES: NodeState[] = [
  { id: 'ideate', name: 'Ideate & Strategist', role: 'Psychological Barrier & 15 Hooks', status: 'idle' },
  { id: 'critique', name: 'Creative Critic', role: '5-Pillar Rubric Scoring', status: 'idle' },
  { id: 'quality_gate', name: 'Quality Gate', role: 'Score Threshold Router (>=7.0)', status: 'idle' },
  { id: 'revise', name: 'Self-Revision Loop', role: 'Autonomous Recovery Engine', status: 'idle' },
  { id: 'compliance', name: 'Compliance Guard', role: 'Tool Audit (brand_facts, claim_checker)', status: 'idle' },
  { id: 'rank', name: 'Algorithmic Ranker', role: 'Composite 5-Pillar Formula', status: 'idle' },
  { id: 'human_select', name: 'Human-in-the-Loop', role: 'LangGraph Interrupt Checkpoint', status: 'idle' },
  { id: 'write_script', name: 'Script Directors', role: 'Parallel Fan-Out (2 Scripts)', status: 'idle' },
  { id: 'media_plan', name: 'Media Plan', role: '9:16 Storyboards & Veo Prompts', status: 'idle' },
  { id: 'generate_visuals', name: 'Visual Synthesizer', role: 'Diffusion / SVG Generator', status: 'idle' },
  { id: 'package', name: 'Package & Ship', role: 'Final Multi-Modal Payload', status: 'idle' },
];

export function useAgentStream() {
  const [nodes, setNodes] = useState<NodeState[]>(DEFAULT_NODES);
  const [activeNode, setActiveNode] = useState<AgentNodeId | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isSampleReplay, setIsSampleReplay] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revisionCount, setRevisionCount] = useState(0);
  const [llmCallsCount, setLlmCallsCount] = useState(0);
  const [interruptData, setInterruptData] = useState<InterruptData | null>(null);
  const [traces, setTraces] = useState<TraceItem[]>([]);
  const [agentHealth, setAgentHealth] = useState<'unknown' | 'healthy' | 'offline' | 'checking'>('unknown');

  // Generated outputs
  const [rankedHooks, setRankedHooks] = useState<RankedHook[]>(SAMPLE_RANKED_HOOKS);
  const [scriptsData, setScriptsData] = useState<StudioScriptsOutput>(SAMPLE_SCRIPTS_OUTPUT);
  const [mediaPlanData, setMediaPlanData] = useState<StudioMediaPlanOutput>(SAMPLE_MEDIA_PLAN_OUTPUT);
  const [selectedScriptIndex, setSelectedScriptIndex] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Check agent health status
  const checkAgentHealth = useCallback(async () => {
    setAgentHealth('checking');
    try {
      const res = await fetch(`${AGENT_BASE_URL}/healthz`, { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        setAgentHealth('healthy');
        return true;
      }
      setAgentHealth('offline');
      return false;
    } catch {
      setAgentHealth('offline');
      return false;
    }
  }, []);

  useEffect(() => {
    checkAgentHealth();
  }, [checkAgentHealth]);

  // Helper to parse SSE stream
  const processSseStream = async (response: Response, isSample = false) => {
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body stream unavailable');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const block of lines) {
        if (!block.trim()) continue;

        let eventType = 'message';
        let eventData: any = {};

        for (const line of block.split('\n')) {
          if (line.startsWith('event: ')) {
            eventType = line.replace('event: ', '').trim();
          } else if (line.startsWith('data: ')) {
            const rawData = line.replace('data: ', '').trim();
            try {
              eventData = JSON.parse(rawData);
            } catch {
              eventData = rawData;
            }
          }
        }

        handleEvent(eventType, eventData, isSample);
      }
    }
  };

  const handleEvent = (eventType: string, data: any, _isSample = false) => {
    const traceId = Math.random().toString(36).substring(2, 9);
    const now = new Date().toLocaleTimeString();

    if (eventType === 'run_started') {
      if (data.thread_id) setThreadId(data.thread_id);
      setIsRunning(true);
      setError(null);
    } else if (eventType === 'node_started') {
      const nodeName = (data.node || '') as AgentNodeId;
      setActiveNode(nodeName);
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeName ? { ...n, status: 'working' } : n))
      );
    } else if (eventType === 'revision_loop') {
      const iter = data.iteration || 1;
      setRevisionCount(iter);
      setNodes((prev) =>
        prev.map((n) =>
          n.id === 'quality_gate'
            ? { ...n, status: 'working', summary: `Triggered Revision Loop #${iter} (score < 7.0)` }
            : n
        )
      );
      setTraces((prev) => [
        ...prev,
        {
          id: traceId,
          timestamp: now,
          node: 'quality_gate',
          eventType: 'revision_loop',
          summary: `Self-Revision #${iter}: ${data.reason || 'Rubric score below threshold'}`,
          durationMs: 0,
          modelCalls: 0,
        },
      ]);
    } else if (eventType === 'tool_call') {
      const toolName = data.name;
      const nodeName = data.node as AgentNodeId;
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeName
            ? { ...n, toolCalls: [...(n.toolCalls || []), toolName] }
            : n
        )
      );
      setTraces((prev) => [
        ...prev,
        {
          id: traceId,
          timestamp: now,
          node: nodeName || 'compliance',
          eventType: 'tool_call',
          summary: `Tool Invoked: ${toolName}()`,
        },
      ]);
    } else if (eventType === 'tool_result') {
      setTraces((prev) => [
        ...prev,
        {
          id: traceId,
          timestamp: now,
          node: 'compliance',
          eventType: 'tool_result',
          summary: `Tool Returned: ${data.name} (ok=${data.ok})`,
        },
      ]);
    } else if (eventType === 'node_finished') {
      const nodeName = (data.node || '') as AgentNodeId;
      const calls = data.model_calls || 0;
      setLlmCallsCount((prev) => prev + calls);

      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeName
            ? {
                ...n,
                status: 'done',
                summary: data.summary,
                preview: data.preview,
                durationMs: data.duration_ms,
                modelCalls: calls,
              }
            : n
        )
      );

      setTraces((prev) => [
        ...prev,
        {
          id: traceId,
          timestamp: now,
          node: nodeName,
          eventType: 'node_finished',
          summary: data.summary || `${nodeName} completed`,
          preview: data.preview,
          durationMs: data.duration_ms,
          modelCalls: calls,
        },
      ]);
    } else if (eventType === 'interrupt') {
      setActiveNode('human_select');
      setNodes((prev) =>
        prev.map((n) => (n.id === 'human_select' ? { ...n, status: 'working' } : n))
      );
      const rawInterruptHooks = data.ranked_hooks || [];
      const normalizedHooks = rawInterruptHooks.map((h: any, idx: number) => ({
        hookId: h.hookId || h.id || `hook_${idx + 1}`,
        rank: typeof h.rank === 'number' && h.rank > 0 ? h.rank : idx + 1,
        rawText: h.rawText || h.text || '',
        displayText: h.displayText || h.text || h.rawText || '',
        weightedScore: typeof h.weightedScore === 'number' ? h.weightedScore : typeof h.compositeScore === 'number' ? h.compositeScore : 8.2,
        scores: {
          scrollStop: h.scores?.scrollStop ?? 7.0,
          relatability: h.scores?.relatability ?? 7.0,
          curiosityGap: h.scores?.curiosityGap ?? 7.0,
          clarity: h.scores?.clarity ?? 7.0,
          brandFit: h.scores?.brandFit ?? 7.0,
        },
        critique: h.critique || 'Evaluated conversational hook.',
        rewrite: h.rewrite || h.compliance?.safeRewrite || null,
        compliance: {
          isCompliant: h.compliance?.isCompliant ?? true,
          flags: h.compliance?.flags || [],
          safeRewrite: h.compliance?.safeRewrite || null,
        },
        isTop3: h.isTop3 ?? idx < 3,
      }));

      setInterruptData({
        prompt: data.prompt || 'Review and select hooks to fan out',
        selected_hook_ids: data.selected_hook_ids || ['hook_1', 'hook_2'],
        ranked_hooks: normalizedHooks,
      });
      setTraces((prev) => [
        ...prev,
        {
          id: traceId,
          timestamp: now,
          node: 'human_select',
          eventType: 'interrupt',
          summary: 'LangGraph Interrupt: Waiting for human hook selection',
        },
      ]);
    } else if (eventType === 'run_finished') {
      setActiveNode(null);
      setIsRunning(false);
      setIsResuming(false);
      setIsFinished(true);

      const res = data.result || {};
      if (res.rankedHooks && Array.isArray(res.rankedHooks) && res.rankedHooks.length > 0) {
        const normalized = res.rankedHooks.map((h: any, idx: number) => ({
          hookId: h.hookId || h.id || `hook_${idx + 1}`,
          rank: typeof h.rank === 'number' && h.rank > 0 ? h.rank : idx + 1,
          rawText: h.rawText || h.text || '',
          displayText: h.displayText || h.text || h.rawText || '',
          weightedScore: typeof h.weightedScore === 'number' ? h.weightedScore : typeof h.compositeScore === 'number' ? h.compositeScore : 8.2,
          scores: {
            scrollStop: h.scores?.scrollStop ?? 7.0,
            relatability: h.scores?.relatability ?? 7.0,
            curiosityGap: h.scores?.curiosityGap ?? 7.0,
            clarity: h.scores?.clarity ?? 7.0,
            brandFit: h.scores?.brandFit ?? 7.0,
          },
          critique: h.critique || 'Evaluated conversational hook.',
          rewrite: h.rewrite || h.compliance?.safeRewrite || null,
          compliance: {
            isCompliant: h.compliance?.isCompliant ?? true,
            flags: h.compliance?.flags || [],
            safeRewrite: h.compliance?.safeRewrite || null,
          },
          isTop3: h.isTop3 ?? idx < 3,
        }));
        setRankedHooks(normalized);
      }
      if (res.scripts && Array.isArray(res.scripts) && res.scripts.length > 0) {
        setScriptsData({ scripts: res.scripts });
      }
      if (res.storyboardFrames && Array.isArray(res.storyboardFrames)) {
        setMediaPlanData({
          storyboardFrames: res.storyboardFrames,
          videoPrompts: res.videoPrompts || [],
        });
      }

      setTraces((prev) => [
        ...prev,
        {
          id: traceId,
          timestamp: now,
          node: 'package',
          eventType: 'run_finished',
          summary: `Run finished. Packaged ${res.scripts?.length || 0} scripts & ${res.storyboardFrames?.length || 0} storyboards.`,
        },
      ]);
    }
  };

  // Start autonomous run
  const startRun = useCallback(async (input: PainPointInput) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsRunning(true);
    setIsFinished(false);
    setIsResuming(false);
    setIsSampleReplay(false);
    setError(null);
    setRevisionCount(0);
    setLlmCallsCount(0);
    setInterruptData(null);
    setTraces([]);
    setNodes(DEFAULT_NODES);

    const payload = {
      pain_point: input.painPoint,
      audience: input.audience,
      language: input.language,
      platform: input.platform,
      tone: input.tone,
      generate_images: false,
    };

    try {
      const res = await fetch(`${AGENT_BASE_URL}/runs/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error('Agent rate limit reached. Please wait a moment or replay the recorded run.');
        }
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }

      await processSseStream(res, false);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.warn('Live run failed, checking if sample replay is desired:', err);
      setError(err.message || 'Failed to connect to agent service.');
      setIsRunning(false);
    }
  }, []);

  // Resume run with selected hooks
  const resumeRun = useCallback(async (selectedHookIds: string[]) => {
    if (!threadId) {
      setError('No active thread ID. Please start a new run.');
      return;
    }

    setIsResuming(true);
    setError(null);
    setInterruptData(null);
    setNodes((prev) =>
      prev.map((n) => (n.id === 'human_select' ? { ...n, status: 'done', summary: `User selected ${selectedHookIds.length} hooks` } : n))
    );

    try {
      const res = await fetch(`${AGENT_BASE_URL}/runs/${threadId}/resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected_hook_ids: selectedHookIds }),
      });

      if (res.status === 404) {
        throw new Error('Thread expired due to TTL. Please restart the run.');
      }
      if (!res.ok) {
        throw new Error(`Resume failed (${res.status}): ${res.statusText}`);
      }

      await processSseStream(res, isSampleReplay);
    } catch (err: any) {
      setError(err.message || 'Failed to resume run.');
      setIsResuming(false);
    }
  }, [threadId, isSampleReplay]);

  // Replay live sample run
  const replaySampleRun = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsRunning(true);
    setIsFinished(false);
    setIsResuming(false);
    setIsSampleReplay(true);
    setError(null);
    setRevisionCount(0);
    setLlmCallsCount(0);
    setInterruptData(null);
    setTraces([]);
    setNodes(DEFAULT_NODES);

    try {
      const res = await fetch(`${AGENT_BASE_URL}/sample-trace`, {
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        throw new Error('Unable to load recorded trace from agent.');
      }

      await processSseStream(res, true);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      // Fallback to local sample output
      setRankedHooks(SAMPLE_RANKED_HOOKS);
      setScriptsData(SAMPLE_SCRIPTS_OUTPUT);
      setMediaPlanData(SAMPLE_MEDIA_PLAN_OUTPUT);
      setIsRunning(false);
      setIsFinished(true);
      setError('Loaded static fallback sample data.');
    }
  }, []);

  const resetAgent = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setNodes(DEFAULT_NODES);
    setActiveNode(null);
    setThreadId(null);
    setIsRunning(false);
    setIsResuming(false);
    setIsFinished(false);
    setError(null);
    setRevisionCount(0);
    setLlmCallsCount(0);
    setInterruptData(null);
    setTraces([]);
  }, []);

  return {
    nodes,
    activeNode,
    threadId,
    isRunning,
    isResuming,
    isFinished,
    isSampleReplay,
    error,
    revisionCount,
    llmCallsCount,
    interruptData,
    traces,
    agentHealth,
    rankedHooks,
    scriptsData,
    mediaPlanData,
    selectedScriptIndex,
    setSelectedScriptIndex,
    checkAgentHealth,
    startRun,
    resumeRun,
    replaySampleRun,
    resetAgent,
  };
}
