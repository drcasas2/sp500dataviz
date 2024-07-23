import { useEffect, useRef, useState } from "react";

const NumInputField = ({ label, value, onInput }) => {

    return (
        <div className="bg-slate-200 w-auto h-auto py-2 px-2 rounded font-bold text-[0.55rem] text-wrap text-center flex flex-col flex-wrap mx-auto my-2 sm:mx-0 sm:py-4 sm:text-[0.83rem] sm:pb-0 sm:pt-1 sm:px-1 md:w-auto md:text-[0.85rem] lg:w-auto lg:py-1 lg:px-1 lg:text-[1rem]">
            <label className="pb-0">
                {/* Initial Investment (in USD):  */}
                {label}
            </label>
            <input
                label={label}
                value={value}
                type="number"
                step="500"
                onChange={onInput}
                className=" pl-2 mb-1 border-2 w-3/4 mx-auto border-sky-600 border-solid rounded "
            />
        </div>
    );
};

export default NumInputField;