import { useEffect, useState } from "react";
import { getSettings } from "../api/setting";

export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSettings(token);
        setSettings(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return { settings, loading, error };
};