const socket = io();
let mediaStream = null;

document.getElementById('joinRoom').addEventListener('click', () => {
  const username = document.getElementById('username').value;
  if (username) {
    socket.emit('join', username);
    document.getElementById('controls').style.display = 'block';
  }
});

// دریافت لیست کاربران آنلاین
socket.on('updateUserList', (users) => {
  const userList = document.getElementById('userList');
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.textContent = user.username;
    userList.appendChild(li);
  });
});

// فعال کردن صدا
document.getElementById('startVoice').addEventListener('click', async () => {
  mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioTracks = mediaStream.getAudioTracks();

  audioTracks.forEach((track) => {
    const audioSender = new MediaStream([track]);
    audioSender.getTracks().forEach((audioTrack) => {
      const reader = audioTrack.clone();
      reader.ondataavailable = (e) => socket.emit('voice', e.data);
      console.log('Sending voice data:', data);
    });
  });
});

// قطع کردن صدا
document.getElementById('stopVoice').addEventListener('click', () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }
});

// دریافت صدا از کاربران دیگر
socket.on('voice', (data) => {
  console.log('Receiving voice data:', data);
  const audioBlob = new Blob([data], { type: 'audio/webm' });
  const audioURL = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioURL);
  audio.play();
});
