/**
 * This class helping to use regular javascript array same way as mongo collection
 */
export class Collection {
    data: any;

    constructor(data: any = []) {
        this.data = data;
    }

    async find(query: any = {}, options: any = {}) {
        const filterFn = (entry: any): boolean => {
            for (const key in query) {
                if (query.hasOwnProperty(key)) {
                    if (!entry.hasOwnProperty(key) || !checkQuery(entry[key], query[key])) {
                        return false;
                    }
                }
            }
            return true;
        };

        const checkQuery = (value: any, queryValue: any): boolean => {
            if (typeof queryValue === 'object') {
                if (queryValue.$gte !== undefined) {
                    return value >= queryValue.$gte;
                } else if (queryValue.$or !== undefined) {
                    return queryValue.$or.some((orCondition: any) => checkQuery(value, orCondition));
                }
            } else {
                return value === queryValue;
            }
    
            return false;
        };

        const filteredData = this.data.slice().filter(filterFn);

        if (options.sort) {
            const sortFields = Object.keys(options.sort);
            filteredData.sort((a: any, b: any) => {
                let result = 0;
                for (const field of sortFields) {
                    const sortOrder = options.sort[field];
                    if (a[field] !== b[field]) {
                        result = sortOrder === 1 ? a[field] - b[field] : b[field] - a[field];
                        break;
                    }
                }
                return result;
            });
        }

        if (options.limit) {
            filteredData.splice(options.limit);
        }

        return filteredData;
    }
}









