import { defineStore } from 'pinia'

export const useCommonFnStore = defineStore('commonFn', ()=>{
    const model = ref(false)
    function clearObjectValues(obj) {
        for (const key in obj) {
            if (Array.isArray(obj[key])) {
                obj[key] = [];
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                obj[key] = {};
            } else {
                obj[key] = "";
            }
        }

        return obj;
    }

    return { clearObjectValues }
})