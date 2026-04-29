import { ReactNode, useEffect } from 'react';
import MarketingHeader from './MarketingHeader';
import MarketingFooter from './MarketingFooter';
import ScrollToTopButton from '@/components/ScrollToTopButton';

interface Props {
  children: ReactNode;
  title?: string;
  description?: string;
}

const MarketingLayout = ({ children, title, description }: Props) => {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }
  }, [title, description]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
      <ScrollToTopButton />
    </div>
  );
};

export default MarketingLayout;