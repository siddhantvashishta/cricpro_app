import * as React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { ArrowLeft, User, Calendar, Megaphone, GraduationCap } from 'lucide-react-native';

const roles = [
  {
    id: 'player',
    title: 'Player',
    description: 'Join teams, play matches, and track your career stats.',
    icon: User,
    color: 'MAROON',
    brandColor: Colors.maroon,
    bgImage: 'https://placeholder.com/player' // Placeholder logic
  },
  {
    id: 'organiser',
    title: 'Organiser',
    description: 'Create tournaments, manage teams, and schedule matches.',
    icon: Calendar,
    color: 'NAVY',
    brandColor: Colors.navy,
  },
  {
    id: 'fan',
    title: 'Fan',
    description: 'Follow your favorite teams, players, and live scores.',
    icon: Megaphone,
    color: 'BLUE',
    brandColor: Colors.blue,
  },
  {
    id: 'coach',
    title: 'Coach/Umpire',
    description: 'Manage coaching drills or officiate professional matches.',
    icon: GraduationCap,
    color: 'DARK MAROON',
    brandColor: Colors.maroonDark,
  },
];

const RoleSelectionScreen = ({ navigation }: any) => {
  const [selectedRole, setSelectedRole] = useState('player');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={Colors.maroon} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CRICPRO</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.welcomeSection}>
          <Text style={styles.title}>I am a...</Text>
          <Text style={styles.subtitle}>Select your primary role to get started</Text>
        </View>

        <View style={styles.rolesList}>
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;
            const Icon = role.icon;
            
            return (
              <TouchableOpacity 
                key={role.id}
                style={[
                  styles.roleCard,
                  isSelected ? { borderColor: role.brandColor, borderWidth: 2 } : null
                ]}
                onPress={() => setSelectedRole(role.id)}
              >
                <View style={styles.roleInfo}>
                  <View style={styles.roleLabelContainer}>
                    <Icon color={role.brandColor} size={14} />
                    <Text style={[styles.roleLabel, { color: role.brandColor }]}>{role.color}</Text>
                  </View>
                  <Text style={styles.roleTitle}>{role.title}</Text>
                  <Text style={styles.roleDescription}>{role.description}</Text>
                </View>
                <View style={styles.roleImageContainer}>
                  <View style={[styles.imagePlaceholder, { backgroundColor: role.brandColor + '10' }]}>
                     {/* Image would go here */}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  welcomeSection: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 5,
  },
  rolesList: {
    gap: 15,
  },
  roleCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  roleInfo: {
    flex: 1,
    paddingRight: 10,
  },
  roleLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 5,
  },
  roleLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  roleDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  roleImageContainer: {
    width: 80,
    justifyContent: 'center',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  continueButton: {
    backgroundColor: Colors.maroon,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  continueButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default RoleSelectionScreen;
