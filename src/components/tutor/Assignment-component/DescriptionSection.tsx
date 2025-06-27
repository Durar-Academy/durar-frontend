import React from "react";

const DescriptionSection = () => {
  const descriptionData = [
    // {
    //   header: "Description",
    //   desc: "Memorize the 12 Surahs in Jizu Nabal and Suratul Mursalat",
    // },

    {
      DetailsTitle: "Type",
      DetailsDesc: "Basic",
    },
    {
      DetailsTitle: "Course",
      DetailsDesc: "Quran Memorization",
    },
    {
      DetailsTitle: "Tutor",
      DetailsDesc: "Fatima Khalid",
    },
    {
      DetailsTitle: "Due Date",
      DetailsDesc: "Jan 15, 2025, 11:59 PM",
    },
    {
      DetailsTitle: "Max Score",
      DetailsDesc: "100 Points",
    },
    {
      DetailsTitle: "Late Submit",
      DetailsDesc: "Allowed",
    },
  ];

  return (
    <section className="border-shade-2 p-4 border rounded-xl flex flex-col gap-5 ">
      <div className="flex flex-col gap-4">
        <h1 className="text-high font-semibold">Description</h1>
        <p className="text-low">
          Memorize the 12 Surahs in Jizu Nabal and Suratul Mursalat
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="pb-1">Details</h1>
        {descriptionData.map((desc, index) => (
          <div key={index} className="flex gap-11 text-sm">
            <p className="w-20 text-low">{desc.DetailsTitle}</p>
            <p
              className={`text-sm text-low ${
                desc.DetailsTitle === "Tutor" ? "text-orange" : "text-low"
              }`}
            >
              {desc.DetailsDesc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DescriptionSection;
