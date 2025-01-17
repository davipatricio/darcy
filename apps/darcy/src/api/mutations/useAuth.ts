import { useMutation } from '@tanstack/react-query';
import { KyResponse } from 'ky';
import { apiClient } from '../client';

interface CreateAuthData {
  service: string;
  code: string;
}

export default function useCreateAuth() {
  const authCallback = async ({ service, code }: CreateAuthData) => {
    try {
      await apiClient.post(`auth/${service}/callback`, { json: { code } });
    } catch (err) {
      const error = err as {
        name: string;
        response: KyResponse;
      };
      if (error.name === 'HTTPError') {
        // throw the error code
        const errorJson = (await error.response.json()) as { error: string };
        throw new Error(errorJson.error);
      }

      throw new Error('unknown_error');
    }
  };

  const mutation = useMutation({
    mutationFn: authCallback
  });

  return mutation;
}
