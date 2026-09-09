const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error [${res.status}]: ${errorText || res.statusText}`);
    }

    return (await res.json()) as T;
  } catch (err: any) {
    console.error(`API Fetch Failure (${endpoint}):`, err);
    throw err;
  }
}

export const api = {
  getHealth: () => fetchApi('/health'),
  getSummary: () => fetchApi<any>('/api/dashboard/summary'),
  getAnalytics: () => fetchApi<any>('/api/dashboard/analytics'),
  getInspections: (params?: string) => fetchApi<any>(`/api/inspections${params ? `?${params}` : ''}`),
  getInspection: (id: string) => fetchApi<any>(`/api/inspections/${id}`),
  overrideField: (id: string, fieldName: string, data: any) =>
    fetchApi<any>(`/api/inspections/${id}/fields/${fieldName}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  updateInspectionStatus: (id: string, data: any) =>
    fetchApi<any>(`/api/inspections/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  generateNotice: (id: string) =>
    fetchApi<any>(`/api/inspections/${id}/notice`, { method: 'POST' }),
  analyzeScan: (data: any) =>
    fetchApi<any>('/api/scans/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getBusinesses: (params?: string) => fetchApi<any>(`/api/businesses${params ? `?${params}` : ''}`),
  getBusiness: (id: string) => fetchApi<any>(`/api/businesses/${id}`),
  getRules: (category?: string) => fetchApi<any>(`/api/rules${category ? `?category=${category}` : ''}`),
  updateRule: (code: string, data: any) =>
    fetchApi<any>(`/api/rules/${code}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  verifyQr: (id: string) => fetchApi<any>(`/api/qr/${id}`),
  submitGrievance: (data: any) =>
    fetchApi<any>('/api/qr/grievances', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  analyzeEcommerce: (url: string) =>
    fetchApi<any>('/api/ecommerce/analyze', {
      method: 'POST',
      body: JSON.stringify({ url }),
    }),
  getAuditTrail: () => fetchApi<any>('/api/audit'),
  verifyAuditChain: () => fetchApi<any>('/api/audit/verify'),
  getDemoUsers: () => fetchApi<any>('/api/auth/demo-users'),
};
