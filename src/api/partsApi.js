//Create
import { BASE_URL } from "./apiConnConfig";
export default class Parts {
  async createPart({ name, type, model_path, img_path, price }) {
    if (!name || !type || !model_path || !img_path || !price) {
      console.error("Missing required fields");
      return;
    }

    const newPart = {
      name,
      type,
      model_path,
      img_path,
      price,
    };

    try {
      const response = await fetch(`${BASE_URL}/parts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPart),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`Part created: ${data.message}`);
      } else {
        console.error(`Failed to create part: ${data.error}`);
      }
    } catch (error) {
      console.error("⚠️ Network error:", error);
    }
  }

  //Read

  async getPart({ id, name, part_type, price } = {}) {
    const params = new URLSearchParams();

    if (id !== undefined) params.append("id", id);
    if (name) params.append("name", name);
    if (part_type) params.append("part_type", part_type);
    if (price !== undefined) params.append("price", price);

    const url = `${BASE_URL}/parts/?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Retrieved parts:", data);
        return data;
      } else {
        console.error("Failed to retrieve parts:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Network error:", error);
      return null;
    }
  }

  //Update
  async updatePart({ id, name, part_type, model_path, img_path, price }) {
    if (!id) {
      console.error("Missing required field: id");
      return;
    }

    const payload = { id };
    //create an object and add the key value into the object if given
    if (name) payload.name = name;
    if (part_type) payload.part_type = part_type;
    if (model_path) payload.model_path = model_path;
    if (img_path) payload.img_path = img_path;
    if (price !== undefined) payload.price = price;

    try {
      const response = await fetch(`${BASE_URL}/parts/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`Part ${id} updated:`, data.message);
        return data;
      } else {
        console.error(`Failed to update part ${id}:`, data.error);
        return null;
      }
    } catch (error) {
      console.error("Network error:", error);
      return null;
    }
  }

  //Delete
  async deletePart(part_id) {
    if (!part_id) {
      console.error("Missing part_id for deletion");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/parts/${part_id}`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        console.log(`Part ${part_id} deleted successfully`);
        return true;
      } else {
        const data = await response.json();
        console.error(`Failed to delete part ${part_id}:`, data.error);
        return false;
      }
    } catch (error) {
      console.error("Network error while deleting part:", error);
      return false;
    }
  }
}
