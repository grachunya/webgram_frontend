import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCurrentUser } from "@/store/slices/userSlice";
import { useEffect } from "react";

export const useCurrentUser = () => {
  const dispatch = useAppDispatch();
  const { currentUser, isLoading, error, isInitialized } = useAppSelector(
    (state) => state.user,
  );

  useEffect(() => {
    if (!isInitialized && !isLoading) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isInitialized, isLoading]);

  return {
    data: currentUser,
    isLoading: isLoading || !isInitialized,
    isError: !!error,
    error,
    isInitialized,
  };
};
