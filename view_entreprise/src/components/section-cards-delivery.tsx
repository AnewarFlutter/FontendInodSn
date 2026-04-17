'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Package, CheckCircle2, Wallet } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DeliveryPersonHeader } from "@/components/delivery-person-header"

export function SectionCards() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1); // Start at 1 (first real card)
  const totalCards = 3;
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Set initial scroll position to show first real card
    const cardWidth = 280 + 12;
    container.scrollLeft = cardWidth;

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const scrollLeft = container.scrollLeft;
      const cardWidth = 280 + 12;
      const scrollIndex = Math.round(scrollLeft / cardWidth);

      // Handle infinite scroll
      if (scrollIndex === 0) {
        // Scrolled to clone at start, jump to real last card
        isScrollingRef.current = true;
        container.scrollLeft = totalCards * cardWidth;
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 50);
        setActiveIndex(totalCards);
      } else if (scrollIndex === totalCards + 1) {
        // Scrolled to clone at end, jump to real first card
        isScrollingRef.current = true;
        container.scrollLeft = cardWidth;
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 50);
        setActiveIndex(1);
      } else {
        setActiveIndex(scrollIndex);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [totalCards]);

  const scrollToCard = (direction: 'prev' | 'next') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 280 + 12;
    const currentScroll = container.scrollLeft;
    const targetScroll = direction === 'prev'
      ? currentScroll - cardWidth
      : currentScroll + cardWidth;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <div className="space-y-6">
      {/* Delivery Person Header */}
      <div className="px-4 lg:px-6">
        <DeliveryPersonHeader />
      </div>

      {/* Statistics Cards */}
      <div className="px-4 lg:px-6">
        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden">
          {/* Navigation Buttons */}
          <div className="flex justify-end gap-2 mb-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scrollToCard('prev')}
              className="h-9 w-9 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={() => scrollToCard('next')}
              className="h-9 w-9 rounded-full bg-primary/90 hover:bg-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
          >
          {/* Clone of last card (for infinite scroll) */}
          <Card className="flex-shrink-0 w-[280px] snap-center relative">
            <CardHeader className="py-4 px-4">
              <div className="absolute top-3 right-3">
                <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Wallet className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold tabular-nums text-center text-primary mt-2">
                47 500
              </CardTitle>
              <CardDescription className="text-center text-sm mt-1">FCFA encaissés</CardDescription>
            </CardHeader>
          </Card>

          {/* Real cards */}
          <Card className="flex-shrink-0 w-[280px] snap-center relative">
            <CardHeader className="py-4 px-4">
              <div className="absolute top-3 right-3">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold tabular-nums text-center text-green-600 mt-2">
                0
              </CardTitle>
              <CardDescription className="text-center text-sm mt-1">{"Terminées aujourd'hui"}</CardDescription>
            </CardHeader>
          </Card>
          <Card className="flex-shrink-0 w-[280px] snap-center relative">
            <CardHeader className="py-4 px-4">
              <div className="absolute top-3 right-3">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold tabular-nums text-center mt-2">
                3
              </CardTitle>
              <CardDescription className="text-center text-sm mt-1">Missions en cours</CardDescription>
            </CardHeader>
          </Card>
          <Card className="flex-shrink-0 w-[280px] snap-center relative">
            <CardHeader className="py-4 px-4">
              <div className="absolute top-3 right-3">
                <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Wallet className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold tabular-nums text-center text-primary mt-2">
                47 500
              </CardTitle>
              <CardDescription className="text-center text-sm mt-1">FCFA encaissés</CardDescription>
            </CardHeader>
          </Card>

          {/* Clone of first card (for infinite scroll) */}
          <Card className="flex-shrink-0 w-[280px] snap-center relative">
            <CardHeader className="py-4 px-4">
              <div className="absolute top-3 right-3">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold tabular-nums text-center text-green-600 mt-2">
                0
              </CardTitle>
              <CardDescription className="text-center text-sm mt-1">{"Terminées aujourd'hui"}</CardDescription>
            </CardHeader>
          </Card>
          </div>

          {/* Scroll Indicators */}
          <div className="flex justify-center gap-1.5 mt-3">
            {Array.from({ length: totalCards }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  const container = scrollContainerRef.current;
                  if (container) {
                    const cardWidth = 280 + 12; // width + gap
                    container.scrollTo({
                      left: (index + 1) * cardWidth, // +1 to account for clone at start
                      behavior: 'smooth',
                    });
                  }
                }}
                className={`h-1.5 rounded-full transition-all ${
                  index + 1 === activeIndex
                    ? 'w-6 bg-primary'
                    : 'w-1.5 bg-muted-foreground/30'
                }`}
                aria-label={`Aller à la carte ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid grid-cols-3 gap-4">
          <Card className="@container/card relative">
            <CardHeader>
              <div className="absolute top-4 right-4">
                <div className="p-2.5 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-4xl font-bold tabular-nums text-center @[250px]/card:text-5xl text-green-600 mt-2">
                0
              </CardTitle>
              <CardDescription className="text-center text-base mt-2">{"Terminées aujourd'hui"}</CardDescription>
            </CardHeader>
          </Card>
          <Card className="@container/card relative">
            <CardHeader>
              <div className="absolute top-4 right-4">
                <div className="p-2.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <CardTitle className="text-4xl font-bold tabular-nums text-center @[250px]/card:text-5xl mt-2">
                3
              </CardTitle>
              <CardDescription className="text-center text-base mt-2">Missions en cours</CardDescription>
            </CardHeader>
          </Card>
          <Card className="@container/card relative">
            <CardHeader>
              <div className="absolute top-4 right-4">
                <div className="p-2.5 rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Wallet className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <CardTitle className="text-4xl font-bold tabular-nums text-center @[250px]/card:text-5xl text-primary mt-2">
                47 500
              </CardTitle>
              <CardDescription className="text-center text-base mt-2">FCFA encaissés</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
