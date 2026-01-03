import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { H3, Text } from '@/components/Text';
import { Item, itemsRepository } from '@/db';
import { useSyncStatus } from '@/store/sync';
import { useUIStore } from '@/store/ui';
import { tokens } from '@/theme/tokens';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

/**
 * Home screen demonstrating local CRUD operations
 */
export default function HomeScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const { connectionState, pendingChangesCount } = useSyncStatus();
  const addToast = useUIStore((s) => s.addToast);
  
  // Load items from database
  const loadItems = useCallback(async () => {
    try {
      const data = await itemsRepository.findAll({ orderBy: 'createdAt DESC' });
      setItems(data);
    } catch (error) {
      console.error('Failed to load items:', error);
      addToast({ message: 'Failed to load items', type: 'error' });
    }
  }, []);
  
  useEffect(() => {
    loadItems();
  }, [loadItems]);
  
  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  }, [loadItems]);
  
  // Create new item
  const handleAddItem = async () => {
    if (!newItemTitle.trim()) return;
    
    setIsAdding(true);
    try {
      await itemsRepository.create({
        title: newItemTitle.trim(),
        content: '',
        priority: 0,
      });
      setNewItemTitle('');
      await loadItems();
      addToast({ message: 'Item created', type: 'success' });
    } catch (error) {
      console.error('Failed to create item:', error);
      addToast({ message: 'Failed to create item', type: 'error' });
    } finally {
      setIsAdding(false);
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
          <View style={styles.syncBadge}>
            <Text variant="caption" color={item.syncStatus === 'synced' ? 'muted' : 'primary'}>
              {item.syncStatus}
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
  
  const ListHeader = () => (
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
      
      {/* Add Item Form */}
      <View style={styles.addForm}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Add new item..."
            value={newItemTitle}
            onChangeText={setNewItemTitle}
            onSubmitEditing={handleAddItem}
            returnKeyType="done"
          />
        </View>
        <Button
          onPress={handleAddItem}
          loading={isAdding}
          disabled={!newItemTitle.trim()}
          size="md"
        >
          Add
        </Button>
      </View>
      
      {/* Items Header */}
      <View style={styles.listHeader}>
        <H3>Items ({items.length})</H3>
        <Text variant="caption" color="muted">
          Tap to delete
        </Text>
      </View>
    </View>
  );
  
  const ListEmpty = () => (
    <View style={styles.empty}>
      <Text variant="body" color="muted" style={styles.emptyText}>
        No items yet. Add one above!
      </Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
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
            tintColor={tokens.color.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.color.background,
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
    backgroundColor: tokens.color.backgroundMuted,
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
