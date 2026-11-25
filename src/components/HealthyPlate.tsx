import React, { memo, useEffect, useRef, useState } from 'react';
import { FoodItem, PlateState, SectorId } from '../data/foods';
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

    useEffect(() => {
      hoverRectRef.current = null;
    }, [finalScale]);

    useEffect(() => {
      return () => {
        if (moveRafRef.current) window.cancelAnimationFrame(moveRafRef.current);
        if (wheelRafRef.current) window.cancelAnimationFrame(wheelRafRef.current);
      };
    }, []);

    useEffect(() => {
      if (!isPressed && !isRotating && !isDragging) return;
      const prevCursor = document.body.style.cursor;
      document.body.style.cursor = isRotating ? ROTATE_CURSOR : 'grabbing';
      return () => {
        document.body.style.cursor = prevCursor;
      };
    }, [isPressed, isRotating, isDragging]);

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
}) => {
  const [dragOverSector, setDragOverSector] = useState<SectorId | null>(null);
  const bowlRef = useRef<HTMLDivElement>(null);
  const fatsBowlRef = useRef<HTMLDivElement>(null);
  const lastFoodInteractionRef = useRef<number>(0);

  const markFoodInteractionEnded = () => {
    lastFoodInteractionRef.current = performance.now();
  };

  const buildDropContext = (
    clientX: number,
    clientY: number,
    sector: SectorId
  ): DropPointContext => {
    const targetRef = sector === 'fats' ? fatsBowlRef : bowlRef;
    const rect = targetRef.current?.getBoundingClientRect();
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
      onDropFood(foodId, sector, buildDropContext(e.clientX, e.clientY, sector));
    }
  };

  const handleSectorActivate = (
    e: React.MouseEvent<HTMLElement>,
    sector: PlateFoodSector
  ) => {
    if (performance.now() - lastFoodInteractionRef.current < 150) {
      return;
    }
    onSectorClick(sector, buildDropContext(e.clientX, e.clientY, sector));
  };

  const isTargetHighlighted = (sector: SectorId) =>
    dragOverSector === sector ||
    (selectedFood !== null &&
      (selectedFood.targetSector === sector || selectedFood.category === 'distractor'));

  const vegetablesActive = isTargetHighlighted('vegetables');
  const fruitsActive = isTargetHighlighted('fruits');
  const cerealsActive = isTargetHighlighted('cereals');
  const proteinActive = isTargetHighlighted('protein');
  const fatsActive = isTargetHighlighted('fats');
  const hydrationActive = isTargetHighlighted('hydration');
  const isHydrated = plate.hydration !== null;

  const renderPlatedSectorItems = (
    sector: PlateFoodSector,
    items: FoodItem[],
    baseFallbackPx: number,
    targetBowlRef: React.RefObject<HTMLDivElement | null>
  ) => {
    const sectorPlacements = placements[sector];

    return items.map((item, idx) => {
      const placement = sectorPlacements[idx] ?? {
        instanceId: `${sector}-${item.id}-${idx}`,
        foodId: item.id,
        sector,
        localX: 50,
        localY: 50,
        zIndex: BASE_PLATE_Z_INDEX + idx,
        rotation: ((idx % 5) - 2) * 5,
        scale: sector === 'fats' ? 1.15 : STANDARD_FOOD_SCALE,
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
          bowlRef={targetBowlRef}
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
    <div className="relative flex-1 self-stretch w-full h-full min-h-0 overflow-visible [container-type:size]">
      {/* EXTRA CIRCULAR MINI-PLATE FOR HEALTHY FATS (ENLARGED & MORE UNCOVERED BEHIND UPPER-LEFT OF MAIN PLATE) */}
      <div className="pointer-events-none absolute z-10 top-[-2cqh] left-[max(-2cqh,calc(58.5cqw_-_84cqh))] flex flex-col items-center">
        <div
          className={`pointer-events-none relative shrink-0 w-[min(49cqh,38cqw)] h-[min(49cqh,38cqw)] rounded-full select-none overflow-visible transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            fatsActive ? 'scale-105' : ''
          } ${wiggleSector === 'fats' ? 'animate-plate-wiggle' : ''}`}
          data-testid="fats-plate"
        >
          <svg
            viewBox="-8 -8 216 216"
            className="absolute inset-0 w-full h-full drop-shadow-[0_10px_16px_rgba(30,27,46,0.20)] pointer-events-none"
            aria-hidden="true"
          >
            <defs>
              <clipPath id="fats-inner-circle-clip">
                <circle cx="100" cy="100" r="80" />
              </clipPath>

              <radialGradient id="fats-white-rim" cx="46%" cy="40%" r="58%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="84%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#F3F2F7" />
              </radialGradient>

              <linearGradient id="sector-healthy-fats" x1="12%" y1="10%" x2="88%" y2="90%">
                <stop offset="0%" stopColor={fatsActive ? '#FFF380' : '#FFE84D'} />
                <stop offset="52%" stopColor={fatsActive ? '#FFD93B' : '#FFC812'} />
                <stop offset="100%" stopColor={fatsActive ? '#FFB012' : '#F49D06'} />
              </linearGradient>

              <radialGradient id="fats-well-depth" cx="52%" cy="54%" r="54%">
                <stop offset="68%" stopColor="#ffffff" stopOpacity="0.06" />
                <stop offset="88%" stopColor="#1E1B2E" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#1E1B2E" stopOpacity="0.11" />
              </radialGradient>

              <linearGradient id="fats-specular-sheen" x1="10%" y1="10%" x2="82%" y2="85%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.34" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>

              <filter id="fats-label-diffused" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="0.9" />
              </filter>
            </defs>

            {/* Offset 3D shadow */}
            <circle cx="100" cy="106" r="92" fill="#1E1B2E" opacity="0.20" />

            {/* White ceramic rim with crisp dark outline */}
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="url(#fats-white-rim)"
              stroke="#1E1B2E"
              strokeWidth="4.5"
            />

            {/* Inner circular golden-oil bowl */}
            <g clipPath="url(#fats-inner-circle-clip)">
              <circle cx="100" cy="100" r="80" fill="url(#sector-healthy-fats)" />

              {/* Diffused "GRASAS" label — centered inside the circular fats plate, auto-removed when food is placed */}
              {plate.fats.length === 0 && (
                <text
                  data-testid="plate-label-fats"
                  x="100"
                  y="100"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="24"
                  fontWeight="700"
                  letterSpacing="1.1"
                  fill="#ffffff"
                  fillOpacity="0.78"
                  filter="url(#fats-label-diffused)"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  GRASAS
                </text>
              )}

              <circle cx="100" cy="100" r="80" fill="url(#fats-well-depth)" />
              <path
                d="M 32 108 C 35 54, 78 26, 140 29 C 118 58, 88 96, 64 156 C 42 142, 30 126, 32 108 Z"
                fill="url(#fats-specular-sheen)"
              />

              {fatsActive && (
                <circle
                  cx="100"
                  cy="100"
                  r="77"
                  fill="#ffffff"
                  fillOpacity="0.22"
                  stroke="#1E1B2E"
                  strokeWidth="4"
                  strokeDasharray="8 6"
                />
              )}
            </g>

            {/* Inner porcelain lip */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#1E1B2E"
              strokeOpacity="0.36"
              strokeWidth="2.8"
            />
            <circle
              cx="100"
              cy="100"
              r="78"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.78"
              strokeWidth="1.6"
            />
          </svg>

          {/* Interactive Fats Bowl Overlay (160 / 216 = 74.07% -> inset 12.96%) */}
          <div
            ref={fatsBowlRef}
            role="button"
            tabIndex={0}
            onClick={(e) => handleSectorActivate(e, 'fats')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSectorClick('fats');
              }
            }}
            onDragOver={(e) => handleDragOver(e, 'fats')}
            onDragLeave={() => handleDragLeave('fats')}
            onDrop={(e) => handleDrop(e, 'fats')}
            aria-label={`Plato de Grasas Saludables, ${plate.fats.length} alimentos`}
            data-testid="sector-fats"
            className="pointer-events-auto absolute inset-[12.96%] rounded-full bg-transparent cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] overflow-visible [--plated-base:104px] sm:[--plated-base:116px] xl:[--plated-base:128px]"
          >
            {renderPlatedSectorItems('fats', plate.fats, 128, fatsBowlRef)}
          </div>
        </div>
      </div>

      {/* MAIN CIRCULAR HEALTHY PLATE — MAXIMIZED TO FILL PLAYFIELD HEIGHT & SHIFTED SLIGHTLY RIGHT */}
      <div
        className={`pointer-events-none absolute z-20 top-1/2 left-[58.5cqw] -translate-x-1/2 -translate-y-1/2 shrink-0 w-[min(123cqh,96cqw)] h-[min(123cqh,96cqw)] rounded-full select-none overflow-visible ${
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

            {/* Top-Left — Vegetales (Vibrant Vivid Leaf Green) */}
            <linearGradient id="sector-vegetables-green" x1="0%" y1="10%" x2="100%" y2="85%">
              <stop offset="0%" stopColor={vegetablesActive ? '#6BFF7A' : '#3CF24E'} />
              <stop offset="55%" stopColor={vegetablesActive ? '#38E84B' : '#1FD432'} />
              <stop offset="100%" stopColor={vegetablesActive ? '#1CC730' : '#10AC24'} />
            </linearGradient>

            {/* Bottom-Left — Frutas (Vibrant Juicy Berry Crimson) */}
            <linearGradient id="sector-fruits-berry" x1="10%" y1="10%" x2="90%" y2="95%">
              <stop offset="0%" stopColor={fruitsActive ? '#FF5282' : '#FF2460'} />
              <stop offset="58%" stopColor={fruitsActive ? '#FA205E' : '#E50E4C'} />
              <stop offset="100%" stopColor={fruitsActive ? '#D60B45' : '#BD063C'} />
            </linearGradient>

            {/* Top-Right — Cereales (Vibrant Warm Golden-Caramel Grain Brown) */}
            <linearGradient id="sector-cereals-grain" x1="15%" y1="0%" x2="90%" y2="95%">
              <stop offset="0%" stopColor={cerealsActive ? '#F0C68D' : '#E0AE6E'} />
              <stop offset="58%" stopColor={cerealsActive ? '#DBA35D' : '#CA8E47'} />
              <stop offset="100%" stopColor={cerealsActive ? '#BE823B' : '#AA6E2C'} />
            </linearGradient>

            {/* Bottom-Right — Proteínas (Vibrant Luminous Tangerine Orange) */}
            <linearGradient id="sector-protein-orange" x1="15%" y1="5%" x2="90%" y2="95%">
              <stop offset="0%" stopColor={proteinActive ? '#FFBF52' : '#FFA41B'} />
              <stop offset="58%" stopColor={proteinActive ? '#FF962E' : '#FF7E0A'} />
              <stop offset="100%" stopColor={proteinActive ? '#F56D0A' : '#E85C00'} />
            </linearGradient>

            {/* Inner Bowl Concave Depth Shadow */}
            <radialGradient id="inner-well-depth" cx="52%" cy="54%" r="54%">
              <stop offset="68%" stopColor="#ffffff" stopOpacity="0.06" />
              <stop offset="88%" stopColor="#1E1B2E" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#1E1B2E" stopOpacity="0.11" />
            </radialGradient>

            {/* Subtle Ceramic Specular Glaze Reflection */}
            <linearGradient id="bowl-specular-sheen" x1="10%" y1="10%" x2="82%" y2="85%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.30" />
              <stop offset="48%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Soft Diffused Watermark Blur for Interior Category Names */}
            <filter id="plate-label-diffused" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.15" />
            </filter>
          </defs>

          {/* Solid 3D Cartoon Offset Shadow Under Plate in #1E1B2E */}
          <circle cx="300" cy="310" r="244" fill="#1E1B2E" opacity="0.22" />

          {/* Pure White (#ffffff) Ceramic Plate Rim with Crisp #1E1B2E Cartoon Border */}
          <circle
            cx="300"
            cy="300"
            r="244"
            fill="url(#plate-pure-white-rim)"
            stroke="#1E1B2E"
            strokeWidth="5.5"
          />

          {/* Subtle Inner Rim Accent Ring matching reference plate */}
          <circle
            cx="300"
            cy="300"
            r="235"
            fill="none"
            stroke="#1E1B2E"
            strokeOpacity="0.16"
            strokeWidth="2"
          />

          {/* Expanded Inner Colored Circular Bowl (r = 226) */}
          <g clipPath="url(#plate-inner-circle-clip)">
            {/* Top-Left (~34%) — Vegetales */}
            <rect x="74" y="74" width="226" height="289.3" fill="url(#sector-vegetables-green)" />
            {/* Bottom-Left (~16%) — Frutas */}
            <rect x="74" y="363.3" width="226" height="162.7" fill="url(#sector-fruits-berry)" />
            {/* Top-Right (25%) — Cereales */}
            <rect x="300" y="74" width="226" height="226" fill="url(#sector-cereals-grain)" />
            {/* Bottom-Right (25%) — Proteínas */}
            <rect x="300" y="300" width="226" height="226" fill="url(#sector-protein-orange)" />

            {/* Softly Diffused Interior Section Names (Removed Automatically When Any Food Is Added) */}
            {plate.vegetables.length === 0 && (
              <text
                data-testid="plate-label-vegetables"
                x="196"
                y="246"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="31"
                fontWeight="700"
                letterSpacing="1.2"
                fill="#ffffff"
                fillOpacity="0.72"
                filter="url(#plate-label-diffused)"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                VEGETALES
              </text>
            )}

            {plate.fruits.length === 0 && (
              <text
                data-testid="plate-label-fruits"
                x="222"
                y="432"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="29"
                fontWeight="700"
                letterSpacing="1.2"
                fill="#ffffff"
                fillOpacity="0.74"
                filter="url(#plate-label-diffused)"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                FRUTAS
              </text>
            )}

            {plate.cereals.length === 0 && (
              <text
                data-testid="plate-label-cereals"
                x="404"
                y="204"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="31"
                fontWeight="700"
                letterSpacing="1.2"
                fill="#ffffff"
                fillOpacity="0.74"
                filter="url(#plate-label-diffused)"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                CEREALES
              </text>
            )}

            {plate.protein.length === 0 && (
              <text
                data-testid="plate-label-protein"
                x="404"
                y="398"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="30"
                fontWeight="700"
                letterSpacing="1.2"
                fill="#ffffff"
                fillOpacity="0.74"
                filter="url(#plate-label-diffused)"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                PROTEÍNAS
              </text>
            )}

            {/* Crisp #ffffff Ceramic Dividers with subtle #1E1B2E edge */}
            {/* Vertical center divider */}
            <line
              x1="300"
              y1="74"
              x2="300"
              y2="526"
              stroke="#1E1B2E"
              strokeOpacity="0.22"
              strokeWidth="9"
            />
            {/* Left horizontal divider (Vegetales / Frutas at y = 363.3) */}
            <line
              x1="74"
              y1="363.3"
              x2="300"
              y2="363.3"
              stroke="#1E1B2E"
              strokeOpacity="0.22"
              strokeWidth="9"
            />
            {/* Right horizontal divider (Cereales / Proteínas at y = 300) */}
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
              x1="74"
              y1="363.3"
              x2="300"
              y2="363.3"
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
            {vegetablesActive && (
              <path
                d="M 297 76 A 224 224 0 0 0 84.3 360.3 L 297 360.3 Z"
                fill="#ffffff"
                fillOpacity="0.20"
                stroke="#ffffff"
                strokeWidth="5.5"
                strokeDasharray="10 7"
              />
            )}
            {fruitsActive && (
              <path
                d="M 86.0 366.3 A 224 224 0 0 0 297 524 L 297 366.3 Z"
                fill="#ffffff"
                fillOpacity="0.20"
                stroke="#ffffff"
                strokeWidth="5.5"
                strokeDasharray="10 7"
              />
            )}
            {cerealsActive && (
              <path
                d="M 303 76 A 224 224 0 0 1 524 297 L 303 297 Z"
                fill="#ffffff"
                fillOpacity="0.20"
                stroke="#ffffff"
                strokeWidth="5.5"
                strokeDasharray="10 7"
              />
            )}
            {proteinActive && (
              <path
                d="M 303 303 L 524 303 A 224 224 0 0 1 303 524 Z"
                fill="#ffffff"
                fillOpacity="0.22"
                stroke="#ffffff"
                strokeWidth="5.5"
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

        {/* Interactive Sector Overlay aligned 1:1 with the circular bowl (452 / 620 = 72.9% -> inset 13.55%) */}
        <div
          ref={bowlRef}
          className="pointer-events-none absolute inset-[13.55%] rounded-full flex isolate overflow-visible"
        >
          {/* LEFT HALF: 64% Vegetales (top) + 36% Frutas (bottom) */}
          <div className="pointer-events-none relative w-1/2 h-full flex flex-col overflow-visible">
            {/* SECTOR 1: TOP-LEFT — Vegetales */}
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => handleSectorActivate(e, 'vegetables')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSectorClick('vegetables');
                }
              }}
              onDragOver={(e) => handleDragOver(e, 'vegetables')}
              onDragLeave={() => handleDragLeave('vegetables')}
              onDrop={(e) => handleDrop(e, 'vegetables')}
              aria-label={`Sector Vegetales, ${plate.vegetables.length} alimentos`}
              data-testid="sector-vegetables"
              className={`pointer-events-auto h-[64%] w-full relative bg-transparent cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] rounded-tl-full overflow-visible [--plated-base:94px] sm:[--plated-base:106px] xl:[--plated-base:118px] ${
                wiggleSector === 'vegetables' ? 'animate-plate-wiggle' : ''
              }`}
            >
              {renderPlatedSectorItems('vegetables', plate.vegetables, 118, bowlRef)}
            </div>

            {/* SECTOR 2: BOTTOM-LEFT — Frutas */}
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => handleSectorActivate(e, 'fruits')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSectorClick('fruits');
                }
              }}
              onDragOver={(e) => handleDragOver(e, 'fruits')}
              onDragLeave={() => handleDragLeave('fruits')}
              onDrop={(e) => handleDrop(e, 'fruits')}
              aria-label={`Sector Frutas, ${plate.fruits.length} alimentos`}
              data-testid="sector-fruits"
              className={`pointer-events-auto h-[36%] w-full relative bg-transparent cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] rounded-bl-full overflow-visible [--plated-base:84px] sm:[--plated-base:94px] xl:[--plated-base:106px] ${
                wiggleSector === 'fruits' ? 'animate-plate-wiggle' : ''
              }`}
            >
              {renderPlatedSectorItems('fruits', plate.fruits, 106, bowlRef)}
            </div>
          </div>

          {/* RIGHT HALF: 50% Cereales (top) + 50% Proteínas (bottom) */}
          <div className="pointer-events-none relative w-1/2 h-full flex flex-col overflow-visible">
            {/* SECTOR 3: TOP-RIGHT — Cereales */}
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => handleSectorActivate(e, 'cereals')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSectorClick('cereals');
                }
              }}
              onDragOver={(e) => handleDragOver(e, 'cereals')}
              onDragLeave={() => handleDragLeave('cereals')}
              onDrop={(e) => handleDrop(e, 'cereals')}
              aria-label={`Sector Cereales, ${plate.cereals.length ? plate.cereals.map((c) => c.name).join(', ') : 'vacío'}`}
              data-testid="sector-cereals"
              className={`pointer-events-auto h-1/2 w-full relative bg-transparent cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] rounded-tr-full overflow-visible [--plated-base:90px] sm:[--plated-base:102px] xl:[--plated-base:114px] ${
                wiggleSector === 'cereals' ? 'animate-plate-wiggle' : ''
              }`}
            >
              {renderPlatedSectorItems('cereals', plate.cereals, 114, bowlRef)}
            </div>

            {/* SECTOR 4: BOTTOM-RIGHT — Proteínas */}
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
              aria-label={`Sector Proteínas, ${plate.protein.length ? plate.protein.map((p) => p.name).join(', ') : 'vacío'}`}
              data-testid="sector-protein"
              className={`pointer-events-auto h-1/2 w-full relative bg-transparent cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] rounded-br-full overflow-visible [--plated-base:90px] sm:[--plated-base:102px] xl:[--plated-base:114px] ${
                wiggleSector === 'protein' ? 'animate-plate-wiggle' : ''
              }`}
            >
              {renderPlatedSectorItems('protein', plate.protein, 114, bowlRef)}
            </div>
          </div>
        </div>
      </div>

      {/* HYDRATION GLASS SECTION — ENLARGED IN BOTTOM-RIGHT CORNER CLOSE TO MAIN PLATE */}
      <div className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 xl:bottom-1 xl:right-1.5 z-30 flex flex-col items-center">
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
          className={`food-option group relative w-[min(22cqh,16.5cqw)] flex flex-col items-center cursor-pointer transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8137ea] rounded-3xl p-1 ${
            hydrationActive ? 'scale-110' : 'hover:scale-105'
          } ${wiggleSector === 'hydration' ? 'animate-plate-wiggle' : ''}`}
        >
          {isHydrated && lastPlacedId === plate.hydration?.id && (
            <BurstParticles color="#4efcfb" />
          )}

          {/* Enlarged Water Glass Container Close to Main Plate */}
          <div className="relative flex items-center justify-center w-[min(20cqh,15.5cqw)] h-[min(26cqh,20cqw)]">
            {hydrationActive && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-2 rounded-[24px] bg-[#4efcfb]/30 border-[3px] border-dashed border-[#1E1B2E]"
              />
            )}

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
        </button>
      </div>
    </div>
  );
});

HealthyPlate.displayName = 'HealthyPlate';
