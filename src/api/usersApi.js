import { BASE_URL } from "./apiConnConfig";

export default class Users {
  //Create
  async addUser(username, password, email) {
    const api_post_req = "/users/";
    try {
      const response = await fetch(`${BASE_URL}${api_post_req}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //turn this js object to json
          username: username,
          password: password,
          email: email,
        }),
      });
      const data = await response.json(); //json parsed this into javascript object
      if (response.ok) {
        console.log("Success:", data.message);
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  //Read
  async getUser({ id, username, createdAt, email } = {}) {
    const params = new URLSearchParams();

    if (id) params.append("id", id);
    if (username) params.append("username", username);
    if (createdAt) params.append("created_at", createdAt);
    if (email) params.append("email", email);

    const api_get_req = `/users/?${params.toString()}`;

    const response = await fetch(`${BASE_URL}${api_get_req}`); //it takes a while to fetch data from api
    return await response.json(); //it takes a while to turn data into json
  }

  //Update
  async updateUser({ id, username, createdAt, email } = {}) {
    let api_put_req = "";
    //user_id must be given for this request to response
    if (id) {
      api_put_req = `/users/${id}`;
    } else {
      throw new Error("User ID is required!");
    }
    //only update fields which are given
    const updatedFields = {};
    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (createdAt) updatedFields.createdAt = createdAt;
    if (Object.keys(updatedFields).length === 0) {
      throw new Error("No fields to update.");
    }
    //send the PUT request to api server
    try {
      const response = await fetch(`${BASE_URL}${api_put_req}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Make sure the server knows that json is being sent
        },
        body: JSON.stringify(updatedFields),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`User ${id} updated successfully:`, data.message);
        return data; // You could return the response data here for further use
      } else {
        console.error("Error updating user:", data.error);
        throw new Error(data.error || "Failed to update user.");
      }
    } catch (error) {
      console.error("Network error:", error);
      throw error; // Rethrow or handle the error as necessary
    }
  }

  //Delete
  // Function to delete a user
  async deleteUser(userId) {
    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`User ${userId} deleted:`, data.message);
        alert(`User ${userId} deleted successfully!`);
      } else {
        console.error("Error deleting user:", data.error);
        alert(`Error deleting user: ${data.error}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please try again.");
    }
  }

  // Function to delete a custom bot from a user
  async deleteCustomBotFromUser(userId, botId) {
    try {
      const response = await fetch(`${BASE_URL}/users/${userId}/${botId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log(
          `Custom Bot ${botId} deleted from user ${userId}:`,
          data.message
        );
        alert(`Custom Bot ${botId} deleted from user ${userId} successfully!`);
      } else {
        console.error("Error deleting custom bot from user:", data.error);
        alert(`Error deleting custom bot from user: ${data.error}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please try again.");
    }
  }
}
