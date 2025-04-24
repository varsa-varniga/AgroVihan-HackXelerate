// src/utils/indexedDBService.js
const DB_NAME = 'carbonCreditOfflineDB';
const DB_VERSION = 1;
const CALCULATIONS_STORE = 'offlineCalculations';

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
      reject("Error opening IndexedDB");
    };
    
    request.onsuccess = (event) => {
      console.log("IndexedDB opened successfully");
      resolve(event.target.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(CALCULATIONS_STORE)) {
        db.createObjectStore(CALCULATIONS_STORE, { keyPath: 'id', autoIncrement: true });
        console.log("Object store created");
      }
    };
  });
};

export const saveCalculationOffline = (calculationData) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    
    request.onerror = (event) => {
      reject("Error opening IndexedDB");
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([CALCULATIONS_STORE], 'readwrite');
      const store = transaction.objectStore(CALCULATIONS_STORE);
      
      // Add timestamp and offline flag
      const dataToStore = {
        ...calculationData,
        timestamp: new Date().toISOString(),
        synced: false
      };
      
      const request = store.add(dataToStore);
      
      request.onsuccess = () => {
        resolve("Data saved offline successfully");
      };
      
      request.onerror = (event) => {
        reject("Error saving data offline: " + event.target.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
};

export const getOfflineCalculations = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    
    request.onerror = (event) => {
      reject("Error opening IndexedDB");
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([CALCULATIONS_STORE], 'readonly');
      const store = transaction.objectStore(CALCULATIONS_STORE);
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        reject("Error getting offline data: " + event.target.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
};

export const markAsSynced = (id) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    
    request.onerror = (event) => {
      reject("Error opening IndexedDB");
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([CALCULATIONS_STORE], 'readwrite');
      const store = transaction.objectStore(CALCULATIONS_STORE);
      
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const data = getRequest.result;
        if (data) {
          data.synced = true;
          const updateRequest = store.put(data);
          
          updateRequest.onsuccess = () => {
            resolve("Data marked as synced");
          };
          
          updateRequest.onerror = (event) => {
            reject("Error updating sync status: " + event.target.error);
          };
        } else {
          reject("Data not found");
        }
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
};

export const removeCalculation = (id) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    
    request.onerror = (event) => {
      reject("Error opening IndexedDB");
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([CALCULATIONS_STORE], 'readwrite');
      const store = transaction.objectStore(CALCULATIONS_STORE);
      
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => {
        resolve("Data deleted successfully");
      };
      
      deleteRequest.onerror = (event) => {
        reject("Error deleting data: " + event.target.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
};