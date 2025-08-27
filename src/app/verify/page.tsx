"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function VerifyContent() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Verifying your application...");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMessage("Missing verification token.");
      setStatus("error");
      return;
    }

    const verifyUser = async () => {
      try {
        const res = await fetch(`/api/verify?token=${token}`);
        const data = await res.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message || "Your application completed successfully!");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyUser();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="p-8 rounded-xl shadow-lg backdrop-blur-md bg-white/10 text-center max-w-md">
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold mb-4">Verification in Progress</h1>
            <p>{message}</p>
          </>
        )}
        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-green-400">✅ Verified</h1>
            <p>{message}</p>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-red-400">❌ Verification Failed</h1>
            <p>{message}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="p-8 rounded-xl shadow-lg backdrop-blur-md bg-white/10 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>Please wait while we verify your application.</p>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
