// import data from "@constants/data";
// import { useSessionStorage } from "@hooks/useSessionStorage";

// export function useData(type) {
//     return type ? useSessionStorage(`data:${type}`, data[type]) : [,];
// }


import * as data from "../constants/data";
import { useSessionStorage } from "./useSessionStorage";

export function useData(type) {
    if (type) {
        return useSessionStorage(`data:${type}`, data[type]);
    }
    return [,]; // Return an array or other default value as needed
}
