// client/src/hooks/useAgriApi.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Field, CropAdvisory, PathologyScan, DashboardStats, User } from '@shared/schema';
import { CreateFieldInput, GenerateAdvisoryInput, PathologyScanInput } from '@shared/validators';

const API_BASE = '/api';

// Fetch Headers with Tenant context
function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-user-id': '00000000-0000-0000-0000-000000000001'
  };
}

export function useTenant() {
  return useQuery<User>({
    queryKey: ['tenant'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/tenant`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch tenant info');
      return res.json();
    }
  });
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/dashboard/stats`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch dashboard telemetry');
      return res.json();
    },
    refetchInterval: 30000,
  });
}

export function useFields() {
  return useQuery<Field[]>({
    queryKey: ['fields'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/fields`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch field plots');
      return res.json();
    }
  });
}

export function useCreateField() {
  const queryClient = useQueryClient();
  return useMutation<Field, Error, CreateFieldInput>({
    mutationFn: async (newField) => {
      const res = await fetch(`${API_BASE}/fields`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newField)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to register field');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    }
  });
}

export function useAdvisories() {
  return useQuery<CropAdvisory[]>({
    queryKey: ['advisories'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/advisories`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch advisory archive');
      return res.json();
    }
  });
}

export function useAdvisory(id?: string) {
  return useQuery<CropAdvisory>({
    queryKey: ['advisory', id],
    queryFn: async () => {
      if (!id) throw new Error('Advisory ID is required');
      const res = await fetch(`${API_BASE}/advisories/${id}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to retrieve advisory plan');
      return res.json();
    },
    enabled: !!id
  });
}

export function useGenerateAdvisory() {
  const queryClient = useQueryClient();
  return useMutation<CropAdvisory, Error, GenerateAdvisoryInput>({
    mutationFn: async (payload) => {
      const res = await fetch(`${API_BASE}/advisories/generate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to synthesize advisory');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    }
  });
}

export function usePathologyScans() {
  return useQuery<PathologyScan[]>({
    queryKey: ['pathology-scans'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/diagnostics`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch pathology scan logs');
      return res.json();
    }
  });
}

export function useScanPathology() {
  const queryClient = useQueryClient();
  return useMutation<PathologyScan, Error, PathologyScanInput>({
    mutationFn: async (payload) => {
      const res = await fetch(`${API_BASE}/diagnostics/scan`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to execute pathology triage');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pathology-scans'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    }
  });
}
