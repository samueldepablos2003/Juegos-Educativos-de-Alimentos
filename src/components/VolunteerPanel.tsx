import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { VolunteerStats } from '../data/foods';

interface VolunteerPanelProps {
  stats: VolunteerStats;
  onClose: () => void;
  onResetStats: () => void;
}

export const VolunteerPanel: React.FC<VolunteerPanelProps> = ({
  stats,
  onClose,
  onResetStats,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="volunteer-heading"
      className="fixed inset-0 z-50 bg-[#1E1B2E]/60 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-lg bg-[#ffffff] border-4 border-[#1E1B2E] rounded-3xl shadow-[0_10px_0_#1E1B2E] p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#8137ea]">
              Registro Anónimo Local · Jornada Comunitaria
            </p>
            <h2
              id="volunteer-heading"
              className="font-display text-2xl font-bold text-[#1E1B2E]"
            >
              Panel Voluntario
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar Panel Voluntario"
            className="p-2 rounded-xl bg-[#fee330] hover:bg-[#f5d81d] border-2 border-[#1E1B2E] text-[#1E1B2E] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <p className="text-sm font-semibold text-[#1E1B2E]/85">
          Estadísticas anónimas guardadas localmente en este equipo (sin nombres ni datos personales).
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#5dd118]/15 border-2 border-[#1E1B2E] rounded-2xl p-3.5 shadow-[0_3px_0_#1E1B2E]">
            <span className="block text-xs font-bold text-[#1E1B2E]">
              Platos Armados
            </span>
            <span
              data-testid="stat-total-plates"
              className="block text-3xl font-black text-[#1E1B2E] tabular-nums mt-0.5"
            >
              {stats.totalPlatesCompleted}
            </span>
          </div>

          <div className="bg-[#fee330]/35 border-2 border-[#1E1B2E] rounded-2xl p-3.5 shadow-[0_3px_0_#1E1B2E]">
            <span className="block text-xs font-bold text-[#1E1B2E]">
              Platos Arcoíris
            </span>
            <span className="block text-3xl font-black text-[#1E1B2E] tabular-nums mt-0.5">
              {stats.rainbowPlatesAchieved}
            </span>
          </div>

          <div className="bg-[#4efcfb]/25 border-2 border-[#1E1B2E] rounded-2xl p-3.5 shadow-[0_3px_0_#1E1B2E]">
            <span className="block text-xs font-bold text-[#1E1B2E]">
              Agua Pura Elegida
            </span>
            <span className="block text-3xl font-black text-[#1E1B2E] tabular-nums mt-0.5">
              {stats.waterChosenCount}
            </span>
          </div>

          <div className="bg-[#fc3e7e]/15 border-2 border-[#1E1B2E] rounded-2xl p-3.5 shadow-[0_3px_0_#1E1B2E]">
            <span className="block text-xs font-bold text-[#1E1B2E]">
              Lecciones Ultraprocesados
            </span>
            <span className="block text-3xl font-black text-[#fc3e7e] tabular-nums mt-0.5">
              {stats.distractorLessonsCount}
            </span>
          </div>
        </div>

        <div className="bg-[#FFFDF7] border-2 border-[#1E1B2E] rounded-2xl p-3.5 flex items-center justify-between text-sm font-bold text-[#1E1B2E]">
          <span>Desayuno: <strong className="tabular-nums">{stats.byMode.breakfast}</strong></span>
          <span>Almuerzo: <strong className="tabular-nums">{stats.byMode.lunch}</strong></span>
          <span>Reto Libre: <strong className="tabular-nums">{stats.byMode.free}</strong></span>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="px-3.5 py-2 rounded-xl border-2 border-[#1E1B2E] bg-[#ffffff] text-[#fc3e7e] hover:bg-[#fc3e7e]/10 text-sm font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              <span>Reiniciar Contadores</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetStats();
                  setConfirmReset(false);
                }}
                className="px-3 py-2 rounded-xl bg-[#fc3e7e] text-[#ffffff] border-2 border-[#1E1B2E] text-xs font-extrabold cursor-pointer"
              >
                Confirmar Reinicio
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3 py-2 rounded-xl bg-[#ffffff] border-2 border-[#1E1B2E] text-[#1E1B2E] text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#8137ea] hover:bg-[#7028d9] border-2 border-[#1E1B2E] shadow-[0_3px_0_#1E1B2E] text-[#ffffff] text-sm font-extrabold cursor-pointer ml-auto"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
