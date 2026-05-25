import { useEffect, useState } from 'react';
import type { AppVersionInfo } from '../../shared/index';

export function useAppVersion() {
  const [versionInfo, setVersionInfo] = useState<AppVersionInfo | null>(null);

  useEffect(() => {
    window.electron.getAppVersion().then((res) => {
      if (res.success && res.data) setVersionInfo(res.data);
    });
  }, []);

  return { versionInfo };
}
