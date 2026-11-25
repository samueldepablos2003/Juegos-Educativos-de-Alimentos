import React, { memo, useEffect, useRef, useState } from 'react';
import { FilterTab, FoodItem } from '../data/foods';
import { AnimatedFoodSticker } from './AnimatedFoodSticker';

interface FoodTrayProps {
  foods: FoodItem[];
  activeTab: FilterTab;
  selectedFood: FoodItem | null;
  placedIds: Set<string>;
  onSelectTab: (tab: FilterTab) => void;
  onFoodClick: (food: FoodItem) => void;
  onFoodDragStart: (food: FoodItem) => void;
}

const TABS: {
  id: FilterTab;
  label: string;
}[] = [
  { id: 'all', label: 'Todos' },
  { id: 'vegetables', label: 'Vegetales' },
  { id: 'fruits', label: 'Frutas' },
  { id: 'cereals', label: 'Cereales' },
  { id: 'protein', label: 'Proteínas' },
  { id: 'fats', label: 'Grasas' },
  { id: 'drinks', label: 'Bebidas' },
  { id: 'processed', label: 'Procesados' },
];

export const FoodTray: React.FC<FoodTrayProps> = memo(
  ({
    foods,
    activeTab,
    selectedFood,
    placedIds,
    onSelectTab,
    onFoodClick,
    onFoodDragStart,
  }) => {
    const [draggingFoodId, setDraggingFoodId] = useState<string | null>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const conveyorStateRef = useRef<{
      scrollPosFloat: number;
      maxScrollCached: number;
      direction: 1 | -1;
      pausedByPointer: boolean;
      pausedByDrag: boolean;
      pausedByWheel: boolean;
      wheelTimerId: number | null;
      lastTime: number;
    }>({
      scrollPosFloat: 0,
      maxScrollCached: 0,
      direction: 1,
      pausedByPointer: false,
      pausedByDrag: false,
      pausedByWheel: false,
      wheelTimerId: null,
      lastTime: 0,
    });

    // Reset scroll position and refresh cached maxScroll whenever category filter or item count changes
    useEffect(() => {
      const el = listRef.current;
      if (!el) return;
      const state = conveyorStateRef.current;
      if (state.wheelTimerId !== null) {
        window.clearTimeout(state.wheelTimerId);
        state.wheelTimerId = null;
      }
      el.style.scrollBehavior = 'auto';
      el.scrollTop = 0;
      state.scrollPosFloat = 0;
      state.direction = 1;
      state.pausedByWheel = false;
      state.maxScrollCached = Math.max(0, el.scrollHeight - el.clientHeight);
      state.lastTime = performance.now();
    }, [activeTab, foods.length]);

    // Continuous 60 FPS bidirectional conveyor-belt auto-scroll (zero per-frame layout reads)
    useEffect(() => {
      const el = listRef.current;
      if (!el) return;

      const SPEED_PX_PER_SEC = 42;
      const WHEEL_RESUME_DELAY_MS = 400;
      const state = conveyorStateRef.current;

      const updateBounds = () => {
        state.maxScrollCached = Math.max(0, el.scrollHeight - el.clientHeight);
        if (state.scrollPosFloat > state.maxScrollCached) {
          state.scrollPosFloat = state.maxScrollCached;
        }
      };

      el.style.scrollBehavior = 'auto';
      state.scrollPosFloat = el.scrollTop;
      updateBounds();
      state.lastTime = performance.now();

      const resizeObserver =
        typeof ResizeObserver !== 'undefined'
          ? new ResizeObserver(updateBounds)
          : null;
      resizeObserver?.observe(el);

      const syncFromDom = () => {
        updateBounds();
        state.scrollPosFloat = el.scrollTop;
        state.lastTime = performance.now();
      };

      const handlePointerDown = (e: PointerEvent) => {
        const target = e.target as Element | null;
        if (target?.closest('.food-option') || target === el) {
          state.pausedByPointer = true;
        }
      };

      const handlePointerRelease = () => {
        if (state.pausedByPointer) {
          state.pausedByPointer = false;
          syncFromDom();
        }
      };

      const handleDragStart = () => {
        state.pausedByDrag = true;
      };

      const handleDragEndOrDrop = () => {
        if (state.pausedByDrag || state.pausedByPointer) {
          state.pausedByDrag = false;
          state.pausedByPointer = false;
          syncFromDom();
        }
      };

      const handleWindowBlur = () => {
        if (state.pausedByPointer || state.pausedByDrag) {
          state.pausedByPointer = false;
          state.pausedByDrag = false;
          syncFromDom();
        }
      };

      const handleWheel = () => {
        state.pausedByWheel = true;
        if (state.wheelTimerId !== null) {
          window.clearTimeout(state.wheelTimerId);
        }
        state.wheelTimerId = window.setTimeout(() => {
          state.wheelTimerId = null;
          syncFromDom();
          state.pausedByWheel = false;
        }, WHEEL_RESUME_DELAY_MS);
      };

      el.addEventListener('pointerdown', handlePointerDown, { passive: true });
      el.addEventListener('dragstart', handleDragStart);
      el.addEventListener('wheel', handleWheel, { passive: true });
      window.addEventListener('pointerup', handlePointerRelease, { passive: true });
      window.addEventListener('pointercancel', handlePointerRelease, { passive: true });
      window.addEventListener('dragend', handleDragEndOrDrop);
      window.addEventListener('drop', handleDragEndOrDrop);
      window.addEventListener('blur', handleWindowBlur);

      let rafId = 0;
      const animate = (now: number) => {
        const dt = Math.min(Math.max((now - state.lastTime) / 1000, 0), 0.05);
        state.lastTime = now;

        const maxScroll = state.maxScrollCached;
        const isPaused =
          state.pausedByPointer || state.pausedByDrag || state.pausedByWheel;

        if (!isPaused && maxScroll > 1) {
          state.scrollPosFloat += SPEED_PX_PER_SEC * state.direction * dt;

          if (state.direction === 1 && state.scrollPosFloat >= maxScroll) {
            state.scrollPosFloat = maxScroll;
            state.direction = -1;
          } else if (state.direction === -1 && state.scrollPosFloat <= 0) {
            state.scrollPosFloat = 0;
            state.direction = 1;
          }

          el.scrollTop = state.scrollPosFloat;
        }

        rafId = window.requestAnimationFrame(animate);
      };

      rafId = window.requestAnimationFrame(animate);

      return () => {
        window.cancelAnimationFrame(rafId);
        resizeObserver?.disconnect();
        if (state.wheelTimerId !== null) {
          window.clearTimeout(state.wheelTimerId);
          state.wheelTimerId = null;
        }
        el.removeEventListener('pointerdown', handlePointerDown);
        el.removeEventListener('dragstart', handleDragStart);
        el.removeEventListener('wheel', handleWheel);
        window.removeEventListener('pointerup', handlePointerRelease);
        window.removeEventListener('pointercancel', handlePointerRelease);
        window.removeEventListener('dragend', handleDragEndOrDrop);
        window.removeEventListener('drop', handleDragEndOrDrop);
        window.removeEventListener('blur', handleWindowBlur);
      };
    }, []);

    return (
      <aside
        aria-label="Bandeja de alimentos"
        className="flex flex-col h-full bg-[#ffffff] border-l-[3px] border-[#1E1B2E] shadow-[-6px_0_0_rgba(30,27,46,0.06)] overflow-hidden"
      >
        {/* Tactile 3D Filter Tabs — Active pill in Morado Eléctrico (#8137ea) + #ffffff text */}
        <div
          role="tablist"
          aria-label="Categorías de alimentos"
          className="flex flex-wrap gap-1.5 p-2.5 xl:p-3 bg-[#FFFDF7] border-b-[3px] border-[#1E1B2E] shrink-0"
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`font-display px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer border-2 border-[#1E1B2E] shadow-[0_3px_0_#1E1B2E] active:translate-y-[2px] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#8137ea] ${
                  active
                    ? 'bg-[#8137ea] text-[#ffffff]'
                    : 'bg-[#ffffff] text-[#1E1B2E] hover:bg-[#fee330]/30'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Helper Instruction Strip */}
        <div className="px-3 py-1.5 bg-[#FFFDF7] border-b-2 border-[#1E1B2E]/15 text-[11px] xl:text-xs font-extrabold text-[#1E1B2E] shrink-0 flex items-center justify-between gap-2">
          <span className="truncate">
            {selectedFood
              ? `Elegido: ${selectedFood.name}`
              : 'Arrastra o toca un alimento'}
          </span>
          <span className="tabular-nums text-[11px] xl:text-xs font-black text-[#8137ea] shrink-0">
            {foods.length} opciones
          </span>
        </div>

        {/* Single-Column Vertical Food List (Continuous Bidirectional Conveyor Belt + Off-Screen Virtualization) */}
        <div
          ref={listRef}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden tray-scroll tray-vertical-carousel bg-[#ffffff] px-4 py-3 grid grid-cols-1 gap-y-4 content-start"
          data-testid="food-tray-grid"
        >
          {foods.map((food, index) => {
            const isSelected = selectedFood?.id === food.id;
            const isPlaced = placedIds.has(food.id);
            const isDragging = draggingFoodId === food.id;
            const NEGATIVE_STAGGER = [
              '0s',
              '-1.2s',
              '-2.5s',
              '-3.6s',
              '-0.7s',
              '-1.9s',
              '-3.1s',
            ];
            const staggerDelay = NEGATIVE_STAGGER[index % NEGATIVE_STAGGER.length];

            return (
              <button
                key={food.id}
                type="button"
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', food.id);
                  e.dataTransfer.effectAllowed = 'move';
                  setDraggingFoodId(food.id);
                  onFoodDragStart(food);
                }}
                onDragEnd={() => setDraggingFoodId(null)}
                onClick={() => onFoodClick(food)}
                aria-pressed={isSelected}
                aria-label={`${food.name}${isPlaced ? ' (en el plato)' : ''}`}
                data-testid={`food-card-${food.id}`}
                className={`food-option food-sticker-btn tray-item-virtual group relative w-full min-h-[250px] xl:min-h-[280px] flex flex-col items-center justify-center gap-3 py-4 px-3 bg-transparent border-none cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] rounded-3xl ${
                  isDragging ? 'arrastrando' : ''
                }`}
              >
                {/* Lightweight Radial Sunny Yellow Aura when Selected (Zero blur filter cost) */}
                {(isSelected || isDragging) && (
                  <span
                    className="pointer-events-none absolute top-4 w-48 h-48 xl:w-52 xl:h-52 rounded-full ring-2 ring-[#8137ea]"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(254,227,48,0.85) 0%, rgba(254,227,48,0.45) 55%, rgba(254,227,48,0) 76%)',
                    }}
                    aria-hidden="true"
                  />
                )}

                {/* Uniform Animated Food Sticker */}
                <AnimatedFoodSticker
                  foodId={food.id}
                  state={isDragging ? 'dragging' : 'idle'}
                  isSelected={isSelected}
                  isPaused={isDragging}
                  showPlacedBadge={isPlaced}
                  badgeClassName="-top-1 -right-2 w-7 h-7"
                  animationDelay={staggerDelay}
                  className="w-[168px] h-[168px] xl:w-[186px] xl:h-[186px] drop-shadow-[0_10px_12px_rgba(30,27,46,0.20)]"
                />

                {/* Clean, High-Contrast Large Food Name in #1E1B2E */}
                <span
                  className={`relative z-10 w-full text-center font-display text-lg xl:text-xl font-bold leading-tight pointer-events-none ${
                    isSelected ? 'text-[#8137ea]' : 'text-[#1E1B2E]'
                  }`}
                >
                  {food.name}
                </span>
              </button>
            );
          })}
        </div>
      </aside>
    );
  }
);

FoodTray.displayName = 'FoodTray';
