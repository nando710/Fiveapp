import Svg, { Ellipse, Circle, Path, G, Rect, Line } from 'react-native-svg';

interface MascotProps { size?: number }

export function ArMascot({ size = 95 }: MascotProps) {
  return (
    <Svg width={size} height={size * 1.1} viewBox="0 0 95 105">
      {/* Sombra */}
      <Ellipse cx="47" cy="102" rx="22" ry="4" fill="rgba(0,0,0,0.15)" />
      {/* Corpo */}
      <Ellipse cx="47" cy="72" rx="26" ry="30" fill="#00897B" />
      {/* Detalhes do corpo */}
      <Ellipse cx="38" cy="62" rx="7" ry="12" fill="rgba(255,255,255,0.1)" transform="rotate(-10 38 62)" />
      {/* Cabeça */}
      <Circle cx="47" cy="40" r="26" fill="#00A896" />
      {/* Antenas */}
      <Line x1="36" y1="16" x2="30" y2="6" stroke="#4DB6AC" strokeWidth="2.5" strokeLinecap="round" />
      <Circle cx="29" cy="5" r="3.5" fill="#80CBC4" />
      <Line x1="58" y1="16" x2="64" y2="6" stroke="#4DB6AC" strokeWidth="2.5" strokeLinecap="round" />
      <Circle cx="65" cy="5" r="3.5" fill="#80CBC4" />
      {/* Óculos AR */}
      <Rect x="20" y="28" width="55" height="20" rx="6" fill="rgba(0,0,0,0.3)" />
      <Rect x="21" y="29" width="23" height="18" rx="5" fill="#00BCD4" opacity="0.8" />
      <Rect x="51" y="29" width="23" height="18" rx="5" fill="#00BCD4" opacity="0.8" />
      {/* Brilho dos óculos */}
      <Path d="M24 32 Q29 30 36 34" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <Path d="M54 32 Q59 30 66 34" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Olhos digitais dentro dos óculos */}
      <Circle cx="32" cy="38" r="5" fill="#E0F7FA" />
      <Circle cx="63" cy="38" r="5" fill="#E0F7FA" />
      <Circle cx="32" cy="38" r="3" fill="#006064" />
      <Circle cx="63" cy="38" r="3" fill="#006064" />
      <Circle cx="34" cy="36" r="1.5" fill="white" />
      <Circle cx="65" cy="36" r="1.5" fill="white" />
      {/* Boca */}
      <Path d="M36 55 Q47 65 58 55" stroke="#00695C" strokeWidth="2.5" fill="rgba(255,255,255,0.3)" strokeLinecap="round" />
      {/* Braços */}
      <Ellipse cx="18" cy="68" rx="12" ry="7" fill="#00A896" transform="rotate(-30 18 68)" />
      <Ellipse cx="76" cy="68" rx="12" ry="7" fill="#00A896" transform="rotate(30 76 68)" />
      {/* Ícone AR na mão */}
      <G transform="translate(68 56)">
        <Rect x="0" y="0" width="16" height="16" rx="3" fill="rgba(255,255,255,0.2)" stroke="#80CBC4" strokeWidth="1.5" />
        <Path d="M3 3 L3 0 M0 3 L3 3" stroke="#E0F7FA" strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M13 3 L13 0 M16 3 L13 3" stroke="#E0F7FA" strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M3 13 L3 16 M0 13 L3 13" stroke="#E0F7FA" strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M13 13 L13 16 M16 13 L13 13" stroke="#E0F7FA" strokeWidth="1.5" strokeLinecap="round" />
      </G>
    </Svg>
  );
}
