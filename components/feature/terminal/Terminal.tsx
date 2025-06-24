"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useLocale, Locale } from "@/src/context/LocaleContext";

interface Repo {
  id: number;
  name: string;
  html_url: string;
}

export default function Terminal() {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<string[]>([]);
  const [textColor, setTextColor] = useState("green");
  const [awaitColor, setAwaitColor] = useState(false);
  const [awaitLang, setAwaitLang] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const { t, setLocale } = useLocale();

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
    if (awaitColor) {
      setTextColor(cmd);
      setAwaitColor(false);
      print(t("commandCompleted"));
      return;
    }

    if (awaitLang) {
      if (cmd === "en" || cmd === "ru") {
        setLocale(cmd as Locale);
        print(t("commandCompleted"));
      } else {
        toast.error(t("unknownCommand"));
      }
      setAwaitLang(false);
      return;
    }

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
      case "5":
        print(t("enterColor"));
        setAwaitColor(true);
        return;
      case "6":
        print(t("enterLanguage"));
        setAwaitLang(true);
        return;
      case "7":
        setLines([]);
        break;
      default:
        toast.error(t("unknownCommand"));
        return;
    }

    print(t("commandCompleted"));
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
    <div
      className="font-mono bg-black p-6 rounded-lg w-full max-w-2xl shadow-lg"
      style={{ color: textColor }}
    >
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
          className="flex-1 bg-black outline-none"
          style={{ color: textColor }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
        />
      </div>
    </div>
  );
}
