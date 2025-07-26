import { useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useUserFilterStore } from "@/store/userFiltersStore";
import { FilterPanel } from "./FilterPanel";
import { ActiveFilters } from "./ActiveFilters";
import UsersTable from "./AllUsers";
import { getPaginatedUsers } from "@/services/userServices";
import { useSearchParams } from "react-router-dom";

const Index = () => {
  const { setUsers } = useUserFilterStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const updateParams = (newPage: number, newLimit: number) => {
    setSearchParams({ page: newPage.toString(), limit: newLimit.toString() });
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => getPaginatedUsers(page, limit),
    placeholderData: keepPreviousData,
  });
  console.log("page info", data);

  useEffect(() => {
    if (data?.users) {
      setUsers(data.users);
    }
  }, [data?.users, setUsers]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading users...</p>
        </motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-lg text-destructive">Error loading users</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <FilterPanel />
      <ActiveFilters />
      <UsersTable
        usersData={data?.users || []}
        page={page}
        limit={limit}
        total={data?.totalPages || 0}
        setParams={(newPage, newLimit) =>
          setSearchParams({
            page: newPage.toString(),
            limit: newLimit.toString(),
          })
        }
      />
    </div>
  );
};

export default Index;
