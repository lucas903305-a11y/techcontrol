import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Input } from '../components';
import { useTheme } from '../hooks/useTheme';

export default function AIAssistantScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    const userMsg = { role: 'user', content: message };
    setChat((prev) => [...prev, userMsg]);
    setMessage('');
    setLoading(true);
    setTimeout(() => {
      setChat((prev) => [...prev, { role: 'assistant', content: 'Basado en la descripción, podría tratarse de un problema de conectividad en el cableado. Te sugiero:\n\n1. Verificar el cable RJ45\n2. Comprobar el puerto del switch\n3. Hacer un test de continuidad\n\n¿Querés que profundice en algún punto?' }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Asistente IA</Text>
        <TouchableOpacity>
          <Ionicons name="camera-outline" size={24} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
        {chat.length === 0 && (
          <View style={styles.welcome}>
            <View style={[styles.aiAvatar, { backgroundColor: colors.accent }]}>
              <Ionicons name="hardware-chip-outline" size={32} color="#FFFFFF" />
            </View>
            <Text style={[styles.welcomeTitle, { color: colors.text }]}>Asistente Técnico IA</Text>
            <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>Describime el problema técnico o subí una foto y te ayudo con el diagnóstico.</Text>
            <View style={styles.suggestions}>
              {['No funciona la cámara de seguridad', 'Pérdida de conectividad en la red', 'Error en servidor'].map((s, i) => (
                <TouchableOpacity key={i} style={[styles.suggestionChip, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => { setMessage(s); setTimeout(handleSend, 100); }}>
                  <Text style={[styles.suggestionText, { color: colors.text }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {chat.map((msg, i) => (
          <View key={i} style={[styles.chatBubble, msg.role === 'user' ? [styles.userBubble, { backgroundColor: colors.accent }] : [styles.aiBubble, { backgroundColor: colors.surface, borderColor: colors.border }]]}>
            <Text style={[styles.chatText, { color: msg.role === 'user' ? '#FFFFFF' : colors.text }]}>{msg.content}</Text>
          </View>
        ))}

        {loading && (
          <View style={[styles.chatBubble, styles.aiBubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.chatText, { color: colors.textSecondary }]}>Analizando...</Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.cameraBtn}>
          <Ionicons name="camera-outline" size={22} color={colors.accent} />
        </TouchableOpacity>
        <View style={styles.textInput}>
          <Input placeholder="Describí el problema..." value={message} onChangeText={setMessage} containerStyle={{ marginBottom: 0, flex: 1 }} />
        </View>
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.accent }]} onPress={handleSend}>
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
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
  suggestionChip: { padding: Spacing.lg, borderRadius: BorderRadius.lg, borderWidth: 1 },
  suggestionText: { fontSize: 14 },
  chatBubble: { maxWidth: '85%', padding: Spacing.lg, borderRadius: BorderRadius.lg, marginBottom: Spacing.md },
  userBubble: { alignSelf: 'flex-end' },
  aiBubble: { alignSelf: 'flex-start', borderWidth: 1 },
  chatText: { fontSize: 14, lineHeight: 20 },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, paddingHorizontal: Spacing.lg, borderTopWidth: 1, gap: Spacing.sm },
  cameraBtn: { padding: Spacing.sm },
  textInput: { flex: 1 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
