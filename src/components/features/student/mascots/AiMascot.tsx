import Svg, { Ellipse, Circle, Path, G, Polygon, Line } from 'react-native-svg';

interface MascotProps { size?: number }

export function AiMascot({ size = 95 }: MascotProps) {
  return (
    <Svg width={size} height={size * 1.1} viewBox="0 0 95 105">
      {/* Sombra */}
      <Ellipse cx="47" cy="102" rx="22" ry="4" fill="rgba(0,0,0,0.2)" />
      {/* Corpo */}
      <Ellipse cx="47" cy="72" rx="26" ry="30" fill="#7B5CF0" />
      {/* Brilho no corpo */}
      <Ellipse cx="38" cy="58" rx="8" ry="14" fill="rgba(255,255,255,0.12)" transform="rotate(-15 38 58)" />
      {/* Cabeça */}
      <Circle cx="47" cy="40" r="26" fill="#8B6CF8" />
      {/* Antena */}
      <Line x1="47" y1="14" x2="47" y2="5" stroke="#C4B5FD" strokeWidth="2.5" strokeLinecap="round" />
      <Circle cx="47" cy="4" r="4" fill="#A78BFA" />
      <Circle cx="47" cy="4" r="2" fill="#fff" />
      {/* Olhos — hexagonal tech */}
      <Polygon points="27,28 37,22 47,28 47,40 37,46 27,40" fill="white" opacity="0.95" />
      <Polygon points="47,28 57,22 67,28 67,40 57,46 47,40" fill="white" opacity="0.95" />
      <Circle cx="37" cy="34" r="7" fill="#4C1D95" />
      <Circle cx="57" cy="34" r="7" fill="#4C1D95" />
      {/* Íris tech */}
      <Circle cx="37" cy="34" r="4" fill="#7B5CF0" />
      <Circle cx="57" cy="34" r="4" fill="#7B5CF0" />
      {/* Brilho */}
      <Circle cx="40" cy="31" r="2" fill="white" />
      <Circle cx="60" cy="31" r="2" fill="white" />
      {/* Boca — sorriso com dentes */}
      <Path d="M36 51 Q47 60 58 51" stroke="#6D28D9" strokeWidth="2.5" fill="rgba(255,255,255,0.3)" strokeLinecap="round" />
      {/* Raios */}
      <Path d="M66 30 L73 26 L70 33 L78 29" stroke="#C4B5FD" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Braços */}
      <Ellipse cx="18" cy="68" rx="12" ry="7" fill="#8B6CF8" transform="rotate(-30 18 68)" />
      <Ellipse cx="76" cy="68" rx="12" ry="7" fill="#8B6CF8" transform="rotate(30 76 68)" />
    </Svg>
  );
}
