import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable, Platform, Dimensions } from 'react-native';
import { MapPin, Star, CircleDot, ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const getDaysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();
const getFirstDayOfMonth = (m: number, y: number) => new Date(y, m, 1).getDay();

interface BookingModalProps {
  isVisible: boolean;
  onClose: () => void;
  ground: any;
  onConfirm: (bookingData: any) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isVisible, onClose, ground, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState('18:00 - 19:00');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());

  const onDateSelect = (d: number, m: number, y: number) => {
    const newD = new Date(y, m, d);
    setSelectedDate(newD.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/,/g, ''));
    setShowCalendarModal(false);
  };

  const changeMonth = (delta: number) => {
    setViewDate(prev => {
      const today = new Date();
      const currentOffset = (prev.getFullYear() - today.getFullYear()) * 12 + (prev.getMonth() - today.getMonth());
      if (currentOffset + delta < 0 || currentOffset + delta > 2) return prev;
      const d = new Date(prev);
      d.setMonth(d.getMonth() + delta);
      return d;
    });
  };

  const dynamicDateOptions = useMemo(() => {
    const opts = ['Today', 'Tomorrow'];
    const d1 = new Date(); d1.setDate(d1.getDate() + 2);
    const d2 = new Date(); d2.setDate(d2.getDate() + 3);
    opts.push(d1.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/,/g, ''));
    opts.push(d2.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/,/g, ''));
    
    if (!opts.includes(selectedDate)) {
      opts.push(selectedDate);
    }
    return opts;
  }, [selectedDate]);

  if (!ground) return null;

  return (
    <Modal visible={isVisible} transparent animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.content}>
        <View style={styles.header}>
            <View>
              <Text style={styles.title}>Book Venue</Text>
              <Text style={styles.subtitle}>{ground.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.detailsRow}>
            <View style={styles.detailPill}>
                <MapPin size={14} color="#64748B" />
                <Text style={styles.detailText}>{ground.distance}</Text>
            </View>
            <View style={styles.detailPill}>
                <CircleDot size={14} color="#64748B" />
                <Text style={styles.detailText}>{ground.type}</Text>
            </View>
            <View style={styles.detailPill}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.detailText}>{ground.rating}</Text>
            </View>
        </View>

        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 20 }}>
            <TouchableOpacity 
              style={styles.calendarIconBtn}
              onPress={() => setShowCalendarModal(true)}
            >
              <Calendar color={Colors.maroon} size={20} />
            </TouchableOpacity>
            {dynamicDateOptions.map((date, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={[styles.dateChip, selectedDate === date && styles.dateChipActive]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.dateChipText, selectedDate === date && styles.dateChipTextActive]}>{date}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Available Slots</Text>
        <View style={styles.slotsGrid}>
            {['06:00 - 07:00','07:00 - 08:00','16:00 - 17:00','18:00 - 19:00','19:00 - 20:00','21:00 - 22:00'].map((slot, index) => {
              const seed = index + selectedDate.length; 
              let isAvailable = true;
              let label = 'AVL';
              let lblColor = '#10B981'; // Green
              if (seed % 4 === 0) { isAvailable = false; label = 'WL 4'; lblColor = '#EF4444'; }
              else if (seed % 3 === 0) { label = 'FAST'; lblColor = '#F59E0B'; }
                
              const active = selectedSlot === slot;

              return (
              <TouchableOpacity 
                key={slot} 
                style={[
                  styles.slotChip, 
                  active && styles.slotChipActive, 
                  !isAvailable && { borderColor: '#FECACA', backgroundColor: '#FEF2F2', opacity: 0.6 }
                ]}
                disabled={!isAvailable}
                onPress={() => setSelectedSlot(slot)}
              >
                <Text style={[styles.slotChipText, active && styles.slotChipTextActive, !isAvailable && { color: '#EF4444' }]}>{slot}</Text>
                <Text style={{ fontSize: 9, fontWeight: '900', color: active ? Colors.maroon : lblColor, marginTop: 4 }}>{label}</Text>
              </TouchableOpacity>
            )})}
        </View>

        <View style={styles.footer}>
            <View>
                <Text style={styles.priceLabel}>Total Amount</Text>
                <Text style={styles.priceValue}>{ground.price}</Text>
            </View>
            <TouchableOpacity 
              style={styles.payBtn}
              onPress={() => onConfirm({ name: ground.name, price: ground.price, date: selectedDate, slot: selectedSlot })}
            >
              <Text style={styles.payBtnText}>Proceed to Pay</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>

    {/* Nested Calendar Modal */}
    <Modal visible={showCalendarModal} transparent animationType="fade">
        <View style={styles.centeredModal}>
          <View style={styles.calendarContent}>
            <View style={styles.calendarHeader}>
              <Pressable onPress={() => changeMonth(-1)} style={styles.monthNavBtn}>
                <ChevronLeft color={Colors.text} size={24} />
              </Pressable>
              <Text style={styles.calendarMonthText}>
                {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
              </Text>
              <Pressable onPress={() => changeMonth(1)} style={styles.monthNavBtn}>
                <ChevronRight color={Colors.text} size={24} />
              </Pressable>
            </View>

            <View style={styles.weekdayRow}>
              {WEEKDAYS.map((w, i) => (
                <Text key={i} style={styles.weekdayText}>{w}</Text>
              ))}
            </View>

            <View style={styles.dayGrid}>
              {Array(getFirstDayOfMonth(viewDate.getMonth(), viewDate.getFullYear())).fill(0).map((_, i) => (
                <View key={`empty-${i}`} style={styles.dayBox} />
              ))}
              {Array(getDaysInMonth(viewDate.getMonth(), viewDate.getFullYear())).fill(0).map((_, i) => {
                const d = i + 1;
                const calDateStr = new Date(viewDate.getFullYear(), viewDate.getMonth(), d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/,/g, '');
                const isSelected = selectedDate === calDateStr;
                const isPast = new Date(viewDate.getFullYear(), viewDate.getMonth(), d).getTime() < new Date().setHours(0,0,0,0);
                
                return (
                  <Pressable
                    key={d}
                    style={[styles.dayBox, isSelected && styles.dayBoxActive]}
                    onPress={() => !isPast && onDateSelect(d, viewDate.getMonth(), viewDate.getFullYear())}
                  >
                    <Text style={[styles.dayText, isSelected && styles.dayTextActive, isPast && { color: '#CBD5E1' }]}>{d}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable style={styles.closeCalBtn} onPress={() => setShowCalendarModal(false)}>
              <Text style={styles.closeCalBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
    </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  content: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 20, fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4, fontWeight: '600' },
  closeText: { fontSize: 16, fontWeight: '700', color: Colors.textSecondary },
  detailsRow: { flexDirection: 'row', gap: 10, marginBottom: 24, flexWrap: 'wrap' },
  detailPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 4 },
  detailText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 12 },
  calendarIconBtn: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: Colors.maroon, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1F2' },
  dateChip: { paddingHorizontal: 16, paddingVertical: 12, height: 44, justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  dateChipActive: { backgroundColor: '#FFF1F2', borderColor: Colors.maroon },
  dateChipText: { fontSize: 14, fontWeight: '700', color: '#475569' },
  dateChipTextActive: { color: Colors.maroon },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  slotChip: { width: (width - 48 - 20) / 3, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  slotChipActive: { backgroundColor: Colors.maroon, borderColor: Colors.maroon },
  slotChipText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  slotChipTextActive: { color: Colors.white },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  priceLabel: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  priceValue: { fontSize: 20, fontWeight: '900', color: '#0F172A' },
  payBtn: { backgroundColor: '#10B981', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 16, alignItems: 'center' },
  payBtnText: { color: Colors.white, fontSize: 15, fontWeight: '900' },

  centeredModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  calendarContent: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, gap: 16 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  monthNavBtn: { padding: 8, backgroundColor: '#F0F0F0', borderRadius: 8 },
  calendarMonthText: { fontSize: 16, fontWeight: '800', color: Colors.text },
  weekdayRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  weekdayText: { width: '14%', textAlign: 'center', fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  dayGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayBox: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  dayBoxActive: { backgroundColor: Colors.maroon },
  dayText: { fontSize: 14, fontWeight: '700', color: Colors.text },
  dayTextActive: { color: Colors.white },
  closeCalBtn: { marginTop: 10, paddingVertical: 12, alignItems: 'center' },
  closeCalBtnText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
});

export default BookingModal;
