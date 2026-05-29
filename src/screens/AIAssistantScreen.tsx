import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Input, Button } from '../components';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { openAIService } from '../services/openai';
import { ScreenWrapper } from '../components/ScreenWrapper';

const responses: { keywords: string[]; reply: string; followUp: string[] }[] = [
  {
    keywords: ['cámara', 'camara', 'dahua', 'hikvision', 'cctv'],
    reply: '**Diagnóstico de cámara:**\n\n1. Verificá la alimentación PoE (switch o inyector)\n2. Comprobá el cable RJ45 con un tester\n3. Revisá que el puerto del switch esté activo (LED verde)\n4. Accedé a la IP de la cámara vía navegador\n5. Si no responde, probá con un reset de fábrica (botón por 10s)',
    followUp: ['¿Qué modelo de cámara es?', '¿Tiene LED de encendido?', '¿Probaste con otro cable?'],
  },
  {
    keywords: ['red', 'wifi', 'conectividad', 'internet', 'router', 'switch'],
    reply: '**Diagnóstico de red:**\n\n1. Hacé un `ping 8.8.8.8` desde la consola\n2. Verificá que el DHCP esté asignando IPs\n3. Revisá los LED del switch/router\n4. Probá con un cable conocido bueno\n5. Ejecutá `tracert` para ver dónde se pierde la conexión\n\nSi es WiFi, verificá interferencias en el canal.',
    followUp: ['¿Afecta a todos los dispositivos?', '¿Hay luces en el router?', '¿Hicieron cambios recientes?'],
  },
  {
    keywords: ['servidor', 'server', 'nas', 'linux', 'windows server'],
    reply: '**Diagnóstico de servidor:**\n\n1. Revisá los logs del sistema: `/var/log/syslog` o Visor de eventos\n2. Verificá espacio en disco con `df -h`\n3. Comprobá memoria con `free -m`\n4. Revisá servicios caídos con `systemctl status`\n5. Hacé un `uptime` para ver hace cuánto está corriendo',
    followUp: ['¿Qué SO tiene el servidor?', '¿Qué servicio falla?', '¿Mostró algún error específico?'],
  },
  {
    keywords: ['impresora', 'printer', 'escaner', 'scanner'],
    reply: '**Diagnóstico de impresora:**\n\n1. Verificá que esté encendida y con papel\n2. Revisá los consumibles (tóner/tinta)\n3. Comprobá la conexión USB o red\n4. En Windows: Configuración > Dispositivos > Impresoras\n5. En red: verificá que la IP sea accesible con `ping`',
    followUp: ['¿Es USB o de red?', '¿Qué modelo es?', '¿Imprime página de prueba?'],
  },
  {
    keywords: ['correo', 'email', 'mail', 'outlook', 'exchange'],
    reply: '**Diagnóstico de correo:**\n\n1. Verificá credenciales en el cliente de correo\n2. Comprobá la configuración SMTP/IMAP\n3. Revisá que el puerto no esté bloqueado (25, 465, 587, 993)\n4. Probá desde webmail para descartar problemas del cliente\n5. Revisá cuota de almacenamiento',
    followUp: ['¿Error al enviar o recibir?', '¿Usa Exchange o POP3/IMAP?', '¿Funciona el webmail?'],
  },
];

function smartReply(input: string) {
  const lower = input.toLowerCase();
  for (const r of responses) {
    if (r.keywords.some((k) => lower.includes(k))) return r;
  }
  return {
    reply: '**Análisis general:**\n\nContame más detalles sobre el problema para poder ayudarte mejor. Incluí:\n\n• ¿Qué equipo o sistema está fallando?\n• ¿Desde cuándo ocurre?\n• ¿Hay algún mensaje de error?\n• ¿Afecta a un equipo o a toda la red?',
    followUp: ['Es un problema de red', 'Es un equipo específico', 'Es un problema de software'],
  };
}

function simulateTyping(input: string): { lines: string[]; delay: number }[] {
  const result = smartReply(input);
  const lines = result.reply.split('\n');
  const chunks: { lines: string[]; delay: number }[] = [];
  for (let i = 0; i < lines.length; i += 2) {
    chunks.push({ lines: lines.slice(i, i + 2), delay: 300 + Math.random() * 400 });
  }
  return chunks;
}

export default function AIAssistantScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ role: string; content: string; image?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [displayedReply, setDisplayedReply] = useState('');
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const scrollToBottom = () => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const isOpenAIReady = !!process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  const streamResponse = async (userMsg: string, history: { role: string; content: string }[]) => {
    setLoading(true);
    setDisplayedReply('');
    setFollowUps([]);

    let text: string;
    let followUp: string[];

    if (isOpenAIReady) {
      text = await openAIService.chatAssistant(userMsg, history.slice(-6));
      followUp = [t('ai.followUpDetail'), t('ai.followUpReport'), t('ai.followUpSteps')];
    } else {
      const result = smartReply(userMsg);
      text = result.reply;
      followUp = result.followUp;
    }

    const lines = text.split('\n');
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < lines.length) {
        setDisplayedReply((prev) => (prev ? prev + '\n' : '') + lines[idx]);
        idx++;
        scrollToBottom();
      } else {
        clearInterval(interval);
        setLoading(false);
        setFollowUps(followUp);
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      }
    }, 80);
  };

  const handleSend = async (text?: string) => {
    const msg = (text || message).trim();
    if (!msg && images.length === 0) return;
    const content = msg || '[Foto adjunta]';
    setChat((prev) => [...prev, { role: 'user', content, image: images[images.length - 1] }]);
    setMessage('');
    setImages([]);
    scrollToBottom();
    streamResponse(msg, chat);
  };

  const handleChip = (s: string) => {
    setChat((prev) => [...prev, { role: 'user', content: s }]);
    streamResponse(s, chat);
  };

  return (
    <ScreenWrapper style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('ai.title')}</Text>
        <TouchableOpacity testID="reset-button" accessibilityLabel="reset" onPress={() => { setChat([]); setDisplayedReply(''); setFollowUps([]); setImages([]); }}>
          <Ionicons name="refresh-outline" size={24} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollRef} style={styles.chatArea} contentContainerStyle={styles.chatContent}>
        {chat.length === 0 && !displayedReply ? (
          <View style={styles.welcome}>
            <View style={[styles.aiAvatar, { backgroundColor: colors.accent }]}>
              <Ionicons name="hardware-chip-outline" size={32} color="#FFFFFF" />
            </View>
            <Text style={[styles.welcomeTitle, { color: colors.text }]}>{t('ai.title')}</Text>
            <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
              {t('ai.subtitle')}
            </Text>
            <View style={styles.suggestions}>
              {[t('ai.suggestionCamera'), t('ai.suggestionNetwork'), t('ai.suggestionServer')].map((s, i) => (
                <TouchableOpacity key={i} style={[styles.suggestionChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => handleChip(s)}>
                  <Ionicons name={(['videocam-outline', 'wifi-outline', 'server-outline'] as const)[i]} size={16} color={colors.accent} />
                  <Text style={[styles.suggestionText, { color: colors.text }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <>
            {chat.map((msg, i) => (
              <View key={i}>
                <View style={[styles.chatBubble, msg.role === 'user' ? [styles.userBubble, { backgroundColor: colors.accent }] : [styles.aiBubble, { backgroundColor: colors.surface, borderColor: colors.border }]]}>
                  {msg.image && <Image source={{ uri: msg.image }} style={styles.chatImage} />}
                  <Text style={[styles.chatText, { color: msg.role === 'user' ? '#FFFFFF' : colors.text }]}>{msg.content}</Text>
                </View>
              </View>
            ))}
            {displayedReply && (
              <View style={[styles.chatBubble, styles.aiBubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.chatText, { color: colors.text }]}>{displayedReply}</Text>
              </View>
            )}
            {loading && !displayedReply && (
              <View style={[styles.chatBubble, styles.aiBubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.typingDot, { color: colors.textSecondary }]}>{t('ai.analyzing')}</Text>
              </View>
            )}
            {followUps.length > 0 && (
              <Animated.View style={[styles.followUpContainer, { opacity: fadeAnim }]}>
                {followUps.map((f, i) => (
                  <TouchableOpacity key={i} style={[styles.followUpChip, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}
                    onPress={() => handleChip(f)}>
                    <Text style={[styles.followUpText, { color: colors.accent }]}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}
          </>
        )}
      </ScrollView>

      <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
          <Ionicons name="images-outline" size={22} color={colors.accent} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraBtn} onPress={takePhoto}>
          <Ionicons name="camera-outline" size={22} color={colors.accent} />
        </TouchableOpacity>
        <View style={styles.textInput}>
          <Input placeholder={t('ai.placeholder')} value={message} onChangeText={setMessage}
            onSubmitEditing={() => handleSend()}
            containerStyle={{ marginBottom: 0, flex: 1 }} />
        </View>
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.accent }]} onPress={() => handleSend()}>
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      {images.length > 0 && (
        <View style={[styles.imagePreviewBar, { backgroundColor: colors.surface }]}>
          {images.map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.previewThumb} />
          ))}
          <Text style={[styles.previewCount, { color: colors.textSecondary }]}>{images.length} {t('ai.photos')}</Text>
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xxl, paddingTop: Spacing.huge, paddingBottom: Spacing.md },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  chatArea: { flex: 1 },
  chatContent: { padding: Spacing.xxl, paddingBottom: Spacing.lg },
  welcome: { alignItems: 'center', paddingTop: Spacing.huge },
  aiAvatar: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  welcomeTitle: { fontSize: 18, fontWeight: '700', marginBottom: Spacing.sm },
  welcomeText: { fontSize: 14, textAlign: 'center', marginBottom: Spacing.xxl },
  suggestions: { gap: Spacing.sm, width: '100%' },
  suggestionChip: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.lg, borderRadius: BorderRadius.lg, borderWidth: 1 },
  suggestionText: { fontSize: 14 },
  chatBubble: { maxWidth: '85%', padding: Spacing.lg, borderRadius: BorderRadius.lg, marginBottom: Spacing.md },
  userBubble: { alignSelf: 'flex-end' },
  aiBubble: { alignSelf: 'flex-start', borderWidth: 1 },
  chatText: { fontSize: 14, lineHeight: 20 },
  chatImage: { width: 160, height: 120, borderRadius: BorderRadius.md, marginBottom: Spacing.sm, resizeMode: 'cover' },
  typingDot: { fontSize: 14, fontStyle: 'italic' },
  followUpContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  followUpChip: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.round, borderWidth: 1 },
  followUpText: { fontSize: 13, fontWeight: '600' },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, paddingHorizontal: Spacing.lg, borderTopWidth: 1, gap: Spacing.sm },
  cameraBtn: { padding: Spacing.sm },
  textInput: { flex: 1 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  imagePreviewBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, gap: Spacing.sm },
  previewThumb: { width: 36, height: 36, borderRadius: BorderRadius.sm },
  previewCount: { fontSize: 12 },
});
