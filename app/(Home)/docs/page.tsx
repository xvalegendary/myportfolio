"use client";
import React from 'react'
import { useLocale } from '@/src/context/LocaleContext';

function Page() {
  const { t } = useLocale();
  return (
    <div className="flex items-center justify-center h-screen animate-fadeIn">
      {t('docsTitle')}
    </div>
  )
}

export default Page
