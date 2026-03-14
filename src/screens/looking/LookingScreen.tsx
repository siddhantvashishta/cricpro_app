import { View, StyleSheet, FlatList, Alert, SafeAreaView } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
    AppHeader,
    LookingActionHeader,
    LookingFilterTabs,
    LookingCard,
    LookingFilterTab,
    LookingType,
    CreatePostModal,
    ApplyModal,
    YourRecruitmentModal,
    LookingFilterModal,
    ActionSheetModal
} from '../../components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { colors, spacing } from '../../theme';

// Based on the screenshot details
export const LookingScreen: React.FC = () => {
    const {
        activeLookingTab,
        setActiveLookingTab,
        lookingPosts,
        myPosts,
        isProMember,
        setHeaderConfig
    } = useAppStore();
    const navigation = useNavigation<NavigationProp<any>>();
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [initialPostType, setInitialPostType] = useState('Opponent');
    const [applyModalVisible, setApplyModalVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [yourRecruitmentVisible, setYourRecruitmentVisible] = useState(false);
    const [actionSheetVisible, setActionSheetVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Filter store posts based on active tab
    const filteredData = lookingPosts.filter(item => {
        if (activeLookingTab === 'Opponent') return item.type === 'Opponent';
        if (activeLookingTab === 'Team to Join') return item.type === 'Recruitment';
        if (activeLookingTab === 'Player') return item.type === 'Player';
        return true;
    });

    const handleActionPress = (item: any) => {
        handleMessagePress(item);
    };

    const handleProfilePress = (item: any) => {
        navigation.navigate('PlayerProfile', { playerId: item.playerId || '1' });
    };

    const handleMessagePress = (item: any) => {
        navigation.navigate('ChatDetail', {
            name: item.teamName,
            avatar: null // Could map to mock player avatar if available
        });
    };

    const handleMorePress = (item: any) => {
        setSelectedItem(item);
        setActionSheetVisible(true);
    };

    const actionOptions = [
        { label: 'Share Post', onPress: () => Alert.alert('Shared', 'Post link copied to clipboard!') },
        { label: 'Report Post', onPress: () => Alert.alert('Reported', 'Thank you for your feedback. We will review this post.'), isDestructive: true },
        { label: 'Hide Post', onPress: () => Alert.alert('Hidden', 'You will no longer see this post.') },
    ];

    const handleHeaderAction = (iconName: string) => {
        if (iconName === 'search-outline') {
            navigation.navigate('Search');
        } else if (iconName === 'chatbox-ellipses-outline') {
            navigation.navigate('DirectMessages');
        } else if (iconName === 'filter-action') {
            if (!isProMember) {
                Alert.alert(
                    'Pro Feature 👑',
                    'Advanced filtering is available to Elite members only.',
                    [
                        { name: 'Cancel', style: 'cancel' } as any,
                        { text: 'Upgrade', onPress: () => navigation.navigate('ProClub') } as any
                    ]
                );
            } else {
                setFilterModalVisible(true);
            }
        } else if (iconName === 'locate-outline') {
            Alert.alert('Location', 'Updating your location to find nearby matches!');
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setHeaderConfig({
                title: undefined,
                rightIcons: [
                    { name: 'search', onPress: () => handleHeaderAction('search-outline') },
                    { name: 'chatbox-ellipses-outline', onPress: () => handleHeaderAction('chatbox-ellipses-outline') },
                    { name: 'locate-outline', onPress: () => handleHeaderAction('locate-outline') },
                    { name: 'funnel-outline', onPress: () => handleHeaderAction('filter-action') }
                ],
                showBack: false
            });
        });
        return unsubscribe;
    }, [navigation, isProMember]);

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <View style={styles.headerStack}>
                        <LookingActionHeader
                            onPostPress={() => {
                                setInitialPostType('Opponent');
                                setCreateModalVisible(true);
                            }}
                            onCommunityPress={() => {
                                setInitialPostType('Community');
                                setCreateModalVisible(true);
                            }}
                            onYouPress={() => setYourRecruitmentVisible(true)}
                        />
                        <LookingFilterTabs
                            activeTab={activeLookingTab}
                            onTabChange={setActiveLookingTab}
                        />
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.cardWrapper}>
                        <LookingCard
                            type={item.type}
                            teamName={item.teamName}
                            description={item.description}
                            requirementText={item.requirementText}
                            date={item.date}
                            ground={item.ground}
                            timeAgo={item.timeAgo}
                            distance={item.distance}
                            rightIconType={item.rightIconType}
                            onActionPress={() => handleActionPress(item)}
                            onMorePress={() => handleMorePress(item)}
                            onProfilePress={() => handleProfilePress(item)}
                            onMessagePress={() => handleMessagePress(item)}
                        />
                    </View>
                )}
                contentContainerStyle={styles.listContent}
            />

            <CreatePostModal
                visible={createModalVisible}
                onClose={() => setCreateModalVisible(false)}
                initialType={initialPostType}
            />

            <ApplyModal
                visible={applyModalVisible}
                onClose={() => setApplyModalVisible(false)}
                targetName={selectedItem?.teamName || ''}
            />

            <YourRecruitmentModal
                visible={yourRecruitmentVisible}
                onClose={() => setYourRecruitmentVisible(false)}
                onNewPost={() => {
                    setYourRecruitmentVisible(false);
                    setCreateModalVisible(true);
                }}
            />

            <LookingFilterModal
                visible={filterModalVisible}
                onClose={() => setFilterModalVisible(false)}
                onApply={(filters) => Alert.alert('Filters Applied', `Showing ${filters.role} within ${filters.distance}`)}
            />

            <ActionSheetModal
                visible={actionSheetVisible}
                onClose={() => setActionSheetVisible(false)}
                title={`Options for ${selectedItem?.teamName}`}
                options={actionOptions}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // Light gray background to show card outlines
    },
    headerStack: {
        backgroundColor: colors.surface,
        marginBottom: spacing.md,
    },
    listContent: {
        paddingBottom: spacing.xxl,
    },
    cardWrapper: {
        marginHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
});
