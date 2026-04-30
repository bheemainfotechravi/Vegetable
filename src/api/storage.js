const storage = {
  getItem: (key) => {
    try {
      return Promise.resolve(localStorage.getItem(key));
    } catch (e) {
      return Promise.resolve(null);
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
    return Promise.resolve();
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
    return Promise.resolve();
  },
};

export default storage;