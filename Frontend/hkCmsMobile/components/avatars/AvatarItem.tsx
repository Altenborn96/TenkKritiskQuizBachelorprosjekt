import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";

interface AvatarItemProps {
  avatar: { id: number; url: string };
  onSelect: () => void;
}

const AvatarItem: React.FC<AvatarItemProps> = ({ avatar, onSelect }) => {
  return (
    <TouchableOpacity onPress={() => onSelect()} style={styles.avatarItem}>
      <Image source={{ uri: avatar.url }} style={styles.avatarImage} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatarItem: {
    padding: 5,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 30,
  },
});

export default AvatarItem;
