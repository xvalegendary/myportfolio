"use client";
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/src/context/LocaleContext';

export default function Page() {
  const { t } = useLocale();
  return (
    <div className="container flex flex-col items-center gap-6 py-24 animate-fadeIn">
      <h1 className="text-5xl font-bold animate-glow">{t('aboutGreeting')}</h1>
      <p className="text-center max-w-md">
        {t('aboutDescription')}
      </p>
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="https://vk.com/" target="_blank">
            <Image src="/vk.svg" alt="VK" width={20} height={20} />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="https://t.me/" target="_blank">
            <Image src="/telegram.svg" alt="Telegram" width={20} height={20} />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="https://github.com/xyhomi3" target="_blank">
            <Github className="w-5 h-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
