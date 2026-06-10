import { useState, useCallback } from 'react';
import API from '../api/axios';

export const usePatch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const patch = useCallback(async (url, body = null, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.patch(url, body, config);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return { patch, loading, error };
};
