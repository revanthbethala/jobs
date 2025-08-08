import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/lib/exportToExcel";
import { useUserFiltersStore } from "@/store/userFiltersStore";
import { getPaginatedUsers } from "@/services/userServices";
import { Education } from "@/types/profileTypes";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import LoadingSpinner from "@/components/LoadingSpinner";

const UsersTable = () => {
  const {
    search,
    gender,
    educationalLevels,
    passedOutYears,
    minActiveBacklogs,
    maxActiveBacklogs,
    page,
    limit,
    setPage,
    setLimit,
  } = useUserFiltersStore();

  const filters = {
    search,
    gender,
    educationalLevels,
    passedOutYears,
    minActiveBacklogs,
    maxActiveBacklogs,
  };

  const { showAllData } = useUserFiltersStore();
  const queryKey = [
    "users",
    page,
    limit,
    showAllData,
    search,
    gender,
    educationalLevels,
    passedOutYears,
    minActiveBacklogs,
    maxActiveBacklogs,
  ];
  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => {
      const finalFilters = showAllData ? {} : filters;
      return getPaginatedUsers(page, limit, finalFilters);
    },
    placeholderData: (previousData) => previousData,
    staleTime: 10 * 1000,
  });
  const users = data?.users || [];
  const totalUsers = data?.totalUsers || 0;
  const totalPages = data?.totalPages || 1;
  const handleExport = () => {
    const dataToExport = users.map((user) => {
      const getEdu = (level: string) =>
        user.education.find((edu) => edu.educationalLevel === level);

      const tenth = getEdu("10th");
      const interOrDiploma = getEdu("12th") || getEdu("Diploma");
      const btech = getEdu("B.Tech");

      const totalBacklogs = user.education.reduce(
        (sum, edu) => sum + (edu.noOfActiveBacklogs || 0),
        0
      );

      return {
        "Full Name": `${user.firstName} ${user.lastName}`,
        Username: user.username,
        Email: user.email,
        Gender: user.gender ?? "-",
        "10th": tenth?.percentage ?? "-",
        "12th/Diploma": interOrDiploma?.percentage ?? "-",
        "B.Tech": btech?.percentage ?? "-",
        Branch: btech?.specialization ?? "-",
        "Passed Out Year": btech?.passedOutYear ?? "-",
        "Active Backlogs": totalBacklogs,
      };
    });

    exportToExcel(dataToExport, "Filtered_Users.xlsx");
  };

  console.log(isLoading);
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500 text-center">Failed to load users.</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      // className="w-screen"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold">
                Users Information
              </h2>
              <Badge variant="outline" className="text-xs sm:text-sm">
                {totalUsers} user(s) found
              </Badge>
            </div>
            <Button
              size="sm"
              onClick={handleExport}
              className="w-full sm:w-auto"
            >
              Export to Excel
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              No users found matching the current filters.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-md border border-gray-200">
                <Table className="min-w-[1000px] text-sm">
                  <TableHeader>
                    <TableRow className="bg-muted">
                      <TableHead>Username</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>10th</TableHead>
                      <TableHead>12th/Diploma</TableHead>
                      <TableHead>B.Tech</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Passed Year</TableHead>
                      <TableHead>Active Backlogs</TableHead>
                      <TableHead>Father Name</TableHead>
                      <TableHead>Mother Name</TableHead>
                      <TableHead>City</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => {
                      const getEdu = (level: string) =>
                        user.education.find(
                          (edu: Education) => edu.educationalLevel === level
                        );
                      const tenth = getEdu("10th");
                      const interOrDiploma =
                        getEdu("12th") || getEdu("Diploma");
                      const btech = getEdu("B.Tech");
                      const totalBacklogs = user.education.reduce(
                        (sum: number, edu: Education) =>
                          sum + (edu.noOfActiveBacklogs || 0),
                        0
                      );

                      const getPercentBadge = (edu?: Education) =>
                        edu ? (
                          <Badge variant="secondary">{edu.percentage}%</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        );

                      return (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          className="hover:bg-muted transition-colors border-b border-b-gray-200"
                        >
                          <TableCell>{user.username}</TableCell>
                          <TableCell className="capitalize">
                            {user?.firstName ? (
                              `${user.firstName} ${user.lastName}`
                            ) : (
                              <span className="font-bold text-center">-</span>
                            )}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {user.gender ?? (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>{getPercentBadge(tenth)}</TableCell>
                          <TableCell>
                            {getPercentBadge(interOrDiploma)}
                          </TableCell>
                          <TableCell>{getPercentBadge(btech)}</TableCell>
                          <TableCell>
                            {btech?.specialization ?? (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {btech?.passedOutYear ?? (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                totalBacklogs > 0 ? "destructive" : "secondary"
                              }
                            >
                              {totalBacklogs}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.fatherName}</TableCell>
                          <TableCell>{user.motherName}</TableCell>
                          <TableCell>{user.city}</TableCell>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              <div className="mt-4 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                {/* Rows Per Page */}
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="rows-per-page"
                    className="text-sm text-gray-600 whitespace-nowrap"
                  >
                    Rows per page:
                  </label>
                  <select
                    id="rows-per-page"
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="border border-input rounded-md px-3 py-1 text-sm"
                  >
                    {[5, 10, 25, 50].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <Pagination>
                  <PaginationContent className="gap-1">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => {
                          if (page !== 1) setPage(Math.max(page - 1, 1));
                        }}
                        className={`cursor-pointer${
                          page === 1 ? " pointer-events-none opacity-50" : ""
                        }`}
                      />
                    </PaginationItem>

                    {/* Only render surrounding pages */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (p) =>
                          Math.abs(p - page) <= 2 || p === 1 || p === totalPages
                      )
                      .map((p, index, arr) => (
                        <PaginationItem
                          key={p}
                          className="flex gap-1 items-center"
                        >
                          <PaginationLink
                            isActive={page === p}
                            onClick={() => setPage(p)}
                            className="cursor-pointer"
                          >
                            {p}
                          </PaginationLink>
                          {index < arr.length - 1 && arr[index + 1] - p > 1 && (
                            <PaginationEllipsis />
                          )}
                        </PaginationItem>
                      ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => {
                          if (page !== totalPages) {
                            setPage(Math.min(page + 1, totalPages));
                          }
                        }}
                        className={`cursor-pointer${
                          page === totalPages
                            ? " pointer-events-none opacity-50"
                            : ""
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UsersTable;
