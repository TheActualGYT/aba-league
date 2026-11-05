"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-neutral-900 p-8 rounded-lg shadow-lg w-full max-w-md border border-neutral-700">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">NCAA 10 League</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-neutral-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded focus:outline-none focus:border-neutral-400 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-neutral-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded focus:outline-none focus:border-neutral-400 text-white"
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-neutral-200 hover:bg-white text-black font-bold py-2 px-4 rounded transition"
          >
            Login
          </button>
        </form>
        <p className="text-xs text-neutral-400 mt-4 text-center">
          Default users: garrett, dad, uncle<br />Password: password123 (change immediately)
        </p>
      </div>
    </div>
  );
}