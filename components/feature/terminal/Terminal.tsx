"use client";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useLocale, Locale } from "@/src/context/LocaleContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiSun, FiMoon, FiX, FiExternalLink } from "react-icons/fi";
import { Variants } from 'framer-motion';

interface Repo {
  id: number;
  name: string;
  html_url: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  direction: number;
}

export default function Terminal() {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<{content: string, isLink?: boolean}[]>([]);
  const [textColor, setTextColor] = useState("#4ade80");
  const [awaitColor, setAwaitColor] = useState(false);
  const [awaitLang, setAwaitLang] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t, locale, setLocale } = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const [typingIndex, setTypingIndex] = useState(0);
  const [welcomeText, setWelcomeText] = useState("");
  
  


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
   
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      
     
      if (particlesRef.current.length === 0) {
        particlesRef.current = Array.from({ length: 100 }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.5 + 0.3,
          direction: Math.random() * Math.PI * 2,
        }));
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      if (!ctx) return;
      

      ctx.fillStyle = resolvedTheme === 'dark' 
        ? 'rgba(10, 10, 15, 0.15)' 
        : 'rgba(240, 240, 245, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      particlesRef.current.forEach(particle => {
      
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;
        
     
        particle.opacity += (Math.random() - 0.5) * 0.02;
        if (particle.opacity < 0.2) particle.opacity = 0.2;
        if (particle.opacity > 0.8) particle.opacity = 0.8;
        
       
        if (particle.x < 0 || particle.x > canvas.width || particle.y < 0 || particle.y > canvas.height) {
          particle.x = centerX + (Math.random() - 0.5) * 50;
          particle.y = centerY + (Math.random() - 0.5) * 50;
          particle.direction = Math.random() * Math.PI * 2;
        }
        
  
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = resolvedTheme === 'dark'
          ? `rgba(200, 255, 210, ${particle.opacity})`
          : `rgba(30, 100, 50, ${particle.opacity})`;
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [resolvedTheme]);


  useEffect(() => {
    const welcomeMessage = `${t("terminalWelcome")}\n${t("terminalOptions")}`;
    
    if (typingIndex < welcomeMessage.length) {
      const timer = setTimeout(() => {
        setWelcomeText(welcomeMessage.substring(0, typingIndex + 1));
        setTypingIndex(typingIndex + 1);
      }, 30);
      
      return () => clearTimeout(timer);
    }
  }, [typingIndex, t]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const print = (text: string, isLink: boolean = false) => {
    setLines((prev) => [...prev, { content: text, isLink }]);
  };

  const fetchRepos = async () => {
    print(t("loadingRepos"));
    try {
      const res = await fetch("https://api.github.com/users/xvalegendary/repos"); // @return void repo[]
      const data: Repo[] = await res.json();
      data.slice(0, 5).forEach((repo) => {
        print(`${repo.name}: ${repo.html_url}`, true);
        print(`stalkerium-recode (coming soon)`);
        print(`aesterial-dashboard (in development)`);
      });
    } catch (err) {
      print("Failed to load repos");
    }
  };

  const handleCommand = async (cmd: string) => {
    if (awaitColor) {

      const validColors = [
        'red', 'orange', 'amber', 'yellow', 'lime', 'green', 
        'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo',
        'violet', 'purple', 'fuchsia', 'pink', 'rose'
      ];
      
      if (validColors.includes(cmd.toLowerCase())) {
        setTextColor(
          getComputedStyle(document.documentElement)
            .getPropertyValue(`--${cmd}-400`)
            .trim() || `#${cmd}`
        );
        print(t("commandCompleted"));
      } else {
        toast.error(t("unknownCommand"));
      }
      setAwaitColor(false);
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
        print("vk: https://vk.com/xvalegendary", true);
        print("TG: https://t.me/@awptop1butimnotavitma", true);
        print("GH: https://github.com/xvalegendary", true);
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
      case "8":
        print("golang, typescript, javascript, python, nextjs, react. want to learn a rust for cybersecurity");
        break;
      default:
        toast.error(t("unknownCommand"));
        return;
    }
  };

  const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cmd = input;
      setLines((prev) => [...prev, { content: `> ${cmd}` }]);
      setInput("");
      await handleCommand(cmd);
    }
  };

  const terminalVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  const lineVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="relative w-full max-w-2xl h-[600px]">
     
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full rounded-xl -z-10"
      />
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={terminalVariants}
        className="relative overflow-hidden h-full"
      >
        <div 
          className={`font-mono backdrop-blur-sm p-6 rounded-xl w-full h-full flex flex-col shadow-2xl ${resolvedTheme === 'dark' ? 'bg-black/80 border border-gray-800' : 'bg-gray-100/90 border border-gray-300'}`}
          style={{ color: textColor }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="flex-1 text-center text-gray-400 text-sm">
              root@xvalegendary:~$
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-gray-800 px-2 py-1 rounded">{locale}</span>
              <button 
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="p-1 rounded-full hover:bg-gray-700"
              >
                {resolvedTheme === 'dark' ? <FiSun /> : <FiMoon />}
              </button>
            </div>
          </div>

          <pre className="whitespace-pre-wrap mb-3">
            {welcomeText}
            {typingIndex < (t("terminalWelcome").length + t("terminalOptions").length + 1) && (
              <span className="animate-pulse">█</span>
            )}
          </pre>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent mb-3">
            <AnimatePresence>
              {lines.map((line, i) => (
                <motion.div
                  key={i}
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  className="mb-1"
                >
                  {line.isLink ? (
                    <a 
                      href={line.content.split(': ')[1]} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline flex items-center"
                    >
                      <FiExternalLink className="mr-1" />
                      {line.content}
                    </a>
                  ) : (
                    line.content
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          <div className="flex items-center mt-auto">
            <span className="mr-2 text-green-400 animate-pulse">$</span>
            <input
              ref={inputRef}
              className="flex-1 bg-transparent outline-none placeholder-gray-600"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={awaitColor ? t("enterColor") : awaitLang ? t("enterLanguage") : "type command..."}
              autoFocus
              style={{ color: textColor }}
            />
          </div>
          
        
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div>commands: {lines.length}</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <motion.a
                href="https://github.com/xvalegendary"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-all group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiGithub className="group-hover:text-green-400 transition-colors" />
                <span>GitHub</span>
              </motion.a>
              
              <motion.button
                onClick={() => setLines([])}
                className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-all group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiX className="group-hover:text-red-400 transition-colors" />
                <span>{t("clearScreen")}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
      
     
      <div className="absolute -top-10 -left-10 w-20 h-20 bg-green-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" />
    </div>
  );
}