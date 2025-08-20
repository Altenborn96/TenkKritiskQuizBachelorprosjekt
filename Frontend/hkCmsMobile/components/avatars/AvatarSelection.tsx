import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import AvatarItem from "./AvatarItem";
import { AvatarSelectionProps, Avatar } from "@/app/types/avatar";

const { width } = Dimensions.get("window");
const avatarSize = width * 0.25;
const spaceBetween = width * 0.02;
const AVATARS_PER_PAGE = 9; // 3x3 grid

const AvatarSelection: React.FC<AvatarSelectionProps> = ({
  avatars,
  onSelectAvatar,
  selectedAvatar,
}) => {
  const [activePage, setActivePage] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  // Split avatars into pages and pad with placeholders (null) if needed
  const totalPages = Math.ceil(avatars.length / AVATARS_PER_PAGE);
  const pages: (Avatar | null)[][] = [];
  for (let i = 0; i < totalPages; i++) {
    const start = i * AVATARS_PER_PAGE;
    const pageAvatars: (Avatar | null)[] = avatars.slice(
      start,
      start + AVATARS_PER_PAGE
    );
    while (pageAvatars.length < AVATARS_PER_PAGE) {
      pageAvatars.push(null);
    }
    pages.push(pageAvatars);
  }

  // Render an avatar or an empty placeholder for grid alignment
  const renderAvatarItem = ({ item }: { item: Avatar | null }) => {
    if (!item) {
      return (
        <View
          style={[
            styles.avatarWrapper,
            { width: avatarSize, margin: spaceBetween },
          ]}
        />
      );
    }
    const isSelected = item.id.toString() === selectedAvatar;
    return (
      <View
        style={[
          styles.avatarWrapper,
          { width: avatarSize, margin: spaceBetween },
          isSelected && styles.selectedAvatar,
        ]}
      >
        <AvatarItem avatar={item} onSelect={() => onSelectAvatar(item)} />
      </View>
    );
  };

  // Render one page (a grid of avatars) wrapped in a view with full width
  const renderPage = ({ item }: { item: (Avatar | null)[] }) => (
    <View style={{ width: width }}>
      <FlatList
        data={item}
        renderItem={renderAvatarItem}
        keyExtractor={(item, index) =>
          item ? item.id.toString() : `placeholder-${index}`
        }
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.avatarsGrid}
        scrollEnabled={false} // disable inner scrolling
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={pages}
        horizontal
        pagingEnabled
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderPage}
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const currentPage = Math.round(offsetX / width);
          setActivePage(currentPage);
        }}
        scrollEventThrottle={16} // ensures a smooth update
      />
      <View style={styles.paginationDotsContainer}>
        {pages.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setActivePage(index);
              flatListRef.current?.scrollToIndex({ index, animated: true });
            }}
          >
            <View
              style={[styles.dot, activePage === index && styles.activeDot]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E3EEFC",
    width: "100%",
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    position: "relative",
  },
  avatarsGrid: {
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: "15%",
  },
  columnWrapper: {
    justifyContent: "space-evenly",
  },
  avatarWrapper: {
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedAvatar: {
    borderWidth: 3,
    borderColor: "#2C3E50",
    borderRadius: 999,
  },
  paginationDotsContainer: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    zIndex: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#333",
  },
});

export default AvatarSelection;
