"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale } from '@/src/context/LocaleContext';

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
}

export default function Page() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const { t } = useLocale();

  useEffect(() => {
    fetch('https://api.github.com/users/xyhomi3/repos')
      .then((res) => res.json())
      .then((data) => Array.isArray(data) ? setRepos(data) : [])
      .catch(console.error);
  }, []);
  return (
    <div className="container py-24 animate-fadeIn">
      <h1 className="text-4xl font-bold text-center mb-8 animate-glow">{t('projectsTitle')}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {repos.map(repo => (
          <Card key={repo.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{repo.name}</CardTitle>
              {repo.description && <CardDescription>{repo.description}</CardDescription>}
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild>
                <Link href={repo.html_url} target="_blank">
                  {t('viewOnGitHub')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
