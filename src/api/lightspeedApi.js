// src/api/lightspeedApi.js

// NEVER commit the real key/secret to GitHub. Use a .env file!
const API_KEY = "b5019b4b330ee3aba7c1c2378979868a"; 
const API_SECRET = "d109fafabb0692b5fcd1d41982697fe4";
const BASE_URL = "https://api.webshopapp.com/nl";

// Helper to encode credentials for Basic Auth
const authHeader = btoa(`${API_KEY}:${API_SECRET}`);

export const lightspeedApi = {
  /**
   * Create a new customer and store the pet data in their profile
   */
  async createCustomerWithPet(userData, petData) {
    try {
      const response = await fetch(`${BASE_URL}/customers.json`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${authHeader}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer: {
            email: userData.email,
            firstname: userData.firstname,
            lastname: userData.lastname,
            // We store the pet data in the 'memo' field or a custom field
            memo: `PET_DATA: ${JSON.stringify(petData)}`, 
            content: "Created via Nutrition Calculator"
          }
        })
      });

      if (!response.ok) throw new Error("Failed to create customer in Lightspeed");
      
      return await response.json();
    } catch (error) {
      console.error("Lightspeed API Error:", error);
      throw error;
    }
  },

  /**
   * Fetch specific product details (price/stock) for the checkout
   */
  async getProductBySku(sku) {
    const response = await fetch(`${BASE_URL}/products.json?sku=${sku}`, {
      headers: { "Authorization": `Basic ${authHeader}` }
    });
    const data = await response.json();
    return data.products[0]; // Returns the first match
  }
};