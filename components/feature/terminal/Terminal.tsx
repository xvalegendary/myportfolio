"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useLocale } from "@/src/context/LocaleContext";

interface Repo {
  id: number;
  name: string;
  html_url: string;
}

export default function Terminal() {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<string[]>([]);
  const { setTheme, resolvedTheme } = useTheme();
  const { t } = useLocale();

  const print = (text: string) => setLines((prev) => [...prev, text]);

  const fetchRepos = async () => {
    print(t("loadingRepos"));
    try {
      const res = await fetch("https://api.github.com/users/xyhomi3/repos");
      const data: Repo[] = await res.json();
      data.slice(0, 5).forEach((repo) => {
        print(`${repo.name}: ${repo.html_url}`);
      });
    } catch (err) {
      print("Failed to load repos");
    }
  };

  const handleCommand = async (cmd: string) => {
    switch (cmd.trim()) {
      case "1":
        print(t("aboutDescription"));
        break;
      case "2":
        await fetchRepos();
        break;
      case "3":
        print("VK: https://vk.com/");
        print("TG: https://t.me/");
        print("GH: https://github.com/xyhomi3");
        break;
      case "4":
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        toast.success(t("themeToggled"));
        break;
      default:
        toast.error(t("unknownCommand"));
    }
  };

  const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cmd = input;
      setLines((prev) => [...prev, `> ${cmd}`]);
      setInput("");
      await handleCommand(cmd);
    }
  };

  return (
    <div className="font-mono bg-black text-green-500 p-6 rounded-lg w-full max-w-2xl shadow-lg">
      <pre className="whitespace-pre-wrap">
        {t("terminalWelcome")}
        {"\n"}
        {t("terminalOptions")}
      </pre>
      {lines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
      <div className="flex items-center">
        <span className="mr-2">$</span>
        <input
          className="flex-1 bg-black text-green-500 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
        />
      </div>
    </div>
  );
}
