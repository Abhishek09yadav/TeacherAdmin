
import { axiosInstance } from "../lib/axios";

// subject
// export async function getAllSubjects() {
//   try {
//     const response = await axiosInstance.get("/subject/get-subjects");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching subjects:", error);
//     throw error;
//   }
// }

// Center related functions
export async function getAllCenters() {
  try {
    const response = await axiosInstance.get("center/centers");
    console.log("response method called: ", response);
    return response;
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
    console.log("response", response.data);
    
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

export async function getAllUsers(){
  try {
    const response = await axiosInstance.get("auth/users");
    console.log("response", response.data);
    
    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function updateUserCenter(object) {
 
  try {
    const response = await axiosInstance.put(`/auth/update-center`, object);
    // console.log({userId, centerName});
    return response.data;
  } catch (error) {
    console.log("Error updating User center:", error);
    throw error;
  }
}

// modules related functions
export async function getAllSubjects() {
  try {
    const response = await axiosInstance.get("/module/get-subjects");
    return response.data;
  } catch (error) {
    console.error("Error fetching Subjects:", error);
    throw error;
  }
}

export async function getAllClasses() {
  try {
    const response = await axiosInstance.get("/module/get-classess");
    return response.data;
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
}
export async function getAllCourses() {
  try {
    const response = await axiosInstance.get("/module/get-courses");
    return response.data;
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
}


export async function getAllTopics() {
  try {
    const response = await axiosInstance.get("/module/get-topics");
    return response.data;
  } catch (error) {
    console.error("Error fetching Topics:", error);
    throw error;
  }
}