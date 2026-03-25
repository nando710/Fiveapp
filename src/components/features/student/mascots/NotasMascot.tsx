import Svg, { Ellipse, Circle, Path, G, Polygon } from 'react-native-svg';

interface MascotProps { size?: number }

export function NotasMascot({ size = 95 }: MascotProps) {
  return (
    <Svg width={size} height={size * 1.1} viewBox="0 0 95 105">
      {/* Sombra */}
      <Ellipse cx="47" cy="102" rx="22" ry="4" fill="rgba(0,0,0,0.2)" />
      {/* Corpo — estrela arredondada */}
      <Polygon
        points="47,45 56,68 80,68 61,82 68,105 47,91 26,105 33,82 14,68 38,68"
        fill="#1976D2"
      />
      {/* Cabeça */}
      <Circle cx="47" cy="36" r="28" fill="#1E88E5" />
      {/* Estrelinha */}
      <Polygon points="73,18 75,24 81,24 76,28 78,34 73,30 68,34 70,28 65,24 71,24" fill="#FFC107" />
      {/* Olhos */}
      <Ellipse cx="36" cy="33" rx="11" ry="13" fill="white" />
      <Ellipse cx="58" cy="33" rx="11" ry="13" fill="white" />
      <Circle cx="37" cy="35" r="7" fill="#0D47A1" />
      <Circle cx="59" cy="35" r="7" fill="#0D47A1" />
      <Circle cx="40" cy="31" r="3" fill="white" />
      <Circle cx="62" cy="31" r="3" fill="white" />
      {/* Sobrancelhas — expressão de determinação */}
      <Path d="M26 22 Q36 18 42 22" stroke="#0D47A1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M52 22 Q58 18 68 22" stroke="#0D47A1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Boca — confiante */}
      <Path d="M36 48 Q47 57 58 48" stroke="#0D47A1" strokeWidth="2.5" fill="rgba(255,255,255,0.35)" strokeLinecap="round" />
      {/* Nota musical */}
      <G transform="translate(10 55) rotate(-15)">
        <Path d="M0 20 L0 0 L14 -5 L14 15" stroke="#90CAF9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <Circle cx="0" cy="20" r="4" fill="#90CAF9" />
        <Circle cx="14" cy="15" r="4" fill="#90CAF9" />
      </G>
    </Svg>
  );
}
