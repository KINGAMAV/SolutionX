import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Rediriger vers le dashboard
    navigate("/dashboard");
  }, [navigate]);

  return null;
}
