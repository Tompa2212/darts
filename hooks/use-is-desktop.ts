import { useMediaQuery } from './use-media-query';

export const useIsDesktop = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return isDesktop;
};
