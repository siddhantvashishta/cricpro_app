import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CloudSun, Wind, Droplets } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

interface WeatherWidgetProps {
  temp: number;
  condition: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ temp, condition }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <CloudSun color={Colors.white} size={20} />
      </View>
      <View style={styles.info}>
        <Text style={styles.temp}>{temp}°C</Text>
        <Text style={styles.condition}>{condition}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Wind color="#94A3B8" size={12} />
          <Text style={styles.statText}>12 km/h</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  info: {
    marginRight: 12,
  },
  temp: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  condition: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  stats: {
    justifyContent: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
});

export default WeatherWidget;
