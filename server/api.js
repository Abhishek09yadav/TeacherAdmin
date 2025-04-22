export async function fetchCenters(){
  const response = await axiosInstance.get("/center/get-centers");
  return response.data;
  
}