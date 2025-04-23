
import { axiosInstance } from "../lib/axios";

export async function getAllCenters() {
  try {
    const response = await axiosInstance.get("center/centers");
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching centers:", error);
    throw error;
  }
}
export async function addCenter(name, description) {
  try {
    // console.log("name", name);
    // console.log("description", description);
    const response = await axiosInstance.post(
      "center/add-Center",
     { name,
      description}
    );
    return response.data;
  } catch (error) {
    console.log("Error adding center:", error);
    throw error;
  }
}

export async function updateCenter(id,data) {
  try {
    const response = await axiosInstance.put(`center/center/${id}`,data);
    return response.data;
  } catch (error) {
    console.log("Error updating center:", error);
    throw error;
  }
}
export async function deleteCenter(id) {
  try {
    console.log("id", id);
    const response = await axiosInstance.delete(`center/center/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error updating center:", error);
    throw error;
  }
}
