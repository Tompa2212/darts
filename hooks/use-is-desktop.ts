import { useMediaQuery } from './use-media-query';

export const useIsDesktop = () => {
  return useMediaQuery('(min-width: 768px)', { defaultValue: true });
};
