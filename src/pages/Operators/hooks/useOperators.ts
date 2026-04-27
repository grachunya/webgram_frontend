import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFreeAgents,
  getQueues,
  setUser,
  setStatus,
  setQueues,
} from '@api/agents';
import { getUsers } from '@api/users';
import type { AgentStatus } from '@api/agents';

export const useOperators = () => {
  const qc = useQueryClient();

  const invalidate = useCallback(
    () => Promise.all([
      qc.invalidateQueries({ queryKey: ['users'] }),
      qc.invalidateQueries({ queryKey: ['currentUser'] }),
    ]),
    [qc],
  );

  const {
    data: users = [],
    isPending: isUsersPending,
    isError: isUsersError,
    error: usersError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  const {
    data: freeAgents = [],
    isPending: isAgentsPending,
  } = useQuery({
    queryKey: ['freeAgents'],
    queryFn: getFreeAgents,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  const {
    data: queues = [],
    isPending: isQueuesPending,
  } = useQuery({
    queryKey: ['queues'],
    queryFn: getQueues,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

  const assignAgent = useMutation({
    mutationFn: ({ agentUuid, userUuid }: { agentUuid: string; userUuid: string }) =>
      setUser(agentUuid, userUuid),
    onSuccess: invalidate,
  });

  const changeStatus = useMutation({
    mutationFn: ({ agent_uuid, agent_status }: { agent_uuid: string; agent_status: AgentStatus }) =>
      setStatus({ agent_uuid, agent_status }),
    onSuccess: invalidate,
  });

  const assignQueues = useMutation({
    mutationFn: ({ agent_uuid, queue_uuids }: { agent_uuid: string; queue_uuids: string[] }) =>
      setQueues({ agent_uuid, queue_uuids }),
    onSuccess: invalidate,
  });

  return {
    users,
    freeAgents,
    queues,
    isPending: isUsersPending || isAgentsPending || isQueuesPending,
    isError: isUsersError,
    error: usersError,
    assignAgent,
    changeStatus,
    assignQueues,
  };
};
