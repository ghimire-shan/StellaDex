import React, { useEffect, useMemo, useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    StatusBar,
    FlatList,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons  } from '@expo/vector-icons';
import {
    COLUMN_COUNT,
    SPACING,
    CONTAINER_PADDING,

    DISPLAY_TEXT_COLOR,
    FOOTER_TEXT_COLOR,
    LOCK_OUTLINE_COLOR,
    SEARCH_OUTLINE_COLOR,
    SEARCH_BACKGROUND_COLOR,
    BACKGROUND_COLOR,
    
} from '../constants/stelladexview'; 
import stelladexData from '../assets/constellation_stelladex_data.json';

interface ConstellationInfo {
    nominative_name: string,
    genitive_name: string,
    english_name: string,
    center_ra: number,
    center_dec: number,
    bright_stars: (string | null)[],
}

const UserStellaDex= () => {
    const { width } = useWindowDimensions();
    const [searchQuery, setSearchQuery] = useState('');

    const availableWidth = width - (CONTAINER_PADDING * 2) - (SPACING * (COLUMN_COUNT - 1));
    const tileSize = availableWidth / COLUMN_COUNT;

    // Prepare the data
    // Convert the dictionary object to an array to be used in the FlatList
    const constellationList = useMemo(() => {
        if (!stelladexData) return [];

        const dataMap = stelladexData as Record<string, ConstellationInfo>;
        return Object.entries(dataMap).map(([key, data]) => ({
            id: key,
            ...data
        })).sort((a, b) => a.id.localeCompare(b.id))
    }, []);

    /*
    // Search filter
    // Currently the search filter does a A-Z sort. Need to think about sorting according to the unlocked stuff 
    // and then maybe a A - Z? sort? 
    // Technically the users will have a bunch of ??? and a few unlocked stuff so it may not matter, need to 
    // check with actual database to confirm
    */
    const filteredList = useMemo(() => {
        if (!searchQuery) return constellationList;
        const lowerQ = searchQuery.toLowerCase();

        return constellationList.filter(c => 
            c.id.toLowerCase().includes(lowerQ) ||
            c.nominative_name.toLowerCase().includes(lowerQ) ||
            c.english_name.toLowerCase().includes(lowerQ)
        );
    }, [searchQuery, constellationList]);


    // Logic for locking constellations user doesn't have
    const isConstellationUnlocked = (id: string) => {
        // TODO: connect to database and check if the userId has this id
        return true;
    }

    // Render Item
    const renderItem = ({ item }: {item: ConstellationInfo & {id: string}}) => {
        const unlocked = isConstellationUnlocked(item.id);

        return (
            <TouchableOpacity
                style={[
                    styles.tile,
                    {width: tileSize, height: tileSize * 1.2},
                    !unlocked && styles.tileLocked
                ]}
                disabled={!unlocked}
                activeOpacity={0.7}
            >
                {/* What user sees, change to image later */}
                <View
                    style={styles.contentContainer}
                >
                    {unlocked ? (
                        // Place image here, <Image source = {{uri: item.image}} ..
                        <Text style={styles.displayText}>{item.nominative_name}</Text>
                    ): (
                        <Ionicons name='lock-closed-outline' size={24} color={LOCK_OUTLINE_COLOR} />
                    )}
                </View>

                {/* Name label */}
                <Text style={styles.abbrText} numberOfLines={1}>
                    {/* If user hasn't unlocked the constellation, it shows up as ??? */}
                    {unlocked ? item.id : '???'}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'light-content'} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>StellaDex</Text>

                <View style={styles.searchContainer}>
                    <Ionicons name='search' size={18} color={SEARCH_OUTLINE_COLOR} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder='Search...'
                        placeholderTextColor={SEARCH_OUTLINE_COLOR}
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        returnKeyType='search'
                        clearButtonMode='while-editing'
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        // Manual button to clear
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={16} color={SEARCH_OUTLINE_COLOR} />
                    </TouchableOpacity>
                    )}
                </View>
            </View>
            
            <FlatList
                data={filteredList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={COLUMN_COUNT}
                key={`grid-${COLUMN_COUNT}`}

                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}

                initialNumToRender={24}
                maxToRenderPerBatch={24}
                windowSize={5}
                removeClippedSubviews={true}
            />

            {/* Section for the Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    {filteredList.length} / {constellationList.length} Found
                </Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR
    },
    header: {
        padding: CONTAINER_PADDING,
        paddingBottom: 15,
        backgroundColor: BACKGROUND_COLOR,
        borderBottomWidth: 1,
        borderBottomColor: 'pink',
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: 'System',
        marginBottom: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: SEARCH_BACKGROUND_COLOR,
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: LOCK_OUTLINE_COLOR,
    },
    searchInput: {
        flex: 1,
        color: 'white',
        marginLeft: 8,
        fontSize: 14, 
    },
    listContent: {
        paddingHorizontal: CONTAINER_PADDING,
        paddingTop: 15, 
        paddingBottom: 80, 
    },
    columnWrapper: {
        gap: SPACING,
        marginBottom: SPACING, 
    },
    tile : {
        backgroundColor: SEARCH_BACKGROUND_COLOR,
        borderRadius: 8,
        borderWidth: 1, 
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    tileLocked: {
        backgroundColor: 'grey',
        
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    displayText :{
        color: DISPLAY_TEXT_COLOR,
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5, 
    },
    abbrText: {
        color: FOOTER_TEXT_COLOR,
        fontSize: 10,
        textAlign: 'center',
        width: '100%',
        paddingBottom: 4, 
    },
    footer: {
        padding: 10,
        backgroundColor: 'black',
        alignItems: 'center',
        borderTopColor: SEARCH_BACKGROUND_COLOR,
        borderTopWidth: 1,
        
    },
    footerText: {
        color: FOOTER_TEXT_COLOR,
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1, 
    },
})


export default UserStellaDex;