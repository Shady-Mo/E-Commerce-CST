function get(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        console.error("Error retrieving data from localStorage:", error);
        return [];
    }
}

function set(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("Error setting data in localStorage:", error);
    }
}

function remove(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Error removing data from localStorage:", error);
    }
}

export const storage = { get, set, remove };