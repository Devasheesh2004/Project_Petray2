import { useState, useCallback } from 'react';
import API from '../api/axios';

export const useGet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const get = useCallback(async (url, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(url, config);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return { get, loading, error };
};
