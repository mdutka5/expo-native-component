import { requireNativeViewManager } from 'expo-modules-core';
import { useRef, useState, type ComponentProps, type ComponentType, type Ref } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  FlatList,
  TextInput,
  Switch,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

type Alarm = {
  id: number;
  name: string;
  hours: number;
  minutes: number;
  enabled: boolean;
};

type ClockValues = {
  hours: number;
  minutes: number;
};

type ClockRef = {
  getValues: () => Promise<ClockValues>;
};

const NativeClock = requireNativeViewManager('AnimatedIOSClockView') as ComponentType<
  ComponentProps<typeof View> & { ref?: Ref<ClockRef> }
>;

function formatTime(hours: number, minutes: number) {
  return `${String(Math.round(hours)).padStart(2, '0')}:${String(Math.round(minutes)).padStart(2, '0')}`;
}

export default function App() {
  const clockRef = useRef<ClockRef>(null);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [draftName, setDraftName] = useState('Alarm');

  const openAddAlarm = () => {
    setDraftName(`Alarm ${alarms.length + 1}`);
    setIsAdding(true);
  };

  const cancelAddAlarm = () => {
    setIsAdding(false);
    setDraftName('Alarm');
  };

  const saveAlarm = async () => {
    const values = await clockRef.current?.getValues();
    const hours = values?.hours ?? 0;
    const minutes = values?.minutes ?? 0;

    setAlarms((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: draftName.trim() || 'Alarm',
        hours,
        minutes,
        enabled: true,
      },
    ]);
    setIsAdding(false);
    setDraftName('Alarm');
  };

  const toggleAlarm = (id: number) => {
    setAlarms((prev) =>
      prev.map((alarm) => (alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm))
    );
  };

  const deleteAlarm = (id: number) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.title}>Alarms</Text>
          {!isAdding && (
            <Pressable onPress={openAddAlarm} hitSlop={12} style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </Pressable>
          )}
        </View>

        {isAdding ? (
          <View style={styles.editor}>
            <Text style={styles.editorHint}>Tap the clock to set a time</Text>

            <View style={styles.clockWrap}>
              <NativeClock ref={clockRef} style={styles.clock} />
            </View>

            <TextInput
              style={styles.nameInput}
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Alarm name"
              placeholderTextColor="#9A9A9A"
              returnKeyType="done"
            />

            <View style={styles.editorActions}>
              <Pressable onPress={cancelAddAlarm} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={saveAlarm} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Save Alarm</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <FlatList
            data={alarms}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={alarms.length === 0 ? styles.emptyList : styles.list}

            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No Alarms</Text>
                <Text style={styles.emptyBody}>Tap + to add one with the iOS clock.</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={[styles.alarmRow, !item.enabled && styles.alarmRowDisabled]}>
                <View style={styles.alarmInfo}>
                  <Text style={[styles.alarmTime, !item.enabled && styles.alarmTextDisabled]}>
                    {formatTime(item.hours, item.minutes)}
                  </Text>
                  <Text style={[styles.alarmName, !item.enabled && styles.alarmTextDisabled]}>
                    {item.name}
                  </Text>
                </View>
                <View style={styles.alarmControls}>
                  <Switch
                    value={item.enabled}
                    onValueChange={() => toggleAlarm(item.id)}
                    trackColor={{ false: '#D1D1D6', true: '#34C759' }}
                  />
                  <Pressable onPress={() => deleteAlarm(item.id)} hitSlop={8}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.3,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 34,
    lineHeight: 36,
    color: '#FF9500',
    fontWeight: '400',
  },
  list: {
    paddingVertical: 8,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptyBody: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  alarmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  alarmRowDisabled: {
    opacity: 0.55,
  },
  alarmInfo: {
    flex: 1,
    paddingRight: 16,
  },
  alarmTime: {
    fontSize: 48,
    fontWeight: '300',
    color: '#000000',
    fontVariant: ['tabular-nums'],
  },
  alarmName: {
    marginTop: 2,
    fontSize: 16,
    color: '#3A3A3C',
  },
  alarmTextDisabled: {
    color: '#8E8E93',
  },
  alarmControls: {
    alignItems: 'flex-end',
    gap: 10,
  },
  deleteText: {
    fontSize: 14,
    color: '#FF3B30',
  },
  editor: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  editorHint: {
    textAlign: 'center',
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 24,
  },
  clockWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  clock: {
    width: 220,
    height: 72,
  },
  nameInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#C7C7CC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    color: '#000000',
    backgroundColor: '#F2F2F7',
    marginBottom: 24,
  },
  editorActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  primaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FF9500',
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
