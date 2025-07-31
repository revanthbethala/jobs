export function getIncompleteFields(user): number {
  const incompleteFields: string[] = [];

  const profile = user?.user;
  if (!profile) return 0;

  for (const key in profile) {
    if (key == "profilePic" || key == "resume" || key == "profilePic") continue;

    const value = profile[key];

    // Special case: education array
    if (key === "education") {
      if (!Array.isArray(value) || value.length === 0) {
        incompleteFields.push("education");
      } else {
        const requiredEduFields = [
          "educationalLevel",
          "institution",
          "boardOrUniversity",
          "percentage",
          "passedOutYear",
          "location",
        ];

        value.forEach((edu, index: number) => {
          requiredEduFields.forEach((field) => {
            if (
              edu[field] === null ||
              edu[field] === undefined ||
              edu[field] === ""
            ) {
              incompleteFields.push(`education[${index}].${field}`);
            }
          });
        });
      }
      continue; // skip base-level check for "education"
    }

    // Top-level null/empty string check
    if (value === null || value === undefined || value === "") {
      incompleteFields.push(key);
    }
  }
  console.log("fields", incompleteFields);

  return incompleteFields.length;
}
