import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../../api/auth";
import Spinner from "../../components/ui/Spinner";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      googleLogin(token).then(() => navigate("/dashboard"));
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  );
};

export default GoogleCallback;
