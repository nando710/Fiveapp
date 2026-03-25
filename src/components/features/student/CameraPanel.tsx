import { useRef, useState, useEffect } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions, type CameraType, type FlashMode } from 'expo-camera';
import { Image } from 'expo-image';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { Text } from '@components/ui';

// Componente separado para que o hook useVideoPlayer só seja chamado quando há vídeo
function VideoPreview({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.play();
  });

  return (
    <VideoView
      player={player}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
    />
  );
}

const { width: W, height: H } = Dimensions.get('window');

const MAX_DURATION = 15; // segundos
const RING_RADIUS = 40;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
// Tamanho do SVG = diâmetro do anel + espessura da borda (6px cada lado)
const SVG_SIZE = (RING_RADIUS + 6) * 2;

type MediaType = 'photo' | 'video';

interface CameraPanelProps {
  onClose: () => void;
}

export function CameraPanel({ onClose }: CameraPanelProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [facing, setFacing]     = useState<CameraType>('back');
  const [flash, setFlash]       = useState<FlashMode>('off');
  const [capturing, setCapturing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(MAX_DURATION);

  const [previewUri, setPreviewUri]   = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<MediaType>('photo');

  const cameraRef     = useRef<CameraView>(null);
  const holdTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordingRef  = useRef(false);
  const countdownRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  // Progresso do anel SVG (0 → 1 em 15s)
  const ringProgress = useRef(new Animated.Value(0)).current;
  const ringAnim     = useRef<Animated.CompositeAnimation | null>(null);

  // strokeDashoffset: CIRCUMFERENCE (vazio) → 0 (cheio)
  const strokeOffset = ringProgress.interpolate({
    inputRange:  [0, 1],
    outputRange: [RING_CIRCUMFERENCE, 0],
  });

  // Escala do botão interno ao gravar
  const innerScale = useRef(new Animated.Value(1)).current;

  const startRecording = async () => {
    if (!cameraRef.current || recordingRef.current) return;

    // Garante permissão de microfone antes de gravar
    if (!micPermission?.granted) {
      const result = await requestMicPermission();
      if (!result.granted) return;
    }

    recordingRef.current = true;
    setIsRecording(true);
    setCountdown(MAX_DURATION);

    // Anima o inner para virar quadrado arredondado
    Animated.spring(innerScale, { toValue: 0.5, useNativeDriver: true, speed: 20, bounciness: 0 }).start();

    // Inicia anel de progresso
    ringAnim.current = Animated.timing(ringProgress, {
      toValue: 1,
      duration: MAX_DURATION * 1000,
      useNativeDriver: false,
    });
    ringAnim.current.start(({ finished }) => {
      // Gravação terminou pelo limite de tempo
      if (finished) stopRecording();
    });

    // Countdown
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    try {
      const video = await cameraRef.current.recordAsync({ maxDuration: MAX_DURATION });
      if (video) {
        setPreviewUri(video.uri);
        setPreviewType('video');
      }
    } catch {
      // gravação cancelada
    }
  };

  const stopRecording = () => {
    if (!recordingRef.current) return;
    recordingRef.current = false;

    ringAnim.current?.stop();
    ringProgress.setValue(0);
    if (countdownRef.current) clearInterval(countdownRef.current);
    Animated.spring(innerScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 4 }).start();

    cameraRef.current?.stopRecording();
    setIsRecording(false);
    setCountdown(MAX_DURATION);
  };

  const handlePressIn = () => {
    // Espera 250ms: se ainda pressionado → grava; se soltou antes → foto
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;
      startRecording();
    }, 250);
  };

  const handlePressOut = () => {
    if (holdTimer.current) {
      // Soltou rápido → era um toque → tira foto
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
      takePhoto();
    } else if (isRecording) {
      stopRecording();
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
      if (photo) {
        setPreviewUri(photo.uri);
        setPreviewType('photo');
      }
    } finally {
      setCapturing(false);
    }
  };

  const handleDiscard = () => {
    setPreviewUri(null);
  };

  const handlePost = () => {
    // TODO: conectar ao backend Supabase para publicar o story
    setPreviewUri(null);
    onClose();
  };

  // Limpeza ao desmontar
  useEffect(() => {
    return () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      ringAnim.current?.stop();
      if (recordingRef.current) cameraRef.current?.stopRecording();
    };
  }, []);

  // ── Sem permissão ────────────────────────────────────────────────────────────
  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Ionicons name="camera-outline" size={52} color="rgba(255,255,255,0.6)" />
        <Text style={styles.permText}>Precisamos de acesso à câmera</Text>
        <Pressable style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Permitir câmera</Text>
        </Pressable>
        <Pressable onPress={onClose} style={styles.permClose}>
          <Text style={styles.permCloseText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  // ── Preview (foto ou vídeo) ──────────────────────────────────────────────────
  if (previewUri) {
    return (
      <View style={styles.root}>
        {previewType === 'photo' ? (
          <Image source={{ uri: previewUri }} style={styles.fill} contentFit="cover" />
        ) : (
          <VideoPreview uri={previewUri} />
        )}

        <LinearGradient colors={['rgba(0,0,0,0.5)', 'transparent']} style={styles.previewTopGrad} pointerEvents="none" />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.previewBottomGrad} pointerEvents="none" />

        {/* Badge de tipo */}
        <View style={styles.typeBadge}>
          <Ionicons
            name={previewType === 'video' ? 'videocam' : 'camera'}
            size={13}
            color="#fff"
          />
          <Text style={styles.typeBadgeText}>
            {previewType === 'video' ? 'Vídeo' : 'Foto'}
          </Text>
        </View>

        <Pressable style={styles.closeBtn} onPress={handleDiscard} hitSlop={12}>
          <Ionicons name="close" size={28} color="#fff" />
        </Pressable>

        <View style={styles.previewActions}>
          <Pressable style={styles.discardBtn} onPress={handleDiscard}>
            <Text style={styles.discardText}>Descartar</Text>
          </Pressable>
          <Pressable style={styles.postBtn} onPress={handlePost}>
            <LinearGradient
              colors={['#9B6DFF', '#7B3FF6']}
              style={styles.postBtnGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={styles.postBtnText}>Publicar story</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Câmera ───────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <CameraView
        ref={cameraRef}
        style={styles.fill}
        facing={facing}
        flash={flash}
        mode="video"
      />

      <LinearGradient colors={['rgba(0,0,0,0.55)', 'transparent']} style={styles.topGrad} pointerEvents="none" />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={styles.bottomGrad} pointerEvents="none" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={onClose} hitSlop={12} style={styles.topBtn}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </Pressable>

        {/* Countdown durante gravação */}
        {isRecording ? (
          <View style={styles.recIndicator}>
            <View style={styles.recDot} />
            <Text style={styles.recText}>{countdown}s</Text>
          </View>
        ) : (
          <Text style={styles.cameraTitle}>Novo story</Text>
        )}

        <Pressable
          hitSlop={12}
          style={styles.topBtn}
          onPress={() => setFlash((f) => (f === 'off' ? 'on' : 'off'))}
          disabled={isRecording}
        >
          <Ionicons
            name={flash === 'off' ? 'flash-off-outline' : 'flash-outline'}
            size={24}
            color={flash === 'off' ? 'rgba(255,255,255,0.6)' : '#FFD60A'}
          />
        </Pressable>
      </View>

      {/* Dica de uso */}
      {!isRecording && (
        <View style={styles.hint}>
          <Text style={styles.hintText}>Toque para foto · Segure para vídeo</Text>
        </View>
      )}

      {/* Controles de captura */}
      <View style={styles.captureRow}>
        {/* Flip câmera */}
        <Pressable
          hitSlop={12}
          onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
          style={styles.sideBtn}
          disabled={isRecording}
        >
          <Ionicons name="camera-reverse-outline" size={30} color={isRecording ? 'transparent' : '#fff'} />
        </Pressable>

        {/* Botão de captura com anel de progresso */}
        <View style={styles.captureWrap}>
          {/* Anel SVG de progresso durante gravação */}
          <Svg width={SVG_SIZE} height={SVG_SIZE} style={StyleSheet.absoluteFill} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
            {/* Trilha cinza */}
            {isRecording && (
              <Circle
                cx={SVG_SIZE / 2}
                cy={SVG_SIZE / 2}
                r={RING_RADIUS}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={5}
                fill="none"
              />
            )}
            {/* Arco vermelho animado */}
            {isRecording && (
              <AnimatedCircle
                cx={SVG_SIZE / 2}
                cy={SVG_SIZE / 2}
                r={RING_RADIUS}
                stroke="#FF3B30"
                strokeWidth={5}
                fill="none"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                rotation="-90"
                origin={`${SVG_SIZE / 2}, ${SVG_SIZE / 2}`}
              />
            )}
          </Svg>

          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={capturing}
          >
            <View style={[styles.captureOuter, isRecording && styles.captureOuterRec]}>
              {capturing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Animated.View
                  style={[
                    styles.captureInner,
                    isRecording && styles.captureInnerRec,
                    { transform: [{ scale: innerScale }] },
                  ]}
                />
              )}
            </View>
          </Pressable>
        </View>

        <View style={styles.sideBtn} />
      </View>
    </View>
  );
}

// Wrapper para passar Animated.Value como prop do SVG Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  root:    { width: W, height: H, backgroundColor: '#000' },
  fill:    { ...StyleSheet.absoluteFillObject },
  centered: {
    width: W,
    height: H,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },

  topGrad:        { position: 'absolute', top: 0,    left: 0, right: 0, height: 160 },
  bottomGrad:     { position: 'absolute', bottom: 0, left: 0, right: 0, height: 200 },
  previewTopGrad: { position: 'absolute', top: 0,    left: 0, right: 0, height: 140 },
  previewBottomGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 220 },

  topBar: {
    position: 'absolute',
    top: 52,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBtn: { width: 40, alignItems: 'center' },
  cameraTitle: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: '#fff' },

  recIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  recDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  recText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: '#fff' },

  hint: { position: 'absolute', bottom: 148, left: 0, right: 0, alignItems: 'center' },
  hintText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
  },

  captureRow: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 48,
  },
  sideBtn: { width: 40, alignItems: 'center' },

  captureWrap: {
    width: SVG_SIZE,
    height: SVG_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureOuter: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureOuterRec: { borderColor: 'rgba(255,255,255,0.3)' },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
  },
  captureInnerRec: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
  },

  // Permissão
  permText: { fontFamily: 'Nunito_700Bold', fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  permBtn:  { backgroundColor: '#7B5CF0', paddingHorizontal: 28, paddingVertical: 13, borderRadius: 14, marginTop: 8 },
  permBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: '#fff' },
  permClose: { marginTop: 8 },
  permCloseText: { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: 'rgba(255,255,255,0.5)' },

  // Preview
  typeBadge: {
    position: 'absolute',
    top: 56,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  typeBadgeText: { fontFamily: 'Nunito_700Bold', fontSize: 12, color: '#fff' },
  closeBtn: { position: 'absolute', top: 52, left: 16, padding: 4 },
  previewActions: {
    position: 'absolute',
    bottom: 52,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  discardBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
  },
  discardText: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: 'rgba(255,255,255,0.8)' },
  postBtn: { flex: 1.5, borderRadius: 14, overflow: 'hidden' },
  postBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  postBtnText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 15, color: '#fff' },
});
