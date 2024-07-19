import { useEffect, useRef, useState } from "react";

const NumInputField = ({ label, value, onInput }) => {

    return (
        <div className="bg-slate-200 w-auto h-auto py-0 px-2 rounded font-bold text-[0.35rem] text-wrap px-2 text-center flex flex-col mx-auto min-w-[1.09rem] my-auto text-center sm:min-w-[7.09rem] sm:mx-0 sm:px-1 sm:text-[0.53rem] sm:pb-0 sm:pt-1 sm:px-1 md:w-auto md:text-[0.65rem] lg:w-auto lg:py-1 lg:px-1 lg:text-[1rem]">
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
                className=" px-2 mb-1 border-2 border-sky-600 border-solid rounded "
            />
        </div>
    );
};

export default NumInputField;