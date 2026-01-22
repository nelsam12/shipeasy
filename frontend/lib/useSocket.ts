import { useEffect, useRef } from "react";
import { socketService } from "@/services/socket.service";
import Cookies from "js-cookie";

/**
 * Hook to manage socket connection
 */
export const useSocket = () => {
  const socketRef = useRef(socketService);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    
    if (token && !socketRef.current.isConnected()) {
      socketRef.current.connect(token);
    }

    return () => {
      // Don't disconnect on unmount - keep connection alive
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current.isConnected(),
  };
};
