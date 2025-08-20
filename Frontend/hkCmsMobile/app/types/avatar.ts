export interface Avatar {
  id: number;
  name: string;
  url: string;
}

export interface AvatarUpdateDto {
  username: string;
  avatarUrl: string;
  avatarId: number;
}

export interface AvatarSelectionProps {
  avatars: Avatar[];
  selectedAvatar: string | null;
  onSelectAvatar: (avatar: Avatar) => void;
}

export interface AvatarItemProps {
  avatar: Avatar;
  onSelect: () => void;
}
