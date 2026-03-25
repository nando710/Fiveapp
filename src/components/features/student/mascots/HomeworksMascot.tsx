import Svg, { Ellipse, Circle, Path, Rect, G } from 'react-native-svg';

interface MascotProps { size?: number }

export function HomeworksMascot({ size = 95 }: MascotProps) {
  return (
    <Svg width={size} height={size * 1.1} viewBox="0 0 95 105">
      {/* Sombra */}
      <Ellipse cx="47" cy="102" rx="22" ry="4" fill="rgba(0,0,0,0.15)" />
      {/* Corpo */}
      <Ellipse cx="47" cy="72" rx="26" ry="30" fill="#FF8C42" />
      {/* Cabeça */}
      <Circle cx="47" cy="40" r="26" fill="#FF9A56" />
      {/* Chifrinhos */}
      <Ellipse cx="34" cy="17" rx="6" ry="9" fill="#e06b1a" transform="rotate(-20 34 17)" />
      <Ellipse cx="60" cy="17" rx="6" ry="9" fill="#e06b1a" transform="rotate(20 60 17)" />
      {/* Olhos — branco */}
      <Ellipse cx="36" cy="38" rx="10" ry="12" fill="white" />
      <Ellipse cx="58" cy="38" rx="10" ry="12" fill="white" />
      {/* Olhos — pupila */}
      <Circle cx="37" cy="39" r="6" fill="#1a1030" />
      <Circle cx="59" cy="39" r="6" fill="#1a1030" />
      {/* Brilho dos olhos */}
      <Circle cx="40" cy="36" r="2.5" fill="white" />
      <Circle cx="62" cy="36" r="2.5" fill="white" />
      {/* Boca */}
      <Path d="M39 52 Q47 59 55 52" stroke="#c05a10" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Braços */}
      <Ellipse cx="18" cy="68" rx="12" ry="7" fill="#FF9A56" transform="rotate(-30 18 68)" />
      <Ellipse cx="76" cy="68" rx="12" ry="7" fill="#FF9A56" transform="rotate(30 76 68)" />
      {/* Livro na mão direita */}
      <G transform="translate(70 60) rotate(20)">
        <Rect x="0" y="0" width="14" height="18" rx="2" fill="#4a9e50" />
        <Rect x="0" y="0" width="2" height="18" rx="1" fill="#3a7e40" />
        <Path d="M4 5 H12 M4 8 H12 M4 11 H12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </G>
    </Svg>
  );
}
