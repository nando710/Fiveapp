import Svg, { Ellipse, Circle, Path, Rect, G } from 'react-native-svg';

interface MascotProps { size?: number }

export function ListenMascot({ size = 95 }: MascotProps) {
  return (
    <Svg width={size} height={size * 1.1} viewBox="0 0 95 105">
      {/* Sombra */}
      <Ellipse cx="47" cy="102" rx="22" ry="4" fill="rgba(0,0,0,0.15)" />
      {/* Corpo */}
      <Ellipse cx="47" cy="72" rx="26" ry="30" fill="#E65C9C" />
      {/* Detalhes corpo */}
      <Ellipse cx="38" cy="62" rx="7" ry="12" fill="rgba(255,255,255,0.1)" transform="rotate(-10 38 62)" />
      {/* Cabeça */}
      <Circle cx="47" cy="40" r="26" fill="#F06FAD" />
      {/* Fone — arco */}
      <Path d="M22 38 Q22 14 47 14 Q72 14 72 38" stroke="#C2185B" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Fone — orelha esquerda */}
      <Rect x="16" y="35" width="10" height="16" rx="5" fill="#C2185B" />
      {/* Fone — orelha direita */}
      <Rect x="69" y="35" width="10" height="16" rx="5" fill="#C2185B" />
      {/* Olhos — branco */}
      <Ellipse cx="37" cy="40" rx="9" ry="11" fill="white" />
      <Ellipse cx="57" cy="40" rx="9" ry="11" fill="white" />
      {/* Olhos — pupila */}
      <Circle cx="38" cy="41" r="5.5" fill="#1a1030" />
      <Circle cx="58" cy="41" r="5.5" fill="#1a1030" />
      {/* Brilho */}
      <Circle cx="40" cy="38" r="2" fill="white" />
      <Circle cx="60" cy="38" r="2" fill="white" />
      {/* Boca */}
      <Path d="M39 53 Q47 60 55 53" stroke="#b5006e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Braços */}
      <Ellipse cx="18" cy="68" rx="12" ry="7" fill="#F06FAD" transform="rotate(-30 18 68)" />
      <Ellipse cx="76" cy="68" rx="12" ry="7" fill="#F06FAD" transform="rotate(30 76 68)" />
      {/* Nota musical na mão */}
      <G transform="translate(68 56)">
        <Ellipse cx="4" cy="13" rx="4" ry="3" fill="white" />
        <Rect x="7.5" y="3" width="2" height="10" rx="1" fill="white" />
        <Path d="M9.5 3 L15 1 L15 4 L9.5 6 Z" fill="white" />
      </G>
    </Svg>
  );
}
