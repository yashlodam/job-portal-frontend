const setItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("Error saving to localStorage:", error);
    }
};

const getItem = (key) => {
    try {
        const value = localStorage.getItem(key);

        if (value === null || value === undefined || value === "undefined") {
            return null;
        }

        return JSON.parse(value);
    } catch (error) {
        console.error("Error reading from localStorage:", error);
        return null;
    }
};

const removeItem = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Error removing from localStorage:", error);
    }
};

const clearStorage = () => {
    try {
        localStorage.clear();
    } catch (error) {
        console.error("Error clearing localStorage:", error);
    }
};

export { setItem, getItem, removeItem, clearStorage };