"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function OverallStatsCard({ overallStats }) {
  if (!overallStats) return null;

  const { attended, missed, totalLectures, percentage } = overallStats;

  const REQUIRED_PERCENTAGE = 75;

  let neededToReachLimit = Math.ceil(
    (REQUIRED_PERCENTAGE * totalLectures / 100 - attended) * 4
  );
  if (neededToReachLimit < 0) neededToReachLimit = 0;

  const displayPercentage = Math.round(percentage);

  const progressData = [
    { name: "Progress", value: displayPercentage },
    { name: "Remaining", value: 100 - displayPercentage },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 mb-8">
      <h2 className="font-semibold text-xl text-gray-900 mb-6">
        Your Overall Attendance
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-stretch sm:gap-8">
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-y-3 text-sm sm:text-base">
            <p className="text-gray-600">Total Lectures</p>
            <p className="font-medium text-gray-900 text-right">
              {totalLectures}
            </p>

            <p className="text-gray-600">Attended</p>
            <p className="font-medium text-green-600 text-right">
              {attended}
            </p>

            <p className="text-gray-600">Missed</p>
            <p className="font-medium text-red-600 text-right">
              {missed}
            </p>

            <p className="text-gray-600">Percentage</p>
            <p
              className={`font-semibold text-right ${
                displayPercentage < REQUIRED_PERCENTAGE
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {displayPercentage}%
            </p>
          </div>

          {displayPercentage < REQUIRED_PERCENTAGE && neededToReachLimit > 0 && (
            <p className="text-sm text-red-700 font-medium mt-2">
              You need to attend the next{" "}
              <b>{neededToReachLimit}</b> lectures in a row
              to reach the <b>acceptable limit</b>.
            </p>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-44 h-44 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[{ value: 100 }]}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={85}
                  stroke="none"
                >
                  <Cell fill="#e5e7eb" /> 
                </Pie>

                <Pie
                  data={progressData}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={85}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  <Cell
                    fill={displayPercentage >= REQUIRED_PERCENTAGE ? "#16a34a" : "#dc2626"}
                  />
                  <Cell fill="transparent" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`text-3xl font-bold tracking-tight ${
                  displayPercentage < REQUIRED_PERCENTAGE
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {displayPercentage}%
              </span>
              <span className="text-sm text-gray-500 mt-1">Present</span>
            </div>
          </div>
        </div>
      </div>

      {displayPercentage < REQUIRED_PERCENTAGE ? (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">
          ⚠️ You must attend the next{" "}
          <b>{neededToReachLimit}</b> consecutive lectures
          to reach the <b>acceptable limit</b>.
        </div>
      ) : (
        <div className="mt-6 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-4">
          🎉 Great job! You’re maintaining attendance above the{" "}
          <b>acceptable limit</b>.
        </div>
      )}
    </div>
  );
}
