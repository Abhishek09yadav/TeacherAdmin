"use client";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { useEffect, useState } from "react";
import './view-teacher.css'
const DateRangeModal = ({
  isOpen,
  onClose,
  onConfirm,
  tempRange,
  setTempRange,
  monthsToShow,
}) => {

   if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-white p-4 rounded-md shadow-md  max-w-full overflow-auto">
        <DateRangePicker
          showSelectionPreview
          moveRangeOnFirstSelection={false}
          retainEndDateOnFirstSelection={true}
          onChange={(ranges) => setTempRange(ranges.selection)}
          months={monthsToShow}
          direction={monthsToShow === 1 ? "vertical" : "horizontal"}
          rangeColors={["#3b82f6"]}
          editableDateInputs={true}
          ranges={[tempRange]}
        />
        <div className="mt-2 flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={() => {
              onClose();
              setTempRange({
                startDate: new Date(),
                endDate: new Date(),
                key: "selection",
              });
            }}
            className="px-5 py-2 text-white bg-red-600 rounded hover:bg-red-500"
          >
            Close
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-500"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateRangeModal

