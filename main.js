import clm from './clmtrackr.module.js';

void function() {

  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const ctracker = new clm.tracker();

  const colors = {
    cake: 'rgba(244, 185, 169, 0.5)',
    crush: 'rgba(206, 54, 93, 0.5)',
    like: 'rgba(245, 177, 204, 0.5)',
    zip: 'rgba(237, 28, 36, 0.5)',
    leo: 'rgba(154, 106, 79, 0.5)',
    jam: 'rgba(168, 37, 123, 0.5)'
  };

  let current_color = 'like';

  function drawLip(points) {
    context.beginPath();
    points.forEach((point, i) => {
      if (i === 0) context.moveTo(...point);
      else context.lineTo(...point);
    });
    context.closePath();
    context.fill();
  }

  function drawLoop() {
    requestAnimationFrame(drawLoop);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = colors[current_color];

    const position = ctracker.getCurrentPosition();

    if (!position) return;

    const upper_lip = []
      .concat(position.slice(44, 51))
      .concat(position.slice(59, 62));

    const lower_lip = []
      .concat(position.slice(44,45))
      .concat(position.slice(56, 59))
      .concat(position.slice(50, 56));

    drawLip(upper_lip);
    drawLip(lower_lip);
  }

  function handleSuccess(stream) {
    video.srcObject = stream;
  }

  function handleError(error) {
    switch (error.name) {
      case 'ConstraintNotSatisfiedError':
        console.error(`The resolution of ${video.width.exact}x${video.height.exact} px is not supported by your device.`);
      case 'PermissionDeniedError':
        console.error(`Permissions have not been granted to use your camera and microphone, you need to allow the
        page acontextess to your devices.`);
      default:
        console.error(`getUserMedia error: ${error.name}`);
    }
  }

  function init(e) {
    e.target.disabled = true;
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: true
      })
      .then(handleSuccess)
      .catch(handleError)
  }

  Object.keys(colors).forEach((color) => {
    document
      .getElementById(color)
      .addEventListener('click', (e) => {
        current_color = color;
        document.querySelectorAll('.btn')
          .forEach((btn) => btn.classList.remove('selected'));
        e.target.classList.add('selected');
      });
  });

  video.addEventListener('canplay', () => {
    ctracker.init();
    ctracker.start(video);
    drawLoop();
  });

  document
    .querySelector('#show')
    .addEventListener('click', init);

}();
