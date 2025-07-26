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
import { User, useUserFilterStore } from "@/store/userFiltersStore";
import { Education } from "@/types/profileTypes";
import { exportToExcel } from "@/lib/exportToExcel";
import { Button } from "@/components/ui/button";

interface UsersTableProps {
  usersData: User[];
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  total: number;
}

export const UsersTable = ({
  usersData,
  page,
  setPage,
  limit,
  setLimit,
  total,
}: UsersTableProps) => {
  const totalPages = Math.ceil(total / limit);
  const { filteredUsers:users } = useUserFilterStore();
  console.log(users);
  const handleExport = () => {
    const dataToExport = users.map((user) => {
      const getEdu = (level: string) =>
        user.education.find((edu) => edu.educationalLevel === level);
      const tenth = getEdu("10th");
      const interOrDiploma = getEdu("12th") || getEdu("Diploma");
      const btech = getEdu("B.Tech");

      const totalBacklogs = user.education.reduce(
        (sum, edu) => sum + edu.noOfActiveBacklogs,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className=" space-y-3">
              <h2>Users Information</h2>
              <Badge variant="outline">
                {total} user{total !== 1 ? "s" : ""} found
              </Badge>
            </div>
            <div className="flex gap-2 items-center">
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
                          (edu) => edu.educationalLevel === level
                        );
                      const tenth = getEdu("10th");
                      const interOrDiploma =
                        getEdu("12th") || getEdu("Diploma");
                      const btech = getEdu("B.Tech");

                      const totalBacklogs = user.education.reduce(
                        (sum, edu) => sum + edu.noOfActiveBacklogs,
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
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Rows per page:
                  </span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setPage(1);
                      setLimit(Number(e.target.value));
                    }}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    {[10, 25, 50].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UsersTable;
