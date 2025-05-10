'use client';

import { useLogin } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useLogin({
    onComplete: () => router.push("/"),
  });

  return (
    <main className="flex min-h-screen min-w-full">
      <div className="flex bg-gradient-to-br from-slate-900 to-slate-800 flex-1 p-6 justify-center items-center">
        <div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-8">Challenge Platform</h1>
          </div>
          <div className="mt-6 flex justify-center text-center">
            <button
              className="bg-blue-500 hover:bg-blue-600 py-3 px-6 text-white rounded-lg text-lg font-semibold"
              onClick={login}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}