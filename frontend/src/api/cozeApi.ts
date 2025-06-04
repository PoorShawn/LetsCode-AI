import { axiosRequest } from "../utils/request";

interface KnitResponse {
  message: string;
}

export const sendMessageToKnit = async (message: string): Promise<KnitResponse> => {
  try {
    const response = await axiosRequest<KnitResponse>('/api/knit', 'POST', { message });
    return response;
  } catch (error) {
    console.error('Error in sendMessageToKnit:', error);
    throw error;
  }
};