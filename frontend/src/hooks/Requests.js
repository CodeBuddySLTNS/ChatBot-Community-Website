import { useState, useEffect, useRef } from 'react';
import { server, devServer, production } from '../../config.json';
import axios from 'axios';

const baseUrl = production ? server : devServer;

export const useFetch = (endpoint) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const abortController = useRef(null);
  
  const editData = (newdata) => setData(newdata);
  const fetchData = async () => {
    try {
      if (abortController.current) abortController.current.abort();
      abortController.current = new AbortController();
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const { data: d } = await axios.get(`${baseUrl + endpoint}`, {
        headers: {
          Authentication: `Bearer ${token}`
        },
        signal: abortController.current.signal 
      });
      
      if (d.success) {
        setData(d);
        setError(null);
        setLoading(false);
      } else {
        setError(d?.response?.error);
        setLoading(false);
      }
    } catch (e) {
      if (e.code === 'ERR_CANCELED') return;
      console.error(e);
      setError('Failed to fetch data.');
      setLoading(false);
    }
  }
  
  const retry = () => fetchData();
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return { 
    loading, 
    data, 
    error, 
    retry,
    editData
  }
}

export const usePost = (endpoint) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const abortController = useRef(null);
  
  const editData = (newdata) => setData(newdata);
  const postData = async (postdata) => {
    try {
      if (abortController.current) abortController.current.abort();
      abortController.current = new AbortController();
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const { data: d } = await axios.post(`${baseUrl + endpoint}`, postdata, {
        headers: {
          Authentication: `Bearer ${token}`
        },
        signal: abortController.current.signal 
      });
      
      if (d.success) {
        setData(d);
        setError(null);
        setLoading(false);
      } else {
        setError(d?.response?.error);
        setLoading(false);
      }
    } catch (e) {
      if (e.code === 'ERR_CANCELED') return;
      setError({
        network: e.message
      });
      setLoading(false);
    }
  }
  
  return { 
    loading,
    data,
    error,
    postData,
    editData
  }
}
