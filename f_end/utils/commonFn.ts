export const clearObjectValues = (obj: object)=>{
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