import Svg, { Ellipse, Circle, Path, G, Rect, Line } from 'react-native-svg';

interface MascotProps { size?: number }

export function ReposicoesMascot({ size = 95 }: MascotProps) {
  return (
    <Svg width={size} height={size * 1.1} viewBox="0 0 95 105">
      {/* Sombra */}
      <Ellipse cx="47" cy="102" rx="22" ry="4" fill="rgba(0,0,0,0.15)" />
      {/* Corpo */}
      <Ellipse cx="47" cy="72" rx="26" ry="30" fill="#4CAF50" />
      {/* Cabeça */}
      <Circle cx="47" cy="40" r="26" fill="#66BB6A" />
      {/* Folhas no topo */}
      <Path d="M33 16 Q27 6 37 10 Q31 18 33 16" fill="#388E3C" />
      <Path d="M47 12 Q47 2 52 8 Q44 14 47 12" fill="#2E7D32" />
      <Path d="M61 16 Q67 6 57 10 Q63 18 61 16" fill="#388E3C" />
      {/* Olhos */}
      <Ellipse cx="36" cy="38" rx="10" ry="12" fill="white" />
      <Ellipse cx="58" cy="38" rx="10" ry="12" fill="white" />
      <Circle cx="37" cy="39" r="6" fill="#1a1030" />
      <Circle cx="59" cy="39" r="6" fill="#1a1030" />
      <Circle cx="40" cy="36" r="2.5" fill="white" />
      <Circle cx="62" cy="36" r="2.5" fill="white" />
      {/* Bochecha */}
      <Ellipse cx="24" cy="47" rx="7" ry="5" fill="rgba(255,100,100,0.25)" />
      <Ellipse cx="70" cy="47" rx="7" ry="5" fill="rgba(255,100,100,0.25)" />
      {/* Boca */}
      <Path d="M37 52 Q47 62 57 52" stroke="#2E7D32" strokeWidth="2.5" fill="rgba(255,255,255,0.4)" strokeLinecap="round" />
      {/* Braços */}
      <Ellipse cx="18" cy="65" rx="12" ry="7" fill="#66BB6A" transform="rotate(-25 18 65)" />
      <Ellipse cx="76" cy="65" rx="12" ry="7" fill="#66BB6A" transform="rotate(25 76 65)" />
      {/* Calendário */}
      <G transform="translate(64 55)">
        <Rect x="0" y="0" width="18" height="18" rx="3" fill="white" opacity="0.9" />
        <Rect x="0" y="0" width="18" height="5" rx="3" fill="#388E3C" />
        <Line x1="4" y1="2.5" x2="4" y2="0" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <Line x1="14" y1="2.5" x2="14" y2="0" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <Rect x="3" y="7" width="3" height="3" rx="1" fill="#4CAF50" />
        <Rect x="7.5" y="7" width="3" height="3" rx="1" fill="#4CAF50" />
        <Rect x="12" y="7" width="3" height="3" rx="1" fill="#4CAF50" />
        <Rect x="3" y="12" width="3" height="3" rx="1" fill="#ccc" />
        <Rect x="7.5" y="12" width="3" height="3" rx="1" fill="#ccc" />
      </G>
    </Svg>
  );
}
