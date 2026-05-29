import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Share,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Badge } from '../components';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { formatDate, getStatusColor, getStatusLabel, getPriorityColor, openWhatsApp } from '../utils';
import { api } from '../services/api';
import { useAppStore } from '../store';
import { Ticket, TicketComment } from '../types';

export default function TicketDetailScreen({ navigation, route }: any) {
  const { colors, isDark } = useTheme();
  const ticket: Ticket = route?.params?.ticket || {};
  const [currentStatus, setCurrentStatus] = useState(ticket.status || 'pending');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<TicketComment[]>(ticket.comments || []);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const { t, locale } = useTranslation();
  const showToast = useAppStore((s) => s.showToast);

  const statusOptions = [
    { key: 'pending', label: t('ticket.pending'), icon: 'time-outline' },
    { key: 'in_progress', label: t('ticket.inProgress'), icon: 'construct-outline' },
    { key: 'completed', label: t('ticket.completed'), icon: 'checkmark-circle-outline' },
    { key: 'cancelled', label: t('ticket.cancelled'), icon: 'close-circle-outline' },
  ];

  const handleStatusChange = async (status: string) => {
    setCurrentStatus(status as Ticket['status']);
    setShowStatusMenu(false);
    try {
      await api.updateTicket(ticket.id, {
        status: status as Ticket['status'],
        completed_at: status === 'completed' ? new Date().toISOString() : undefined,
      });
      showToast(t('ticket.statusUpdated') + ' ' + getStatusLabel(status).toLowerCase(), 'success');
    } catch {
      showToast(t('common.error'), 'error');
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    const newComment: TicketComment = {
      id: Date.now().toString(),
      ticket_id: ticket.id,
      user_id: ticket.user_id,
      text: comment.trim(),
      created_at: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
    setComment('');
  };

  const handleShare = () => {
    Share.share({
      message: `${t('ticket.shareTitle')}: ${ticket.title}\n${t('ticket.shareStatus')}: ${getStatusLabel(currentStatus)}\n${t('ticket.shareClient')}: ${ticket.client_name || 'N/A'}\n${t('ticket.shareDate')}: ${formatDate(ticket.created_at)}`,
    });
  };

  const handleWhatsApp = async () => {
    const message = `${t('ticket.whatsappHeader')} ${ticket.title}\n${t('ticket.shareStatus')}: ${getStatusLabel(currentStatus)}`;
    try {
      const clients = await api.getClients();
      const client = clients.find((c: any) => c.id === ticket.client_id);
      if (client?.phone) {
        openWhatsApp(client.phone, message);
      } else {
        Alert.alert(t('common.whatsapp'), t('ticket.noClientPhone'));
      }
    } catch {
      Alert.alert(t('common.whatsapp'), t('ticket.cannotGetClient'));
    }
  };

  return (
    <ScreenWrapper style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('ticket.detail')}</Text>
        <View style={{ flexDirection: 'row', gap: Spacing.md }}>
          <TouchableOpacity onPress={() => navigation.navigate('NewTicket', { ticket })}>
            <Ionicons name="pencil-outline" size={22} color={colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert(
            t('common.delete'),
            t('common.confirm'),
            [
              { text: t('common.cancel'), style: 'cancel' },
              { text: t('common.delete'), style: 'destructive', onPress: async () => {
                try { await api.deleteTicket(ticket.id); navigation.goBack(); }
                catch { Alert.alert(t('common.error'), t('common.error')); }
              }},
            ]
          )}>
            <Ionicons name="trash-outline" size={22} color={colors.error} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare}>
            <Ionicons name="share-outline" size={22} color={colors.accent} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.statusBar, { backgroundColor: getStatusColor(currentStatus) + '15' }]}>
          <Badge label={getStatusLabel(currentStatus)} variant={currentStatus === 'completed' ? 'success' : currentStatus === 'in_progress' ? 'info' : currentStatus === 'cancelled' ? 'error' : 'warning'} size="md" />
          <TouchableOpacity
            style={[styles.changeStatusBtn, { borderColor: colors.border }]}
            onPress={() => setShowStatusMenu(!showStatusMenu)}
          >
            <Ionicons name="swap-horizontal-outline" size={16} color={colors.accent} />
            <Text style={[styles.changeStatusText, { color: colors.accent }]}>{t('ticket.changeStatus')}</Text>
          </TouchableOpacity>
        </View>

        {showStatusMenu && (
          <View style={[styles.statusMenu, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {statusOptions.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.statusOption, currentStatus === opt.key && { backgroundColor: getStatusColor(opt.key) + '15' }]}
                onPress={() => handleStatusChange(opt.key)}
              >
                <Ionicons name={opt.icon as any} size={18} color={getStatusColor(opt.key)} />
                <Text style={[styles.statusOptionText, { color: colors.text }]}>{opt.label}</Text>
                {currentStatus === opt.key && (
                  <Ionicons name="checkmark" size={18} color={getStatusColor(opt.key)} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.ticketTitle, { color: colors.text }]}>{ticket.title}</Text>
          {ticket.description && (
            <Text style={[styles.description, { color: colors.textSecondary }]}>{ticket.description}</Text>
          )}

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>{t('client.name')}:</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>{ticket.client_name || t('ticket.unassigned')}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="flag-outline" size={14} color={getPriorityColor(ticket.priority)} />
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>{t('ticket.priority')}:</Text>
              <Text style={[styles.metaValue, { color: getPriorityColor(ticket.priority) }]}>{ticket.priority}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>{t('ticket.createdLabel')}</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>{formatDate(ticket.created_at, 'long')}</Text>
            </View>
            {ticket.scheduled_date && (
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={14} color={colors.accent} />
                <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>{t('ticket.scheduledLabel')}</Text>
                <Text style={[styles.metaValue, { color: colors.accent }]}>{formatDate(ticket.scheduled_date, 'long')}</Text>
              </View>
            )}
          </View>
        </View>

        {ticket.images && ticket.images.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('ticket.attachments')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.attachmentRow}>
              {ticket.images.map((img, i) => (
                <View key={i}>
                  <Image source={{ uri: img }} style={styles.attachmentImage} />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('ticket.commentsLabel')} ({comments.length})
          </Text>

          {comments.length === 0 && (
            <View style={[styles.emptyComments, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="chatbubbles-outline" size={32} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>{t('ticket.noComments')}</Text>
            </View>
          )}

          {comments.map((c) => (
            <View key={c.id} style={[styles.commentBubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.commentHeader}>
                <Text style={[styles.commentAuthor, { color: colors.accent }]}>{t('ticket.technician')}</Text>
                <Text style={[styles.commentTime, { color: colors.textTertiary }]}>{formatDate(c.created_at, 'relative')}</Text>
              </View>
              <Text style={[styles.commentText, { color: colors.text }]}>{c.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.commentInput, { backgroundColor: colors.inputBackground, color: colors.text }]}
          placeholder={t('ticket.addComment')}
          placeholderTextColor={colors.textTertiary}
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: colors.accent, opacity: comment.trim() ? 1 : 0.5 }]}
          onPress={handleAddComment}
          disabled={!comment.trim()}
        >
          <Ionicons name="send" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.huge,
    paddingBottom: Spacing.md,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { padding: Spacing.xxl, paddingBottom: Spacing.massive },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  changeStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
  },
  changeStatusText: { fontSize: 12, fontWeight: '600' },
  statusMenu: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  statusOptionText: { flex: 1, fontSize: 14, fontWeight: '500' },
  section: { marginBottom: Spacing.xl },
  ticketTitle: { fontSize: 20, fontWeight: '700', marginBottom: Spacing.sm },
  description: { fontSize: 14, lineHeight: 20, marginBottom: Spacing.lg },
  metaGrid: { gap: Spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  metaLabel: { fontSize: 13, width: 70 },
  metaValue: { fontSize: 13, fontWeight: '500', flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: Spacing.lg },
  attachmentRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  attachmentImage: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.md,
  },
  emptyComments: {
    alignItems: 'center',
    padding: Spacing.xxl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  emptyText: { fontSize: 14 },
  commentBubble: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  commentAuthor: { fontSize: 12, fontWeight: '600' },
  commentTime: { fontSize: 11 },
  commentText: { fontSize: 14, lineHeight: 20 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  commentInput: {
    flex: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
