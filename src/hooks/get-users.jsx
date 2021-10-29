import { useInfiniteQuery } from "react-query";
import { fetchUsers } from "../api/queries/UsersQueries";

export const useUsers = () => {
  return useInfiniteQuery(
    ["users"],
    fetchUsers,
    {
      getNextPageParam: (lastPage) =>
        lastPage?.paging?.hasMore && lastPage.paging.next,
      onError: (error) => {
        // status: 401 unauthorized
        if (error.response && error.response.status === 401) {
          console.log(error.response)
        }
      },
    }
  );
};
