// Mock file upload service for development
export const mockUploadFile = async (
  file: File,
  type: "resume" | "profilePicture"
): Promise<string> => {
  // Simulate upload delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Create a mock URL for the uploaded file
  const mockUrls = {
    profilePicture: [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face",
    ],
    resume: [
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      "https://www.africau.edu/images/default/sample.pdf",
    ],
  };

  // Return a random mock URL based on file type
  const urls = mockUrls[type];
  const randomIndex = Math.floor(Math.random() * urls.length);

  return urls[randomIndex];
};
