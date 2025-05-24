import { BASE_URL } from "./apiConnConfig";

export default class Bots {
  //Create
  async createCustomBot({ user_id, name }) {
    if (!user_id || !name) {
      console.error("Missing required fields: user_id or name");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/custom_bots/add_custom_bot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, name }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(
          `Custom bot '${name}' created for user ${user_id}:`,
          data.message
        );
        return data;
      } else {
        console.error("Failed to create custom bot:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Network error while creating custom bot:", error);
      return null;
    }
  }

  async addPartToBot({ part_id, custom_robot_id, amount }) {
    if (!part_id || !custom_robot_id || !amount) {
      console.error(
        "Missing required fields: part_id, custom_robot_id, or amount"
      );
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/custom_bots/add_part_to_bot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ part_id, custom_robot_id, amount }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(
          `Added ${amount} of part ${part_id} to bot ${custom_robot_id}:`,
          data.message
        );
        return data;
      } else {
        console.error("Failed to add part to bot:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Network error while adding part to bot:", error);
      return null;
    }
  }
  //Read
  async getCustomBot({ id, user_id, name, status, created_at } = {}) {
    const params = new URLSearchParams();

    if (id) params.append("id", id);
    if (user_id) params.append("user_id", user_id);
    if (name) params.append("name", name);
    if (status) params.append("status", status);
    if (created_at) params.append("created_at", created_at);

    try {
      const response = await fetch(
        `${BASE_URL}/custom_bots/bots?${params.toString()}`
      );
      const data = await response.json();

      if (response.ok) {
        console.log("Custom bot(s) fetched successfully:", data);
        return data;
      } else {
        console.error("Error fetching custom bot(s):", data.error);
        return null;
      }
    } catch (error) {
      console.error("Network error while fetching custom bot(s):", error);
      return null;
    }
  }

  async getPartsFromCustomBot(bot_id) {
    if (!bot_id) {
      console.error("bot_id is required");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/custom_bots/${bot_id}/parts`);
      const data = await response.json();

      if (response.ok) {
        console.log(`Parts from bot ${bot_id} fetched successfully:`, data);
        return data;
      } else {
        console.error(`Error fetching parts from bot ${bot_id}:`, data.error);
        return null;
      }
    } catch (error) {
      console.error("Network error while fetching parts from bot:", error);
      return null;
    }
  }
  //Update
  async updateCustomBot(bot_id, { name } = {}) {
    if (!bot_id) {
      console.error("bot_id is required");
      return;
    }

    const body = {};
    if (name) body.name = name;

    if (Object.keys(body).length === 0) {
      console.error("No update fields provided");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/custom_bots/${bot_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`Custom Bot ${bot_id} updated successfully:`, data.message);
        return data;
      } else {
        console.error(`Failed to update Custom Bot ${bot_id}:`, data.error);
        return null;
      }
    } catch (error) {
      console.error("Network error while updating Custom Bot:", error);
      return null;
    }
  }

  //Delete
  async deletePartFromCustomBot(bot_id, part_id) {
    if (!bot_id || !part_id) {
      console.error("bot_id and part_id are required");
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/custom_bots/${bot_id}/${part_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 204) {
        console.log(`Part ${part_id} deleted from Custom Bot ${bot_id}`);
        return true;
      } else {
        const data = await response.json();
        console.error(
          `Failed to delete part ${part_id} from Custom Bot ${bot_id}:`,
          data.error
        );
        return false;
      }
    } catch (error) {
      console.error(
        "Network error while deleting part from custom bot:",
        error
      );
      return false;
    }
  }
}
