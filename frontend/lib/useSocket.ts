import { useEffect, useState } from "react";
import { socketService } from "@/services/socket.service";

/**
 * Hook to manage socket connection
 * Uses js-cookie library for reliable cookie access
 */
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Get token from cookie - try both naming conventions
    const token = typeof window !== 'undefined' 
      ? (document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1] ||
         document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1])
      : undefined;
    
    if (token && !socketService.isConnected()) {
      socketService.connect(token);
      setIsConnected(true);
    } else if (socketService.isConnected()) {
      setIsConnected(true);
    }

    return () => {
      // Don't disconnect on unmount - keep connection alive
    };
  }, []);

  return {
    socket: socketService,
    isConnected,
  };
};
