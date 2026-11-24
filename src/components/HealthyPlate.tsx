import React, { memo, useEffect, useRef, useState } from 'react';
import { FoodItem, PlateState, SectorId } from '../data/foods';
import { getEnergyItems, getProteinItems, isRainbowPlate } from '../game/rules';
import {
  BASE_PLATE_Z_INDEX,
  computeMovedSectorLocal,
  detectRadialGripZone,
  DRAG_THRESHOLD_PX,
  DropPointContext,
  PlatedTransform,
  PlateFoodSector,
  sectorLocalToBowl,
  STANDARD_FOOD_SCALE,
} from '../game/platingPhysics';
import { AnimatedFoodSticker } from './AnimatedFoodSticker';
import { ProcessedFoodImage } from './ProcessedFoodImage';
import { HYDRATION_GLASS_SRC } from '../utils/imagePreloader';

const ROTATE_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cpath d='M14 5a9 9 0 1 1-6.36 2.64' fill='none' stroke='%23ffffff' stroke-width='4.5' stroke-linecap='round'/%3E%3Cpath d='M5 4v6h6' fill='none' stroke='%23ffffff' stroke-width='4.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M14 5a9 9 0 1 1-6.36 2.64' fill='none' stroke='%231E1B2E' stroke-width='2.4' stroke-linecap='round'/%3E%3Cpath d='M5 4v6h6' fill='none' stroke='%231E1B2E' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 14 14, alias`;

interface HealthyPlateProps {
  plate: PlateState;
  placements: Record<PlateFoodSector, PlatedTransform[]>;
  selectedFood: FoodItem | null;
  wiggleSector: SectorId | 'all' | null;
  lastPlacedId: string | null;
  lastPlacedInstanceId: string | null;
  onDropFood: (foodId: string, sector: SectorId, dropContext?: DropPointContext) => void;
  onSectorClick: (sector: SectorId, dropContext?: DropPointContext) => void;
  onRemoveFood: (sector: SectorId, itemIndex?: number) => void;
  onBringFoodToFront: (sector: PlateFoodSector, instanceId: string) => void;
  onMoveFood: (
    sector: PlateFoodSector,
    instanceId: string,
    localX: number,
    localY: number
  ) => void;
  onWheelResizeFood: (
    sector: PlateFoodSector,
    instanceId: string,
    deltaY: number
  ) => void;
  onRotateFood: (
    sector: PlateFoodSector,
    instanceId: string,
    rotation: number
  ) => void;
  onArrangePlate: () => void;
}

const BURST_DIRS = [
  { tx: '-36px', ty: '-34px' },
  { tx: '38px', ty: '-30px' },
  { tx: '-40px', ty: '24px' },
  { tx: '34px', ty: '30px' },
  { tx: '0px', ty: '-44px' },
  { tx: '44px', ty: '0px' },
];

const BurstParticles: React.FC<{ color: string }> = memo(({ color }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 740);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-30">
      {BURST_DIRS.map((d, idx) => (
        <svg
          key={idx}
          viewBox="0 0 24 24"
          className="w-6 h-6 absolute animate-star-burst pointer-events-none"
          style={
            {
              '--tx': d.tx,
              '--ty': d.ty,
            } as React.CSSProperties
          }
        >
          <path
            d="M12 2 L14.8 9 L22 9.5 L16.4 14.2 L18.2 21.5 L12 17.4 L5.8 21.5 L7.6 14.2 L2 9.5 L9.2 9 Z"
            fill={idx % 2 === 0 ? '#fee330' : color}
            stroke="#1E1B2E"
            strokeWidth="1.8"
          />
        </svg>
      ))}
    </div>
  );
});

BurstParticles.displayName = 'BurstParticles';

interface PlatedFoodItemProps {
  item: FoodItem;
  idx: number;
  placement: PlatedTransform;
  sector: PlateFoodSector;
  baseFallbackPx: number;
  finalScale: number;
  isJustPlaced: boolean;
  disabledInteraction: boolean;
  bowlRef: React.RefObject<HTMLDivElement | null>;
  onBringToFront: (sector: PlateFoodSector, instanceId: string) => void;
  onMoveFood: (
    sector: PlateFoodSector,
    instanceId: string,
    localX: number,
    localY: number
  ) => void;
  onWheelResizeFood: (
    sector: PlateFoodSector,
    instanceId: string,
    deltaY: number
  ) => void;
  onRotateFood: (
    sector: PlateFoodSector,
    instanceId: string,
    rotation: number
  ) => void;
  onRemoveFood: (sector: PlateFoodSector, itemIndex: number) => void;
  onItemInteractionEnd: () => void;
}

type PointerSession =
  | {
      mode: 'drag';
      pointerId: number;
      startClientX: number;
      startClientY: number;
      startBowlX: number;
      startBowlY: number;
      bowlWidth: number;
      bowlHeight: number;
      latestLocalX: number;
      latestLocalY: number;
      hasExceededThreshold: boolean;
    }
  | {
      mode: 'rotate';
      pointerId: number;
      startClientX: number;
      startClientY: number;
      centerX: number;
      centerY: number;
      startAngle: number;
      latestRotation: number;
      hasExceededThreshold: boolean;
    };

const PlatedFoodItem: React.FC<PlatedFoodItemProps> = memo(
  ({
    item,
    idx,
    placement,
    sector,
    baseFallbackPx,
    finalScale,
    isJustPlaced,
    disabledInteraction,
    bowlRef,
    onBringToFront,
    onMoveFood,
    onWheelResizeFood,
    onRotateFood,
    onRemoveFood,
    onItemInteractionEnd,
  }) => {
    const outerRef = useRef<HTMLDivElement>(null);
    const itemRef = useRef<HTMLDivElement>(null);
    const sessionRef = useRef<PointerSession | null>(null);
    const hoverRectRef = useRef<DOMRect | null>(null);
    const moveRafRef = useRef<number>(0);
    const pendingMoveCoordsRef = useRef<{ x: number; y: number } | null>(null);
    const wheelRafRef = useRef<number>(0);
    const pendingWheelDeltaRef = useRef<number>(0);
    const hoverZoneRef = useRef<'center' | 'edge'>('center');
    const lastPointerUpTimeRef = useRef<number>(0);
    const [isPressed, setIsPressed] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isRotating, setIsRotating] = useState(false);
    const [hoverZone, setHoverZone] = useState<'center' | 'edge'>('center');

    // Invalidate cached hover bounding rect whenever scale changes via wheel or auto-arrange
    useEffect(() => {
      hoverRectRef.current = null;
    }, [finalScale]);

    // Clean up any pending rAF callbacks on unmount
    useEffect(() => {
      return () => {
        if (moveRafRef.current) window.cancelAnimationFrame(moveRafRef.current);
        if (wheelRafRef.current) window.cancelAnimationFrame(wheelRafRef.current);
      };
    }, []);

    // Keep body cursor synced while actively dragging or rotating even if pointer leaves bounds
    useEffect(() => {
      if (!isPressed && !isRotating && !isDragging) return;
      const prevCursor = document.body.style.cursor;
      document.body.style.cursor = isRotating ? ROTATE_CURSOR : 'grabbing';
      return () => {
        document.body.style.cursor = prevCursor;
      };
    }, [isPressed, isRotating, isDragging]);

    // Attach non-passive wheel listener coalesced to 1 update per rAF frame
    useEffect(() => {
      const el = itemRef.current;
      if (!el) return;

      const handleWheel = (e: WheelEvent) => {
        if (disabledInteraction) return;
        e.preventDefault();
        e.stopPropagation();
        pendingWheelDeltaRef.current += e.deltaY;
        if (!wheelRafRef.current) {
          wheelRafRef.current = window.requestAnimationFrame(() => {
            wheelRafRef.current = 0;
            const accumulated = pendingWheelDeltaRef.current;
            pendingWheelDeltaRef.current = 0;
            if (accumulated !== 0) {
              onWheelResizeFood(sector, placement.instanceId, accumulated);
            }
          });
        }
      };

      el.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        el.removeEventListener('wheel', handleWheel);
        if (wheelRafRef.current) {
          window.cancelAnimationFrame(wheelRafRef.current);
          wheelRafRef.current = 0;
        }
      };
    }, [disabledInteraction, onWheelResizeFood, placement.instanceId, sector]);

    const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!disabledInteraction && !sessionRef.current) {
        hoverRectRef.current = e.currentTarget.getBoundingClientRect();
      }
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabledInteraction) return;
      if (e.pointerType === 'mouse' && e.button !== 0 && e.button !== 2) return;

      e.preventDefault();
      e.stopPropagation();
      onBringToFront(sector, placement.instanceId);

      const rect = e.currentTarget.getBoundingClientRect();
      hoverRectRef.current = rect;
      const { zone, centerX, centerY } = detectRadialGripZone(
        rect,
        e.clientX,
        e.clientY
      );

      const shouldRotate =
        zone === 'rotate' || (e.pointerType === 'mouse' && e.button === 2);

      if (shouldRotate) {
        const startAngle =
          Math.atan2(e.clientY - centerY, e.clientX - centerX) *
            (180 / Math.PI) -
          placement.rotation;

        sessionRef.current = {
          mode: 'rotate',
          pointerId: e.pointerId,
          startClientX: e.clientX,
          startClientY: e.clientY,
          centerX,
          centerY,
          startAngle,
          latestRotation: placement.rotation,
          hasExceededThreshold: false,
        };
        hoverZoneRef.current = 'edge';
        setHoverZone('edge');
        setIsPressed(true);
      } else {
        const bowlRect = bowlRef.current?.getBoundingClientRect();
        const { bowlX, bowlY } = sectorLocalToBowl(
          sector,
          placement.localX,
          placement.localY
        );

        sessionRef.current = {
          mode: 'drag',
          pointerId: e.pointerId,
          startClientX: e.clientX,
          startClientY: e.clientY,
          startBowlX: bowlX,
          startBowlY: bowlY,
          bowlWidth: bowlRect?.width ?? 0,
          bowlHeight: bowlRect?.height ?? 0,
          latestLocalX: placement.localX,
          latestLocalY: placement.localY,
          hasExceededThreshold: false,
        };
        hoverZoneRef.current = 'center';
        setHoverZone('center');
        setIsPressed(true);
      }

      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignore synthetic events without active pointerId
      }
    };

    const flushPointerFrame = () => {
      moveRafRef.current = 0;
      const coords = pendingMoveCoordsRef.current;
      if (!coords) return;
      pendingMoveCoordsRef.current = null;

      const session = sessionRef.current;
      if (!session) {
        const rect = hoverRectRef.current ?? itemRef.current?.getBoundingClientRect();
        if (!rect) return;
        const { zone } = detectRadialGripZone(rect, coords.x, coords.y);
        const nextHoverZone = zone === 'rotate' ? 'edge' : 'center';
        if (hoverZoneRef.current !== nextHoverZone) {
          hoverZoneRef.current = nextHoverZone;
          setHoverZone(nextHoverZone);
        }
        return;
      }

      const deltaClientX = coords.x - session.startClientX;
      const deltaClientY = coords.y - session.startClientY;

      if (!session.hasExceededThreshold) {
        if (Math.hypot(deltaClientX, deltaClientY) <= DRAG_THRESHOLD_PX) {
          return;
        }
        session.hasExceededThreshold = true;
        if (session.mode === 'rotate') {
          setIsRotating(true);
        } else {
          setIsDragging(true);
        }
      }

      if (session.mode === 'rotate') {
        const rawRotation =
          Math.atan2(coords.y - session.centerY, coords.x - session.centerX) *
            (180 / Math.PI) -
          session.startAngle;
        const normalizedRotation =
          Math.round((((rawRotation % 360) + 360) % 360) * 10) / 10;
        session.latestRotation = normalizedRotation;
        if (itemRef.current) {
          itemRef.current.style.transform = `translate3d(-50%, -50%, 0) rotate(${normalizedRotation}deg)`;
        }
        return;
      }

      if (session.bowlWidth <= 0 || session.bowlHeight <= 0) return;

      const { localX, localY } = computeMovedSectorLocal({
        sector,
        startBowlX: session.startBowlX,
        startBowlY: session.startBowlY,
        deltaClientX,
        deltaClientY,
        bowlWidth: session.bowlWidth,
        bowlHeight: session.bowlHeight,
      });
      session.latestLocalX = localX;
      session.latestLocalY = localY;
      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${localX}%, ${localY}%, 0)`;
      }
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabledInteraction) return;
      const session = sessionRef.current;
      if (session && session.pointerId !== e.pointerId) return;

      pendingMoveCoordsRef.current = { x: e.clientX, y: e.clientY };
      if (!moveRafRef.current) {
        moveRafRef.current = window.requestAnimationFrame(flushPointerFrame);
      }
    };

    const endPointerSession = (
      e: React.PointerEvent<HTMLDivElement>,
      cancelled: boolean
    ) => {
      const session = sessionRef.current;
      if (!session || session.pointerId !== e.pointerId) return;

      e.stopPropagation();
      if (moveRafRef.current) {
        window.cancelAnimationFrame(moveRafRef.current);
        moveRafRef.current = 0;
      }
      pendingMoveCoordsRef.current = null;

      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignore synthetic events
      }

      const distMoved = Math.hypot(
        e.clientX - session.startClientX,
        e.clientY - session.startClientY
      );
      const wasQuickClick =
        !session.hasExceededThreshold && distMoved <= DRAG_THRESHOLD_PX;

      // Commit final GPU transform coordinates to React state once on gesture end
      if (session.hasExceededThreshold) {
        if (session.mode === 'rotate') {
          onRotateFood(sector, placement.instanceId, session.latestRotation);
        } else {
          onMoveFood(
            sector,
            placement.instanceId,
            session.latestLocalX,
            session.latestLocalY
          );
        }
      }

      sessionRef.current = null;
      hoverRectRef.current = null;
      setIsDragging(false);
      setIsRotating(false);
      setIsPressed(false);
      lastPointerUpTimeRef.current = performance.now();
      onItemInteractionEnd();

      if (!cancelled && wasQuickClick) {
        onRemoveFood(sector, idx);
      }
    };

    const isInteracting = isDragging || isRotating || isPressed;

    const resolvedCursor = disabledInteraction
      ? 'default'
      : isRotating
        ? ROTATE_CURSOR
        : isDragging || isPressed
          ? 'grabbing'
          : hoverZone === 'edge'
            ? ROTATE_CURSOR
            : 'grab';

    return (
      <div
        ref={outerRef}
        style={{
          zIndex: placement.zIndex,
          transform: `translate3d(${placement.localX}%, ${placement.localY}%, 0)`,
        }}
        className={`pointer-events-none absolute inset-0 ${
          isInteracting ? 'transition-none gpu-active-layer' : 'plated-food-elastic'
        }`}
      >
        <div
          ref={itemRef}
          data-testid={`plated-item-${item.id}`}
          data-instance-id={placement.instanceId}
          onPointerEnter={handlePointerEnter}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={(e) => endPointerSession(e, false)}
          onPointerCancel={(e) => endPointerSession(e, true)}
          onPointerLeave={() => {
            if (!sessionRef.current) {
              hoverRectRef.current = null;
              if (hoverZoneRef.current !== 'center') {
                hoverZoneRef.current = 'center';
                setHoverZone('center');
              }
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (disabledInteraction) return;
            if (performance.now() - lastPointerUpTimeRef.current < 150) return;
            onRemoveFood(sector, idx);
          }}
          onDragStart={(e) => e.preventDefault()}
          title={
            disabledInteraction
              ? undefined
              : `${item.name} · Arrastra del centro, gira desde el borde, rueda para tamaño o clic rápido para quitar`
          }
          style={{
            transform: `translate3d(-50%, -50%, 0) rotate(${placement.rotation}deg)`,
            filter: 'drop-shadow(0 6px 8px rgba(30, 27, 46, 0.32))',
            touchAction: 'none',
            cursor: resolvedCursor,
          }}
          className={`group absolute left-0 top-0 select-none ${
            disabledInteraction
              ? 'pointer-events-none'
              : isInteracting
                ? 'pointer-events-auto transition-none gpu-active-layer plated-food-active'
                : 'pointer-events-auto plated-food-elastic'
          }`}
        >
          {isJustPlaced && <BurstParticles color={item.accentHex} />}
          <div className="relative pointer-events-none">
            <AnimatedFoodSticker
              foodId={item.id}
              className={isInteracting ? 'transition-none' : 'plated-food-size-elastic'}
              artStyle={{
                width: `calc(var(--plated-base, ${baseFallbackPx}px) * ${finalScale})`,
                height: `calc(var(--plated-base, ${baseFallbackPx}px) * ${finalScale})`,
              }}
              state={isDragging ? 'dragging' : isJustPlaced ? 'placed' : 'idle'}
              isPaused={isInteracting}
              showPlacedBadge={false}
              animationDelay={['0s', '-1.2s', '-2.5s', '-3.5s', '-0.7s'][idx % 5]}
            />
          </div>
        </div>
      </div>
    );
  }
);

PlatedFoodItem.displayName = 'PlatedFoodItem';

export const HealthyPlate: React.FC<HealthyPlateProps> = memo(({
  plate,
  placements,
  selectedFood,
  wiggleSector,
  lastPlacedId,
  lastPlacedInstanceId,
  onDropFood,
  onSectorClick,
  onRemoveFood,
  onBringFoodToFront,
  onMoveFood,
  onWheelResizeFood,
  onRotateFood,
  onArrangePlate,
}) => {
  const [dragOverSector, setDragOverSector] = useState<SectorId | null>(null);
  const bowlRef = useRef<HTMLDivElement>(null);
  const lastFoodInteractionRef = useRef<number>(0);
  const rainbowActive = isRainbowPlate(plate.shield);
  const proteinItems = getProteinItems(plate);
  const energyItems = getEnergyItems(plate);

  const markFoodInteractionEnded = () => {
    lastFoodInteractionRef.current = performance.now();
  };

  const buildDropContext = (clientX: number, clientY: number): DropPointContext => {
    const rect = bowlRef.current?.getBoundingClientRect();
    return {
      clientX,
      clientY,
      bowlRect: rect
        ? {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          }
        : undefined,
    };
  };

  const handleDragOver = (e: React.DragEvent, sector: SectorId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverSector !== sector) {
      setDragOverSector(sector);
    }
  };

  const handleDragLeave = (sector: SectorId) => {
    if (dragOverSector === sector) {
      setDragOverSector(null);
    }
  };

  const handleDrop = (e: React.DragEvent, sector: SectorId) => {
    e.preventDefault();
    setDragOverSector(null);
    const foodId = e.dataTransfer.getData('text/plain');
    if (foodId) {
      onDropFood(foodId, sector, buildDropContext(e.clientX, e.clientY));
    }
  };

  const handleSectorActivate = (
    e: React.MouseEvent<HTMLElement>,
    sector: PlateFoodSector
  ) => {
    if (performance.now() - lastFoodInteractionRef.current < 150) {
      return;
    }
    onSectorClick(sector, buildDropContext(e.clientX, e.clientY));
  };

  const isTargetHighlighted = (sector: SectorId) =>
    dragOverSector === sector ||
    (selectedFood !== null &&
      (selectedFood.targetSector === sector || selectedFood.category === 'distractor'));

  const shieldActive = isTargetHighlighted('shield');
  const proteinActive = isTargetHighlighted('protein');
  const energyActive = isTargetHighlighted('energy');
  const hydrationActive = isTargetHighlighted('hydration');
  const isHydrated = plate.hydration !== null;

  const renderPlatedSectorItems = (
    sector: PlateFoodSector,
    items: FoodItem[],
    baseFallbackPx: number
  ) => {
    const sectorPlacements = placements[sector];

    return items.map((item, idx) => {
      const placement = sectorPlacements[idx] ?? {
        instanceId: `${sector}-${item.id}-${idx}`,
        foodId: item.id,
        sector,
        localX: sector === 'shield' ? 52 : 48,
        localY: 50,
        zIndex: BASE_PLATE_Z_INDEX + idx,
        rotation: ((idx % 5) - 2) * 5,
        scale: STANDARD_FOOD_SCALE,
      };
      const finalScale = Math.round(placement.scale * 1000) / 1000;
      const isJustPlaced =
        lastPlacedInstanceId !== null
          ? placement.instanceId === lastPlacedInstanceId
          : lastPlacedId === item.id && idx === items.length - 1;

      return (
        <PlatedFoodItem
          key={placement.instanceId}
          item={item}
          idx={idx}
          placement={placement}
          sector={sector}
          baseFallbackPx={baseFallbackPx}
          finalScale={finalScale}
          isJustPlaced={isJustPlaced}
          disabledInteraction={selectedFood !== null}
          bowlRef={bowlRef}
          onBringToFront={onBringFoodToFront}
          onMoveFood={onMoveFood}
          onWheelResizeFood={onWheelResizeFood}
          onRotateFood={onRotateFood}
          onRemoveFood={onRemoveFood}
          onItemInteractionEnd={markFoodInteractionEnded}
        />
      );
    });
  };

  return (
    <div className="relative flex-1 h-full min-h-0 flex items-center justify-center gap-3 sm:gap-5 xl:gap-8 px-1 sm:px-3 overflow-visible">
      {/* CIRCULAR HEALTHY PLATE WITH THIN CERAMIC RIM, EXPANDED 50%/25%/25% BOWL & EXTERNAL CURVED LABELS */}
      <div
        className={`relative shrink-0 w-[900px] h-[900px] rounded-full select-none overflow-visible ${
          wiggleSector === 'all' ? 'animate-plate-wiggle' : ''
        }`}
        data-testid="healthy-plate"
      >
        <svg
          viewBox="-10 -10 620 620"
          className="absolute inset-0 w-full h-full drop-shadow-[0_14px_24px_rgba(30,27,46,0.20)] pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <clipPath id="plate-inner-circle-clip">
              <circle cx="300" cy="300" r="226" />
            </clipPath>

            {/* Pure White (#ffffff) Ceramic Outer Rim with subtle edge sheen */}
            <radialGradient id="plate-pure-white-rim" cx="46%" cy="40%" r="58%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="84%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#F3F2F7" />
            </radialGradient>

            {/* Left 50% — Verde Manzana (#5dd118) */}
            <linearGradient id="sector-apple-green" x1="0%" y1="15%" x2="100%" y2="85%">
              <stop offset="0%" stopColor={shieldActive ? '#80EB3E' : '#69DF24'} />
              <stop offset="55%" stopColor={shieldActive ? '#6DE228' : '#5dd118'} />
              <stop offset="100%" stopColor={shieldActive ? '#5dd118' : '#52BE12'} />
            </linearGradient>

            {/* Top-Right 25% — Rosa Fresa (#fc3e7e) */}
            <linearGradient id="sector-strawberry-coral" x1="15%" y1="0%" x2="90%" y2="95%">
              <stop offset="0%" stopColor={proteinActive ? '#FF6A9D' : '#FF558E'} />
              <stop offset="60%" stopColor={proteinActive ? '#FF528C' : '#fc3e7e'} />
              <stop offset="100%" stopColor={proteinActive ? '#fc3e7e' : '#EB2B6C'} />
            </linearGradient>

            {/* Bottom-Right 25% — Amarillo Sol (#fee330) */}
            <linearGradient id="sector-sunny-mango" x1="15%" y1="5%" x2="90%" y2="95%">
              <stop offset="0%" stopColor={energyActive ? '#FFF078' : '#FFEA54'} />
              <stop offset="60%" stopColor={energyActive ? '#FFE94D' : '#fee330'} />
              <stop offset="100%" stopColor={energyActive ? '#fee330' : '#F3D416'} />
            </linearGradient>

            {/* Inner Bowl Concave Depth Shadow */}
            <radialGradient id="inner-well-depth" cx="52%" cy="54%" r="54%">
              <stop offset="66%" stopColor="#ffffff" stopOpacity="0.06" />
              <stop offset="88%" stopColor="#1E1B2E" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#1E1B2E" stopOpacity="0.16" />
            </radialGradient>

            {/* Subtle Ceramic Specular Glaze Reflection */}
            <linearGradient id="bowl-specular-sheen" x1="10%" y1="10%" x2="82%" y2="85%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.34" />
              <stop offset="48%" stopColor="#ffffff" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* External Curved Text Paths Floating Outside the Outer Plate Rim (R = 272 / 280) */}
            <path
              id="rim-path-shield"
              d="M 44.4 393.0 A 272 272 0 0 1 262.1 30.7"
              fill="none"
            />
            <path
              id="rim-path-protein"
              d="M 337.9 30.7 A 272 272 0 0 1 569.3 262.1"
              fill="none"
            />
            <path
              id="rim-path-energy"
              d="M 339.0 577.3 A 280 280 0 0 0 577.3 339.0"
              fill="none"
            />
          </defs>

          {/* Solid 3D Cartoon Offset Shadow Under Plate in #1E1B2E */}
          <circle cx="300" cy="310" r="244" fill="#1E1B2E" opacity="0.22" />

          {/* Thin Pure White (#ffffff) Ceramic Plate Rim with Crisp #1E1B2E Cartoon Border */}
          <circle
            cx="300"
            cy="300"
            r="244"
            fill="url(#plate-pure-white-rim)"
            stroke="#1E1B2E"
            strokeWidth="5.5"
          />

          {/* External Curved Labels Floating Outside the Plate with #1E1B2E Cartoon Outline */}
          <text
            fill="#5dd118"
            stroke="#1E1B2E"
            strokeWidth="5"
            paintOrder="stroke fill"
            strokeLinejoin="round"
            fontSize="26"
            fontWeight="700"
            letterSpacing="0.9"
            dominantBaseline="central"
            style={{
              fontFamily: 'var(--font-display)',
              filter: 'drop-shadow(0 2.5px 0 rgba(30, 27, 46, 0.35))',
            }}
          >
            <textPath href="#rim-path-shield" startOffset="50%" textAnchor="middle">
              FRUTAS Y HORTALIZAS
            </textPath>
          </text>

          <text
            fill="#fc3e7e"
            stroke="#1E1B2E"
            strokeWidth="5"
            paintOrder="stroke fill"
            strokeLinejoin="round"
            fontSize="26"
            fontWeight="700"
            letterSpacing="0.9"
            dominantBaseline="central"
            style={{
              fontFamily: 'var(--font-display)',
              filter: 'drop-shadow(0 2.5px 0 rgba(30, 27, 46, 0.35))',
            }}
          >
            <textPath href="#rim-path-protein" startOffset="50%" textAnchor="middle">
              PROTEÍNAS
            </textPath>
          </text>

          <text
            fill="#fee330"
            stroke="#1E1B2E"
            strokeWidth="5.2"
            paintOrder="stroke fill"
            strokeLinejoin="round"
            fontSize="26"
            fontWeight="700"
            letterSpacing="0.9"
            dominantBaseline="central"
            style={{
              fontFamily: 'var(--font-display)',
              filter: 'drop-shadow(0 2.5px 0 rgba(30, 27, 46, 0.35))',
            }}
          >
            <textPath href="#rim-path-energy" startOffset="50%" textAnchor="middle">
              ENERGÍA
            </textPath>
          </text>

          {/* Expanded Inner Colored Circular Bowl (r = 226) */}
          <g clipPath="url(#plate-inner-circle-clip)">
            {/* Left 50% Verde Manzana (#5dd118) */}
            <rect x="74" y="74" width="226" height="452" fill="url(#sector-apple-green)" />
            {/* Top-Right 25% Rosa Fresa (#fc3e7e) */}
            <rect x="300" y="74" width="226" height="226" fill="url(#sector-strawberry-coral)" />
            {/* Bottom-Right 25% Amarillo Sol (#fee330) */}
            <rect x="300" y="300" width="226" height="226" fill="url(#sector-sunny-mango)" />

            {/* High-Contrast Zone Percentages */}
            {/* 50% in #ffffff with subtle #1E1B2E shadow */}
            <text
              x="194"
              y="305"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="68"
              fontWeight="700"
              fill="#1E1B2E"
              fillOpacity="0.28"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              50%
            </text>
            <text
              x="194"
              y="301"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="68"
              fontWeight="700"
              fill="#ffffff"
              fillOpacity="0.88"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              50%
            </text>

            {/* 25% Proteínas in #ffffff with subtle #1E1B2E shadow */}
            <text
              x="404"
              y="206"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="50"
              fontWeight="700"
              fill="#1E1B2E"
              fillOpacity="0.25"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              25%
            </text>
            <text
              x="404"
              y="202"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="50"
              fontWeight="700"
              fill="#ffffff"
              fillOpacity="0.90"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              25%
            </text>

            {/* 25% Energía in #1E1B2E for crisp contrast on #fee330 */}
            <text
              x="404"
              y="398"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="50"
              fontWeight="700"
              fill="#1E1B2E"
              fillOpacity="0.58"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              25%
            </text>

            {/* Crisp #ffffff Ceramic Dividers with subtle #1E1B2E edge */}
            <line
              x1="300"
              y1="74"
              x2="300"
              y2="526"
              stroke="#1E1B2E"
              strokeOpacity="0.22"
              strokeWidth="9"
            />
            <line
              x1="300"
              y1="300"
              x2="526"
              y2="300"
              stroke="#1E1B2E"
              strokeOpacity="0.22"
              strokeWidth="9"
            />
            <line
              x1="300"
              y1="74"
              x2="300"
              y2="526"
              stroke="#ffffff"
              strokeWidth="5.5"
            />
            <line
              x1="300"
              y1="300"
              x2="526"
              y2="300"
              stroke="#ffffff"
              strokeWidth="5.5"
            />

            {/* Bowl Concave Depth & Subtle Ceramic Glaze Reflection */}
            <circle cx="300" cy="300" r="226" fill="url(#inner-well-depth)" />
            <path
              d="M 92 315 C 97 162, 224 88, 396 93 C 340 168, 254 282, 188 450 C 122 412, 90 364, 92 315 Z"
              fill="url(#bowl-specular-sheen)"
            />

            {/* Active Drop/Selection Glow Highlights */}
            {shieldActive && (
              <path
                d="M 297 76 A 224 224 0 0 0 297 524 Z"
                fill="#ffffff"
                fillOpacity="0.20"
                stroke="#ffffff"
                strokeWidth="5.5"
                strokeDasharray="10 7"
              />
            )}
            {proteinActive && (
              <path
                d="M 303 76 A 224 224 0 0 1 524 297 L 303 297 Z"
                fill="#ffffff"
                fillOpacity="0.20"
                stroke="#ffffff"
                strokeWidth="5.5"
                strokeDasharray="10 7"
              />
            )}
            {energyActive && (
              <path
                d="M 303 303 L 524 303 A 224 224 0 0 1 303 524 Z"
                fill="#ffffff"
                fillOpacity="0.22"
                stroke="#1E1B2E"
                strokeWidth="4.5"
                strokeDasharray="10 7"
              />
            )}
          </g>

          {/* Inner Porcelain Bowl Bevel Lip in #1E1B2E */}
          <circle
            cx="300"
            cy="300"
            r="226"
            fill="none"
            stroke="#1E1B2E"
            strokeOpacity="0.38"
            strokeWidth="3.5"
          />
          <circle
            cx="300"
            cy="300"
            r="223"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.78"
            strokeWidth="2"
          />
        </svg>

        {/* Interactive Sector Overlay aligned 1:1 with the expanded circular bowl (452 / 620 = 72.9% -> inset 13.55%) */}
        <div
          ref={bowlRef}
          className="absolute inset-[13.55%] rounded-full grid grid-cols-2 grid-rows-2 isolate overflow-visible"
        >
          {/* SECTOR 1: 50% LEFT HALF — Frutas y Hortalizas */}
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => handleSectorActivate(e, 'shield')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSectorClick('shield');
              }
            }}
            onDragOver={(e) => handleDragOver(e, 'shield')}
            onDragLeave={() => handleDragLeave('shield')}
            onDrop={(e) => handleDrop(e, 'shield')}
            aria-label={`Sector Frutas y Hortalizas, ${plate.shield.length} alimentos`}
            data-testid="sector-shield"
            className={`row-span-2 col-span-1 relative bg-transparent cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] rounded-l-full overflow-visible [--plated-base:112px] sm:[--plated-base:128px] xl:[--plated-base:144px] ${
              wiggleSector === 'shield' ? 'animate-plate-wiggle' : ''
            }`}
          >
            {renderPlatedSectorItems('shield', plate.shield, 144)}

            {rainbowActive && (
              <span
                data-testid="rainbow-badge"
                className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-xs sm:text-sm font-bold text-[#1E1B2E] bg-[#fee330] px-3 py-0.5 rounded-xl border-2 border-[#1E1B2E] shadow-[0_3px_0_#1E1B2E] z-[9999]"
              >
                ¡Plato Arcoíris!
              </span>
            )}
          </div>

          {/* SECTOR 2: 25% TOP-RIGHT — Proteínas */}
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => handleSectorActivate(e, 'protein')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSectorClick('protein');
              }
            }}
            onDragOver={(e) => handleDragOver(e, 'protein')}
            onDragLeave={() => handleDragLeave('protein')}
            onDrop={(e) => handleDrop(e, 'protein')}
            aria-label={`Sector Proteínas, ${proteinItems.length ? proteinItems.map((p) => p.name).join(', ') : 'vacío'}`}
            data-testid="sector-protein"
            className={`col-span-1 row-span-1 relative bg-transparent cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] rounded-tr-full overflow-visible [--plated-base:96px] sm:[--plated-base:112px] xl:[--plated-base:132px] ${
              wiggleSector === 'protein' ? 'animate-plate-wiggle' : ''
            }`}
          >
            {renderPlatedSectorItems('protein', proteinItems, 132)}
          </div>

          {/* SECTOR 3: 25% BOTTOM-RIGHT — Energía */}
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => handleSectorActivate(e, 'energy')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSectorClick('energy');
              }
            }}
            onDragOver={(e) => handleDragOver(e, 'energy')}
            onDragLeave={() => handleDragLeave('energy')}
            onDrop={(e) => handleDrop(e, 'energy')}
            aria-label={`Sector Energía, ${energyItems.length ? energyItems.map((eItem) => eItem.name).join(', ') : 'vacío'}`}
            data-testid="sector-energy"
            className={`col-span-1 row-span-1 relative bg-transparent cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] rounded-br-full overflow-visible [--plated-base:96px] sm:[--plated-base:112px] xl:[--plated-base:132px] ${
              wiggleSector === 'energy' ? 'animate-plate-wiggle' : ''
            }`}
          >
            {renderPlatedSectorItems('energy', energyItems, 132)}
          </div>
        </div>
      </div>

      {/* HYDRATION GLASS SECTION IN BOTTOM-RIGHT USING REFERENCE ARTWORK */}
      <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 z-20 flex flex-col items-center">
        <button
          type="button"
          onClick={() => {
            if (isHydrated && !selectedFood) {
              onRemoveFood('hydration');
            } else {
              onSectorClick('hydration');
            }
          }}
          onDragOver={(e) => handleDragOver(e, 'hydration')}
          onDragLeave={() => handleDragLeave('hydration')}
          onDrop={(e) => handleDrop(e, 'hydration')}
          aria-label={`Vaso de Hidratación, ${isHydrated ? 'lleno de Agua Pura' : 'vacío'}`}
          title={isHydrated && !selectedFood ? 'Toca para vaciar el vaso' : 'Añade Agua Pura aquí'}
          data-testid="sector-hydration"
          className={`food-option group relative w-[144px] sm:w-[158px] flex flex-col items-center cursor-pointer transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] rounded-3xl p-1.5 ${
            hydrationActive ? 'scale-110' : 'hover:scale-105'
          } ${wiggleSector === 'hydration' ? 'animate-plate-wiggle' : ''}`}
        >
          {isHydrated && lastPlacedId === plate.hydration?.id && (
            <BurstParticles color="#4efcfb" />
          )}

          {/* Reference Water Glass Container */}
          <div className="relative flex items-center justify-center w-[112px] h-[126px] sm:w-[126px] sm:h-[142px] xl:w-[138px] xl:h-[156px]">
            {/* Target highlight ring when dragging/selecting water */}
            {hydrationActive && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-2 rounded-[28px] bg-[#4efcfb]/30 border-[3px] border-dashed border-[#1E1B2E]"
              />
            )}

            {/* Soft luminous aura when hydrated */}
            {isHydrated && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.92) 0%, rgba(78,252,251,0.55) 52%, rgba(78,252,251,0) 76%)',
                }}
              />
            )}

            <div
              className={`relative w-full h-full flex items-center justify-center transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isHydrated
                  ? 'animate-drop-bounce opacity-100'
                  : 'opacity-80 group-hover:opacity-100'
              }`}
              style={{
                filter: 'drop-shadow(0 6px 8px rgba(30, 27, 46, 0.20))',
              }}
            >
              <div
                className="alimento-3d-wrapper w-full h-full pointer-events-none"
                style={{ animationDelay: '-1.8s' }}
              >
                <ProcessedFoodImage
                  src={HYDRATION_GLASS_SRC}
                  alt="Vaso de agua pura"
                  className="w-full h-full object-contain pointer-events-none"
                />
              </div>
            </div>
          </div>

          <span className="font-display title-label-stroke-dark -mt-1 text-base sm:text-lg font-bold text-[#4efcfb] leading-none">
            Hidratación
          </span>
          <span className="text-[11px] sm:text-xs font-extrabold text-[#1E1B2E] mt-1 whitespace-nowrap">
            {isHydrated ? '¡Agua Pura!' : 'Toca o arrastra agua'}
          </span>
        </button>
      </div>
    </div>
  );
});

HealthyPlate.displayName = 'HealthyPlate';
