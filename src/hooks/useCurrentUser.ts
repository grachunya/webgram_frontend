import { useAppSelector } from "@/store/hooks";

export const useCurrentUser = () => {
  const { currentUser, isLoading, error, isInitialized } = useAppSelector(
    (state) => state.user,
  );

  return {
    data: currentUser,
    isLoading: isLoading || !isInitialized,
    isError: !!error,
    error,
    isInitialized,
  };
};
