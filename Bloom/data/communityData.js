export const ALL_CIRCLES = [
    { id: '1', name: 'Late Night Vent Crew', icon: 'moon-waning-crescent' },
    { id: '2', name: 'Study Grind Support', icon: 'book-open-variant' },
    { id: '3', name: 'Daily Dose of Zen', icon: 'leaf' },
    { id: '4', name: 'Cramming & Positivity', icon: 'run-fast' },
    { id: '5', name: 'Gaming & Positivity', icon: 'controller-classic' },
    { id: '6', name: 'Nature Walkers', icon: 'walk' },
    { id: '7', name: 'Solo Travel Buddies', icon: 'airplane' },
    { id: '8', name: 'Just Feel It Out', icon: 'emoticon-happy-outline' },
    { id: '9', name: 'Exam Stress Hotline', icon: 'head-alert-outline' },
  ];
  
  export const CHAT_MESSAGES = {
    '2': [ // Corresponds to "Study Grind Support"
      { id: 'm5', text: 'Same here. We’ll through! Just sent some helpful notes to the group docs.', sender: 'Michael', isMe: false },
      { id: 'm4', text: 'Alex here. We’ll get through this. You got this!', sender: 'You', isMe: true },
      { id: 'm3', text: 'Totally! Took a quick break though, deep breaths!', sender: 'You', isMe: true },
      { id: 'm2', text: 'Totally! Took a quick break though, deep breaths. You got this!', sender: 'Alex', isMe: false },
      { id: 'm1', text: 'Hey everyone, feeling overwhelmed with econ finals, anyone else?', sender: 'Alex', isMe: false },
    ],
    '1': [
      { id: 'm1', text: 'Anyone else just feeling overwhelmed with finals?', sender: 'Alex', isMe: false },
    ],
    '3': [
       { id: 'm1', text: 'Remember to take a mindful break today!', sender: 'Bot', isMe: false },
    ]
  };
  
  export const MY_CHATS_PREVIEW = [
      { id: '2', name: 'Study Grind Support', icon: 'account-group', lastMessage: 'You: good session everyone, feeling better now!', time: '5m ago', isJoined: true },
      { id: '1', name: 'Late Night Vent Crew', icon: 'account-outline', lastMessage: 'Alex: anyone else overwhelmed with finals?', time: '2h ago', isJoined: true },
      { id: '3', name: 'Daily Dose of Zen', icon: 'leaf-maple', lastMessage: 'Bot: Remember to take a mindful break today!', time: 'Yesterday', isJoined: true },
  ]