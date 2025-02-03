export const processEnrollmentData = (users: User[]): EnrollmentData => {
  const enrollmentData: EnrollmentData = {};
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  users.forEach((user) => {
    const createdAt = new Date(user.createdAt);
    if (isNaN(createdAt.getTime())) return;

    const year = createdAt.getUTCFullYear().toString();
    const monthIndex = createdAt.getUTCMonth();

    if (!enrollmentData[year]) {
      enrollmentData[year] = months.map((month) => ({ month, value: 0 }));
    }

    enrollmentData[year][monthIndex].value += 1;
  });

  return enrollmentData;
};
