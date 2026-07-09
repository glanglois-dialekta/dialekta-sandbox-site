// Lecteur vidéo simulé pour le guide d'infusion.
// Pousse video_start, video_progress (25/50/75) et video_complete
// avec les paramètres habituels des intégrations vidéo.
document.addEventListener('DOMContentLoaded', function () {
  var VIDEO = {
    video_title: 'Guide d\'infusion : la cafetière à piston',
    video_provider: 'html5_simule',
    video_duration: 180 // secondes (simulées en accéléré)
  };
  var player = document.getElementById('video-player');
  var playBtn = document.getElementById('video-play');
  var progressBar = document.getElementById('video-progress-bar');
  var timeLabel = document.getElementById('video-time');
  if (!player || !playBtn) return;

  var elapsed = 0;
  var timer = null;
  var milestones = { 25: false, 50: false, 75: false };

  function fmt(s) {
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  playBtn.addEventListener('click', function () {
    if (timer) return;
    playBtn.textContent = 'Lecture en cours (simulation accélérée)';
    playBtn.disabled = true;
    BB.dlPush(Object.assign({ event: 'video_start', video_percent: 0 }, VIDEO));

    // 1 seconde réelle = 10 secondes de vidéo : la vidéo de 3 min se termine en 18 s
    timer = setInterval(function () {
      elapsed += 10;
      var percent = Math.min(100, Math.round((elapsed / VIDEO.video_duration) * 100));
      progressBar.style.width = percent + '%';
      timeLabel.textContent = fmt(Math.min(elapsed, VIDEO.video_duration)) + ' / ' + fmt(VIDEO.video_duration);

      [25, 50, 75].forEach(function (m) {
        if (percent >= m && !milestones[m]) {
          milestones[m] = true;
          BB.dlPush(Object.assign({ event: 'video_progress', video_percent: m }, VIDEO));
        }
      });

      if (elapsed >= VIDEO.video_duration) {
        clearInterval(timer);
        timer = null;
        playBtn.textContent = 'Revoir la vidéo';
        playBtn.disabled = false;
        elapsed = 0;
        milestones = { 25: false, 50: false, 75: false };
        BB.dlPush(Object.assign({ event: 'video_complete', video_percent: 100 }, VIDEO));
      }
    }, 1000);
  });
});
