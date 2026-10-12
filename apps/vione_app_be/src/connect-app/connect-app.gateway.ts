import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

export interface ActiveCallRecord {
  callId: string;
  callerUserId: string;
  callerName: string;
  callerAvatar?: string | null;
  callerTitle?: string | null;
  recipientUserId: string;
  callType: 'audio' | 'video';
  status: 'ringing' | 'connected' | 'ended';
  startedAt: number;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/',
})
export class ConnectAppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ConnectAppGateway.name);
  private readonly onlineUserSockets = new Map<string, Set<string>>();
  private readonly activeCalls = new Map<string, ActiveCallRecord>();
  private readonly callTimeouts = new Map<string, NodeJS.Timeout>();

  constructor(private readonly prisma: PrismaService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    for (const [userId, sockets] of this.onlineUserSockets.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.onlineUserSockets.delete(userId);
          if (this.server) {
            this.server.emit('presence:user_offline', { userId });
          }
        }
      }
    }
  }

  isUserOnline(userId: string): boolean {
    if (!userId) return false;
    const sockets = this.onlineUserSockets.get(userId);
    return (sockets?.size ?? 0) > 0;
  }

  @SubscribeMessage('join:room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    if (room && typeof room === 'string') {
      client.join(room);
      this.logger.log(`Client ${client.id} joined room ${room}`);

      if (room.startsWith('user:')) {
        const userId = room.replace('user:', '');
        if (userId) {
          if (!this.onlineUserSockets.has(userId)) {
            this.onlineUserSockets.set(userId, new Set());
          }
          this.onlineUserSockets.get(userId)!.add(client.id);
          if (this.server) {
            this.server.emit('presence:user_online', { userId });
          }

          // Kiểm tra và đẩy ngay cuộc gọi đang đổ chuông nếu có cho user vừa kết nối / vừa đăng nhập
          this.checkAndDeliverActiveCallToUser(userId, client);
        }
      }
      return { ok: true, room };
    }
    return { ok: false };
  }

  @SubscribeMessage('leave:room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    if (room && typeof room === 'string') {
      client.leave(room);
      this.logger.log(`Client ${client.id} left room ${room}`);

      if (room.startsWith('user:')) {
        const userId = room.replace('user:', '');
        if (userId && this.onlineUserSockets.has(userId)) {
          const sockets = this.onlineUserSockets.get(userId)!;
          sockets.delete(client.id);
          if (sockets.size === 0) {
            this.onlineUserSockets.delete(userId);
            if (this.server) {
              this.server.emit('presence:user_offline', { userId });
            }
          }
        }
      }
      return { ok: true, room };
    }
    return { ok: false };
  }

  // ── Moment Events ─────────────────────────────────────────────

  emitMomentCommentAdded(momentId: string, comment: any) {
    if (!this.server) return;
    this.server.to(`moment:${momentId}`).emit('moment:comment_added', {
      momentId,
      comment,
    });
  }

  emitMomentCommentDeleted(momentId: string, commentId: string) {
    if (!this.server) return;
    this.server.to(`moment:${momentId}`).emit('moment:comment_deleted', {
      momentId,
      commentId,
    });
  }

  emitMomentCommentLiked(momentId: string, commentId: string, likesCount: number, userId: string, liked: boolean) {
    if (!this.server) return;
    this.server.to(`moment:${momentId}`).emit('moment:comment_liked', {
      momentId,
      commentId,
      likesCount,
      userId,
      liked,
    });
  }

  emitMomentLiked(momentId: string, likesCount: number, userId: string, liked: boolean) {
    if (!this.server) return;
    this.server.to(`moment:${momentId}`).emit('moment:liked', {
      momentId,
      likesCount,
      userId,
      liked,
    });
    // Also broadcast to general feed room so home feed updates like count in real time
    this.server.emit('moment:feed_liked', {
      momentId,
      likesCount,
    });
  }

  // ── DM Messaging Events ──────────────────────────────────────

  emitDmMessageReceived(threadId: string, recipientUserId: string, message: any, threadSummary: any) {
    if (!this.server) return;
    // Emit to active chat room
    this.server.to(`thread:${threadId}`).emit('dm:message_received', {
      threadId,
      message,
    });
    // Emit to recipient's personal user room for inbox thread list & unread count badge
    this.server.to(`user:${recipientUserId}`).emit('dm:thread_updated', {
      threadId,
      message,
      threadSummary,
    });
  }

  emitDmMessageRetracted(threadId: string, messageId: string) {
    if (!this.server) return;
    this.server.to(`thread:${threadId}`).emit('dm:message_retracted', {
      threadId,
      messageId,
    });
  }

  emitDmReadReceipt(threadId: string, readerUserId: string) {
    if (!this.server) return;
    this.server.to(`thread:${threadId}`).emit('dm:read_receipt', {
      threadId,
      readerUserId,
      readAt: new Date().toISOString(),
    });
  }

  emitDmReaction(threadId: string, messageId: string, reactions: any[]) {
    if (!this.server) return;
    this.server.to(`thread:${threadId}`).emit('dm:reaction_updated', {
      threadId,
      messageId,
      reactions,
    });
  }

  // ── NFC Touch & Connection Events ───────────────────────────

  emitNfcTapped(targetUserId: string, requesterProfile: any, connectionId: string) {
    if (!this.server) return;
    this.server.to(`user:${targetUserId}`).emit('nfc:tapped', {
      requesterProfile,
      connectionId,
      timestamp: new Date().toISOString(),
    });
  }

  emitConnectionRequested(targetUserId: string, requesterProfile: any, connectionId: string) {
    if (!this.server) return;
    this.server.to(`user:${targetUserId}`).emit('connection:requested', {
      requesterProfile,
      connectionId,
      timestamp: new Date().toISOString(),
    });
  }

  emitConnectionAccepted(targetUserId: string, accepterProfile: any, connectionId: string) {
    if (!this.server) return;
    this.server.to(`user:${targetUserId}`).emit('connection:accepted', {
      accepterProfile,
      connectionId,
      timestamp: new Date().toISOString(),
    });
  }

  emitConnectionDeclined(targetUserId: string, declinerProfile: any, connectionId: string) {
    if (!this.server) return;
    this.server.to(`user:${targetUserId}`).emit('connection:declined', {
      declinerProfile,
      connectionId,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('qr:connect')
  handleQrConnect(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { targetUserId: string; requesterProfile: any; connectionId?: string },
  ) {
    if (!payload?.targetUserId || !this.server) return { ok: false };
    const connectionId = payload.connectionId || `conn-${Date.now()}`;
    this.logger.log(`QR connect from ${payload.requesterProfile?.displayName || 'User'} -> user:${payload.targetUserId}`);
    this.server.to(`user:${payload.targetUserId}`).emit('connection:requested', {
      requesterProfile: payload.requesterProfile,
      connectionId,
      timestamp: new Date().toISOString(),
    });
    return { ok: true, connectionId };
  }

  @SubscribeMessage('connection:respond')
  handleConnectionRespond(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { targetUserId: string; accepted: boolean; responderProfile: any; connectionId: string },
  ) {
    if (!payload?.targetUserId || !this.server) return { ok: false };
    this.logger.log(`Connection respond [${payload.accepted ? 'ACCEPTED' : 'DECLINED'}] -> user:${payload.targetUserId}`);
    const eventName = payload.accepted ? 'connection:accepted' : 'connection:declined';
    this.server.to(`user:${payload.targetUserId}`).emit(eventName, {
      responderProfile: payload.responderProfile,
      connectionId: payload.connectionId,
      accepted: payload.accepted,
      timestamp: new Date().toISOString(),
    });
    return { ok: true };
  }

  emitNotification(userId: string, notification: any) {
    if (!this.server) return;
    this.server.to(`user:${userId}`).emit('notification:new', notification);
  }

  emitUnreadNotificationCount(userId: string, unreadCount: number) {
    if (!this.server) return;
    this.server.to(`user:${userId}`).emit('notification:unread_count', { unreadCount });
    this.server.to(`user:${userId}`).emit('notification:count', { count: unreadCount });
    this.server.to(`user:${userId}`).emit('notification:updated', { unreadCount });
  }

  emitToRoom(room: string, event: string, payload: any) {
    if (!this.server) return;
    this.server.to(room).emit(event, payload);
  }

  emitToAll(event: string, payload: any) {
    if (!this.server) return;
    this.server.emit(event, payload);
  }

  // ── Real-time Audio & Video Call Signaling ────────────────────

  checkAndDeliverActiveCallToUser(userId: string, targetSocket?: Socket) {
    if (!userId) return;
    const now = Date.now();
    for (const call of this.activeCalls.values()) {
      if (call.recipientUserId === userId && call.status === 'ringing') {
        const elapsed = now - call.startedAt;
        if (elapsed < 45000) {
          this.logger.log(`[Call Presence] User ${userId} joined -> Re-delivering ringing call ${call.callId} from ${call.callerName}`);
          const payload = {
            callId: call.callId,
            callerUserId: call.callerUserId,
            callerName: call.callerName,
            callerAvatar: call.callerAvatar || null,
            callerTitle: call.callerTitle || null,
            callType: call.callType,
            timestamp: new Date(call.startedAt).toISOString(),
            isReplay: true,
          };
          if (targetSocket) {
            targetSocket.emit('call:incoming', payload);
          } else if (this.server) {
            this.server.to(`user:${userId}`).emit('call:incoming', payload);
          }
        }
      }
    }
  }

  getActiveCallForUser(userId: string) {
    if (!userId) return null;
    const now = Date.now();
    for (const call of this.activeCalls.values()) {
      if (call.recipientUserId === userId && call.status === 'ringing') {
        if (now - call.startedAt < 45000) {
          return {
            callId: call.callId,
            callerUserId: call.callerUserId,
            callerName: call.callerName,
            callerAvatar: call.callerAvatar || null,
            callerTitle: call.callerTitle || null,
            callType: call.callType,
            startedAt: call.startedAt,
          };
        }
      }
    }
    return null;
  }

  @SubscribeMessage('call:check_active')
  handleCheckActiveCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload?: { userId?: string },
  ) {
    const userId = payload?.userId;
    const activeCall = userId ? this.getActiveCallForUser(userId) : null;
    return { ok: true, activeCall };
  }

  @SubscribeMessage('call:initiate')
  handleCallInitiate(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      callId: string;
      recipientUserId: string;
      callerUserId?: string;
      callerName: string;
      callerAvatar?: string;
      callerTitle?: string;
      callType: 'audio' | 'video';
    },
  ) {
    if (!payload?.recipientUserId || !this.server) return { ok: false };
    const callerId = payload.callerUserId || client.id;
    if (callerId === payload.recipientUserId) {
      this.logger.warn(`User ${callerId} attempted to call self`);
      return { ok: false, error: 'cannot_call_self' };
    }

    // Clean up any stale call with same callId
    if (this.callTimeouts.has(payload.callId)) {
      clearTimeout(this.callTimeouts.get(payload.callId)!);
      this.callTimeouts.delete(payload.callId);
    }

    const callRecord: ActiveCallRecord = {
      callId: payload.callId,
      callerUserId: callerId,
      callerName: payload.callerName,
      callerAvatar: payload.callerAvatar || null,
      callerTitle: payload.callerTitle || null,
      recipientUserId: payload.recipientUserId,
      callType: payload.callType || 'video',
      status: 'ringing',
      startedAt: Date.now(),
    };
    this.activeCalls.set(payload.callId, callRecord);

    // Auto timeout after 45 seconds if no answer -> Trigger missed call
    const timer = setTimeout(() => {
      this.handleCallTimeout(payload.callId);
    }, 45000);
    this.callTimeouts.set(payload.callId, timer);

    this.logger.log(`Call initiated [${payload.callType}] by ${payload.callerName} (${callerId}) -> user:${payload.recipientUserId}`);

    // Broadcast to recipient room but explicitly exclude the caller's socket
    client.to(`user:${payload.recipientUserId}`).emit('call:incoming', {
      callId: payload.callId,
      callerUserId: callerId,
      callerName: payload.callerName,
      callerAvatar: payload.callerAvatar || null,
      callerTitle: payload.callerTitle || null,
      callType: payload.callType || 'video',
      timestamp: new Date().toISOString(),
    });

    return { ok: true, callId: payload.callId };
  }

  @SubscribeMessage('call:accept')
  handleCallAccept(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      callId: string;
      callerUserId: string;
      calleeUserId: string;
      calleeName?: string;
      calleeAvatar?: string;
    },
  ) {
    if (!payload?.callerUserId || !this.server) return { ok: false };
    this.logger.log(`Call accepted: ${payload.callId} by ${payload.calleeUserId}`);

    const callRecord = this.activeCalls.get(payload.callId);
    if (callRecord) {
      callRecord.status = 'connected';
      if (this.callTimeouts.has(payload.callId)) {
        clearTimeout(this.callTimeouts.get(payload.callId)!);
        this.callTimeouts.delete(payload.callId);
      }
    }

    this.server.to(`user:${payload.callerUserId}`).emit('call:accepted', {
      callId: payload.callId,
      calleeUserId: payload.calleeUserId,
      calleeName: payload.calleeName,
      calleeAvatar: payload.calleeAvatar,
      timestamp: new Date().toISOString(),
    });

    return { ok: true };
  }

  @SubscribeMessage('call:decline')
  handleCallDecline(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      callId: string;
      callerUserId: string;
      reason?: string;
    },
  ) {
    if (!payload?.callerUserId || !this.server) return { ok: false };
    this.logger.log(`Call declined: ${payload.callId} -> user:${payload.callerUserId}`);

    const callRecord = this.activeCalls.get(payload.callId);
    if (callRecord) {
      if (callRecord.status === 'ringing') {
        void this.recordMissedCall(callRecord, 'declined');
      }
      if (this.callTimeouts.has(payload.callId)) {
        clearTimeout(this.callTimeouts.get(payload.callId)!);
        this.callTimeouts.delete(payload.callId);
      }
      this.activeCalls.delete(payload.callId);
    }

    this.server.to(`user:${payload.callerUserId}`).emit('call:declined', {
      callId: payload.callId,
      reason: payload.reason || 'busy',
      timestamp: new Date().toISOString(),
    });

    return { ok: true };
  }

  @SubscribeMessage('call:end')
  handleCallEnd(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      callId: string;
      targetUserId: string;
      duration?: number;
    },
  ) {
    if (!payload?.targetUserId || !this.server) return { ok: false };
    this.logger.log(`Call ended: ${payload.callId} -> user:${payload.targetUserId}`);

    const callRecord = this.activeCalls.get(payload.callId);
    if (callRecord) {
      // If caller ended before callee accepted -> Record as missed call
      if (callRecord.status === 'ringing') {
        void this.recordMissedCall(callRecord, 'cancelled_by_caller');
      }
      if (this.callTimeouts.has(payload.callId)) {
        clearTimeout(this.callTimeouts.get(payload.callId)!);
        this.callTimeouts.delete(payload.callId);
      }
      this.activeCalls.delete(payload.callId);
    }

    this.server.to(`user:${payload.targetUserId}`).emit('call:ended', {
      callId: payload.callId,
      duration: payload.duration || 0,
      timestamp: new Date().toISOString(),
    });

    return { ok: true };
  }

  private handleCallTimeout(callId: string) {
    const callRecord = this.activeCalls.get(callId);
    if (!callRecord || callRecord.status !== 'ringing') return;

    this.logger.log(`Call timed out after 45s: ${callId} -> user:${callRecord.recipientUserId}`);
    void this.recordMissedCall(callRecord, 'timeout');

    // Notify caller that call was not answered
    if (this.server) {
      this.server.to(`user:${callRecord.callerUserId}`).emit('call:declined', {
        callId,
        reason: 'timeout',
        timestamp: new Date().toISOString(),
      });
      this.server.to(`user:${callRecord.recipientUserId}`).emit('call:ended', {
        callId,
        reason: 'timeout',
        timestamp: new Date().toISOString(),
      });
    }

    this.callTimeouts.delete(callId);
    this.activeCalls.delete(callId);
  }

  private async recordMissedCall(call: ActiveCallRecord, reason: string = 'timeout') {
    try {
      const notifId = randomUUID();
      const callTypeName = call.callType === 'video' ? 'Video' : 'Thoại';
      const title = '📞 Cuộc gọi nhỡ';
      const body = `Bạn có 1 cuộc gọi nhỡ [${callTypeName}] từ ${call.callerName || 'Đối tác ViOne'}.`;

      // 1. Insert into business_notifications
      await this.prisma.$executeRawUnsafe(`
        INSERT INTO public.business_notifications (
          id, recipient_user_id, source_domain, source_record_id, event_kind, notification_kind,
          title_key, body_key, safe_display_data, priority, status, dedupe_key, app_scope, target_app, created_at, updated_at
        ) VALUES (
          $1::uuid, $2::uuid, 'call', $3, 'call_missed', 'call_missed',
          $4, $5, $6::jsonb, 'high', 'delivered', $7, 'all', 'all', NOW(), NOW()
        )
      `, notifId, call.recipientUserId, call.callId, title, body,
         JSON.stringify({ callerId: call.callerUserId, callerName: call.callerName, callType: call.callType, reason }),
         `missed-call-${call.callId}`).catch(() => {});

      // 2. Insert into member_notifications
      await this.prisma.$executeRawUnsafe(`
        INSERT INTO public.member_notifications (
          id, recipient_id, title, body, read, dismissed, ref_type, ref_id, created_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, false, false, 'call', $4, NOW()
        )
      `, call.recipientUserId, title, body, call.callId).catch(() => {});

      // 3. Emit realtime missed call event to recipient
      if (this.server) {
        this.server.to(`user:${call.recipientUserId}`).emit('call:missed', {
          callId: call.callId,
          callerUserId: call.callerUserId,
          callerName: call.callerName,
          callerAvatar: call.callerAvatar || null,
          callType: call.callType,
          reason,
          timestamp: new Date().toISOString(),
        });

        this.server.to(`user:${call.recipientUserId}`).emit('notification:new', {
          id: notifId,
          title,
          body,
          type: 'missed_call',
          sourceDomain: 'call',
          action: { targetRoute: '/connect-app/inbox' },
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      this.logger.warn(`Failed to record missed call: ${err}`);
    }
  }

  @SubscribeMessage('call:signal')
  handleCallSignal(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      callId: string;
      targetUserId: string;
      signal: any;
    },
  ) {
    if (!payload?.targetUserId || !this.server) return { ok: false };
    this.server.to(`user:${payload.targetUserId}`).emit('call:signal', {
      callId: payload.callId,
      senderSocketId: client.id,
      signal: payload.signal,
    });
    return { ok: true };
  }
}

