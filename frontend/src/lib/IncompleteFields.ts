export function getIncompleteFields(profile): number {
  const incompleteFields: string[] = [];

  for (const key in profile) {
    if (key === "token") continue;

    const value = profile[key];

    // Check top-level null
    if (value === null || value === undefined || value === "") {
      incompleteFields.push(key);
    }

    // Special case: education array
    if (key === "education") {
      if (!Array.isArray(value) || value.length === 0) {
        incompleteFields.push("education");
      } else {
        // Check each education item for required fields
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
            if (!edu[field] && edu[field] !== 0) {
              incompleteFields.push(`education[${index}].${field}`);
            }
          });
        });
      }
    }
  }
  console.log(incompleteFields);
  return incompleteFields.length;
}
