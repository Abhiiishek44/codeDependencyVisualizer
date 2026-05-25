import { useEffect, useState, useCallback } from 'react';
import type { Theme, ThemeConfig } from '../../shared/index';

export function useTheme() {
  const [config, setConfig] = useState<ThemeConfig>({ current: 'system', resolved: 'dark' });

  useEffect(() => {
    // Fetch initial theme from main process
    window.electron.getTheme().then((res) => {
      if (res.success && res.data) setConfig(res.data);
    });

    // Listen for system theme changes
    const unsub = window.electron.on('theme:changed', (data) => {
      if (data && typeof data === 'object' && 'current' in (data as object)) {
        setConfig(data as ThemeConfig);
      }
    });
    return unsub;
  }, []);

  const setTheme = useCallback(async (theme: Theme) => {
    const res = await window.electron.setTheme(theme);
    if (res.success && res.data) setConfig(res.data);
  }, []);

  return { theme: config.current, resolvedTheme: config.resolved, setTheme };
}
