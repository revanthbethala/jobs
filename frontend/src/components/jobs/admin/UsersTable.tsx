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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", { page, limit, filters }],
    queryFn: () => getPaginatedUsers(page, limit, filters),
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000,
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
        Gender: user.gender,
        "10th %": tenth?.percentage ?? "N/A",
        "12th/Diploma %": interOrDiploma?.percentage ?? "N/A",
        "B.Tech %": btech?.percentage ?? "N/A",
        "Active Backlogs": totalBacklogs,
      };
    });

    exportToExcel(dataToExport, "Filtered_Users.xlsx");
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading users...</div>;
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
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="space-y-3">
              <h2>Users Information</h2>
              <Badge variant="outline">{totalUsers} user(s) found</Badge>
            </div>
            <div>
              <Button onClick={handleExport}>Export to Excel</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found matching the current filters.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>10th</TableHead>
                      <TableHead>12th/Diploma</TableHead>
                      <TableHead>B.Tech</TableHead>
                      <TableHead>Active Backlogs</TableHead>
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
                          <Badge
                            variant={
                              edu.percentage >= 75
                                ? "default"
                                : edu.percentage >= 60
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {edu.percentage}%
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        );

                      return (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell>
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.gender}</Badge>
                          </TableCell>
                          <TableCell>{getPercentBadge(tenth)}</TableCell>
                          <TableCell>
                            {getPercentBadge(interOrDiploma)}
                          </TableCell>
                          <TableCell>{getPercentBadge(btech)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                totalBacklogs > 0 ? "destructive" : "secondary"
                              }
                            >
                              {totalBacklogs}
                            </Badge>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}

              <div className="mt-3">
                {/* Rows Per Page */}
                <div className="flex items-center gap-2 pt-3">
                  <label
                    htmlFor="rows-per-page"
                    className="text-sm text-gray-600 "
                  >
                    Rows per page:
                  </label>
                  <select
                    id="rows-per-page"
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1); // Reset to page 1 on change
                    }}
                    className="border border-input rounded-md px-3 py-1 text-sm"
                  >
                    <option value="">{1}</option>
                    {[5, 10, 20, 50].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <Pagination>
                  <PaginationContent className="gap-2">
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

                    {[1, 2, 3].map((p) =>
                      p <= totalPages ? (
                        <PaginationItem key={p}>
                          <PaginationLink
                            isActive={page === p}
                            onClick={() => setPage(p)}
                            className="cursor-pointer"
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ) : null
                    )}

                    {page > 4 && page < totalPages - 2 && (
                      <>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>

                        <PaginationItem>
                          <PaginationLink
                            isActive
                            onClick={() => setPage(page)}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      </>
                    )}

                    {totalPages > 3 &&
                      [totalPages - 2, totalPages - 1, totalPages].map((p) =>
                        p > 3 && p !== page ? (
                          <PaginationItem key={p}>
                            <PaginationLink
                              isActive={page === p}
                              onClick={() => setPage(p)}
                              className="cursor-pointer"
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        ) : null
                      )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => {
                          if (page !== totalPages) {
                            setPage(Math.min(page + 1, totalPages));
                          }
                        }}
                        className={`cursor-pointer${
                          page ===totalPages ? " pointer-events-none opacity-50" : ""
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
