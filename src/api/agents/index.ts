import { api } from '@lib/api';

export interface FreeAgent {
  agent_uuid: string;
  agent_name: string;
  agent_number: string | null;
}

export interface Queue {
  queue_uuid: string;
  queue_name: string;
}

export interface Agent {
  agent_uuid: string;
  agent_name: string;
  agent_number: string | null;
  agent_password: string | null;
  domain_uuid: string;
  agent_status: string;
  queues: Queue[];
}

export type AgentStatus = 'Available' | 'Logged Out';

export const getFreeAgents = () =>
  api.get<FreeAgent[]>('/agent/free-agents').then((r) => r.data);

export const getQueues = () =>
  api.get<Queue[]>('/queues').then((r) => r.data);

export const setUser = (agentUuid: string, userUuid: string) =>
  api.post('/agent/set-user', null, {
    params: { agent_uuid: agentUuid, user_uuid: userUuid },
  }).then((r) => r.data);

export const setStatus = (data: { agent_uuid: string; agent_status: AgentStatus }) =>
  api.post('/agent-operator/set-status', data).then((r) => r.data);

export const setQueues = (data: { agent_uuid: string; queue_uuids: string[] }) =>
  api.post('/agent/set-queues', data).then((r) => r.data);

export const upgradeSocket = (agentUuid: string) =>
  api.post(`/agent/upgrade-socket/${agentUuid}`).then((r) => r.data);
