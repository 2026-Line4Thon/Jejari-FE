export const chatListPath = '/chats';
export const chatRoomPath = (roomId) => '/chats/' + encodeURIComponent(roomId);
export const chatCompletePath = (roomId) => chatRoomPath(roomId) + '/complete';
