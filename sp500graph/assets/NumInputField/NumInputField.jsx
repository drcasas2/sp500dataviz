import { useEffect, useRef, useState } from "react";

const NumInputField = ({ label, value, onInput }) => {

    return (
        <div className="bg-slate-200 w-3/10 p-2 rounded font-bold px-2 text-center flex flex-col ">
            <label>
                {/* Initial Investment (in USD):  */}
                {label}
            </label>
            <input
                label={label}
                value={value}
                type="number"
                step="500"
                onChange={onInput}
                className=" px-2 m-2 border-2 border-sky-600 border-solid rounded "
            />
        </div>
    );
};

export default NumInputField;