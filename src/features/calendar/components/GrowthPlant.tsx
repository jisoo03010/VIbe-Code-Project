interface GrowthPlantProps {
  doneCount: number;
}

const STAGE_THRESHOLDS = [3, 7, 12, 20] as const;
const STAGE_NAMES = ['발아', '새싹', '줄기', '열매'] as const;

function getStage(count: number): 1 | 2 | 3 | 4 | 5 {
  if (count <= 2) return 1;
  if (count <= 6) return 2;
  if (count <= 11) return 3;
  if (count <= 19) return 4;
  return 5;
}

function getHint(count: number, stage: number): string {
  if (stage >= 5) return count >= 30 ? '보너스 달성!' : `보너스까지 ${30 - count}개`;
  const remaining = STAGE_THRESHOLDS[stage - 1] - count;
  return `${STAGE_NAMES[stage - 1]}까지 ${remaining}개`;
}

export function GrowthPlant({ doneCount }: GrowthPlantProps) {
  const stage = getStage(doneCount);
  const bonus = doneCount >= 30;
  const hint = getHint(doneCount, stage);

  return (
    <div className="growth-plant-wrapper">
      <div className="growth-info">
        <div>
          <span className="growth-info__count">{doneCount}</span>
          <span className="growth-info__label">개 달성</span>
        </div>
        <div className="growth-info__msg">{hint}</div>
      </div>
      <div className="growth-plant" aria-hidden="true">
        <svg width="64" height="76" viewBox="0 0 90 110" fill="none">
          <ellipse cx="45" cy="105" rx="28" ry="5" fill="#c4a882" opacity="0.5" />
          <g>
            <ellipse cx="45" cy="96" rx="8" ry="6" fill="#8b6f47" />
            <ellipse cx="45" cy="95" rx="6" ry="4.5" fill="#a67c52" />
          </g>
          {stage >= 2 && (
            <g className="plant-part plant-sprout">
              <path d="M45 100 Q42 108 38 112" stroke="#a67c52" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M45 91 Q45 87 44 84" stroke="#7db36a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          )}
          {stage >= 3 && (
            <g className="plant-part plant-leaves-small">
              <path d="M45 91 L45 68" stroke="#6b9a5e" strokeWidth="3" strokeLinecap="round" />
              <path d="M45 75 Q35 68 30 72 Q34 64 45 70" fill="#96ce46" />
              <path d="M45 75 Q55 68 60 72 Q56 64 45 70" fill="#7db36a" />
            </g>
          )}
          {stage >= 4 && (
            <g className="plant-part plant-stem">
              <path d="M45 68 L45 42" stroke="#5a8a4e" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M45 60 Q30 52 26 58 Q32 48 45 55" fill="#6b9a5e" />
              <path d="M45 60 Q60 52 64 58 Q58 48 45 55" fill="#96ce46" />
              <path d="M45 48 Q36 42 33 46 Q37 38 45 44" fill="#a8d86e" />
              <path d="M45 48 Q54 42 57 46 Q53 38 45 44" fill="#7db36a" />
            </g>
          )}
          {stage >= 5 && (
            <g className="plant-part plant-fruit">
              <circle cx="38" cy="36" r="5" fill="#d9534f" />
              <circle cx="52" cy="36" r="5" fill="#c9302c" />
              <circle cx="45" cy="24" r="4.5" fill="#d9534f" />
              <circle cx="36" cy="34" r="1.5" fill="#fff" opacity="0.4" />
              <circle cx="50" cy="34" r="1.5" fill="#fff" opacity="0.4" />
              {bonus && (
                <>
                  <circle cx="30" cy="42" r="4.5" fill="#d9534f" />
                  <circle cx="60" cy="42" r="4" fill="#c9302c" />
                </>
              )}
            </g>
          )}
          {stage >= 5 && (
            <g className="plant-sparkle">
              <circle cx="38" cy="20" r="1.5" fill="#ffd700" />
              <circle cx="55" cy="28" r="1" fill="#ffd700" />
              <circle cx="30" cy="30" r="1.2" fill="#ffd700" />
              <circle cx="48" cy="16" r="1" fill="#ffd700" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
