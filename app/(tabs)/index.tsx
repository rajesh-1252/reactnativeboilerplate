import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { H3, Text } from '@/components/Text';
import { Item, itemsRepository } from '@/db';
import { useSyncStatus } from '@/store/sync';
import { useUIStore } from '@/store/ui';
import { getAppSyncEngine } from '@/sync/app-sync-engine';
import { tokens } from '@/theme/tokens';
import { useTheme as useTamaguiTheme } from '@tamagui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

/**
 * Optimized Add Item component to prevent full page rerenders on input change
 */
function AddItemForm({ onAddItem }: { onAddItem: (title: string) => Promise<void> }) {
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) return;
    setIsAdding(true);
    await onAddItem(title.trim());
    setTitle('');
    setIsAdding(false);
  };

  return (
    <View style={styles.addForm}>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Add new item..."
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
      </View>
      <Button
        onPress={handleAdd}
        loading={isAdding}
        disabled={!title.trim()}
        size="md"
      >
        Add
      </Button>
    </View>
  );
}

/**
 * Home screen demonstrating local CRUD operations
 */
export default function HomeScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const tamaguiTheme = useTamaguiTheme();
  const { connectionState, pendingChangesCount } = useSyncStatus();
  const addToast = useUIStore((s) => s.addToast);
  
  const dynamicStyles = useMemo(() => ({
    container: {
      backgroundColor: tamaguiTheme.background?.get(),
    },
    syncBadge: {
      backgroundColor: tamaguiTheme.backgroundMuted?.get() || tamaguiTheme.surface?.get(),
    }
  }), [tamaguiTheme]);

  // Load items from database
  const loadItems = useCallback(async () => {
    try {
      const data = await itemsRepository.findAll({ orderBy: 'createdAt DESC' });
      setItems(data);
    } catch (error) {
      console.error('Failed to load items:', error);
      addToast({ message: 'Failed to load items', type: 'error' });
    }
  }, [addToast]);
  
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Subscribe to sync completion to update local UI state
  useEffect(() => {
    const engine = getAppSyncEngine();
    const unsubscribe = engine.addEventListener((event) => {
      if (event.type === 'sync-completed') {
        console.log('[HomeScreen] Sync completed, refreshing list...');
        loadItems();
      }
    });

    return unsubscribe;
  }, [loadItems]);
  
  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  }, [loadItems]);
  
  // Create new item callback
  const handleAddItem = async (title: string) => {
    try {
      await itemsRepository.create({
        title,
        content: '',
        priority: 0,
      });
      await loadItems();
      addToast({ message: 'Item created', type: 'success' });
    } catch (error) {
      console.error('Failed to create item:', error);
      addToast({ message: 'Failed to create item', type: 'error' });
      throw error;
    }
  };
  
  // Delete item
  const handleDeleteItem = async (id: string) => {
    try {
      await itemsRepository.delete(id);
      await loadItems();
      addToast({ message: 'Item deleted', type: 'success' });
    } catch (error) {
      console.error('Failed to delete item:', error);
      addToast({ message: 'Failed to delete item', type: 'error' });
    }
  };
  
  const renderItem = ({ item, index }: { item: Item; index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 50).springify()}>
      <Card
        variant="default"
        style={styles.card}
        pressable
        onPress={() => handleDeleteItem(item.id)}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardText}>
            <Text variant="body" numberOfLines={1}>
              {item.title}
            </Text>
            <Text variant="caption" color="muted">
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={[styles.syncBadge, dynamicStyles.syncBadge]}>
            <Text variant="caption" color={item.syncStatus === 'synced' ? 'muted' : 'primary'}>
              {item.syncStatus}
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
  
  // List header extracted to avoid unnecessary re-creation
  const ListHeader = useMemo(() => (
    <View style={styles.header}>
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text variant="caption" color="muted">
          {connectionState === 'connected' ? '● Online' : '○ Offline'}
        </Text>
        {pendingChangesCount > 0 && (
          <Text variant="caption" color="primary">
            {pendingChangesCount} pending
          </Text>
        )}
      </View>
      
      <AddItemForm onAddItem={handleAddItem} />
      
      {/* Items Header */}
      <View style={styles.listHeader}>
        <H3>Items ({items.length})</H3>
        <Text variant="caption" color="muted">
          Tap to delete
        </Text>
      </View>
    </View>
  ), [connectionState, pendingChangesCount, items.length, handleAddItem]);
  
  const ListEmpty = useCallback(() => (
    <View style={styles.empty}>
      <Text variant="body" color="muted" style={styles.emptyText}>
        No items yet. Add one above!
      </Text>
    </View>
  ), []);
  
  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={tamaguiTheme.primary?.get()}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: tokens.space[4],
    paddingBottom: tokens.space[8],
  },
  header: {
    marginBottom: tokens.space[4],
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: tokens.space[4],
  },
  addForm: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: tokens.space[3],
    marginBottom: tokens.space[6],
  },
  inputContainer: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.space[2],
  },
  card: {
    marginBottom: tokens.space[3],
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardText: {
    flex: 1,
    marginRight: tokens.space[3],
  },
  syncBadge: {
    paddingHorizontal: tokens.space[2],
    paddingVertical: tokens.space[1],
    borderRadius: tokens.radius[1],
  },
  empty: {
    padding: tokens.space[8],
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});
