// src/services/Api.js

export const baseURL = "http://localhost:5169/api"; // LocalDevelopment
// export const baseURL = "http://tenkkritisk-001-site1.htempurl.com/api"; //Change to HTTPS when we aquire a SSL from smarterasp.net
//export const baseURL = "https://tenk-kritisk.no/api"; //Change to this for communication with smarterasp

// Helper function for GET requests
export const get = async (endpoint) => {
    try {
      //Endret base url under testing 
    const response = await fetch(`${baseURL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`GET request failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error; 
  }
};

// Helper function for POST request
export const post = async (endpoint, body) => {
  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
        body: JSON.stringify(body),
       
    });
      console.log("Body til api: " + JSON.stringify(body));
    if (!response.ok) {
      throw new Error(`POST request failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Helper function for PUT requests
export const put = async (endpoint, body) => {
  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`PUT request failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Helper function for DELETE requests
export const del = async (endpoint) => {
  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: "DELETE",
    });

    // Check if the response is not OK
    if (!response.ok) {
      throw new Error(`DELETE request failed: ${response.status}`);
    }

    // If the status is 204, we don't need to parse the response as JSON
    if (response.status === 204) {
      return; // Simply return without any value
    }

    // If you expect other status codes with JSON response, parse here
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Helper function for PATCH requests
export const patch = async (endpoint, body) => {
  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`PATCH request failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
