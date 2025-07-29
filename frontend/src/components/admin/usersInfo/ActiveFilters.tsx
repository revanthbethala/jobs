// import { motion, AnimatePresence } from "framer-motion";
// import { X } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { useUserFiltersStore } from "@/store/userFiltersStore";
// import { FilterFormData } from "@/schemas/userFiltersSchema";

// export const ActiveFilters = () => {
//   const { filters, removeFilter } = useUserFiltersStore();

//   const activeFilters = (
//     Object.entries(filters) as [keyof FilterFormData, any][]
//   ).filter(([key, value]) => {
//     if (value === undefined || value === "" || value === null) return false;
//     if (Array.isArray(value) && value.length === 0) return false;
//     return true;
//   });

//   if (activeFilters.length === 0) return null;

//   return (
//     <div className="mb-4">
//       <div className="flex flex-wrap gap-2">
//         <AnimatePresence>
//           {activeFilters.map(([key, value]) => {
//             // Handle educationalLevels separately
//             if (key === "educationalLevels" && Array.isArray(value)) {
//               return value.map((edu) => (
//                 <motion.div
//                   key={`edu-${edu.level}`}
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.8 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <Badge
//                     variant="secondary"
//                     className="flex items-center gap-1 pr-1"
//                   >
//                     {edu.level}: {edu.percentageRange[0]}% -{" "}
//                     {edu.percentageRange[1]}%
//                     <button
//                       onClick={() =>
//                         removeFilter("educationalLevels", edu.level)
//                       }
//                       className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </Badge>
//                 </motion.div>
//               ));
//             }

//             // Default rendering
//             return (
//               <motion.div
//                 key={key}
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.8 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <Badge
//                   variant="secondary"
//                   className="flex items-center gap-1 pr-1"
//                 >
//                   {getFilterDisplayValue(key, value)}
//                   <button
//                     onClick={() => removeFilter(key)}
//                     className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
//                   >
//                     <X className="h-3 w-3" />
//                   </button>
//                 </Badge>
//               </motion.div>
//             );
//           })}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// // You may optionally move this function outside if reused
// const getFilterDisplayValue = (key: keyof FilterFormData, value: any) => {
//   switch (key) {
//     case "search":
//       return `Search: "${value}"`;
//     case "gender":
//       return `Gender: ${value}`;
//     case "passedOutYears":
//       return `Years: ${value.join(", ")}`;
//     case "minActiveBacklogs":
//       return `Min Backlogs: ${value}`;
//     case "maxActiveBacklogs":
//       return `Max Backlogs: ${value}`;
//     default:
//       return `${key}: ${value}`;
//   }
// };

function ActiveFilters() {
  return (
    <div>ActiveFilters</div>
  )
}

export default ActiveFilters