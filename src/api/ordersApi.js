import { BASE_URL } from "./apiConnConfig";

export default class Orders {
  //Create
  async createOrder({
    user_id,
    custom_robot_id,
    quantity,
    status,
    payment_method,
    shipping_address,
    shipping_date,
  }) {
    const allowedStatus = ["pending", "paid", "shipped", "cancelled"];

    // Basic client-side validation
    if (
      !user_id ||
      !custom_robot_id ||
      !quantity ||
      !status ||
      !payment_method ||
      !shipping_address ||
      !shipping_date
    ) {
      console.error("Missing required fields");
      return;
    }

    if (!allowedStatus.includes(status)) {
      console.error(
        `Invalid status. Must be one of: ${allowedStatus.join(", ")}`
      );
      return;
    }

    const orderData = {
      user_id,
      custom_robot_id,
      quantity,
      status,
      payment_method,
      shipping_address,
      shipping_date,
    };

    try {
      const response = await fetch(`${BASE_URL}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.status === 201) {
        const data = await response.json();
        console.log("Order created:", data.message);
        return true;
      } else {
        const error = await response.json();
        console.error("Failed to create order:", error.error);
        return false;
      }
    } catch (err) {
      console.error("Network or server error while creating order:", err);
      return false;
    }
  }

  //Read

  async getOrder(searchParams) {
    //searchParams is an object with keys used as search criterias
    const baseUrl = `${BASE_URL}/orders`;
    // Prepare the URL with query parameters
    let url = new URL(baseUrl, window.location.origin);

    // Append search criteria to the URL
    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key]) {
        url.searchParams.append(key, searchParams[key]);
      }
    });

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching order data:", errorData);
        return null; // Or handle error appropriately
      }

      const data = await response.json();
      console.log("Order data retrieved:", data);
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  }

  //Update
  async updateOrder(orderData) {
    //orderData is an object with keys 
    // which represents the to be changed fields
    const baseUrl = `${BASE_URL}/orders`;

    try {
      // Perform PUT request to update the order
      const response = await fetch(baseUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData), // Send the order data as JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating order:", errorData);
        return null; // Or handle error appropriately
      }

      const data = await response.json();
      console.log("Order updated successfully:", data);
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  }
  //Delete
  async deleteOrder(orderId) {
    const url = `${BASE_URL}/orders/${orderId}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
  
      if (response.status === 204) {
        console.log(`Order ${orderId} deleted successfully.`);
        return true;
      } else {
        const errorData = await response.json();
        console.error(`Failed to delete order ${orderId}:`, errorData);
        return false;
      }
    } catch (error) {
      console.error(`Network error while deleting order ${orderId}:`, error);
      return false;
    }
  }
}
