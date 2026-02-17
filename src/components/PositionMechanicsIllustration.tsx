import type { PositionIllustrationKey } from "../data/positionIllustrations";

interface PositionMechanicsIllustrationProps {
  illustrationKey: PositionIllustrationKey;
  caption: string;
}

const PARTNER_A_STROKE = "#0f766e";
const PARTNER_A_FILL = "#ccfbf1";
const PARTNER_B_STROKE = "#1d4ed8";
const PARTNER_B_FILL = "#dbeafe";
const SUPPORT_STROKE = "#94a3b8";
const SUPPORT_FILL = "#e2e8f0";
const MOTION_STROKE = "#475569";

interface Point {
  x: number;
  y: number;
}

interface PoseFigureProps {
  head: Point;
  shoulder: Point;
  hip: Point;
  knee: Point;
  foot: Point;
  stroke: string;
  fill: string;
  label: "A" | "B";
  rearKnee?: Point;
  rearFoot?: Point;
  elbow?: Point;
  hand?: Point;
  labelOffset?: Point;
}

const toPoints = (points: Point[]): string => points.map((point) => `${point.x},${point.y}`).join(" ");

const PoseFigure = ({
  head,
  shoulder,
  hip,
  knee,
  foot,
  stroke,
  fill,
  label,
  rearKnee,
  rearFoot,
  elbow,
  hand,
  labelOffset,
}: PoseFigureProps) => {
  return (
    <g>
      {rearKnee && rearFoot && (
        <polyline
          points={toPoints([hip, rearKnee, rearFoot])}
          fill="none"
          stroke={stroke}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.6}
        />
      )}

      <line
        x1={head.x}
        y1={head.y}
        x2={shoulder.x}
        y2={shoulder.y}
        stroke={stroke}
        strokeWidth={6}
        strokeLinecap="round"
      />

      <polyline
        points={toPoints([shoulder, hip, knee, foot])}
        fill="none"
        stroke={stroke}
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {elbow && hand && (
        <polyline
          points={toPoints([shoulder, elbow, hand])}
          fill="none"
          stroke={stroke}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      <circle cx={head.x} cy={head.y} r={5.5} fill={fill} stroke={stroke} strokeWidth={2} />
      <circle cx={hip.x} cy={hip.y} r={2.2} fill="white" stroke={stroke} strokeWidth={1} />
      <circle cx={knee.x} cy={knee.y} r={2.2} fill="white" stroke={stroke} strokeWidth={1} />

      <text
        x={(labelOffset?.x ?? hip.x) + 7}
        y={(labelOffset?.y ?? hip.y) - 2}
        textAnchor="middle"
        fontSize={9}
        fontWeight={700}
        fill={stroke}
        aria-hidden="true"
      >
        {label}
      </text>
    </g>
  );
};

interface SupportPadProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

const SupportPad = ({ x, y, width, height, rotation = 0 }: SupportPadProps) => (
  <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
    <rect
      x={-width / 2}
      y={-height / 2}
      width={width}
      height={height}
      rx={Math.max(4, Math.min(width, height) * 0.35)}
      fill={SUPPORT_FILL}
      stroke={SUPPORT_STROKE}
      strokeWidth={1.5}
    />
  </g>
);

const BedSurface = () => (
  <g>
    <rect x={12} y={90} width={176} height={8} rx={4} fill={SUPPORT_FILL} />
    <line x1={12} y1={94} x2={188} y2={94} stroke={SUPPORT_STROKE} strokeWidth={2} />
  </g>
);

const FloorSurface = () => <line x1={12} y1={96} x2={188} y2={96} stroke={SUPPORT_STROKE} strokeWidth={2} />;

interface MotionArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const MotionArrow = ({ x1, y1, x2, y2 }: MotionArrowProps) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const baseX = x2 - ux * 7;
  const baseY = y2 - uy * 7;
  const leftX = baseX - uy * 3;
  const leftY = baseY + ux * 3;
  const rightX = baseX + uy * 3;
  const rightY = baseY - ux * 3;

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MOTION_STROKE} strokeWidth={1.8} />
      <polygon points={`${x2},${y2} ${leftX},${leftY} ${rightX},${rightY}`} fill={MOTION_STROKE} />
    </g>
  );
};

const renderIllustration = (illustrationKey: PositionIllustrationKey) => {
  switch (illustrationKey) {
    case "side-lying-spooning":
      return (
        <g>
          <BedSurface />
          <SupportPad x={36} y={77} width={20} height={10} />
          <SupportPad x={46} y={87} width={26} height={10} />
          <PoseFigure
            head={{ x: 46, y: 64 }}
            shoulder={{ x: 55, y: 67 }}
            hip={{ x: 80, y: 71 }}
            knee={{ x: 102, y: 76 }}
            foot={{ x: 122, y: 80 }}
            rearKnee={{ x: 100, y: 73 }}
            rearFoot={{ x: 120, y: 76 }}
            stroke={PARTNER_A_STROKE}
            fill={PARTNER_A_FILL}
            label="A"
            labelOffset={{ x: 84, y: 70 }}
          />
          <PoseFigure
            head={{ x: 52, y: 74 }}
            shoulder={{ x: 62, y: 76 }}
            hip={{ x: 86, y: 79 }}
            knee={{ x: 106, y: 84 }}
            foot={{ x: 122, y: 88 }}
            rearKnee={{ x: 104, y: 80 }}
            rearFoot={{ x: 120, y: 83 }}
            stroke={PARTNER_B_STROKE}
            fill={PARTNER_B_FILL}
            label="B"
            labelOffset={{ x: 90, y: 79 }}
          />
          <MotionArrow x1={132} y1={60} x2={156} y2={60} />
        </g>
      );

    case "side-lying-face-to-face":
      return (
        <g>
          <BedSurface />
          <SupportPad x={42} y={82} width={20} height={10} />
          <SupportPad x={158} y={82} width={20} height={10} />
          <PoseFigure
            head={{ x: 56, y: 74 }}
            shoulder={{ x: 66, y: 76 }}
            hip={{ x: 90, y: 79 }}
            knee={{ x: 108, y: 84 }}
            foot={{ x: 124, y: 88 }}
            rearKnee={{ x: 106, y: 80 }}
            rearFoot={{ x: 122, y: 83 }}
            stroke={PARTNER_A_STROKE}
            fill={PARTNER_A_FILL}
            label="A"
            labelOffset={{ x: 94, y: 79 }}
          />
          <PoseFigure
            head={{ x: 146, y: 74 }}
            shoulder={{ x: 136, y: 76 }}
            hip={{ x: 112, y: 79 }}
            knee={{ x: 94, y: 84 }}
            foot={{ x: 78, y: 88 }}
            rearKnee={{ x: 96, y: 80 }}
            rearFoot={{ x: 80, y: 83 }}
            stroke={PARTNER_B_STROKE}
            fill={PARTNER_B_FILL}
            label="B"
            labelOffset={{ x: 109, y: 79 }}
          />
          <MotionArrow x1={98} y1={58} x2={112} y2={58} />
        </g>
      );

    case "seated-face-to-face":
      return (
        <g>
          <FloorSurface />
          <SupportPad x={100} y={89} width={90} height={10} />
          <SupportPad x={60} y={64} width={10} height={44} />
          <SupportPad x={140} y={64} width={10} height={44} />
          <PoseFigure
            head={{ x: 76, y: 48 }}
            shoulder={{ x: 80, y: 58 }}
            hip={{ x: 84, y: 74 }}
            knee={{ x: 98, y: 86 }}
            foot={{ x: 112, y: 88 }}
            rearKnee={{ x: 94, y: 82 }}
            rearFoot={{ x: 107, y: 84 }}
            elbow={{ x: 94, y: 64 }}
            hand={{ x: 102, y: 66 }}
            stroke={PARTNER_A_STROKE}
            fill={PARTNER_A_FILL}
            label="A"
            labelOffset={{ x: 84, y: 74 }}
          />
          <PoseFigure
            head={{ x: 124, y: 48 }}
            shoulder={{ x: 120, y: 58 }}
            hip={{ x: 116, y: 74 }}
            knee={{ x: 102, y: 86 }}
            foot={{ x: 88, y: 88 }}
            rearKnee={{ x: 106, y: 82 }}
            rearFoot={{ x: 93, y: 84 }}
            elbow={{ x: 106, y: 64 }}
            hand={{ x: 98, y: 66 }}
            stroke={PARTNER_B_STROKE}
            fill={PARTNER_B_FILL}
            label="B"
            labelOffset={{ x: 116, y: 74 }}
          />
          <MotionArrow x1={98} y1={40} x2={102} y2={40} />
        </g>
      );

    case "seated-reverse":
      return (
        <g>
          <FloorSurface />
          <SupportPad x={106} y={89} width={98} height={10} />
          <SupportPad x={64} y={64} width={10} height={50} />
          <PoseFigure
            head={{ x: 86, y: 50 }}
            shoulder={{ x: 90, y: 60 }}
            hip={{ x: 94, y: 76 }}
            knee={{ x: 108, y: 88 }}
            foot={{ x: 122, y: 90 }}
            rearKnee={{ x: 104, y: 84 }}
            rearFoot={{ x: 118, y: 86 }}
            stroke={PARTNER_A_STROKE}
            fill={PARTNER_A_FILL}
            label="A"
            labelOffset={{ x: 96, y: 76 }}
          />
          <PoseFigure
            head={{ x: 118, y: 44 }}
            shoulder={{ x: 122, y: 54 }}
            hip={{ x: 126, y: 70 }}
            knee={{ x: 140, y: 84 }}
            foot={{ x: 152, y: 88 }}
            rearKnee={{ x: 136, y: 80 }}
            rearFoot={{ x: 149, y: 83 }}
            stroke={PARTNER_B_STROKE}
            fill={PARTNER_B_FILL}
            label="B"
            labelOffset={{ x: 128, y: 70 }}
          />
          <MotionArrow x1={136} y1={42} x2={152} y2={42} />
        </g>
      );

    case "reclined-supported":
      return (
        <g>
          <BedSurface />
          <path
            d="M32 90 L74 90 L74 72 L40 58 Z"
            fill={SUPPORT_FILL}
            stroke={SUPPORT_STROKE}
            strokeWidth={1.5}
          />
          <SupportPad x={146} y={78} width={28} height={12} />
          <PoseFigure
            head={{ x: 56, y: 58 }}
            shoulder={{ x: 64, y: 64 }}
            hip={{ x: 86, y: 74 }}
            knee={{ x: 106, y: 84 }}
            foot={{ x: 122, y: 90 }}
            rearKnee={{ x: 102, y: 79 }}
            rearFoot={{ x: 118, y: 84 }}
            stroke={PARTNER_A_STROKE}
            fill={PARTNER_A_FILL}
            label="A"
            labelOffset={{ x: 88, y: 73 }}
          />
          <PoseFigure
            head={{ x: 132, y: 44 }}
            shoulder={{ x: 132, y: 54 }}
            hip={{ x: 132, y: 70 }}
            knee={{ x: 138, y: 84 }}
            foot={{ x: 146, y: 92 }}
            rearKnee={{ x: 130, y: 84 }}
            rearFoot={{ x: 138, y: 92 }}
            stroke={PARTNER_B_STROKE}
            fill={PARTNER_B_FILL}
            label="B"
            labelOffset={{ x: 132, y: 70 }}
          />
          <MotionArrow x1={136} y1={38} x2={136} y2={30} />
        </g>
      );

    case "supine-supported":
      return (
        <g>
          <BedSurface />
          <SupportPad x={98} y={84} width={30} height={12} />
          <SupportPad x={52} y={84} width={22} height={10} />
          <PoseFigure
            head={{ x: 48, y: 80 }}
            shoulder={{ x: 58, y: 82 }}
            hip={{ x: 88, y: 84 }}
            knee={{ x: 108, y: 88 }}
            foot={{ x: 124, y: 92 }}
            rearKnee={{ x: 106, y: 84 }}
            rearFoot={{ x: 122, y: 87 }}
            stroke={PARTNER_A_STROKE}
            fill={PARTNER_A_FILL}
            label="A"
            labelOffset={{ x: 92, y: 84 }}
          />
          <PoseFigure
            head={{ x: 132, y: 46 }}
            shoulder={{ x: 132, y: 56 }}
            hip={{ x: 132, y: 72 }}
            knee={{ x: 138, y: 86 }}
            foot={{ x: 146, y: 94 }}
            rearKnee={{ x: 130, y: 86 }}
            rearFoot={{ x: 138, y: 94 }}
            stroke={PARTNER_B_STROKE}
            fill={PARTNER_B_FILL}
            label="B"
            labelOffset={{ x: 132, y: 72 }}
          />
          <MotionArrow x1={140} y1={44} x2={140} y2={36} />
        </g>
      );

    case "edge-supported":
      return (
        <g>
          <rect x={20} y={74} width={88} height={16} rx={4} fill={SUPPORT_FILL} stroke={SUPPORT_STROKE} />
          <line x1={108} y1={74} x2={108} y2={98} stroke={SUPPORT_STROKE} strokeWidth={2} />
          <line x1={108} y1={94} x2={188} y2={94} stroke={SUPPORT_STROKE} strokeWidth={2} />
          <PoseFigure
            head={{ x: 62, y: 66 }}
            shoulder={{ x: 72, y: 68 }}
            hip={{ x: 94, y: 72 }}
            knee={{ x: 110, y: 82 }}
            foot={{ x: 118, y: 90 }}
            rearKnee={{ x: 107, y: 78 }}
            rearFoot={{ x: 115, y: 86 }}
            stroke={PARTNER_A_STROKE}
            fill={PARTNER_A_FILL}
            label="A"
            labelOffset={{ x: 96, y: 72 }}
          />
          <PoseFigure
            head={{ x: 146, y: 42 }}
            shoulder={{ x: 146, y: 54 }}
            hip={{ x: 146, y: 70 }}
            knee={{ x: 146, y: 84 }}
            foot={{ x: 146, y: 96 }}
            rearKnee={{ x: 154, y: 84 }}
            rearFoot={{ x: 154, y: 96 }}
            stroke={PARTNER_B_STROKE}
            fill={PARTNER_B_FILL}
            label="B"
            labelOffset={{ x: 146, y: 70 }}
          />
          <MotionArrow x1={154} y1={44} x2={154} y2={36} />
        </g>
      );

    case "chair-supported":
      return (
        <g>
          <FloorSurface />
          <rect x={36} y={76} width={48} height={8} rx={3} fill={SUPPORT_FILL} stroke={SUPPORT_STROKE} />
          <rect x={32} y={54} width={8} height={30} rx={3} fill={SUPPORT_FILL} stroke={SUPPORT_STROKE} />
          <rect x={116} y={76} width={48} height={8} rx={3} fill={SUPPORT_FILL} stroke={SUPPORT_STROKE} />
          <rect x={160} y={54} width={8} height={30} rx={3} fill={SUPPORT_FILL} stroke={SUPPORT_STROKE} />
          <PoseFigure
            head={{ x: 76, y: 52 }}
            shoulder={{ x: 80, y: 62 }}
            hip={{ x: 84, y: 76 }}
            knee={{ x: 96, y: 88 }}
            foot={{ x: 110, y: 94 }}
            rearKnee={{ x: 92, y: 84 }}
            rearFoot={{ x: 106, y: 90 }}
            stroke={PARTNER_A_STROKE}
            fill={PARTNER_A_FILL}
            label="A"
            labelOffset={{ x: 84, y: 76 }}
          />
          <PoseFigure
            head={{ x: 124, y: 52 }}
            shoulder={{ x: 120, y: 62 }}
            hip={{ x: 116, y: 76 }}
            knee={{ x: 104, y: 88 }}
            foot={{ x: 90, y: 94 }}
            rearKnee={{ x: 108, y: 84 }}
            rearFoot={{ x: 94, y: 90 }}
            stroke={PARTNER_B_STROKE}
            fill={PARTNER_B_FILL}
            label="B"
            labelOffset={{ x: 116, y: 76 }}
          />
          <MotionArrow x1={100} y1={46} x2={110} y2={46} />
        </g>
      );

    case "quadruped-supported":
      return (
        <g>
          <BedSurface />
          <SupportPad x={84} y={84} width={24} height={8} />
          <SupportPad x={112} y={90} width={22} height={8} />
          <PoseFigure
            head={{ x: 66, y: 62 }}
            shoulder={{ x: 78, y: 68 }}
            hip={{ x: 98, y: 70 }}
            knee={{ x: 114, y: 82 }}
            foot={{ x: 126, y: 92 }}
            rearKnee={{ x: 102, y: 82 }}
            rearFoot={{ x: 116, y: 92 }}
            elbow={{ x: 90, y: 78 }}
            hand={{ x: 98, y: 88 }}
            stroke={PARTNER_A_STROKE}
            fill={PARTNER_A_FILL}
            label="A"
            labelOffset={{ x: 99, y: 70 }}
          />
          <PoseFigure
            head={{ x: 140, y: 48 }}
            shoulder={{ x: 140, y: 58 }}
            hip={{ x: 140, y: 74 }}
            knee={{ x: 146, y: 88 }}
            foot={{ x: 152, y: 96 }}
            rearKnee={{ x: 134, y: 88 }}
            rearFoot={{ x: 140, y: 96 }}
            stroke={PARTNER_B_STROKE}
            fill={PARTNER_B_FILL}
            label="B"
            labelOffset={{ x: 140, y: 74 }}
          />
          <MotionArrow x1={144} y1={44} x2={144} y2={36} />
        </g>
      );

    case "standing-wall-supported":
      return (
        <g>
          <rect x={22} y={30} width={10} height={68} rx={3} fill={SUPPORT_FILL} stroke={SUPPORT_STROKE} />
          <FloorSurface />
          <PoseFigure
            head={{ x: 74, y: 40 }}
            shoulder={{ x: 76, y: 52 }}
            hip={{ x: 78, y: 68 }}
            knee={{ x: 76, y: 84 }}
            foot={{ x: 74, y: 96 }}
            rearKnee={{ x: 84, y: 84 }}
            rearFoot={{ x: 84, y: 96 }}
            elbow={{ x: 68, y: 58 }}
            hand={{ x: 58, y: 60 }}
            stroke={PARTNER_A_STROKE}
            fill={PARTNER_A_FILL}
            label="A"
            labelOffset={{ x: 78, y: 68 }}
          />
          <PoseFigure
            head={{ x: 110, y: 38 }}
            shoulder={{ x: 112, y: 50 }}
            hip={{ x: 114, y: 66 }}
            knee={{ x: 114, y: 84 }}
            foot={{ x: 114, y: 96 }}
            rearKnee={{ x: 122, y: 84 }}
            rearFoot={{ x: 122, y: 96 }}
            stroke={PARTNER_B_STROKE}
            fill={PARTNER_B_FILL}
            label="B"
            labelOffset={{ x: 114, y: 66 }}
          />
          <MotionArrow x1={126} y1={42} x2={126} y2={34} />
        </g>
      );

    case "standing-counter-supported":
      return (
        <g>
          <rect x={24} y={50} width={160} height={8} rx={4} fill={SUPPORT_FILL} stroke={SUPPORT_STROKE} />
          <FloorSurface />
          <SupportPad x={72} y={54} width={20} height={8} />
          <PoseFigure
            head={{ x: 82, y: 44 }}
            shoulder={{ x: 88, y: 56 }}
            hip={{ x: 96, y: 72 }}
            knee={{ x: 96, y: 86 }}
            foot={{ x: 96, y: 96 }}
            rearKnee={{ x: 104, y: 86 }}
            rearFoot={{ x: 104, y: 96 }}
            elbow={{ x: 80, y: 58 }}
            hand={{ x: 72, y: 58 }}
            stroke={PARTNER_A_STROKE}
            fill={PARTNER_A_FILL}
            label="A"
            labelOffset={{ x: 97, y: 72 }}
          />
          <PoseFigure
            head={{ x: 126, y: 40 }}
            shoulder={{ x: 128, y: 52 }}
            hip={{ x: 130, y: 68 }}
            knee={{ x: 130, y: 84 }}
            foot={{ x: 130, y: 96 }}
            rearKnee={{ x: 138, y: 84 }}
            rearFoot={{ x: 138, y: 96 }}
            stroke={PARTNER_B_STROKE}
            fill={PARTNER_B_FILL}
            label="B"
            labelOffset={{ x: 130, y: 68 }}
          />
          <MotionArrow x1={140} y1={42} x2={140} y2={34} />
        </g>
      );

    case "top-forward-supported":
      return (
        <g>
          <BedSurface />
          <SupportPad x={96} y={84} width={30} height={12} />
          <PoseFigure
            head={{ x: 48, y: 80 }}
            shoulder={{ x: 58, y: 82 }}
            hip={{ x: 88, y: 84 }}
            knee={{ x: 108, y: 88 }}
            foot={{ x: 124, y: 92 }}
            rearKnee={{ x: 106, y: 84 }}
            rearFoot={{ x: 122, y: 87 }}
            stroke={PARTNER_A_STROKE}
            fill={PARTNER_A_FILL}
            label="A"
            labelOffset={{ x: 92, y: 84 }}
          />
          <PoseFigure
            head={{ x: 108, y: 48 }}
            shoulder={{ x: 110, y: 58 }}
            hip={{ x: 112, y: 74 }}
            knee={{ x: 120, y: 88 }}
            foot={{ x: 128, y: 94 }}
            rearKnee={{ x: 104, y: 88 }}
            rearFoot={{ x: 96, y: 94 }}
            stroke={PARTNER_B_STROKE}
            fill={PARTNER_B_FILL}
            label="B"
            labelOffset={{ x: 113, y: 74 }}
          />
          <MotionArrow x1={118} y1={44} x2={118} y2={36} />
        </g>
      );

    case "top-backward-supported":
      return (
        <g>
          <BedSurface />
          <SupportPad x={96} y={84} width={30} height={12} />
          <PoseFigure
            head={{ x: 48, y: 80 }}
            shoulder={{ x: 58, y: 82 }}
            hip={{ x: 88, y: 84 }}
            knee={{ x: 108, y: 88 }}
            foot={{ x: 124, y: 92 }}
            rearKnee={{ x: 106, y: 84 }}
            rearFoot={{ x: 122, y: 87 }}
            stroke={PARTNER_A_STROKE}
            fill={PARTNER_A_FILL}
            label="A"
            labelOffset={{ x: 92, y: 84 }}
          />
          <PoseFigure
            head={{ x: 116, y: 88 }}
            shoulder={{ x: 114, y: 78 }}
            hip={{ x: 112, y: 64 }}
            knee={{ x: 104, y: 50 }}
            foot={{ x: 94, y: 44 }}
            rearKnee={{ x: 120, y: 50 }}
            rearFoot={{ x: 130, y: 44 }}
            stroke={PARTNER_B_STROKE}
            fill={PARTNER_B_FILL}
            label="B"
            labelOffset={{ x: 112, y: 64 }}
          />
          <MotionArrow x1={116} y1={90} x2={116} y2={100} />
        </g>
      );

    case "top-sideways-supported":
      return (
        <g>
          <BedSurface />
          <PoseFigure
            head={{ x: 48, y: 80 }}
            shoulder={{ x: 58, y: 82 }}
            hip={{ x: 88, y: 84 }}
            knee={{ x: 108, y: 88 }}
            foot={{ x: 124, y: 92 }}
            rearKnee={{ x: 106, y: 84 }}
            rearFoot={{ x: 122, y: 87 }}
            stroke={PARTNER_A_STROKE}
            fill={PARTNER_A_FILL}
            label="A"
            labelOffset={{ x: 92, y: 84 }}
          />
          <PoseFigure
            head={{ x: 138, y: 62 }}
            shoulder={{ x: 128, y: 62 }}
            hip={{ x: 112, y: 62 }}
            knee={{ x: 98, y: 70 }}
            foot={{ x: 86, y: 78 }}
            rearKnee={{ x: 100, y: 56 }}
            rearFoot={{ x: 88, y: 50 }}
            stroke={PARTNER_B_STROKE}
            fill={PARTNER_B_FILL}
            label="B"
            labelOffset={{ x: 112, y: 62 }}
          />
          <MotionArrow x1={136} y1={56} x2={156} y2={56} />
        </g>
      );

    case "rest-reset":
      return (
        <g>
          <BedSurface />
          <SupportPad x={40} y={82} width={22} height={10} />
          <PoseFigure
            head={{ x: 46, y: 68 }}
            shoulder={{ x: 54, y: 71 }}
            hip={{ x: 76, y: 74 }}
            knee={{ x: 94, y: 79 }}
            foot={{ x: 110, y: 83 }}
            rearKnee={{ x: 92, y: 76 }}
            rearFoot={{ x: 108, y: 80 }}
            stroke={PARTNER_A_STROKE}
            fill={PARTNER_A_FILL}
            label="A"
            labelOffset={{ x: 80, y: 74 }}
          />
          <PoseFigure
            head={{ x: 54, y: 76 }}
            shoulder={{ x: 62, y: 78 }}
            hip={{ x: 86, y: 81 }}
            knee={{ x: 106, y: 86 }}
            foot={{ x: 122, y: 90 }}
            rearKnee={{ x: 104, y: 82 }}
            rearFoot={{ x: 120, y: 85 }}
            stroke={PARTNER_B_STROKE}
            fill={PARTNER_B_FILL}
            label="B"
            labelOffset={{ x: 90, y: 81 }}
          />
          <path
            d="M132 58 Q140 53 148 58 Q156 63 164 58"
            fill="none"
            stroke={SUPPORT_STROKE}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M132 66 Q140 61 148 66 Q156 71 164 66"
            fill="none"
            stroke={SUPPORT_STROKE}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      );

    default:
      return (
        <g>
          <BedSurface />
          <PoseFigure
            head={{ x: 48, y: 80 }}
            shoulder={{ x: 58, y: 82 }}
            hip={{ x: 88, y: 84 }}
            knee={{ x: 108, y: 88 }}
            foot={{ x: 124, y: 92 }}
            rearKnee={{ x: 106, y: 84 }}
            rearFoot={{ x: 122, y: 87 }}
            stroke={PARTNER_A_STROKE}
            fill={PARTNER_A_FILL}
            label="A"
            labelOffset={{ x: 92, y: 84 }}
          />
          <PoseFigure
            head={{ x: 132, y: 46 }}
            shoulder={{ x: 132, y: 56 }}
            hip={{ x: 132, y: 72 }}
            knee={{ x: 138, y: 86 }}
            foot={{ x: 146, y: 94 }}
            rearKnee={{ x: 130, y: 86 }}
            rearFoot={{ x: 138, y: 94 }}
            stroke={PARTNER_B_STROKE}
            fill={PARTNER_B_FILL}
            label="B"
            labelOffset={{ x: 132, y: 72 }}
          />
        </g>
      );
  }
};

export const PositionMechanicsIllustration = ({
  illustrationKey,
  caption,
}: PositionMechanicsIllustrationProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <svg
        viewBox="0 0 200 120"
        role="img"
        aria-label={caption}
        className="h-40 w-full rounded-lg border border-slate-200 bg-white p-1"
      >
        <title>{caption}</title>
        {renderIllustration(illustrationKey)}
      </svg>
      <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-600">
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-teal-700" />
          Partner A
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-700" />
          Partner B
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
          Support
        </span>
      </div>
      <p className="mt-2 text-xs font-semibold text-slate-700">Body mechanics diagram (orientation)</p>
      <p className="mt-1 text-xs text-slate-600">{caption}</p>
      <p className="mt-1 text-[11px] text-slate-500">Diagram only. No photos or explicit imagery.</p>
    </div>
  );
};
