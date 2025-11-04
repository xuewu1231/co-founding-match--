import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          奇绩引力场
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          为创业者提供联合创始人配对平台<br />
          通过双向匹配，找到志同道合的合伙人
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              开始注册
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-lg px-8">
              立即登录
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
